import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const ref={type:Schema.Types.ObjectId,ref:'User',required:true,index:true};
export const User=model('User',new Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},role:{type:String,enum:['patient','doctor'],default:'patient'}},{timestamps:true}));
export const Appointment=model('Appointment',new Schema({patient:ref,doctor:String,specialty:String,date:Date,status:{type:String,default:'upcoming'}},{timestamps:true}));
export const Medication=model('Medication',new Schema({patient:ref,name:String,time:String,taken:{type:Boolean,default:false}},{timestamps:true}));
export const Tracker=model('Tracker',new Schema({patient:ref,bp:Number,sugar:Number},{timestamps:true}));
export const Item=model('Item',new Schema({owner:ref,type:{type:String,index:true},data:Schema.Types.Mixed},{timestamps:true}));