const asyncHandler = require('express-async-handler')

const Game = require('../models/gameModel')
const User = require('../models/userModel')
const Message = require('../models/messageModel')


// @desc Get games created by the user
// @route GET /api/games/user
// @access Private
const getUserGames = asyncHandler(async (req, res) => {
    // Fetch all games where the current user is a participant
    const games = await Game.find({ user: req.user.id }).lean();

    // Iterate over each game to find the most recent message
    const gamesWithLastMessage = await Promise.all(games.map(async (game) => {
        const lastMessage = await Message.findOne({ gameId: game._id })
            .sort({ createdAt: -1 }) // Sort to get the most recent message
            .populate('userId', 'name') // Assuming 'userId' should be populated to get the sender's name
            .lean();

        if (lastMessage) {
            // Append the last message info to the game object
            game.lastMessage = {
                text: lastMessage.text,
                senderName: lastMessage.userId.name,
                timestamp: lastMessage.createdAt,
            };
        }

        return game;
    }));

    res.status(200).json(gamesWithLastMessage);
});

// @desc Get All games where user is participant
// @route GET /api/games/participant
// @access Private
const getUserGamesParticpant = asyncHandler(async (req, res) => {
    const games = await Game.find({ participants: req.user.id }); 
    res.json(games);
});

// @desc Get all games inbox
// @route GET /api/games/inbox
// @access Private
const getUserGamesInbox = asyncHandler(async (req, res) => {
    const games = await Game.find({ participants: req.user.id }).lean();

    const gamesWithLastMessage = await Promise.all(games.map(async (game) => {
        const lastMessage = await Message.findOne({ gameId: game._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name')
            .lean();

        if (lastMessage) {
            game.lastMessage = {
                text: lastMessage.text,
                senderName: lastMessage.userId.name,
                timestamp: lastMessage.createdAt,
            };
        }
        return game;
    }));

    // Ensure proper date comparison by parsing the timestamps back to Date objects if they're not undefined
    const sortedGames = gamesWithLastMessage.sort((a, b) => {
        // Check if either game does not have a last message and adjust sorting accordingly
        if (!a.lastMessage && !b.lastMessage) {
            return 0; // Both games have no messages, keep their order unchanged
        } else if (!a.lastMessage) {
            return 1; // Only game A has no messages, sort it after game B
        } else if (!b.lastMessage) {
            return -1; // Only game B has no messages, sort it after game A
        } else {
            // Both games have messages, sort by timestamp from most recent to least recent
            return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        }
    });

    res.status(200).json(sortedGames);
});

// @desc Get All games
// @route GET /api/games/all
// @access Private
const getAllGames = asyncHandler(async (req, res) => {
    const games = await Game.find({})
    res.status(200).json(games)
})

// @desc Get game name by ID
// @route GET /api/games/details/:id
// @access Private
const getGameDetailsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const game = await Game.findById(id).lean();
    if (!game) {
        res.status(404);
        throw new Error('Game not found');
    }
    res.json(game); 
});


// @desc Create Game
// @route POST /api/games
// @access Private
const setGame = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.city) {
        res.status(400)
        throw new Error('Please add all required fields')
    }


    const game = await Game.create({
        name: req.body.name,
        city: req.body.city,
        participants: req.user.id,
        maxParticipants: req.body.maxParticipants,
        date: req.body.date,
        user: req.user.id

    })
    res.status(200).json(game);
});


// @desc Delete game
// @route DELETE /api/games/:id
// @access Private
const deleteGame = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id)

    if(!game) {
        res.status(400)
        throw new Error('Game not found')
    }

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }
    // Make sure logged in user matches the game user
    if(game.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await game.deleteOne()
    res.status(200).json({ id: req.params.id })
})

// @desc Join a game
// @route POST /api/games/:id
// @access Private
const joinGame = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id);

    if (!game) {
        res.status(404);
        throw new Error('Game not found');
    }

    // check if game still has available spots
    if (game.participants.length >= game.maxParticipants) {
        res.status(400);
        throw new Error('Game is full');
    }

    // here we see if user is already a participant of yhat game
    const isParticipant = game.participants.find(participant => participant.toString() === req.user.id);

    if (isParticipant) {
        res.status(400);
        throw new Error('User already joined');
    }


    
    game.participants.push(req.user.id);
    await game.save();
    res.status(200).json(game);
});

module.exports = {
    getUserGames,
    getAllGames,
    getUserGamesParticpant,
    setGame,
    deleteGame,
    joinGame,
    getUserGamesInbox,
    getGameDetailsById,
}