const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: '{PATH} is required'
    },
    age: {
        type: Number,
        required: '{PATH} is required'
    },
    email: {
        type: String,
        required: '{PATH} is required'
    },
    password: {
        type: String,
        required: '{PATH} is required'
    },
    phones: [{
        type: String,
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
}, {
    versionKey: false
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);