import express from 'express';

import Leave from '../models/Leave.js'
import User from '../models/User.js';
import Employee from '../models/Employee.js';


const router = express.Router();

router.post('/employees' , async(req,res)=>{
    try{
   
        const {email, name, password}=req.body;
        let user_id = email;
       
         if (!user_id || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
        const emp = new Employee({user_id, name,password});
        await emp.save();
        res.status(201).json({message:"Employee added successfully!",emp});

    }catch(err){
        res.status(400).json({error:err.message});
    }
})
router.post('/leaves',async(req,res)=>{
    try{
        const {employee,fromDate,toDate,reason}=req.body;
        console.log(req.body);
        const leave = new Leave({employee,fromDate,toDate, reason})
        await leave.save();
        res.status(201).json({ message: "Leave request added successfully", leave });
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

router.post('/auth/login', async (req, res) => {
 
 try{
    const {email, password}= req.body;
    const user =await  User.findOne({userId:email});
   
    if(!user) alert ( 'No user Found');
  
    if(user.password!==password){
          return res.status(401).json({message:"Credentials are wrong"});
    }
    return res.status(200).json({
        message:'Validation Successful',
        user:{
            userId:user.userId,
            name:user.name,
            role:user.role
        },
        token:"valid",

    })
     

 }catch(err){
    console.log(err.message);
 }
});


router.post('/auth/employee-login', async (req, res) => {
 
 try{
 
    const {email, password}= req.body;
    const user =await Employee.findOne({user_id:email});
   
   
    if(!user) alert ( 'No user Found');

    if(user.password!==password){
          return res.status(401).json({message:"Credentials are wrong"});
    }
    return res.status(200).json({
        message:'Validation Successful',
        user:{
            _id:user._id,
            userId:user.user_id,
            name:user.name,
            role:user.role
        },
        token:"valid",

    })
     

 }catch(err){
    console.log(err.message);
 }
});
router.get('/leaves' , async(req,res)=>{
    try{
        const leaves= await Leave.find({status:"Pending"}).populate('employee','user_id name')
     /// _id === employee (that holds object_id) and returns data of user_id and name
     
        console.log(leaves);
        return res.json(leaves);
    }catch(err){
        res.status(500).json({error:err.message});
    }

})

router.get("/leaves/:id", async(req,res)=>{
    try {
        const {id}=req.params;
        const leaves = await Leave.find({employee:id}).sort({appliedAt:-1});
        res.status(200).json(leaves);
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/admin/employees',async(req,res)=>{
    try {
        const employees=await Employee.find().select('-password');
        res.status(200).json(employees);

    } catch (error) {
          res.status(500).json({ error: err.message });
    }
})

router.get('/leaves/pending' ,async(req,res)=>{
    console.log('Route /leaves/pending called');
    try {
        const pending = await Leave.find({status:"Pending"}).populate('employee');
        console.log('Pending Leaves:', pending);
        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
})

router.patch('/leaves/:id/status',async(req,res)=>{
    try {
        const {id} = req.params;
        const {status} =req.body;
        if(!['Approved','Rejected'].includes(status)){
            return res.status(400).json({error:'Invalid status + Still pending'});
        }
        const updatedLeave= await Leave.findByIdAndUpdate(id,{status},{new:true}).populate('employee','user_id name');

        if(!updatedLeave){
            return res.status(404).json({error:'Leave request not found'});
        }

        res.status(200).json({
            message:`Leave updated to ${status.toLowerCase()}`,
            leave:updatedLeave,

        })
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;
