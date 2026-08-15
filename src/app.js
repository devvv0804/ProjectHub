import express from "express";
import cors from "cors";
const app = express();

export default app;
//basic configurations!
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // so that we can use Public folder to display static items!

//cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173", //5173 is for vite application
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

//import the routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/healthcheck", healthCheckRouter);

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to base campy!");
});
//basically we use to file to remove all the things from index.js file which serves as an entry point!
