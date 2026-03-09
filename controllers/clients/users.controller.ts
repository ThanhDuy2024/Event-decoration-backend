import { Request, Response } from "express";
import { changePasswordDto, client, loginDto, profileUpdate, registerDto } from "../../interfaces/users.interface";
import { Users } from "../../models/users.model";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
export const registerUsers = async (req: Request, res: Response) => {
  try {
    const data: registerDto = req.body;

    const checkEmail = await Users.findOne({
      where: {
        email: data.email,
      }
    });

    if (checkEmail) {
      return res.status(400).json({
        code: 'bad request',
        message: 'Email or password exist!'
      })
    };

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;

    const account = await Users.create({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    await account.save();
    res.status(200).json({
      code: 'ok',
      message: 'Account has been register'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'ok',
      message: 'Account is not register'
    })
  }
}

export const loginUsers = async (req: Request, res: Response) => {
  try {
    const data: loginDto = req.body;

    const account = await Users.findOne({
      where: {
        email: data.email,
        status: 'active'
      }
    });

    if (!account) {
      return res.status(404).json({
        code: 'error',
        message: 'Email or password incorrect!'
      })
    };

    const password = bcrypt.compareSync(data.password, account.dataValues.password); // true

    if (!password) {
      return res.status(404).json({
        code: 'error',
        message: 'Email or password incorrect!'
      })
    };

    const token = jwt.sign({
      id: account.dataValues.id,
      username: account.dataValues.username,
    }, String(process.env.JWT_PRIVATE_KEY), {
      expiresIn: '2h'
    });

    res.cookie('usersToken', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      secure: String(process.env.ENVIROIMENT) == "dev" ? false : true,
      sameSite: "lax",
    });

    res.status(200).json({
      code: 'ok',
      message: 'Account create complete'
    })
  } catch (error) {
    console.log(error);
      res.status(404).json({
        code: 'error',
        message: 'Email or password incorrect!'
      })
  }
}

export const profileUsers = async (req: client, res: Response) => {
  try {
    const data: any = req.client;

    const account = await Users.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: data.id
      }
    });

    res.status(200).json({
      code: 'ok',
      data: account?.dataValues,
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Account not found'
    })
  }
}

export const putProfile = async (req: client, res: Response) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image;
    };

    const data: profileUpdate = req.body;

    const account = await Users.findByPk(req.client.id);

    if (!account) {
      res.status(404).json({
        code: 'Not found',
        message: 'Account not found'
      })
    };

    await account?.update(data);
    res.status(200).json({
      code: 'ok',
      message: 'Profile is being updated'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Profile is being not updated'
    })
  }
}

export const changePassword = async (req: client, res: Response) => {
  try {
    const data: changePasswordDto = req.body;

    const account = await Users.findOne({
      where: {
        id: req.client.id,
        email: data.email,
      }
    });

    if (!account) {
      return res.status(404).json({
        code: 'Not found',
        message: 'Account not found!'
      })
    };

    const checkPassword = bcrypt.compareSync(data.oldPassword, account.dataValues.password);

    if (!checkPassword) {
      return res.status(404).json({
        code: 'Not found',
        message: 'Account not found!'
      })
    };

    const salt = bcrypt.genSaltSync(10);
    const password: string = bcrypt.hashSync(data.newPassword, salt);

    await account.update({ password });
    res.status(200).json({
      code: 'ok',
      message: 'Password is being changed!'
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Password is not being changed'
    })
  }
}