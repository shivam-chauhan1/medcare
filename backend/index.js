import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import session from "express-session";

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"]; // Add all allowed origins here

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/", doctorRouter);
app.use("/", adminRouter);

app.listen(process.env.PORT_SERVER, () =>
  console.log(`Server running on port ${process.env.PORT_SERVER}`)
);
