const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

// const task = new Task({
//     description: 'study math',
// })
// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })

// const me = new User({
//     name: "ali ahmed",
//     password: '123456',
//     email: 'ali@gmail.com',
// })
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })
