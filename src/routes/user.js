const express = require('express')
const User = require("../models/user.js")
const auth = require('../middleware/auth')
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account');

const router = new express.Router();
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.name,user.email);
        res.send({user, token});
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save()
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})
// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
// read one user
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send('user not found')
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
router.patch('/users/me', auth, async (req, res) => {
    const updateKeys = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValid = updateKeys.every(item => allowedUpdates.includes(item));
    if (!isValid) {
        return res.status(404).send({error: 'Invalid Args'});
    }
    try {
        updateKeys.forEach(item => req.user[item] = req.body[item]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})
// router.delete('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findByIdAndDelete(_id);
//         if (!user) {
//             return res.status(404).send({error: 'user not found'})
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send({error: 'user not found'})
        // }
        await req.user.remove();
        sendCancelationEmail(req.user.name,req.user.email);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
})
const upload = multer({
    // dest: 'avatars',    // folder than receive images from requests
    limits: {
        fileSize: 1000000,   // size in bytes
    },
    fileFilter(req, file, cb) {  // cb: callback function for indicating that there is error or success
        // cb(new Error('file must be jpg'))   // send back error
        // cb(undefined,true)      // send back accepted
        // cb(undefined,false)     // send back rejected without error
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {     // visit regex101 website to get expression
            cb(new Error('file must be jpg or jpeg or png'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('uploadImg'), async (req, res) => {   //middleware: uploadImg for param in form data request
    const buffer = await sharp(req.file.buffer).resize({width: 250,height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('stored successfully')
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})        // error given by cb function in file filter
});
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('deleted successfully')
});
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('No user with this id');
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar ? user.avatar : '');
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router;