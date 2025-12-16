const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

//Our executable, example usage: ./TwitchDownloaderCLI chatdownload --id 2621173021 --timestamp-format Relative -o chatTest.txt
const EXECUTABLE_NAME = path.join(__dirname, 'TwitchDownloaderCLI');
function getChat(vodID, tempChatFilePath){

    // Ensure temp_chats directory exists
    const dir = path.dirname(tempChatFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const command = `${EXECUTABLE_NAME} chatdownload --id ${vodID} --timestamp-format Relative -o ${tempChatFilePath}`;

    return new Promise((resolve, reject)=>{
       exec(command, (error, stdout, stderr)=>{
            if(error){
                console.error("Error running TwitchDownloader executable");
                return reject(error);
            }
            //Sucess
            resolve(tempChatFilePath);
       });
    });
}
module.exports = { getChat };

