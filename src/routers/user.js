const express=require("express")
const { update } = require("../models/user")
require('../db/mongoose')
const users= require('../models/user')
const auth=require("../middleware/auth")
const multer=require('multer')
const sharp=require('sharp')
const router=new express.Router()

router.post('/users',async (req,res) =>{
const me= new users(req.body)    
    try{
        await me.save()
        const token=await me.createToken()
        return res.status(200).send({me,token})
    }catch(e){
        res.status(400).send(e)
    }    
})

router.post('/users/login',async (req,res) =>{        
        try{
            const me=await users.checkUser(req.body.email,req.body.password)
            const token=await me.createToken()
            return res.status(200).send({me,token})
        }catch(e){
            res.status(400).send(e)
        }        
    })

router.post('/users/logout',auth,async (req,res) =>{
                try{
            req.users.tokens=req.users.tokens.filter((token)=>{
                return token.token!==req.token
            })
            console.log(req.users.tokens)
            console.log(req.token)
            await req.users.save()
            res.send({msg:"your account is logout"})            
        }catch(e){
            res.status(400).send(e)
        }        
    })

router.post('/users/logoutall',auth,async (req,res) =>{
        try{
    req.users.tokens=[]
    await req.users.save()
    res.send({msg:"your account is logoutall devices"})
    
}catch(e){
    res.status(400).send(e)
}        
})



router.get("/users",auth,async (req,res)=>{
    try{
        return res.status(200).send(req.users)

    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/user/:id", async(req,res)=>{
     try{
      const _id=req.params.id
     const task=await users.findById(_id)
 return res.status(200).send(task)

     }catch(e){
         res.status(500).send(e)
        
    }
 })

 router.delete("/user/me",auth,async (req,res)=>{
    try{
        console.log('delete')
        console.log(req.users)
      await req.users.remove()
       res.send(req.users)
    }catch(e){
        res.status(500).send(e)
        
    }
})
router.patch("/user/me",auth,async (req,res)=>{
    
const updates=Object.keys(req.body)
const allowedupdates=['name','email','password']
const isValidupdate=updates.every((update)=>allowedupdates.includes(update))
if(!isValidupdate){
return res.status(404).send("invalid update")
}
try{
//const task=await users.findByIdAndUpdate(req.params.id,req.body,{runValidators:true,new:true})


//const task=await users.findById(_id=req.body._id)
const task=req.users
updates.forEach((update)=>{
    task[update]=req.body[update]
})
task.save()
if(!task){
    return res.status(400).send("invalid update")
}
res.send(task)

    }catch(e){
        res.status(500).send(e)
        
    }
}) 
const upload=multer({
    limits:{
        fileSize:2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error("please select thee picture"))
    
        }
        cb(undefined,true)
    }

})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) =>{       
        const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
        req.users.avatar=buffer
        await req.users.save()
        return res.status(200).send('your profile is updated')   
        
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})

})
router.delete('/users/me/avatar',auth,async (req,res) =>{       
    
            req.users.avatar=undefined
            await req.users.save()
            return res.status(200).send('your profile pic is deleted')   
            
    },(error,req,res,next)=>{
        res.status(400).send({erroe:error.message})
    
    })
router.get("/user/:id/avatar", async(req,res)=>{
    console.log('hellooooo')
        try{
         const _id=req.params.id
          const task=await users.findById(_id)
          console.log(task)
           if(!task || !task.avatar){
            throw new Error()
               }
               res.set('Content-Type','image/jpg')
                res.send(task.avatar)

         }catch(e){
            res.status(500).send(e)
           
       }
    })
   



module.exports=router

