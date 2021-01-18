const mongoose = require("mongoose");

module.exports = {
    connect: async () => {
        mongoose.connect(process.env.DATABASE_STRING_CONNECTION, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}