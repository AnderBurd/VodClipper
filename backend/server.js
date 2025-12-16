//Env file
require('dotenv').config({path: '../.env'});

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000; //3000 for local development

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//test route
app.get('/', (req, res) => {
    res.send("backend works");
})

//test database
app.get('/db-test', async (req, res) => {
    try {
        await pool.query('SELECT NOW()');
        res.send('Database connection successful!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection failed.');
    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);

});