import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../../models/admins.model";
import { LoginData, Profile } from "../../interfaces/admin.interface";
import jwt from "jsonwebtoken";
import { admin } from "../../interfaces/confirm.interface";
import { Op } from "sequelize";
export const postAdmin = async (req: Request, res: Response) => {
  try {
    const data: any = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;

    const sv = await Admin.create(data);
    await sv.save();

    return res.status(200).json({
      code: "200",
      message: "A account create complete!"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      code: "400",
      message: "username or email is exist!"
    })
  }
}

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const data: LoginData = req.body;
    const account = await Admin.findOne({
      where: {
        username: data.username,
      }
    });

    if (!account) {
      return res.status(404).json({
        code: "404",
        message: "Email or password is incorrect!"
      })
    };

    const checkPassword = bcrypt.compareSync(data.password, account.dataValues.password)

    if (!checkPassword) {
      return res.status(404).json({
        code: "404",
        message: "Email or password is incorrect!"
      })
    };

    const token = jwt.sign({
      id: account.dataValues.id,
      username: account.dataValues.username,
    }, String(process.env.JWT_PRIVATE_KEY), {
      expiresIn: '2h'
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      secure: String(process.env.ENVIROIMENT) == "dev" ? false : true,
      sameSite: "lax",
    });

    return res.status(200).json({
      code: "200",
      message: "Login complete!"
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: "400",
      message: "bad request"
    })
  }
}

export const getProfile = async (req: admin, res: Response) => {
  try {
    const account = await Admin.findOne({
      where: {
        id: req.admin.id,
      }
    });

    const data = account?.dataValues;

    delete data.password;

    res.status(200).json({
      code: "ok",
      data: data,
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: "400",
      message: "Account is not extist!"
    })
  }
}

export const putProfile = async (req: admin, res: Response) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image;
    };

    const data: Profile = req.body;

    const account = await Admin.findOne({
      where: {
        id: {
          [Op.not]: req.admin.id,
        },
        username: data.username,
      }
    })

    if (account) {
      return res.status(400).json({
        code: "400",
        message: "username is exist!"
      })
    };


    await Admin.update(data, {
      where: {
        id: req.admin.id,
      }
    });

    res.status(200).json({
      code: "ok",
      message: "Profile update complete!"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "Bad request",
      message: "Profile error!"
    })
  }
}