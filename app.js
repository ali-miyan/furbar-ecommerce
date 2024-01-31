const config = require('./config/config');
config.connectDB();
const path = require('path');
require('dotenv').config();
const express = require('express');
const { profile } = require('console');
const app = express();
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const nocache = require('nocache');   
const Config=require('./config/config')


app.use((req, res, next) => {
  res.set('Cache-control', `no-store,no-cache,must-revalidate`)
  next()
})

app.use(nocache());


app.use(session({
    secret: Config.sessionSecret,
    saveUninitialized: true,
    resave: false
  }))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/assets')));



app.use('/',userRoute)
app.use('/admin',adminRoute)



app.use((req, res, next) => {
  res.status(404).render('404');
})


app.listen(PORT,()=>{
    console.log(`server is running in port:http://localhost:${PORT}`);
})