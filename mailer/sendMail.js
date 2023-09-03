const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');

let config = {
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
}
let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

let weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";
async function RDVCreated(rdv, res, next) {

    let response = {
        body: {
            name: rdv.patient.firstName + " " + rdv.patient.lastName,
            intro: "Your RDV is Confirmed",
            table: {
                data: [
                    {
                        RDVList: "new RDV",
                        day: weekdays[new Date(rdv.date).getDay()],
                        date: new Date(rdv.date).getFullYear().toString() + "-" + new Date(rdv.date).getMonth().toString() + "-" + new Date(rdv.date).getDay().toString(),
                        time: new Date(rdv.date).getHours().toString() + ":" + new Date(rdv.date).getMinutes().toString()
                    }
                ],
                outro: "Looking forward "
            }
        }
    }
    const transporter = nodemailer.createTransport(config);

    let mail = MailGenerator.generate(response)
    let message = {
        from: process.env.MAILER_USER,
        to: rdv.patient.email,
        subject: "Your RDV is confirmed ",
        html: mail
    }
    await transporter.sendMail(message).then((info) => {
        console.log("Message sent: %s", info.messageId)

    }
    ).catch(e => {
        return res.status(500).json({ e })
    })
    res.json({ message: 'RDV added successfully', rdv: rdv });

    t = new Date(rdv.date)
    t.setDate(t.getDate() - 1);
    t.setHours(4);
    t.setMinutes(25);
    rdvNotification(t,rdv)



}
function rdvNotification(date,rdv) {


    let response = {
        body: {
            name: rdv.patient.firstName + " " + rdv.patient.lastName,
            intro: "Reminder your RDV is TOMORROW",
            table: {
                data: [
                    {
                        day: weekdays[new Date(rdv.date).getDay()],
                        date: new Date(rdv.date).getFullYear().toString() + "-" + new Date(rdv.date).getMonth().toString() + "-" + new Date(rdv.date).getDay().toString(),
                        time: new Date(rdv.date).getHours().toString() + ":" + new Date(rdv.date).getMinutes().toString()
                    }
                ],
                outro: "Looking forward "
            }
        }
    }
    const transporter = nodemailer.createTransport(config);

    let mail = MailGenerator.generate(response)
    let message = {
        from: process.env.MAILER_USER,
        to: rdv.patient.email,
        subject: "Reminder your RDV is TOMORROW ",
        html: mail
    }
     transporter.sendMail(message).then((info) => {
        console.log("Message sent: %s", info.messageId)

    }
    ).catch(e => {
        console.log("err: %s", e)

    })
    const job = schedule.scheduleJob(date, function () {
        console.log('The world is going to end today.');
    });

}
// module.exports = rdvNotification;

module.exports = RDVCreated;

