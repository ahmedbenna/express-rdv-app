const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");


async function RDVCreated(rdv, res, next) {
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
    let response = {
        body: {
            name :rdv.patient.firstName+" "+rdv.patient.lastName,
            intro: "Your RDV is Confirmed",
            table: {
                data: [
                    {
                        RDVList: "new RDV",
                        date: new Date(rdv.date).getDate()
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
        return res.status(500).json({e})
    })
    res.json({  message: 'RDV added successfully', rdv: rdv });





}


module.exports = RDVCreated;

