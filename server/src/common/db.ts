import mongoose from "mongoose";

export interface IDatabase {
  init(): void;
}

export default class Database implements IDatabase {
  connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  init(): void {
    mongoose
      .connect(this.connectionString)
      .then(() => {
        console.info("Database connected.");
      })
      .catch((err) => {
        console.error(
          "MongoDB connection error. Please make sure MongoDB is running.\n" +
            err,
        );
        process.exit(1);
      });

    const db = mongoose.connection;

    db.on("error", (err) => console.error("MongoDB error:\n" + err));
  }
}
