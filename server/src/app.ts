import express, { Application } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { userRouter } from "./routes/user";
import session from "express-session";
import { isAuthenticated } from "./middlewares/isAuth";
import { TaskRouter } from "./routes/task";
import MongoStore from "connect-mongo";
dotenv.config();

export const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://trelllo-clone.vercel.app",
      "https://trelllo-clone-git-main-krakenftws-projects.vercel.app",
      "https://trelllo-clone-wp1t2sglp-krakenftws-projects.vercel.app",
    ],
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store: new MongoStore({
      mongoUrl: process.env.DATABASE_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/user", userRouter);
app.use("/task", isAuthenticated, TaskRouter);

app.set("port", process.env.PORT || 3000);
