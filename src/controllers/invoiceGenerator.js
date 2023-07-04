let invoiceModel = require("../models/invoiceModel");

let invoiceNumber = 1;

// Generate a 6-digit invoice number
function generateInvoiceNumber() {
  const paddedNumber = String(invoiceNumber).padStart(6, "0");
  return `INV-${paddedNumber}`;
}

// API endpoint to get the next invoice number
const getInvoiceNumber = async (req, res) => {
  let data = req.body;
  let { digits } = data;
  let lastInvoiceNumber = await invoiceModel.findOne({
    invoiceNumber: invoiceNumber,
  });

  if (!lastInvoiceNumber) {
    let num = 1;
    let paddedNumber = String(num).padStart(digits, "0");

    let invoiceData = {
      digits,
      invoiceNumber: paddedNumber,
    };
    // invoiceNumber = paddedNumber.toString();
    // console.log('Hello example', invoiceNumber);
    let newInvoiceNumber = await invoiceModel.create(invoiceData);
    return res
      .status(201)
      .send({ status: true, message: "success", data: newInvoiceNumber });
  } else {
    // let num =1;
    invoiceNumber++;
    await lastInvoiceNumber.save();
    // invoiceNumber = String(num).padStart(digits, "0")
    // console.log('Hello example', invoiceNumber);
    return res.status(201).send({ status: true, invoiceNumber: invoiceNumber });
  }
};

module.exports = { getInvoiceNumber };

// let invoiceNumber = 1;

// function generateInvoiceNumber() {
//   const paddedNumber = String(invoiceNumber).padStart(6, '0');
//   const invoice = `INV-${paddedNumber}`;
//   invoiceNumber++;
//   return invoice;
// }
// console.log(generateInvoiceNumber());
// console.log(generateInvoiceNumber());
// console.log(generateInvoiceNumber());
// console.log(generateInvoiceNumber());
