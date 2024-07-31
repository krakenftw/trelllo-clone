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
      "trelllo-clone.vercel.app",
      "trelllo-clone-git-main-krakenftws-projects.vercel.app",
      "trelllo-clone-wp1t2sglp-krakenftws-projects.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store: new MongoStore({
      mongoUrl: process.env.DATABASE_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

app.use("/user", userRouter);
app.use("/task", isAuthenticated, TaskRouter);

app.set("port", process.env.PORT || 3000);
