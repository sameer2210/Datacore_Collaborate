import { portNumber } from "./config/config.js";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { connection as connectionDataBase } from "./config/dataBase.js";
import userRouter from "./models/user/routes.js";
import sectorRouter from "./models/sector/routes.js";
import employeeCountRouter from "./models/employeeCount/routes.js";
import industryRouter from "./models/industry/routes.js";
import countryRouter from "./models/country/routes.js";
import authRouter from "./models/auth/routes.js";
import reportRouter from "./models/report/routes.js";
import organizationReport from "./models/organization/routes.js";
import annualRevenueRouter from "./models/annualRevenue/routes.js";
import globalErrorHandler from "./middleware/globalErrorHander.js";
import CallRoute from "./models/calls/routes.js";
import unitRoute from "./models/unit/routes.js";
import { initSocket } from "./socket/socketSetup.js";
import chatRoute from "./models/chat/routes.js";
import SubscriptionPlanRoutes from "./models/substribtionPlan/routes.js";    
import {handleStripeWebhook} from "./models/substribtionPlan/controller.js";    

const app = express();
const httpServer = createServer(app);


connectionDataBase();

// Stripe webhook route must be before any middleware that parses the body
app.post(
    "/api/subscription-plan/webhook",
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());
app.get("/", (req, res, next) => res.send({ message: "Server is running" }));
app.use("/api/user", userRouter);
app.use("/api/sector", sectorRouter);
app.use("/api/employee_count", employeeCountRouter);
app.use("/api/industry", industryRouter);
app.use("/api/country", countryRouter);
app.use("/api/auth", authRouter);
app.use("/api/report", reportRouter);
app.use("/api/org", organizationReport);
app.use("/api/annual-revenue", annualRevenueRouter);
app.use("/api/unit", unitRoute);
app.use("/api/call", CallRoute);
app.use("/api/chat", chatRoute);   
app.use("/api/subscription-plan", SubscriptionPlanRoutes); 

const io = initSocket(httpServer);

app.use(globalErrorHandler);

httpServer.listen(portNumber, (error) => {
    if (error) throw error;
    console.log(`Server is running on port ${portNumber}`);
});