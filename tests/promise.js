require('../src/db/mongoose')
const Tasks=require('../src/models/tasks')
// Tasks.countDocuments({completed:true}).then((result)=>{
//     console.log(result)
//     const _id='5f929fcca5bc2f23604c2a30'
//     return Tasks.findByIdAndUpdate(_id,{discription :'reading books and news paper',complted:true})})
// .then((result2)=>{
//         console.log(result2)
//     }).catch((e)=>{
//         console.log(e)
//     })

    const deleteandcount=async (id,complted)=>{
        const d= await Tasks.findByIdAndRemove({_id:id})
        console.log(d)
        const c=await Tasks.countDocuments({complted})
        return c
    }
    deleteandcount('5f929fcc4fe1c62024e1e376',false).then((result)=>{
        console.log(result)
    }).catch((e)=>{
        console.log(e)
    })