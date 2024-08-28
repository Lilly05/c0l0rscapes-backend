const express = require("express")
const router = express.Router()
const game = require("../controllers/game.controller");

router.get('/random', game.getRandomColor);
router.post('/saveGuess', game.saveColorGuess);
router.get('/history/:userId', game.getHistory);

module.exports = router