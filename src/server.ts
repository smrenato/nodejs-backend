import "reflect-metadata";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import AppError from "./errors/AppError";
import routes from "./routes";

import "./database";

import swaggerUI from "swagger-ui-express";
import swaggerDocs from "./swagger.json";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});

app.listen(process.env.PORT, () => {
    console.log("APP started on port 3333");
});
