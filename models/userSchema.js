const mongoose = require("mongoose");
const validate = require("validator")
const bcrypt = require("bcryptjs")
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
    }

});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})


const user = mongoose.model("Users", userSchema);
module.exports = user;
