const express = require("express")
const router = express.Router()
const user = require("../controllers/user.controller");

router.post('/register', user.register);
router.post("/login", user.login);
router.get("/check-auth", user.checkAuth);
router.post("/logout", user.logout);

module.exports = router
