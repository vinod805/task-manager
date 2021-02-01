const jwt=require('jsonwebtoken')
const users= require('../models/user')

const auth=async (req,res,next)=>{

try {
    const token=req.header("Authorization").replace("Bearer ",'')
    const decode=jwt.verify(token,'vinod')
    const user=await users.findOne({_id:decode._id,"tokens.token":token})
    if(!user){
        throw new Error("hellooo")
    }
    req.token=token
    req.users=user
    
    next()
} catch (e) {
    res.status(400).send({Error:'please authenticate'})
}}
module.exports=auth



