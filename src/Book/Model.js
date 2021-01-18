const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: '{PATH} is required'
    },
    isbn: {
        type: String,
        required: '{PATH} is required'
    },
    category: {
        type: String,
        required: '{PATH} is required'
    },
    year: {
        type: Number,
        required: '{PATH} is required'
    }
}, {
    versionKey: false,
    timestamps: true
});

BookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Book", BookSchema);