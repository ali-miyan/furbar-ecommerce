const path = require('path');
require('dotenv').config();
const express = require('express');
const { profile } = require('console');
const app = express();
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine','ejs');
app.set('views','./views/user');

app.use(express.static(path.join(__dirname,'public')));


app.use('/',userRoute)
app.use('/admin',adminRoute)







app.listen(PORT,()=>{
    console.log(`server is running in port:http://localhost:${PORT}`);
})