const express=require('express')
const tasks= require('./models/tasks')

require('./db/mongoose')
const task_router=require("./routers/tasks")
const user_router=require("./routers/user")



const app=express()
const port=3000
app.use(express.json())
app.use(task_router)
app.use(user_router)


app.listen(port,() =>{
    console.log('server is on')
})

const multer=require("multer")
const { Error } = require('mongoose')
const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx|pdf)$/)){
            return cb(new Error("plesae upload the documents"))
        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
res.send()
},(error,req,res,next)=>{
    res.status(400).send({erroe:error.message})
})
// const Task=require("./models/tasks")
// const User=require("./models/user")
// const main=async ()=>{

//     // const task=await Task.findById("5faa509cc51ca8168c3648de")
//     // await task.populate('owner').execPopulate()
//     // console.log(task)
//     const user=await User.findById('5faa4edd3e255214d0059ca1')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)


// }
// main()
