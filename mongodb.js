const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'node-test';

const id = new ObjectID();          // param is the string of your key
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('unable to connect db')
    }
    const db = client.db(dbName)
    // db.collection('users').insertOne({
    //     _id: id,     // or without
    //     name: 'Noha',
    //     age: 24
    // },(err , result)=>{
    //     if (err){
    //         return console.log('unable to insert')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //     name: 'Ahmed',
    //     age: 15
    //     },
    //     {
    //         name: 'Ali',
    //         age: 30
    //     },
    // ],(err , result)=>{
    //     if (err){
    //         return console.log('unable to insert')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').findOne({ /*name: 'Mahmoud'*/ _id: ObjectID('5de84496acd9a703a45c81ee')},(error,user)=>{
    //     if (error){
    //         return console.log('unable to get user')
    //     }
    //     console.log(user)
    // })
    // db.collection('users').find({age: 20}).toArray((error,users)=>{
    //     if (error){
    //         return console.log('unable to get users')
    //     }
    //     console.log(users)
    // })
    // db.collection('users').updateOne({_id: ObjectID('5de84496acd9a703a45c81ed')},{
    //     $set: {     // or other update operators like inc .. etc
    //         name: 'Michael',
    //         age: 16
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // })
    // db.collection('tasks').updateMany({completed: false},{
    //     $set: {     // or other update operators like inc .. etc
    //         completed: true,
    //     }
    // }).then((result)=>{
    //     console.log(result.modifiedCount)
    // }).catch(error =>{
    //     console.log(error)
    // })
    // db.collection('users').deleteOne({age: 16}).then((result)=>{
    //     console.log(result.deletedCount)
    // }).catch(error =>{
    //     console.log(error)
    // })
    // db.collection('users').deleteMany({age: 30}).then((result) => {
    //     console.log(result.deletedCount)
    // }).catch(error => {
    //     console.log(error)
    // })
});