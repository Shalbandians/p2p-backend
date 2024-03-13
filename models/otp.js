const mongoose = require("mongoose");
const validate = require("validator")


const Userotp = new mongoose.Schema({
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
    otp: {
        type: String,
        required: true
    },


})

const userotp = mongoose.model("userotps", Userotp);
module.exports = userotp;