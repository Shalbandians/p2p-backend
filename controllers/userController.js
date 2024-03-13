
const user = require("../models/userSchema")
const userotp = require("../models/otp")
const nodemailer = require("nodemailer")


const transportor = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})



exports.userregister = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: "Please Enter all fields" })
    }
    try {
        const preuser = await user.findOne({ email: email });
        if (preuser) {
            res.status(400).json({ error: 'This Email Already Exit' })
        } else {
            const userregister = new user({
                name, email, password
            })

            const storedData = await userregister.save();
            res.status(200).json(storedData)
        }
    } catch (error) {
        res.status(400).json({ error: "InValid Details", error })

    }

}




exports.userOtpSend = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }
    try {
        const preuser = await user.findOne({ email: email });
        if (preuser) {
        /*     const OTP = Math.floor(100000 * Math.random() * 900000) */;
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const existEmail = await userotp.findOne({ email: email })
            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true })
                await updateData.save();
                const mailOption = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Otp Verification",
                    text: `OTP : ${OTP}`,
                }
                transportor.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log("error", error)
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email Sent", info)
                        res.status(200).json({ message: "Email sent Successfully" })

                    }
                })

            } else {
                const saveData = new userotp({
                    email, otp: OTP
                });
                await saveData.save();
                const mailOption = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Otp Verification",
                    text: `OTP : ${OTP}`,
                }
                transportor.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log("error", error)
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email Sent", info)
                        res.status(200).json({ message: "Email sent Successfully" })

                    }
                })
            }

        } else {

            res.status(400).json({ error: 'InValid Details', error })

        }

    } catch (error) {

    }
}
/* exports.userLogin = async (req, res) => {
    const { otp, email } = req.body;
    if (!otp || !email) {
        res.status(400).json({ error: "Please Enter Your Email and Otp" })
    }

    try {
        const otpverfication = await userotp.findOne({ email: email });
        if (otpverfication.otp === otp) {
            const preuser = await user.findOne({ email: email });
            const token = await preuser.generateAuthtoken();
            res.status(200).json({ message: "User Login Succesfully Done", userToken: token });

        } else {
            res.status(400).json({ error: "InValid Otp" })
        }
    } catch (error) {
        res.status(400).json({ error: 'InValid Details', error })

    }

} */

exports.userLogin = async (req, res) => {
    const { otp, email } = req.body;
    if (!otp || !email) {
        res.status(400).json({ error: "Please Enter Your Email and Otp" });
        return; // Add a return statement to prevent further execution
    }

    try {
        const otpVerification = await userotp.findOne({ email: email });
        if (!otpVerification) {
            res.status(400).json({ error: "User with this email not found" });
            return;
        }

        if (otpVerification.otp === otp) {
            const preuser = await user.findOne({ email: email });
            if (!preuser) {
                res.status(400).json({ error: "User not found" });
                return;
            }

            const token = await preuser.generateAuthtoken();
            res.status(200).json({ message: "User login successful", userToken: token });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

