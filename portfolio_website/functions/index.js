const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp()
require('dotenv').config()


const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

exports.sendEmail = functions.https.onCall((data, context) => {
    console.log(SENDER_EMAIL + " " + SENDER_PASSWORD);
    let authData = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD
        },
    });
    return authData.sendMail({
            from: `${SENDER_EMAIL}`,
            to: `${SENDER_EMAIL}`,
            subject: `${data.subject}`,
            text: `${data.message}`,
            html: `${data.message + " " + data.name + " " + data.email + " " + data.phoneNumber}`,
        }).then(
            res => {
                console.log("successfully sent that mail")
                return "successfully sent that mail"
            })
        .catch(err => {
            console.log(err)
            throw new Error("mail not sent");
        });
});