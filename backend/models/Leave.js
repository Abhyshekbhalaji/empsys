import mongoose from "mongoose";    

const leaveSchema=new mongoose.Schema({
employee:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'employee',
    required:true
},
fromDate:{
    type:Date,
    required:true
},
toDate:{
        type:Date,
    required:true
},
reason:{
    type:String,
    required:true,
},
status:{
    type:String,
    enum:['Pending','Approved','Rejected'],
    default:'Pending'
}
,
appliedAt:{
    type:Date,
    default:Date.now
},

})

const Leave =new mongoose.model("leave" , leaveSchema);
export default Leave;
