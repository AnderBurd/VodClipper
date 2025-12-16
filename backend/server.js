//Env file
require('dotenv').config({path: '../.env'});
const { getChat } = require('./analysis')
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

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

app.get('/getChat', async (req, res) => {
    const TEST_VOD_ID = '2621173021';
    const TEMP_FILE_NAME = `chat_${TEST_VOD_ID}.txt`;
    
    const TEMP_FILE_PATH = path.join(__dirname, 'temp_chats', TEMP_FILE_NAME);

    console.log(`\n--- Starting VOD Extraction Test for ${TEST_VOD_ID} ---`);

    try {
        //Execute the extraction function
        const filePath = await getChat(TEST_VOD_ID, TEMP_FILE_PATH);
        
        //Verify the file exists (redundant, but good practice)
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            res.status(200).send({
                status: 'SUCCESS',
                message: `Chat file created successfully for VOD ${TEST_VOD_ID}.`,
                filePath: filePath,
                fileSize: `${(stats.size / (1024 * 1024)).toFixed(2)} MB` // Display size in MB
            });
            console.log(`Test SUCCESS. File saved to: ${filePath}`);
            
        } else {
            res.status(500).send({ status: 'ERROR', message: 'Extraction finished, but file was not found.' });
        }

    } catch (error) {
        //Handle errors
        console.error('Extraction Test FAILED:', error.message);
        res.status(500).send({
            status: 'FAILURE',
            message: `Extraction failed: ${error.message}`,
            details: error.toString()
        });
    }
});