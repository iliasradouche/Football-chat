const express = require('express')
const router = express.Router()
const {
    getAllGameMessages,
    setMessage,
    getMessage,
} = require('../controllers/messageController.js')

const {protect} = require('../middleware/authMiddleware.js')

router.route('/:gameId').post(protect, setMessage)
router.route('/:gameId').get(protect, getAllGameMessages);
router.route('/:id').get(protect, getMessage);


module.exports = router