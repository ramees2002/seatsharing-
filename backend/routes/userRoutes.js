const express = require("express");
const User = require("../models/Usermodel");

const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER

router.post("/register", async (req, res) => {

try{

const {

Name,
email,
password,
phone,
role,
profilePic

}=req.body;


if(

!Name ||

!email ||

!password ||

!phone

){

return res.status(400).json({

message:"All fields are required"

});

}


const existingUser = await User.findOne({

email

});


if(existingUser){

return res.status(400).json({

message:"User already exists"

});

}


const hashedPassword = await bcrypt.hash(

password,

10

);


const user = new User({

Name,

email,

password:hashedPassword,

phone,

role,

profilePic

});


await user.save();


res.status(201).json({

message:"Register Success",

user

});

}

catch(error){

res.status(500).json({

message:"Register Error",

error:error.message

});

}

});




// LOGIN

router.post("/login", async(req,res)=>{

try{

const {

email,

password

}=req.body;


if(

!email ||

!password

){

return res.status(400).json({

message:"Email and password required"

});

}


const user = await User.findOne({

email

});


if(!user){

return res.status(400).json({

message:"User not found"

});

}


const isMatch = await bcrypt.compare(

password,

user.password

);


if(!isMatch){

return res.status(400).json({

message:"Invalid Password"

});

}


const token = jwt.sign(

{

id:user._id

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);


res.status(200).json({

message:"Login Success",

token,

user

});


}

catch(error){

res.status(500).json({

message:"Login Error",

error:error.message

});

}

});




// PROFILE

router.get("/profile/:id",

async(req,res)=>{

try{

const user = await User.findById(

req.params.id

).select(

"-password"

);


if(!user){

return res.status(404).json({

message:"User not found"

});

}


res.status(200).json({

message:"User Found",

user

});

}

catch(error){

res.status(500).json({

message:"Profile Error",

error:error.message

});

}

});






// UPDATE PROFILE

router.put("/profile/:id",

async(req,res)=>{

try{

const {

Name,

phone,

profilePic

}=req.body;


const user = await User.findById(

req.params.id

);


if(!user){

return res.status(404).json({

message:"User not found"

});

}


user.Name =

Name ||

user.Name;


user.phone =

phone ||

user.phone;


user.profilePic =

profilePic ||

user.profilePic;


await user.save();


res.status(200).json({

message:"Profile Updated",

user

});

}

catch(error){

res.status(500).json({

message:"Update Error",

error:error.message

});

}

});



// UPDATE VEHICLE
router.put("/vehicle/:id", async (req, res) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.vehicleNumber = vehicleNumber;
    user.vehicleType = vehicleType;

    await user.save();

    res.status(200).json({
      message: "Vehicle Updated Successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Update Error",
      error: error.message
    });
  }
});


// LOGOUT

router.post("/logout",

(req,res)=>{

res.status(200).json({

message:"Logout Success"

});

});


module.exports = router;