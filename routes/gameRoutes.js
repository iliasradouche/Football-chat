const express = require('express')
const router = express.Router()
const { 
    getUserGames,
    getAllGames,
    getUserGamesParticpant, 
    setGame, 
    deleteGame,
    joinGame,
    getUserGamesInbox,
    getGameDetailsById,
} = require('../controllers/gameController')

const {protect} = require('../middleware/authMiddleware.js')

router.route('/').post(protect, setGame);
router.route('/user').get(protect, getUserGames)
router.route('/:id').delete(protect, deleteGame).post(protect, joinGame)
router.route('/all').get(protect, getAllGames);
router.route('/participant').get(protect, getUserGamesParticpant);
router.route('/inbox').get(protect, getUserGamesInbox);
router.route('/details/:id').get(protect, getGameDetailsById);


module.exports = router