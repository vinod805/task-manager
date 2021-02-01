const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require("bcryptjs")
const jwt= require('jsonwebtoken')
const task=require('./tasks')


const userShema= new mongoose.Schema({
    name:{        
    type:String,
    required:true,
    trim:true,

},
email:{
    type:String,
    required:true,
    
},
password:{
    type:String,
    required:true,
    
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}
   
],
avatar:{
    type: Buffer
}
},{
    timestamps:true
})
userShema.virtual('tasks',{
    ref:"tasks",
    localField:'_id',
    foreignField:'owner'
})


userShema.methods.createToken=async function () {
    console.log("create yoken")
    const user=this
const token=jwt.sign({_id:user._id.toString()}, "vinod" )
user.tokens=user.tokens.concat({token})
await user.save()
return token
}
userShema.methods.toJSON= function () {
const user=this
const userObject=user.toObject()
delete userObject.password
delete userObject.tokens
delete userObject.avatar

return userObject
}





//check the user
userShema.statics.checkUser=async (email,password)=>{
const user=await users.findOne({ email})
if(!user){
  
    return {msg:"invalid email"}
}

const isvalid=await bcrypt.compare(password,user.password)
if(password===user.password){
    return user
}
if(!isvalid){
    return {msg:"invalid password"}

}
return user
}

//hashing the password
userShema.pre("save",async function(next){

    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }


    next()
})

userShema.pre("remove",async function(next){
const user=this
await task.deleteMany({owner:user._id})
next()
})


const users=mongoose.model("users",userShema)
module.exports=users