const {check, validationResult} = require('express-validator')

module.exports ={
    checkUser:async (req,res,next)=>{
        try {
            // validation process
            if(req.path=='/regis'){

                await check("username").notEmpty().isAlphanumeric().run(req) //lgsg ngerun reqiest body dan cek parameter yg kita tuju
            } else if (req.path=='/login'){

              await check("email").notEmpty().isEmail().run(req)
            }
            await check("password").notEmpty().isStrongPassword({
                minLength:5,
                minLowercase:1,
                minUppercase:1,
                minSymbols:1,
                minNumbers:1
            }).run(req)

            const validation = validationResult(req)
            
            if(validation.isEmpty()){
                next()
            } else {
                return res.status(400).send({
                    success:false,
                    message: `Invalid ${validation.errors[0].param}`,
                    error: validation.errors
                })
            }

        } catch (err) {
            return res.status(500).send(err)
        }
        
    },
    checkChangePass : (req, res, next) => {
      const { oldPass, newPass, confPass } = req.body;
    
      // Check if any of the inputs are empty
      if (!oldPass || !newPass || !confPass) {
        return res.status(400).json({ message: 'Please fill in all the required fields.' });
      }
    
      // Check if newPass and confPass are the same
      if (newPass !== confPass) {
        return res.status(400).json({ message: 'New password and confirm password do not match.' });
      }
    
      // Check if oldPass and newPass are the same
      if (oldPass === newPass) {
        return res.status(400).json({ message: 'New password must be different from the old password.' });
      }
    
      // If all checks pass, move on to the next middleware/controller
      next();
    },
    checkCardNumber : (req, res, next) => {
      const { cardNumber } = req.body;

  if (!cardNumber || isNaN(cardNumber) || cardNumber.length !== 16) {
    return res.status(400).json({
      success: false,
      message: 'Invalid card number. Please enter a 16-digit numeric card number.',
    });
  }

  next();
      },
    checkEditProfile: async (req, res, next) => {
      try {
        await check("username").notEmpty().isAlphanumeric().run(req);
        await check("email").notEmpty().isEmail().run(req);
        await check("gender").notEmpty().run(req);
        await check("birthdate").notEmpty().run(req);

        const validation = validationResult(req);

        if (validation.isEmpty()) {
          next();
        } else {
          return res.status(400).send({
            success: false,
            message: "Validation invalid",
            error: validation.errors,
          });
        }
      } catch (error) {
        return res.status(500).send(error);
      }
    }
}