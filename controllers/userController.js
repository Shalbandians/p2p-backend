
const user = require("../models/userSchema")

const userotp = require("../models/otp")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")


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
        return res.status(400).json({ error: "Please Enter all fields" });
    }
    try {
        const preuser = await user.findOne({ email: email });
        if (preuser) {
            return res.status(400).json({ error: 'This Email Already Exists' });
        } else {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const saveData = new userotp({ email, otp: OTP });
            await saveData.save();

            const userregister = new user({ name, email, password });
            const storedData = await userregister.save();

            const mailOption = {
                from: process.env.EMAIL,
                to: email,
                subject: "Otp Verification",
                text: `OTP : ${OTP}`,
            };
            transportor.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("error", error);
                    return res.status(400).json({ error: "Email not sent" });
                } else {
                    console.log("Email Sent", info);
                    return res.status(200).json({ message: "User registered successfully. Email sent with OTP." });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error });
    }
}
/* exports.userregister = async (req, res) => {
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

} */




/* exports.userOtpSend = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }
    try {
        const preuser = await user.findOne({ email: email });
        if (preuser) {
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
} */
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

/* exports.userLogin = async (req, res) => {
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
} */

exports.userOtpSend = async (req, res) => {
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
            res.status(200).json({ message: "OTP verified successfully!.", userToken: token });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { password, email } = req.body;
        let userData = await user.findOne({ email }); // Use a different variable name to avoid conflict
        if (!userData) {
            return res.status(400).json({ error: "User not found. Please ensure you are using the right credentials" });
        }
        const isPasswordMatch = bcrypt.compareSync(password, userData.password);

        if (!isPasswordMatch) {
            return res.status(403).json({ error: "Incorrect password, please try again" });
        } else {

            const token = await userData.generateAuthtoken();
            return res.status(200).json({ message: "User login successful", userToken: token, userId: userData._id });
        }


    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}


/* exports.userOtpResend = async (req, res) => {
    const { email } = req.body;

    try {
        const preuser = await user.findOne({ email: email });
        if (preuser) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const saveData = new userotp({ email, otp: OTP });
            await saveData.save();

            const userregister = new user({ name, email, password });
            const storedData = await userregister.save();

            const mailOption = {
                from: process.env.EMAIL,
                to: email,
                subject: "Otp Verification",
                text: `OTP : ${OTP}`,
            };
        } else {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const saveData = new userotp({ email, otp: OTP });
            await saveData.save();

            const userregister = new user({ name, email, password });
            const storedData = await userregister.save();

            const mailOption = {
                from: process.env.EMAIL,
                to: email,
                subject: "Otp Verification",
                text: `OTP : ${OTP}`,
            };
            transportor.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("error", error);
                    return res.status(400).json({ error: "Email not sent" });
                } else {
                    console.log("Email Sent", info);
                    return res.status(200).json({ message: "User registered successfully. Email sent with OTP." });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error });
    }
}; */
exports.userOtpResend = async (req, res) => {

    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }
    try {
        const preuser = await user.findOne({ email: email });
        if (preuser) {
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


};




exports.userResetPassword = async (req, res) => {
    const { otp, email, password } = req.body;
    if (!otp || !email || !password) {
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
            res.status(200).json({ message: "OTP verified successfully!.", userToken: token });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
/* exports.updateProfile = async (req, res) => {
    const { firstName, lastName, email, address, userId } = req.body;

    try {
        // Find the user by ID
        const preuser = await user.findOne({ _id: userId });

        // Check if user exists
        if (!preuser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the new email already exists
        const existingUser = await user.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ error: "Email address already in use" });
        }

        // Update user information
        preuser.firstName = firstName;
        preuser.lastName = lastName;
        preuser.address = address;
        preuser.email = email;
        preuser.name = firstName + lastName;

        // Save the updated user
        await preuser.save();

        // Respond with updated user data
        res.status(200).json({ message: "User profile updated successfully", user: preuser });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            // Duplicate email error
            return res.status(400).json({ error: "Email address already in use" });
        } else {
            console.error("Error updating user profile:", error);
            res.status(500).json({ error: "Failed to update user profile" });
        }
    }
} */
exports.updateProfile = async (req, res) => {
    const { firstName, lastName, email, address, userId } = req.body;

    try {
        // Find the user by ID
        const preuser = await user.findOne({ _id: userId });

        // Check if user exists
        if (!preuser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the new email already exists for a different user
        const existingUser = await user.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ error: "Email address already in use" });
        }

        // Update user information
        preuser.firstName = firstName;
        preuser.lastName = lastName;
        preuser.address = address;
        preuser.email = email;
        preuser.name = firstName + lastName;

        // Save the updated user
        await preuser.save();

        // Respond with updated user data
        res.status(200).json({ message: "User profile updated successfully", user: preuser });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            // Duplicate email error
            return res.status(400).json({ error: "Email address already in use" });
        } else {
            console.error("Error updating user profile:", error);
            res.status(500).json({ error: "Failed to update user profile" });
        }
    }
}
const successResponse = (res, message, data, statusCode) => {
    return res.status(statusCode).json({ success: true, message, data });
};
exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id; // Assuming your route has a parameter for the user ID
        const userData = await user.findOne({ _id: userId });

        if (!userData) {
            return errorResponse(
                res,
                "User not found. Please ensure you are using the right credentials",
                [],
                404
            );
        }

        // If the user is found, send the user data in the response
        return successResponse(
            res,
            "User found successfully",
            userData,
            200
        );
    } catch (error) {
        next(error);
    }
}


/* exports.updateProfile = async (req, res) => {
    const { firstName, lastName, email, address, userId } = req.body;

    try {
        // Find the user by email
        const preuser = await user.findOne({ _id: userId });

        // Check if user exists
        if (!preuser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user information
        preuser.firstName = firstName;
        preuser.lastName = lastName;
        preuser.address = address;
        preuser.email = email;
        preuser.name = firstName + lastName;
        // Save the updated user
        await preuser.save();

        // Respond with updated user data
        res.status(200).json({ message: "User profile updated successfully", user: preuser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update user profile" });
    }
}; */