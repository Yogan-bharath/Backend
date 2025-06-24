const path = require('path');
const fs = require('fs');
const {format} = require('date-fns');
const {v4:uuid} = require('uuid')
const fsPromises = fs.promises;

const logEvents = async (message,fileName)=>{
    const dateTime = format(new Date(),'yyyy:MM:dd');
    const logItem = `${dateTime}\t${uuid()}\t${message}`;
    try{
        if(!fs.existsSync(path.join(__dirname,'.','logs')))
            await fsPromises.mkdir(path.join(__dirname,'.','logs'))
        await fsPromises.appendFile(path.join(__dirname,'.','logs',fileName),`${logItem}\n`)
    }
    catch(error){
        console.log(error);
    }

}

const logger = ((req,res,next)=>{
        logEvents(`${req.url} ${req.method} ${req.headers.origin}`,'index.txt');
        console.log(req.url,req.method);
        next();
})

module.exports = {logger,logEvents}