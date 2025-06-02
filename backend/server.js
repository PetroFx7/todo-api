const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const todoRouters = require('./routes/todos')

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRouters)
console.log('Mongo URI:', process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
        console.log(`App is running on port http://localhost:${process.env.PORT}`);
    })
}).catch((err) => {
    console.error('MongoDB connection error:', err);
})