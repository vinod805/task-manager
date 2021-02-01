const express=require("express")
require('../db/mongoose')
const tasks= require('../models/tasks')
const router=new express.Router()
const auth=require("../middleware/auth")

router.post('/tasks',auth,async (req,res) =>{
//const me= new tasks(req.body)
  const task= new tasks({...req.body,owner:req.users._id})
    try{
        await task.save()
        return res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.get("/tasks",auth,async (req,res)=>{
    const match={}
    if(req.query.completed){
        match.completed=req.query.completed==="true"
    }
    try{
       await req.users.populate({
           path:'tasks',
           match,
           options:{
              limit:parseInt(req.query.limit),
              skip:parseInt(req.query.skip)

           }
       }).execPopulate()
        return res.status(200).send(req.users.tasks)

    }catch(e){
        res.status(400).send(e)

    }
})
router.get("/tasks/:id",auth, async(req,res)=>{
     try{
      const _id=req.params.id
     const task=await tasks.findById({_id,owner:req.users._id})
 return res.status(200).send(task)

     }catch(e){
         res.status(500).send(e)
        
    }
 })
 router.delete("/tasks/:id",auth,async (req,res)=>{
    const _id=req.params.id


    try{

const task=await tasks.findOneAndDelete({_id,owner:req.users._id})
return res.status(200).send(task)

    }catch(e){
        res.status(500).send(e)
        
    }
})
router.patch("/tasks/:id",auth,async (req,res)=>{
    
const updates=Object.keys(req.body)
const allowedupdates=['discription','completed']
const isValidupdate=updates.every((update)=>allowedupdates.includes(update))
if(!isValidupdate){
return res.status(404).send("invalid update")
}
const _id=req.params.id

try{
const task=await tasks.findOne({_id,owner:req.users._id})
if(!task){
    return res.status(400).send("invalid update")
}
updates.forEach((update)=>task[update]=req.body[update])


await task.save()
res.send(task)

    }catch(e){
        res.status(500).send(e)
        
    }
}) 
module.exports=router

