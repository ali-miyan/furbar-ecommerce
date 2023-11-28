const express = require('express');
const routeAdmin=express()

routeAdmin.set('view engine','ejs');
routeAdmin.set('views','./views/user');

routeAdmin.get('/',(req,res)=>{
    res.render('adminlogin')
})



module.exports=routeAdmin