const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password contain word ("password")')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age is negative')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
    }
},{
    timestamps: true,
});
userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.avatar;
    return user;
}
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error('Unable to login, incorrect email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login, incorrect password')
    }
    return user;
}
// pre operation to hash password before storing in db
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
// Delete all tasks of user when user account is removed (cascaded remove)
userSchema.pre('remove',async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next()
})
// other method for relation between user and tasks
userSchema.virtual('tasks',{
    ref: 'Task',    // model
    localField: '_id',  // local field relation in model
    foreignField: 'owner',  // local field for user in model
})
const User = mongoose.model('User', userSchema);
module.exports = User;