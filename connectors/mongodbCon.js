const mongoose = require('mongoose')
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})