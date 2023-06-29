// Generate Random ID of given length
function generateRandomID(length) {
    let id = '';
    const digits = '0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      id += digits[randomIndex];
    }
    return id;
}


// Generate Random AlphaNumeric ID of given length
function generateRandomAlphaNumericID(length) {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  }
  
module.exports = { generateRandomID, generateRandomAlphaNumericID };