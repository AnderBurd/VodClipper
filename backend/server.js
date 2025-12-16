//Env file
require('dotenv').config({path: '../.env'});
const { getChat } = require('./analysis')
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const {processVod} = require('./processVod');
const { getStandardDeviationSpikes } = require('./detectSpikes');

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


//Takes vod and processes and inserts into db
app.get('/processVod/:vodId', async (req, res) => {
    const {vodId} = req.params;
    try{
        const result = await processVod(vodId);
        res.status(200).json({
            message: "Analysis complete",
            data: result
        });
    }
    catch(error){
        res.status(500).json({
            error: "Failed to process VOD",
            details: error.message
        });
    }
});


app.get('/api/analytics/:analysisId', async (req, res) => {
    const { analysisId } = req.params;
    const zThreshold = req.query.z || 5; //Allow user to adjust sensitivity of z test

    try {
        const results = await getStandardDeviationSpikes(analysisId, parseFloat(zThreshold));
        
        if (!results.stats) {
            return res.status(404).json({ message: "No data found." });
        }

        res.json(results);
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics." });
    }
});