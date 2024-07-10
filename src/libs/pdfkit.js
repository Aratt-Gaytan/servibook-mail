const PDFDocument =  require('pdfkit-table')


module.exports = function buildPDF(data, dataCallback, endCallback){
    const doc = new PDFDocument();

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    doc.fontSize(25).text(`Hello ${data.name}`, 150,100 )
    doc.image('./src/libs/images/logo.png', 20, 50, {width: 100})

    doc.fontSize(20).text(`
        Thank you, your book ${data.book} is ready, just come in the library after ${data.start_date} and show this doc to pickup it,
        remember to return the book before the ${data.end_date}` )


    doc.fontSize(20).text(`
        ~ Name: ${data.name}
        ~ Loan id: ${data.loan} 
        ~ Book: ${data.book}
        ~ Address: ${data.address}
        ~ Pick up date: ${data.start_date}
        ~ Return date: ${data.end_date}

        `,  {align: 'center'} )

    doc.end();
}