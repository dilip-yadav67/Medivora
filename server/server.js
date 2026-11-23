import 'dotenv/config';import express from 'express';import cors from 'cors';import mongoose from 'mongoose';import bcrypt from 'bcryptjs';
import routes from './routes.js';import {User} from './models.js';
const app=express();
app.use(cors({origin:process.env.CLIENT_URL?process.env.CLIENT_URL.split(','):true}));
app.use(express.json());
app.get('/',(q,s)=>s.send('Medivora API is running'));
app.get('/api/health',(q,s)=>s.json({ok:true}));
app.use('/api',routes);
const {MONGO_URI,JWT_SECRET,PORT=5000}=process.env;
if(!MONGO_URI||!JWT_SECRET){console.error('Set MONGO_URI and JWT_SECRET');process.exit(1)}
mongoose.connect(MONGO_URI).then(async()=>{
 console.log('MongoDB connected');
 const {DOCTOR_EMAIL:e,DOCTOR_PASSWORD:p}=process.env;
 if(e&&p&&!(await User.findOne({email:e.toLowerCase()})))await User.create({name:'Dr. Alex Morgan',email:e,password:await bcrypt.hash(p,10),role:'doctor'});
 app.listen(PORT,()=>console.log('API on '+PORT));
}).catch(e=>{console.error(e.message);process.exit(1)});
