const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to generate a new invoice number
app.post("/invoices", (req, res) => {
  const brandName = "JB";
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  // Retrieve the last invoice number from a database or storage
  let lastInvoiceNumber = retrieveLastInvoiceNumber(); // Replace with your own logic to retrieve the last invoice number

  let invoiceNumber;
  if (lastInvoiceNumber) {
    // Extract the numeric part and increment it
    const numericPart = lastInvoiceNumber.substring(10);
    const incrementedNumericPart = (
      parseInt(numericPart) + 1
    ).toString().padStart(4, "0");

    // Concatenate the brand name, current date, and the updated numeric part
    invoiceNumber = brandName + month + day + year + incrementedNumericPart;
  } else {
    // Set initial invoice number
    invoiceNumber = brandName + month + day + year + "0001";
  }

  // Save the updated invoice number to the database or storage
  saveInvoiceNumber(invoiceNumber); // Replace with your own logic to save the invoice number

  res.status(200).json({ invoiceNumber });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
