import { Request } from "express";

export interface registerDto {
    username: string,
    email: string,
    password: string,
}

export interface loginDto {
    email: string,
    password: string,
}

export interface client extends Request {
    client?: any
}

export interface profileUpdate {
    username: string,
    image?: string,
    address: string,
    phone: string,
}

export interface changePasswordDto {
    email: string,
    oldPassword: string,
    newPassword: string,
}