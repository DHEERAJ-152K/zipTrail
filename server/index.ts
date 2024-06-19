import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import express from "express";
import mongoose from "mongoose";
import { mongoConnection } from "./Credentials";
import Url from "./mongoModel";
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//MongoDb connection using mongoose
mongoose
  .connect(mongoConnection)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//API to fetch Long URL and generate a short URL and store it in the DB.
app.post("/", async (req, res) => {
  const { longUrl } = req.body;
  const shortId = nanoid(10);
  const newLink = `https://ziptrail.com/${shortId}`;
  console.log(longUrl);
  console.log(newLink);

  try {
    let url = await Url.findOne({ longUrl }); //to find the input longUrl already exist

    if (url) {
      console.log("found");
      return res.json(url);
    } else {
      console.log("not found");

      url = new Url({ longUrl, shortUrl: newLink });

      await url.save();
      return res.status(201).json(url);
    }
  } catch (err) {
    console.error("error:", err);
    return res.status(500).json({ error: "server-error" });
  }
});

//live server on port 3000
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});