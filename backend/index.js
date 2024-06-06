const express = require('express');
const path = require('path');
const sequelize = require('./utils/db');

const app = express();
// app.use(express)

app.use('/', require('./routes'));

app.listen(4000, () => {
    console.log("Server is running on port 4000.");
})