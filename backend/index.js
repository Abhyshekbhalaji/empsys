import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import router from './routes/route.js'
dotenv.config();
import User from './models/User.js';
const apk = express();
apk.use(cors()); 
// enabled cors here
apk.use(express.json());

// incoming http requests are parsed into json  
// if not we can able to access the incoming req.body tag
mongoose.connect('mongodb+srv://abhyshekbhalaji:EQyOLvVDpsw2PWbE@system.757j8yv.mongodb.net/?retryWrites=true&w=majority&appName=system').then(()=> console.log("Mongo DB Connected")).catch(err => console.log('Connection error '+ err))


apk.use('/api',router);

const PORT = 3001;

const listener = apk.listen(PORT, () => {

  console.log("Connected on port",PORT);
});

apk.post('/auth/login' , async(req,res)=>{
    
    const {email,password}= req.body;
   
    try{
        const user = await User.findOne({userId:email});
        if(!user) return res.status(404).json({message:'User not found'});
   
        if(user.password !== password){
            return res.status(401).json({message:'Invalid credentials'});
        }
        return res.status(200).json({
            message:'Login Successful',
            user:{
                userId:user.userId,name:user.name,role:user.role
            },
            token:'dummy-token'
        })
    }catch(err){
        console.log("Error around login "+err.message);
    }
})

