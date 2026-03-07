import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import adminRoute from "./routers/servers/index.route"
import { connectDatabase } from "./configs/mysqlDatabase";
import { mongodbConnect } from "./configs/mongodb";

const app = express();
const port = process.env.PORT;
app.use(cookieParser());
app.use(express.json())
connectDatabase();
mongodbConnect();

app.use('/api/admin', adminRoute);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
