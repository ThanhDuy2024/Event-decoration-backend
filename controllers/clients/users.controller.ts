import { Request, Response } from "express";

export const registerUsers = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      code: 'ok',
      message: 'Account create complete'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'ok',
      message: 'Account is not complete'
    })
  }
}

export const loginUsers = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      code: 'ok',
      message: 'Account create complete'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'ok',
      message: 'Account is not complete'
    })
  }
}

export const profileUsers = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      code: 'ok',
      message: 'Account create complete'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'ok',
      message: 'Account is not complete'
    })
  }
}