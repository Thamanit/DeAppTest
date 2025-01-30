import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
import companyRoute from "./routes/companys.js";
import companyOwnerRoute from "./routes/companyOwner.js";
import companyPositionRoute from "./routes/companyPosition.js";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    console.log("Connecting to mongoDB...");
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(
  cors({
    origin: ['http://localhost:9999'],
    credentials: true
  })
);
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/companys", companyRoute);
app.use("/api/companyowner", companyOwnerRoute);
app.use("/api/companyposition", companyPositionRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(4400, () => {
  connect();
  console.log("Connected to backend.");
});
