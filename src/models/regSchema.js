const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");

const RegData=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,

    },
    lastName:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,

    },
    phoneNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,

    },
    confirmPassword:{
        type:String,
        required:true,

    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

// generating token
RegData.methods.generateToken=async function(){
    try {
        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send("token error"+ error);
        console.log(`error generating token: ${error}`);
    }
}

//middleware converting pass to hash
RegData.pre("save",async function(next){
    if(this.isModified())
        {
            console.log(`pass: ${this.password}`);
            this.password=await bcrypt.hash(this.password,10);
            console.log(`pass: ${this.password}`);
            this.confirmPassword=await bcrypt.hash(this.password,10);
        }

        next();
})

const data=mongoose.model("Register",RegData);
module.exports=data;