const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
//signup router handler
exports.signup = async(req,res) =>{
    try{
        //get data 
        const {name,email,password,role} = req.body;

        //check if user already exits
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email already exists",
            });
        }

        // secure the password
        let hashPassword;
        try{
         hashPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing password",
            });
        }
        //create entry for user

        const user = userModel.create({
            name,email,password:hashPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User created successfully",
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cant not register", 
        })
    }
}

// login route handler
exports.login = async(req,res) => {
    try{

        // fetch the details mail and pwd
        const {email, password} = req.body;
        // check if email and password present
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully"
            });
        }
    // check for registered user
    const user = await userModel.findOne({email});
    // if user not registered
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not registered"
        });
    }

    const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
    };
    // verify password and generate a JWT token
    if(await bcrypt.compare(password,user.password)){
        let token = jwt.sign(payload,
                            process.env.JWT_SECRET,
                            {
                                expiresIn:"2h",
                            });

        // user = user.toObject();
        user.token = token;
        user.password = undefined;    
        
        const options = {
            expires: new Date(Date.now() + 3*24* 60 * 60 * 1000),
            httpOnly: true,
        }// cookie me 3 things paas karni padti hai ---> Name, data, Options 
        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"User loggedIn successfully",
        });
    }
    else{
        return res.status(403).json({
            success:false,
            message:"Incorrect password"
        });
    }
}
catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"A logIn failure",
    })
}

}