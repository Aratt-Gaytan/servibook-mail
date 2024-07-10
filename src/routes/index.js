require('dotenv').config();
const Router = require("express");
const buildPDF = require("../libs/pdfkit.js");
const nodemailer = require('nodemailer');
const streamBuffers = require('stream-buffers');

const router = Router();

router.post("/invoice", (req, res) => {
    const data = req.body;
    
    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024),   // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
    });

    buildPDF(
        data,
        (data) => {
            writableStreamBuffer.write(data);
        },
        () => {
            writableStreamBuffer.end();
            sendEmailWithPDF(writableStreamBuffer.getContents(), res);
        }
    );
});

function sendEmailWithPDF(pdfBuffer, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'arattuwu@gmail.com',
        subject: 'Invoice',
        text: 'Please find attached the invoice.',
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
        res.send('Invoice sent successfully');
    });
}

module.exports = router;

