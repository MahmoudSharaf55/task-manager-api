const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY);
// sgMail.send({
//     to: 'mahmoudsharf55@gmail.com',
//     from: 'mahmoudsharf55@gmail.com',
//     subject: 'this is my first email',
//     text: 'I am writing my first email to you from send grid.',
// })
const sendWelcomeEmail = (name,email)=>{
    sgMail.send({
        to: email,
        from: 'mahmoudsharf55@gmail.com',
        subject: 'Welcome to app',
        text: `Welcome to the app, Mr.${name}`,
        // html: '<h1></h1>'        // for any html you want
    })
}
const sendCancelationEmail = (name,email)=>{
    sgMail.send({
        to: email,
        from: 'mahmoudsharf55@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, Mr.${name}. I hope to see you back soon`,
        // html: '<h1></h1>'        // for any html you want
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
}