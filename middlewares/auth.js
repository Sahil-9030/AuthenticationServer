const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) =>{
    try{
        // extract token --> 3 ways to extract token
        // passing token with body is least secure and header is most secure way to parse token 
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                message:"Token missing",
                success:false,
            });
        }
        // verify the token
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        console.log(payload);

        req.user = payload;
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token",
        });
    }
}

exports.isStudent = (req,res,next) =>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students",
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admins",
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
}