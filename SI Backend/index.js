import dotenv from "dotenv";
dotenv.config();
  import cookieParser from "cookie-parser";  
import { portNumber } from "./src/config/config.js";
import express from "express";
import cors from "cors";
import { connection as connectionDataBase } from "./src/config/dataBase.js";
import userRouter from "./src/models/user/routes.js";
import sectorRouter from "./src/models/sector/routes.js";
import employeeCountRouter from "./src/models/employeeCount/routes.js";
import industryRouter from "./src/models/industry/routes.js";
import countryRouter from "./src/models/country/routes.js";
import authRoter from "./src/models/auth/routes.js";
import globalErrorHandler from "./src/middleware/globalErrorHander.js";
import "./src/models/unit/model.js";
import reportRoutes from './src/models/report/routes.js';
import dataEntryRoutes from './src/routes/routesAll.js';
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
connectionDataBase();

const allowedOrigins = [
  "http://localhost:3000",
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  
}));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res, next) => res.send({ message: "Server is running" }));
app.use("/api/user", userRouter);
app.use("/api/sector", sectorRouter);
app.use("/api/employee_count", employeeCountRouter);
app.use("/api/industry", industryRouter);
app.use("/api/country", countryRouter);
app.use("/api/auth", authRoter);
app.use("/api/reports", reportRoutes);
app.use("/api/data-entry", dataEntryRoutes);



app.use(globalErrorHandler);

app.listen(portNumber, (error) => {
    if (error) throw error;
    console.log(`Server is running on port ${portNumber}`);
})