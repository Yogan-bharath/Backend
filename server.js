const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser')

const errorHandler = require('./errHandler');
const {logger} = require('./logevents');

const handleUsersapi = require('./routers/api/usersRouter')
const homeRouter = require('./routers/homeRouter')
const registerRouter = require('./routers/registerRouter')
const authenticationRouter = require('./routers/authenticationRouter');
const verifyJWT = require('./middleware/verifyJWT')
const refreshRouter = require('./routers/refreshRouter')
const cors = require('cors')

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())

const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions))
app.use(logger)
app.use(require('./middleware/credentials'))


app.use('/api/users',verifyJWT,handleUsersapi)
app.use('/',homeRouter)
app.use('/register',registerRouter)
app.use('/login',authenticationRouter)
app.use('/refresh',refreshRouter)
app.use('/logout',require('./routers/logoutRouter'))



app.all(/^\/.*/,(req,res)=>{
    res.status(404);
    if(req.accepts('html'))
        res.send("Error");
    else if(req.accepts('json'))
        res.send({error:'404 Not found'})
    else res.type('txt'),send('404 not found')
})
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running in http://localhost:${PORT}/`);
})