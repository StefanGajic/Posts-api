const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const port = 3000;

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

require('dotenv/config');
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

mongoose.connect(process.env.DB_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`)
});
