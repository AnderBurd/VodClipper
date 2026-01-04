//Env file
require('dotenv').config({path: '../.env'});
const { getChat } = require('./analysis')
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const {processVod} = require('./processVod');
const { getStandardDeviationSpikes } = require('./detectSpikes');

const cors = require('cors');
const { default: knex } = require('knex');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000; //3000 for local development

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false }
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
        
        //Check if the vod already exists in our database, if yes we dont gotta insert again (error since unique constraint) 
        const exists = await pool.query('SELECT * FROM vod_analysis WHERE vod_id = $1 LIMIT 1', [vodId]);
        if(exists.rows.length > 0){
            return res.status(200).json({
                message: "Vod already exists in db"
            })
        }

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

//Does a z-test and returns spikes, and raw data
app.get('/api/analytics/by-vod/:vodId', async (req, res) => {
    const { vodId } = req.params;
    const zThreshold = req.query.z || 3; //Allow user to adjust sensitivity of z test

    try {

        //Get analysisId, its kinda scuffed because i built the spike detector to need that
        const { rows } = await pool.query(
            'SELECT id FROM vod_analysis WHERE vod_id = $1 LIMIT 1',
            [vodId]
        );
        if (!rows.length) return res.status(404).json({ message: "Vod not found." });

        const analysisId = rows[0].id;

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


app.get('/api/recent-vods', async (req, res) => {
    //Number of vods shown in homescreen
    const limit = 5
    try{
        const recent = await pool.query(
            'SELECT vod_id FROM vod_analysis ORDER BY id DESC LIMIT $1', [limit]
        );
        res.json({
            vods:recent.rows,
            count: recent.rows.length
        });
    }
    catch(error){
        console.error("Error getting recent-vods", error);
        res.status(500).json({
            error: "Failed to fetch recent-vods"
        });
    }
});