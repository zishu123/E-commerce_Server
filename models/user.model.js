var mongoose =require('mongoose');
var Schema=  mongoose.Schema;
var crypto = require('crypto');
var uuid =require('uuid/v1')
var userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:32
    },
    lastname:{
        type:String,
        trim:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    enc_password:{
        type:String,
        required:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }
},{timestamps:true})

userSchema.virtual("password")
    .set(function(password){
        this._password = password;
        this.salt = uuid();
        this.enc_password = this.securePassword(password)
    })
    .get(function(){
       return this._password
    })

userSchema.methods={
    authenticate:function(plainPassword){
        return this.securePassword(plainPassword) === this.enc_password
    },
    securePassword:function(plainPassword){
        if(!plainPassword)  return "";
        try{
            return crypto.createHmac('sha256',this.salt).update(plainPassword).digest('hex')
        }catch(err){
            return ""
        }
    }
}

module.exports = mongoose.model('User',userSchema)