const UsersModel = require("../model/users");
const { dbConf } = require("../config/db");
const { hashPassword, createToken } = require("../config/encript");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");
const { createOTP } = require("../config/createOtp");
const { generatePassword } = require("../middleware/generate");

module.exports = {
  getUsersData: async (req, res) => {
    try {
      let data = await UsersModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  regis: (req, res) => {
    let { username, email, phone, password } = req.body;
    //0. hashing password
    const newPass = hashPassword(password);
    // 1. GET data untuk memeriksa, apakah email dan/atau username, sudah pernah digunakan
    dbConf.query(
      `select * from users where email=${dbConf.escape(
        email
      )} or phone = ${dbConf.escape(phone)};`,
      (err, results) => {
        //jika ambil data dari db terjadi eror
        if (err) {
          return res.status(500).send(err);
        }

        //jika ambil data dari db berhasil
        //cek apakah data yg diinput sudah ada di db
        // 2. Jika ada value yang didapatkan, maka kirim response untuk regis ulang
        if (results.length > 0) {
          return res.status(300).send({
            success: false,
            message: `Email or phone number is already exist`,
          });
        }
        // 3. jika tidak ada yang sama maka registrasi berlanjut
        else {
          const otp = createOTP(6);
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const day = now.getDate();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();

          const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          dbConf.query(
            `insert into users (username, email, phone, password, retryOTP, lastOtpTime, countOtp) values (${dbConf.escape(
              username
            )},${dbConf.escape(email)},${dbConf.escape(phone)},${dbConf.escape(
              newPass
            )},${dbConf.escape(otp)},${dbConf.escape(datetime)},1);`,
            (errInsert, resultInsert) => {
              //jika saat insert ke db ada error
              if (errInsert) {
                console.log(errInsert);
                return res.status(500).send(errInsert);
              }

              //jika saat insert ke db lancar, maka kirim email verifikasi yang didalamnya ada token

              let token = createToken({
                id: resultInsert.insertId,
                username,
                email,
                otp,
              });
              transport.sendMail(
                {
                  from: "StayComfy",
                  to: email,
                  subject: "Verification Email Account StayComfy",
                  html: `<div>
                <a href="https://jcwdol00803.purwadhikabootcamp.com/verification?t=${token}"><h3>Verify Your Account in this link</h3></a>
                <br><br><br>
                <h4> With Your OTP Code : </h4>
                <h4>${otp}</h4>
                
                
                </div>`,
                },
                (err, info) => {
                  if (err) {
                    console.log(`error : ${err}`);
                    return res.status(400).send(err);
                  }
                  return res.status(201).send({
                    success: true,
                    message:
                      "Register your account is success, Check your email",
                    info,
                  });
                }
              );
            }
          );
        }
      }
    );
  },
  login: (req, res) => {
    dbConf.query(
      `Select id_user, username, email, password, isTenant, picture, isVerified
        from users where email=${dbConf.escape(
          req.body.email
        )} or phone=${dbConf.escape(req.body.email)};`,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        if (results.length === 0) {
          return res.status(401).send({
            success: false,
            message: "Email or phone number is not found",
          });
        }

        if (!results[0].isVerified) {
          return res.status(401).send({
            success: false,
            message: "Please verify your account first",
          });
        }

        const check = bcrypt.compareSync(
          req.body.password,
          results[0].password
        );
        delete results[0].password;
        if (check) {
          let token = createToken({ ...results[0] }); //karna mutable/imutabel
          return res.status(200).send({ ...results[0], token });
        } else {
          return res.status(401).send({
            success: false,
            message: "Your Password is Wrong",
          });
        }
      }
    );
  },
  keepLogin: (req, res) => {
    dbConf.query(
      `Select id_user, username, email, password, isVerified, isTenant, picture 
        from users where id_user=${dbConf.escape(
          req.decript.id_user
        )} or username=${dbConf.escape(req.body.name)};`,
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        let token = createToken({ ...results[0] }); //karna mutable/imutabel
        return res.status(200).send({ ...results[0], token });
      }
    );
  },
  editProfile: async (req, res) => {
    try {
      let data = await UsersModel.findAll({
        where: {
          email: req.body.email,
        },
        raw: true,
      });
      if (data.length > 0) {
        return res.status(200).send({
          success: false,
          message: "Email already exist",
        });
      } else {
        let update = await UsersModel.update(
          {
            username: req.body.username,
            email: req.body.email,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
          },
          {
            where: {
              id_user: req.decript.id_user,
            },
          }
        );
        return res.status(200).send({
          success: true,
          message: "Edit Success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  profilePicture: async (req, res) => {
    try {
      let update = await UsersModel.update(
        {
          picture: `/imgProfile/${req.file.filename}`,
        },
        {
          where: {
            id_user: req.decript.id_user,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Upload Success",
      });
    } catch (error) {
      console.log(error);
    }
  },
  verifyAccount: (req, res) => {
    // cek apakah otpnya benar
    // ambil data dari db dulu
    dbConf.query(
      `Select id_user, username, email, retryOtp, countOtp, isVerified
    from users where id_user=${dbConf.escape(req.decript.id)};`,
      (errGet, resultGetData) => {
        if (errGet) {
          console.log(errGet);
          return res.status(500).send(errGet);
        }
        if (resultGetData[0].retryOtp == parseInt(req.body.otp)) {
          dbConf.query(
            `UPDATE users SET isVerified = true WHERE id_user = ${dbConf.escape(
              resultGetData[0].id_user
            )};`,
            (errUpdate, results) => {
              if (errUpdate) {
                console.log(errUpdate);
                return res.status(500).send({
                  success: false,
                  message: errUpdate,
                });
              }
              return res.status(200).send({
                success: true,
                message: "Your Account is Verified",
              });
            }
          );
        } else {
          return res.status(300).send({
            success: false,
            message: `Your OTP is False`,
          });
        }
      }
    );
  },
  changePassword: (req, res) => {
    // Check if id_user is valid
    dbConf.query(
      `select id_user, username, password from users where id_user=${dbConf.escape(
        req.decript.id_user
      )};`,
      (errGet, resultGetData) => {
        if (errGet) {
          console.log(errGet);
          return res.status(500).send(errGet);
        }

        //check if new pass is different from old pass
        const check = bcrypt.compareSync(
          req.body.oldPass,
          resultGetData[0].password
        );
        if (!check) {
          return res.status(400).send({
            success: false,
            message: "Your New Password is same as Old Password",
          });
        }

        // Hash new password
        const hashedNewPassword = hashPassword(req.body.newPass);

        //update password to DB
        dbConf.query(
          `update users set password = ${dbConf.escape(
            hashedNewPassword
          )} where id_user=${dbConf.escape(req.decript.id_user)};`,
          (errUpdate, results) => {
            if (errUpdate) {
              console.log(errUpdate);
              return res.status(500).send({
                success: false,
                message: errUpdate,
              });
            }
            return res.status(200).send({
              success: true,
              message: "Your password has been changed",
            });
          }
        );
      }
    );
  },
  tobeTenant: (req, res) => {
    // get user ID from token payload
    // yang disimpan ke database : /idCard/filename

    dbConf.query(
      `UPDATE users set cardNumber=${dbConf.escape(
        req.body.cardNumber
      )},cardPicture=${dbConf.escape(
        `/idCard/${req.file.filename}`
      )}, isTenant = true where id_user=${dbConf.escape(req.decript.id_user)};`,
      (err, results) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: err,
          });
        }
        return res.status(200).send({
          success: true,
          message: "You have been a Tenant",
        });
      }
    );
  },
  resetpassword: (req, res) => {
    //cek apakah ada data email tersebut di Db
    dbConf.query(
      `SELECT id_user FROM users where email =${dbConf.escape(
        req.query.email
      )}`,
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }

        if (results.length < 1) {
          return res.status(400).send({
            success: false,
            message: `You have not register`,
          });
        }
        const newPass = generatePassword(10);
        const hashedNewPassword = hashPassword(newPass);

        //update password to DB
        dbConf.query(
          `update users set password = ${dbConf.escape(
            hashedNewPassword
          )} where id_user=${dbConf.escape(results[0].id_user)};`,
          (errUpdate, results) => {
            if (errUpdate) {
              console.log(errUpdate);
              return res.status(500).send({
                success: false,
                message: errUpdate,
              });
            }

            //jika update password di DB ok, maka kirim email
            transport.sendMail(
              {
                from: "StayComfy",
                to: req.query.email,
                subject: "Reset Password",
                html: `<div>
              <h3>Your New Password is</h3>
              <br><br>
              <h4>${newPass}</h4>
              
              
              </div>`,
              },
              (err, info) => {
                if (err) {
                  console.log(`error : ${err}`);
                  return res.status(400).send(err);
                }
                return res.status(201).send({
                  success: true,
                  message: "Check Your Email for New Password",
                  info,
                });
              }
            );
          }
        );
      }
    );
  },
  profileData: async (req, res) => {
    try {
      let data = await UsersModel.findAll({
        attributes: [
          "username",
          "email",
          "gender",
          "birthdate",
          "picture",
          "isVerified",
        ],
        where: {
          id_user: req.decript.id_user,
        },
      });
      return res.status(200).send(data[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  resendVerify: async (req, res) => {
    try {
      let data = await UsersModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      if (data.length == 0) {
        return res.status(200).send({
          success: false,
          message: "Email not found",
        });
      }
      if (data[0].isVerified) {
        return res.status(200).send({
          success: false,
          message: "Email has been verified",
        });
      } else {
        const otp = createOTP(6);
        let token = createToken({
          id: data[0].id_user,
          username: data[0].username,
          email: data[0].email,
          otp,
        });
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 7);
        let differenceInTime =
          currentTime.getTime() - data[0].lastOtpTime.getTime();
        let differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays >= 1) {
          let update = await UsersModel.update(
            { countOtp: 1, lastOtpTime: currentTime, retryOtp: otp },
            {
              where: {
                id_user: data[0].id_user,
              },
            }
          );
          transport.sendMail({
            from: "StayComfy",
            to: data[0].email,
            subject: "Verification Email Account StayComfy",
            html: `<div>
            <a href="https://jcwdol00803.purwadhikabootcamp.com/verification?t=${token}"><h3>Verify Your Account in this link</h3></a>
            <br><br><br>
            <h4> With Your OTP Code : </h4>
            <h4>${otp}</h4>
            </div>`,
          });
          return res.status(200).send({
            success: true,
            message: "Please check your email",
          });
        }
        if (data[0].countOtp == 5) {
          return res.status(200).send({
            success: false,
            message:
              "Send email verification reach limit, please try again tomorrow",
          });
        }
        let update = await UsersModel.update(
          {
            countOtp: data[0].countOtp + 1,
            lastOtpTime: currentTime,
            retryOtp: otp,
          },
          {
            where: {
              id_user: data[0].id_user,
            },
          }
        );
        transport.sendMail({
          from: "StayComfy",
          to: data[0].email,
          subject: "Verification Email Account StayComfy",
          html: `<div>
          <a href="https://jcwdol00803.purwadhikabootcamp.com/verification?t=${token}"><h3>Verify Your Account in this link</h3></a>
          <br><br><br>
          <h4> With Your OTP Code : </h4>
          <h4>${otp}</h4>
          </div>`,
        });
        return res.status(200).send({
          success: true,
          message: "Please check your email",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
