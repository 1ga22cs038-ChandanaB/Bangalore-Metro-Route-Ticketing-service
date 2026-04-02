import mongoose from "mongoose";
const connetDB =async()=>
{
    try{
        await mongoose.connect('mongodb+srv://Chandana_P:fj0SyyJEMFQ8LoGc@cluster0.fr6zf.mongodb.net/MetroDB')
        console.log('connected to database....')
    }
    catch(error)
    {
        console.log(`${error}`)
    }
}
export default connetDB