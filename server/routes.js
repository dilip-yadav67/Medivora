import {Router} from 'express';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';
import {User,Appointment,Medication,Tracker,Item} from './models.js';
const r=Router();
const sign=u=>jwt.sign({id:u._id,role:u.role},process.env.JWT_SECRET,{expiresIn:'7d'});
const pub=u=>({id:u._id,name:u.name,email:u.email,role:u.role});
const guard=(role)=>(q,s,n)=>{try{const t=(q.headers.authorization||'').replace('Bearer ','');const p=jwt.verify(t,process.env.JWT_SECRET);if(role&&p.role!==role)return s.status(403).json({message:'Forbidden'});q.user=p;n()}catch{s.status(401).json({message:'Please login to continue'})}};
const wrap=f=>(q,s,n)=>f(q,s,n).catch(e=>{console.error(e);s.status(500).json({message:'Server error'})});
const day=86400000;

r.post('/auth/register',wrap(async(q,s)=>{
 const {name,email,password}=q.body||{};
 if(!name||!email||!password||password.length<6)return s.status(400).json({message:'Enter your name, email and a password of 6+ characters'});
 if(await User.findOne({email:email.toLowerCase()}))return s.status(409).json({message:'An account with this email already exists'});
 const u=await User.create({name,email,password:await bcrypt.hash(password,10),role:'patient'});
 await Appointment.insertMany([{patient:u._id,doctor:'Dr. Alex Morgan',specialty:'Cardiology',date:new Date(Date.now()+day)},{patient:u._id,doctor:'Dr. Priya Singh',specialty:'General Checkup',date:new Date(Date.now()+5*day)}]);
 await Medication.insertMany([{patient:u._id,name:'Metformin 500mg',time:'8:00 AM, 8:00 PM'},{patient:u._id,name:'Amlodipine 5mg',time:'9:00 AM'},{patient:u._id,name:'Vitamin D3',time:'After lunch'}]);
 s.status(201).json({token:sign(u),user:pub(u)});
}));
r.post('/auth/login',wrap(async(q,s)=>{
 const {email,password,role}=q.body||{};
 const u=await User.findOne({email:(email||'').toLowerCase()});
 if(!u||!(await bcrypt.compare(password||'',u.password))||(role&&u.role!==role))return s.status(401).json({message:'Incorrect email or password'});
 s.json({token:sign(u),user:pub(u)});
}));
r.get('/auth/me',guard(),wrap(async(q,s)=>{const u=await User.findById(q.user.id);if(!u)return s.status(401).json({message:'Please login'});s.json(pub(u))}));

r.get('/patient/dashboard',guard('patient'),wrap(async(q,s)=>{
 const p=q.user.id;
 const [appointments,meds,tracker]=await Promise.all([Appointment.find({patient:p}).sort('date'),Medication.find({patient:p}),Tracker.find({patient:p}).sort('-createdAt').limit(7)]);
 s.json({appointments,meds,tracker:tracker.reverse()});
}));
r.post('/patient/tracker',guard('patient'),wrap(async(q,s)=>{
 const bp=Number(q.body.bp);if(!bp||bp<50||bp>260)return s.status(400).json({message:'Enter a valid BP value'});
 s.status(201).json(await Tracker.create({patient:q.user.id,bp,sugar:Number(q.body.sugar)||undefined}));
}));
r.patch('/patient/meds/:id/taken',guard('patient'),wrap(async(q,s)=>{
 const m=await Medication.findOneAndUpdate({_id:q.params.id,patient:q.user.id},{taken:true},{new:true});
 m?s.json(m):s.status(404).json({message:'Not found'});
}));
r.post('/patient/appointments',guard('patient'),wrap(async(q,s)=>{
 const {doctor,specialty,date}=q.body;if(!doctor||!date)return s.status(400).json({message:'Doctor and date are required'});
 s.status(201).json(await Appointment.create({patient:q.user.id,doctor,specialty,date}));
}));

// read-only sample data for Guest mode (no login needed)
r.get('/public/sample',(q,s)=>s.json({
 appointments:[{_id:'a1',doctor:'Dr. Alex Morgan',specialty:'Cardiology',date:new Date(Date.now()+day)},{_id:'a2',doctor:'Dr. Priya Singh',specialty:'General Checkup',date:new Date(Date.now()+5*day)}],
 meds:[{_id:'m1',name:'Metformin 500mg',time:'8:00 AM, 8:00 PM',taken:false},{_id:'m2',name:'Amlodipine 5mg',time:'9:00 AM',taken:true},{_id:'m3',name:'Vitamin D3',time:'After lunch',taken:false}],
 tracker:[128,126,130,124,122,125,120].map(bp=>({bp}))}));

// Doctor workspace: patients, appointments, lab orders, prescriptions, messages, reports, records, treatments
const TYPES=['patient','appointment','lab','prescription','message','report','record','treatment'];
r.get('/doctor/items',guard('doctor'),wrap(async(q,s)=>{const f={owner:q.user.id};if(q.query.type)f.type=String(q.query.type);s.json(await Item.find(f).sort('-createdAt').limit(200))}));
r.post('/doctor/items',guard('doctor'),wrap(async(q,s)=>{
 const {type,data}=q.body||{};
 if(!TYPES.includes(type)||!data||typeof data!=='object')return s.status(400).json({message:'Invalid request'});
 const clean={};for(const [k,v] of Object.entries(data))clean[k]=String(v).slice(0,500);
 s.status(201).json(await Item.create({owner:q.user.id,type,data:clean}));
}));
r.delete('/doctor/items/:id',guard('doctor'),wrap(async(q,s)=>{await Item.deleteOne({_id:q.params.id,owner:q.user.id});s.json({ok:true})}));
export default r;