const { exec } = require('child_process');

function Feature_Extraction(name, callback) {
    exec(`python3 /home/ubuntu/ApolloXIIT/main.py IMAGE ${name}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        callback(stdout.trim());
    });
}

function Translate_Text(text,callback){
    exec(`python3 /home/ubuntu/ApolloXIIT/main.py TRANSLATE '${text}'`,(error,stdout,stderr) => {
        if(error){
            console.log(stderr);
            return;
        }
        callback(stdout.trim());
    });
}

function Make_Query(text, callback){
    exec(`python3 /home/ubuntu/ApolloXIIT/main.py QUERY '${text}'`,(error,stdout,stderr) => {
        if(error){
            console.log(stderr);
            return;
        }
        callback(stdout.trim());
    });
}

module.exports = { Feature_Extraction, Translate_Text, Make_Query };