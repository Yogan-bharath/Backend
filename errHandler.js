const {logEvents} = require('./logevents')

const errorHandler = (err,req,res,next)=>{
    logEvents(`${err.name}: ${err.message}`,'errors.txt');
    console.error(err.stack)
    res.status(500).send(err.message)
}

module.exports = errorHandler