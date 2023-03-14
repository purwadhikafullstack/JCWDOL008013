const UsersModel = require("../model/users");
const { dbConf } = require("../config/db");
const { hashPassword, createToken } = require("../config/encript");
const bcrypt = require("bcrypt");

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
    console.log(newPass);
    // 1. GET data untuk memeriksa, apakah email dan/atau username, sudah pernah digunakan
    dbConf.query(
      `select * from users where email=${dbConf.escape(
        email
      )} or username = ${dbConf.escape(username)};`,
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
            message: `Username or Email is Already exist`,
          });
        }
        // 3. jika tidak ada yang sama maka registrasi berlanjut
        else {
          dbConf.query(
            `insert into users (username, email, phone, password) values (${dbConf.escape(
              username
            )},${dbConf.escape(email)},${dbConf.escape(phone)},${dbConf.escape(
              newPass
            )});`,
            (errInsert, resultInsert) => {
              //jika saat insert ke db ada error
              if (errInsert) {
                return res.status(500).send(errInsert);
              }
              //jika saat insert ke db lancar

              res.status(201).send({
                success: true,
                message: `Register Your account is Success`,
              });
            }
          );
        }
      }
    );
  },
  login: (req, res) => {
    dbConf.query(
      `Select id_user, username, email, password 
        from users where email=${dbConf.escape(
          req.body.email
        )} or username=${dbConf.escape(req.body.name)};`,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        if (results.length === 0) {
          return res.status(401).send({
            success: false,
            message: "Email is not found",
          });
        }

        const check = bcrypt.compareSync(
          req.body.password,
          results[0].password
        );
        console.log(results[0]);
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
    console.log(req.decript);
    dbConf.query(
      `Select id_user, username, email, password 
        from users where id_user=${dbConf.escape(
          req.decript.id_user
        )} or username=${dbConf.escape(req.decript.username)};`,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        let token = createToken({ ...results[0] });
        return res.status(200).send({ ...results[0], token });
      }
    );
  },
  editProfile: async (req, res) => {
    try {
      console.log("cek decript", req.decript);
      console.log("cek body", req.body);
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
    } catch (error) {
      console.log(error);
    }
  },
  profilePicture: async (req, res) => {
    try {
      console.log("cek file", req.files);
      console.log("cek decript", req.decript);
      let update = await UsersModel.update(
        {
          picture: `/imgProfile/${req.files[0].filename}`,
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
};
