import { Response } from "express";
import { admin } from "../../interfaces/confirm.interface";
import { CategoryData } from "../../interfaces/categories.interface";
import { Categories } from "../../models/categories.model";
import { Admin } from "../../models/admins.model";
import { Op } from "sequelize";

export const postCategory = async (req: admin, res: Response) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image;
    };

    const data: CategoryData = req.body;
    data.createdBy = req.admin.id;
    data.updatedBy = req.admin.id;

    await Categories.create({
      categoryName: data.categoryName,
      image: data.image,
      status: data.status,
      createdBy: Number(data.createdBy),
      updatedBy: Number(data.updatedBy),
    });

    res.status(200).json({
      code: "Ok",
      message: "A category create complete!"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "Bad request",
      message: "Server error"
    })
  }
}

export const getCategory = async (req: admin, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;
    const find: any = {
      where: {
        status: {
          [Op.not]: 'delete'
        },
      },
      order: [
        ['updatedAt', 'DESC']
      ],
      offset: 0,
      limit: limit,
    }

    if (req.query.status && req.query.status != 'delete') {
      find.where.status = req.query.status;
    }

    if (req.query.search) {
      find.where.categoryName = {
        [Op.like]: `%${req.query.search}%`
      }
    }

    const totalCategories: number = await Categories.count({
      where: find.where
    });
    const totalPage = Math.ceil(totalCategories / limit);

    if (page > 0 && page <= totalPage) {
      find.offset = (page - 1) * limit;
    }
    const categories = await Categories.findAll(find);

    const data: any = [];
    for (const item of categories) {
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
      code: "Ok",
      data: data,
      totalPage: totalPage,
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "bad request",
      message: "Server error"
    })
  }
}

export const getOneCategory = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({
      where: {
        id: id,
      }
    });
    res.status(200).json({
      code: "Ok",
      data: category,
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "bad request",
      message: "Server error"
    })
  }
}

export const putCategory = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;
    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image;
    };

    req.body.updatedBy = req.admin.id;
    const category = await Categories.findOne({
      where: {
        id: id,
      }
    });

    if (category) {
      await category.update(req.body);
    } 
    res.status(200).json({
      code: "Ok",
      message: "The cateogry is here!"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "bad request",
      message: "Server error"
    })
  }
}

export const deleteCategory = async (req: admin, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({
      where: {
        id: id,
      }
    })

    if (category) {
      await category.update({
        status: 'delete'
      })
    };
    res.status(200).json({
      code: "Ok",
      data: "The category delete complete!",
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "bad request",
      message: "Server error"
    })
  }
}