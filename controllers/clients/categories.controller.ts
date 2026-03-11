import { Request, Response } from "express";
import { Categories } from "../../models/categories.model";
import { statusList } from "../../helpers/variable.helper";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Categories.findAll({
            where: {
                status: statusList.active,
            }
        });
        res.status(200).json({
            code: "success",
            data: categories
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: 'bad request',
        })
    }
}