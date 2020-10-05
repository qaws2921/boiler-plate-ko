const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {

            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }



})

UserSchema.methods.comparePassword = function(plainPassword,cb) {
    // plainPassword 1234 암호화된 비밀번호 $2b$10$uHZZ7xUnb9.UUIzMLuqM.umhWJw6V.aRsG0x9pqK1qKov7KdrC7QG

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err),
            cb(null, isMatch)
    })

}


const User = mongoose.model('User', UserSchema)

module.exports = { User }