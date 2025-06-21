import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','employee'],
        default:'employee'
    }

})
const Employee = mongoose.model('employee' , employeeSchema);
export default Employee;