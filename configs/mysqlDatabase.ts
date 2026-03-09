import { Sequelize } from "sequelize"

export const sequelize = new Sequelize('booking', String(process.env.DATABASE_NAME), String(process.env.DATABASE_PASSWORD), {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database has connected!");
  } catch (error) {
    console.log(error);
    console.log("Database has not connected!");
  }
}