const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bCrypt = require("bcrypt");
const app= express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/classDB", {useNewUrlParser: true});

// database schema
const classesSchema = {
    title: String,
    faculty: String,
    time: String,
    link: String
};

//database model
const Class = new  mongoose.model("Class", classesSchema);

const class1 = new Class({
    title: "OOPM",
    faculty: "prof. vipin verma",
    time: "10:00AM - 11:00AM",
    link: "http://localhost:3000/faculty"
})
const details = [class1];

//home route
app.get("/", function(req,res){
    res.render("home");

});
app.post('/', function(req,res){
    var checkRoute = req.body.user;
    if(checkRoute == 'fac'){
        res.redirect('/auth');
    }else{
        res.redirect('/student');
    }
})
//authentication route
app.get('/auth', function(req,res){
    res.render('auth');
});
app.post('/auth', function(req,res){
    const authDetail = req.body.pass;
    if (authDetail == "minorproject"){
        res.redirect("/faculty");
    }else{
        facultyAuth = "Wrong Password"
        res.redirect('/auth');
    }
})
//student route
app.get('/student', function(req,res){
    Class.find({},function(err,foundClasses){
        res.render('student',{details: foundClasses});
    })
});

// faculty route
app.get('/faculty', function(req,res){
    Class.find({},function(err,foundClasses){
        if(foundClasses.length === 0){
            Class.insertMany(details,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("databse updated");
                    res.redirect("/faculty")
                }
            });
        }else{
            res.render("faculty",{details: foundClasses});
        }
    })

})
app.post('/faculty', function(req,res){
    const detail = new Class({
        title: req.body.addTitle,
        faculty: req.body.addFacultyName,
        time: req.body.addTime,
        link: req.body.addLink
    });
    detail.save();
    res.redirect('/faculty')
})
//delete route
app.post("/delete", function(req,res){
    const mongoId = req.body.cancelSubmission;
    Class.findByIdAndRemove(mongoId, function(err){
        if(!err){
            console.log("deleted item");
            res.redirect('/faculty')
        }
    })
})
app.listen("3000",function(){
    console.log("server has strated on port 3000");
})