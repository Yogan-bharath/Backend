const usersDB = {
    users:require("../models/users.json"),
    setUsers:function(data){this.users=data}
}
const fspromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleLogin = async (req,res)=>{
    const {username,password} = req.body
        if(!username || !password)
            return res.status(400).json({"message":"username and password required"})
        const foundUser = usersDB.users.find(user=>user.username === username)
        if(!foundUser) return res.sendStatus(401)
        const roles = Object.values(foundUser.roles)
        const match = await bcrypt.compare(password,foundUser.password)
        if(match) 
        {
            const accessToken = jwt.sign(
                {   "UsersInfo":{
                    "username":foundUser.username,
                    'roles':roles
                
                                }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:"5m"}
            )
            const refreshToken = jwt.sign(
                {"username":foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:"1d"}
            )
            const otherusers = usersDB.users.filter(user=>user.username!==foundUser.username)
            const currentUser = {...foundUser,refreshToken}
            usersDB.setUsers([...otherusers,currentUser])
            await fspromises.writeFile(path.join(__dirname,'..','models','users.json'),JSON.stringify(usersDB.users))
            res.cookie('jwt',refreshToken,{httpOnly:false,sameSite:'none',secure:true})
            return res.json({
                "sucess":"user logged in",
                "accessToken":accessToken, 
            })

        }
        else return res.sendStatus(401)
        
}

module.exports = handleLogin