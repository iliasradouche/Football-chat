const asyncHandler = require('express-async-handler')

const Message = require('../models/messageModel')
const User = require('../models/userModel')


// @desc Get all messages of a game
// @route GET /api/messages/:gameId
// @access Private
const getAllGameMessages = asyncHandler(async (req, res) => {
    const gameId = req.params.gameId;
    // Find all messages for the specified game
    const messages = await Message.find({ gameId }).populate('userId', 'name');;
    if (messages) {
        res.status(200).json(messages);
    } else {
        res.status(404);
        throw new Error('Messages not found');
    }
})


// @desc Get message data
// @route GET /api/messages/:id
// @access Private
const getMessage = asyncHandler(async (req, res) => {
    res.status(200).json(req.message)
})

// @desc Create message
// @route POST /api/messages/:gameId
// @access Private
const setMessage = asyncHandler(async (req, res) => {
    
    const { text } = req.body;
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    const userId = req.user.id;
    const gameId = req.params.gameId;
    const message = await Message.create({
        userId,
        text,
        gameId
    })

    // Access the io instance attached to the `req` object or server, depending on your setup
    const io = req.app.get('io'); // If you've attached io to your Express app in your server setup

    // Emit the message to the room corresponding to the game ID
    io.to(game).emit('message', message); // 'message' is the event name, adjust as needed

    res.status(201).json(message)
})


module.exports = {
    getAllGameMessages,
    setMessage,
    getMessage,
}