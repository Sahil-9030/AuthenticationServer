const express = require("express");
const router = express.Router();

const {login, signup} = require("../controllers/Auth");
const {auth, isAdmin, isStudent} = require("../middlewares/auth");
router.post("/login",login);

router.post("/signup",signup);

// protected routes with middlewares
router.get("/admin",auth, isAdmin, (req,res) => {
    res.json({
        success:true,
        message:"This is protected route for Admin"
    });
});

router.get("/student", auth, isStudent, (req,res) =>{
    res.json({
        success:true,
        message:"This is protected route for Student"
    });
});

module.exports = router;