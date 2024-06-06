const express = require('express');
const path = require('path');
const sequelize = require('./utils/db');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', require('./routes'));

app.listen(4000, () => {
    console.log("Server is running on port 4000.");
})