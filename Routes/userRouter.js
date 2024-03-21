const express = require("express")
const router = express.Router()
const controllers = require("../controllers/userController")

router.post("/user/register", controllers.userregister)
router.post("/user/sendotp", controllers.userOtpSend)
router.post("/user/login", controllers.userLogin)
router.post("/user/OtpResend", controllers.userOtpResend)
router.get("/user/:id", controllers.getUserById);


router.post("/user/ResetPassword", controllers.userResetPassword)
router.post("/user/updateProfile", controllers.updateProfile)



module.exports = router;