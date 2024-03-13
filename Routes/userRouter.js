const express = require("express")
const router = express.Router()
const controllers = require("../controllers/userController")

router.post("/user/register", controllers.userregister)
router.post("/user/sendotp", controllers.userOtpSend)





module.exports = router;