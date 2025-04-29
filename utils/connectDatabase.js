const mongoose = require('mongoose');

const connectDatabase = async () => {
    mongoose.connect(process.env.DB)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Failed to connect to MongoDB:", err);
            process.exit(1);
        });
};

module.exports = connectDatabase;