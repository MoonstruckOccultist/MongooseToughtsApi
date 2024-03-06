const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought')

const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = Schema(
    {
        username: {
            type: String,
            required: true,
            maxlength: 25,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [emailRegex, 'pls provide valid email']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    }
);

//friendcount
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length
    });


const User = model('user', userSchema);

module.exports = User;