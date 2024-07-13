require('dotenv').config();
const Router = require("express");
const buildPDF = require("../libs/pdfkit.js");
const nodemailer = require('nodemailer');
const streamBuffers = require('stream-buffers');

const router = Router();

router.post("/invoice", (req, res) => {
    const dataB = req.body;
    
    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024),   // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
    });

    buildPDF(
        dataB,
        (data) => {
            writableStreamBuffer.write(data);
        },
        () => {
            writableStreamBuffer.end();
            sendEmailWithPDF(writableStreamBuffer.getContents(), dataB.email, res);
        }
    );
});

function sendEmailWithPDF(pdfBuffer, email, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: 'servibook0@gmail.com',
            pass: 'szny gcdc dvwa kbdm'
        }
    });

    let mailOptions = {
        from: 'servibook0@gmail.com',
        to: email,
        subject: 'Thanks for the loan',
        text: 'Please open attached the invoice.',
        attachments: [
            {
                filename: 'invoice.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.send(`Invoice sent successfully ${info.response}`);
    });
}

module.exports = router;

