module.exports={
    generatePassword: (length) => {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz'
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const symbols = '!@#$%^&*()_+~`|}{[]\:;?><,./-='
        const numbers = '0123456789'
      
        let password = ''
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
        password += symbols.charAt(Math.floor(Math.random() * symbols.length))
        password += numbers.charAt(Math.floor(Math.random() * numbers.length))
      
        const allowedChars = lowercase + uppercase + symbols + numbers
        for (let i = 4; i <length; i++) {
          password += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length))
        }
        // res.status(200).send({
        //   success: true,
        //   message: 'Random password generated successfully',
        //   password: password
        // })
        return password
        
      },
      generateInvoiceNumber(length ) {
        const numDigits = length; // minimum number of digits for the invoice number
        const randomNumber = Math.floor(Math.random() * Math.pow(10, numDigits)); // generate a random number with the specified number of digits
        const paddedNumber = randomNumber.toString().padStart(numDigits, '0'); // pad the number with leading zeroes to ensure it has the minimum number of digits
        const timestamp = Date.now(); // get the current timestamp
        const invoiceNumber = `${paddedNumber}-${timestamp}`; // combine the random number and timestamp to create the invoice number
        return invoiceNumber;
      }
}

  