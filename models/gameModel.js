const mongoose = require('mongoose')

const gameSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required:  true,
            ref: 'User'
        },
        name: {
            type: String,
            required: [true, 'Please add a name value']
        },
        city: {
            type: String,
            required: [true, 'Please add an amount value']
        },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        maxParticipants: { type: Number, default: 10 },
        date: {
            type: Date,
            required: false,
        },

    },
    {
        timestamps: true,
    }
    )
module.exports = mongoose.model('Game',gameSchema)