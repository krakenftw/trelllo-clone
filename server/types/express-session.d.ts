import "express-session";
import { Types } from "mongoose";

declare module "express-session" {
  interface SessionData {
    user: {
      id: Types.ObjectId;
      name: string;
      email: string;
    };
  }
}

