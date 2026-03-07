import { Response } from "express";
import { admin } from "../../interfaces/confirm.interface";
import { Product } from "../../models/products.model";
import { Categories } from "../../models/categories.model";
import { Op } from "sequelize";
import { statusList } from "../../helpers/variable.helper";
import { Admin } from "../../models/admins.model";
import { ProductImages } from "../../models/productImages.model";

export const postProduct = async (req: admin, res: Response) => {
  try {
    if (req.files && !Array.isArray(req.files) && req.files.image && req.files.image[0]) {
      req.body.image = req.files.image[0].path;
    } else {
      delete req.body.image;
    };

    const categories = JSON.parse(req.body.categories);
    req.body.price = Number(req.body.price);
    req.body.quantity = Number(req.body.quantity);
    const data: any = req.body;

    delete data.categories;
    data.createdBy = req.admin.id;
    data.updatedBy = req.admin.id;

    const check = await Categories.findAll({
      where: {
        id: {
          [Op.in]: categories,
        },
        status: 'delete',
      }
    });

    if (check.length > 0) {
      return res.status(400).json({
        code: "error",
        message: "bad request"
      })
    };

    const product: any = await Product.create(data);
    await product.setCategories(categories);

    if (req.files && !Array.isArray(req.files) && req.files.images) {
      for (const item of req.files.images) {
        await product.createProductImage({
          productId: product.id,
          images: item.path,
        });
      }
    }
    res.status(200).json({
      code: 'ok',
      message: 'The product create complete!'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Server error'
    })
  }
}

export const getProduct = async (req: admin, res: Response) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const find: any = {
      include: [
        {
          model: Categories,
          where: {},
        },
        {
          model: ProductImages,
          as: "productImages"
        },
      ],
      where: {
        status: {
          [Op.in]: [statusList.active, statusList.inactive],
        }
      },
      order: [
        ['updatedAt', 'DESC'],
      ],
      offsert: 0,
      limit: limit,
    }

    if (req.query.status && req.query.status != statusList.delete) {
      find.where.status = req.query.status;
    }

    if (req.query.search) {
      find.where.productName = {
        [Op.like]: `%${req.query.search}%`
      }
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
    }

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

    const totalProduct: number = await Product.count({
      where: find.where,
      distinct: true,
    });
    const totalPage = Math.ceil(totalProduct / limit);

    if (page > 0 && page <= totalPage) {
      find.offset = (page - 1) * limit;
    }
    const product = await Product.findAll(find);

    const data: any = [];
    for (const item of product) {
      const rawData: any = item.dataValues;

      const accountC = await Admin.findOne({
        attributes: ["username"],
        where: {
          id: rawData.createdBy,
        }
      })

      rawData.createdByName = accountC?.dataValues?.username;

      const accountU = await Admin.findOne({
        attributes: ["username"],
        where: {
          id: rawData.updatedBy,
        }
      })

      rawData.updatedByName = accountU?.dataValues?.username;

      data.push(rawData);
    }

    res.status(200).json({
      code: 'ok',
      data: data,
      totalPage: totalPage,
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Server error'
    })
  }
}

export const getOneProduct = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      include: [
        {
          model: Categories,
        }
      ],
      where: {
        id: id,
        status: {
          [Op.in]: [statusList.active, statusList.inactive],
        }
      }
    });

    res.status(200).json({
      code: 'ok',
      data: product,
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Server error'
    })
  }
}

export const putProduct = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;

    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image;
    };

    const categories = JSON.parse(req.body.categories);

    delete req.body.categories;

    req.body.updatedBy = req.admin.id;

    const check = await Categories.findAll({
      where: {
        id: {
          [Op.in]: categories,
        },
        status: 'delete'
      }
    });

    if (check.length > 0) {
      return res.status(400).json({
        code: 'bad request',
        message: 'Server error'
      });
    }

    const product: any = await Product.findByPk(Number(id));

    if (!product) {
      res.status(404).json({
        code: "Not found",
        message: "The product is not found!"
      })
    };

    await product.update(req.body);

    await product.setCategories(categories);
    res.status(200).json({
      code: 'ok',
      message: 'The product update complete!'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Server error'
    })
  }
}

export const deleteProduct = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;

    const product: any = await Product.findByPk(Number(id));
    await product.update({
      status: 'delete'
    });

    res.status(200).json({
      code: 'ok',
      message: 'The product delete complete!'
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'bad request',
      message: 'Server error'
    })
  }
}

export const resetProduct = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(Number(id));

    await product?.update({
      status: statusList.inactive,
    });
    res.status(200).json({
      code: "Ok",
      message: "A product has reseted!"
    })
  } catch (error) {
    res.status(404).json({
      code: "Not found!",
      message: "A product not found!"
    })
  }
}