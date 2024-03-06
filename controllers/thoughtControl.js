const { User, Thought } = require('../models');

module.exports = {
    async getThought(req, res) {
        try {
            const thought = await Thought.find().select('-__v');
            console.log(thought);
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const user = await User.findById(req.body.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const thought = await Thought.create({
                thoughtText: req.body.thoughtText,
                userId: req.body.userId,
                username: user.username,
            });

            user.thoughts.push(thought._id);
            await user.save();

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            };

            const user = await User.findOne({ username: thought.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.thoughts.pull(thought._id);
            await user.save();

            res.json({ message: 'Probably better its gone' })
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const reacData = {
                reactionBody: req.body.reactionBody,
                username: req.body.username,
            }

            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: reacData } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            // make sure to make th params route
            const reactId = req.params.reactId;

            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: reactId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}