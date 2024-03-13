const mongoose = require("mongoose");
const validate = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "asdfghjklzxcv@n";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }, verified: {
        type: Boolean,
        default: false,
    },
    token: [
        {
            token: {
                type: String,
                required: true

            }
        }
    ]

});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
});

/* userSchema.methods.generateAuthtoken = async function () {
    try {
        let newtoken = jwt.sign({ _id: this._id }, SECRECT_KEY, {
            expiresIn: "1d"
        })
        this.tokens = this.tokens.concat({ token: newtoken });
        await this.save();
        return newtoken;

    } catch (error) {
        res.status(400).json(error)

    }
}; */
userSchema.methods.generateAuthtoken = async function () {
    try {
        const newtoken = jwt.sign({ _id: this._id }, SECRECT_KEY, {
            expiresIn: "1d"
        });
        this.token = this.token.concat({ token: newtoken });
        await this.save();
        return newtoken;
    } catch (error) {
        throw new Error(error); // Remove the res.status(400).json(error) line
    }
};



const user = mongoose.model("Users", userSchema);
module.exports = user;
