const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required:  true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please add a message']
        },
        gameId: {
            type: mongoose.Schema.Types.ObjectId,
            required:  true,
            ref: 'Game'
        }

    },
    {
        timestamps: true,
    }
    )
module.exports = mongoose.model('Message',messageSchema)