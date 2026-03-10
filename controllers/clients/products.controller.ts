import { Request, Response } from "express"
import { Product } from "../../models/products.model";
import { Categories } from "../../models/categories.model";
import { ProductImages } from "../../models/productImages.model";
import { statusList } from "../../helpers/variable.helper";
import { Op } from "sequelize";

export const getProduct = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const find: any = {
            include: [
                {
                    model: Categories,
                    as: 'categories',
                    where: {}
                },
                {
                    model: ProductImages,
                    as: 'productImages'
                }
            ],
            where: {
                status: statusList.active,
            },
            order: [],
            offset: 0,
            limit: limit,
        };

        if (req.query.search) {
            find.where.productName = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        if (req.query.price && (req.query.price === 'desc' || req.query.price === 'asc')) {
            find.order = [
                ['price', req.query.price]
            ]
        }

        if (req.query.quantity && (req.query.quantity === 'desc' || req.query.quantity === 'asc')) {
            find.order = [
                ['quantity', req.query.quantity]
            ]
        };

        if (req.query.category) {
            find.include = [
                {
                    model: Categories,
                    where: {
                        id: Number(req.query.category),
                    },
                },
            ]
        }

        const totalProduct = await Product.count({
            where: find.where,
            distinct: true,
        });
        const totalPage = Math.ceil(Number(totalProduct) / limit);

        if (page > 0 && page <= totalPage) {
            find.offset = (page - 1) * limit;
        };

        const products = await Product.findAll(find);
        res.status(200).json({
            code: 'ok',
            data: products,
            totalPage: totalPage,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: 'bad request',
            message: 'Product error!'
        })
    }
}

export const detailProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({
            include: [
                {
                    model: Categories,
                    as: 'categories'
                }, 
                {
                    model: ProductImages,
                    as: 'productImages'
                }
            ],
            where: {
                id: Number(req.params.id),
                status: statusList.active,
            }
        });

        res.status(200).json({
            code: 'ok',
            data: product,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: 'error',
            message: 'Server error'
        })
    }
}