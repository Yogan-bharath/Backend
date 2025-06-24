const fs = require('fs').promises;
const path = require('path')
let usersdata = require('../Data/Users_DATA.json');



const getAllEmployees = (req,res)=>{
    if(!usersdata)
        return res.status(404).send("Not Found The users Data")
    res.status(200).json(usersdata)
}

const createUser = async (req,res)=>{
    const body = req.body;
    if(!body)
        return res.status(404).send("Not Found The users Data")
    const {first_name,last_name,password,email} = req.body
    if(!first_name || !last_name || !password || !email) 
        return res.status(400).send("require there fields first_name,last_name,password,email")
    if(!usersdata[0]){
        usersdata.push({'id':1,...body})
    }
    else{
         usersdata.push({'id':usersdata[usersdata.length-1].id+1,...body})
    }
    try{
        await fs.writeFile(path.join(__dirname,'..','Data','Users_DATA.json'),JSON.stringify(usersdata));
        return res.status(201).json({'id':usersdata[usersdata.length-1].id,...body})
    }
    catch(error){
        console.log(error);
    }   
}

const getUserbyId = (req,res)=>{
    const userdata = usersdata.find((user)=>user.id==req.params.id)
    if(!userdata)
        return res.status(400).json({"message":`Emp id ${req.params.id} not found`})
    res.status(200).json(userdata) 
}

const updateUserbyId = async (req,res)=>{
    let user = usersdata.find((user)=>user.id == req.body.id)
    if(!user)
        return res.status(400).json({"message":`Emp id ${req.body.id} not found`})
    const filterArray = usersdata.filter(user=>user.id!=user.id)
    const updateduser = {
        ...user,
        'first_name':req.body.first_name,
        'last_name':req.body.last_name,
        'email':req.body.email,
        'password':req.body.password,
    }
    filterArray.push(updateduser);
    usersdata  = [...filterArray]
    try{
        await fs.writeFile(path.join(__dirname,'..','Data','Users_DATA.json'),JSON.stringify(usersdata));
        res.status(201).send(`<h1>Updated the User id ${req.body.id}</h1>`)
    }
    catch(error){
        console.log(error);
    }   
}

const deleteUserbyId = async (req,res)=>{
    let user = usersdata.find(user=>user.id==req.body.id);
    if(!user)
        return res.status(400).json({"message":`Emp id ${req.body.id} not found`})
    const filterArray = usersdata.filter(user=>user.id!=req.params.id)
    usersdata = [...filterArray]
    try{
        await fs.writeFile(path.join(__dirname,'..','Data','Users_DATA.json'),JSON.stringify(usersdata));
        res.status(201).send(`<h1>Deleted the User id ${req.params.id}</h1>`)
    }
    catch(error){
        console.log(error);
    }
    
}

module.exports = {getAllEmployees,createUser,getUserbyId,updateUserbyId,deleteUserbyId}