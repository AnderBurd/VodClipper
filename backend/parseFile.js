const fs = require('fs');
const readline = require('readline');


//Parse the output.txt, scanning each line thats in "[0:00:05] username: message" format

async function parseChatFile(filePath, vodID){
    const filestream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    //array of output objects
    const messages = [];

    for await (const line of rl){

        //regex that cuts the line into what we want
        const match = line.match(/^\[(\d+):(\d+):(\d+)\]\s+([^:]+):\s+(.*)$/);

        if(match){
            const hours = parseInt(match[1], 10); //parseInt is js way of changing from string to int
            const minutes = parseInt(match[2], 10);
            const seconds = parseInt(match[3], 10);

            // Convert to total seconds for the 'time_s' column
            const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

            messages.push({
                vod_analysis_id: vodID,
                time_s: totalSeconds,
                username: match[4],
                message: match[5]
            });
        }

    }
    return messages;

}

module.exports = {parseChatFile}