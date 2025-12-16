const fs = require('fs')
const path = require('path')
const knex = require('knex')(require('./knexfile').development);
const {getChat} = require('./analysis')
const {parseChatFile} = require('./parseFile')


//Calls getChat and parseChatFile and inserts into database
async function processVod(vodId){
    //path for the temp .txt file
    const tempPath = path.join(__dirname, 'temp_chats', `chat_${vodId}.txt`);

    try{
        console.log(`[Orchestrator] Starting processing for VOD: ${vodId}`);
        //insert new row in vod_analysys table
        const [analysis] = await knex('vod_analysis')
            .insert({
                vod_id: vodId, 
                total_duration_s: 0,
                status: 'temporary' //For our garbage collector
            })
            .returning('id');
        //Get the id
        const analysisId = typeof analysis === 'object' ? analysis.id : analysis;

        //Download the chat
        console.log(`[Orchestrator] Downloading chat...`);
        await getChat(vodId, tempPath);

        //Parse the file
        console.log(`[Orchestrator] Parsing file...`);
        const messageObjects = await parseChatFile(tempPath, analysisId);

        //Insert to Postgres
        console.log(`[Orchestrator] Inserting ${messageObjects.length} messages into DB...`);
        await knex.batchInsert('chat_message', messageObjects, 1000);

        //Cleanup the file
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        console.log(`[Orchestrator] Finished!`);
        return { success: true, count: messageObjects.length, analysisId: analysisId };
    }
    catch(error){
        console.error(`[Orchestrator] Error processing VOD ${vodId}:`, error);
        // Cleanup file if error occurs
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        throw error;
    }
}
module.exports = { processVod };