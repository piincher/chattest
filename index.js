import { config } from "dotenv";
import cors from "cors";
import express from "express";
import userRoutes from './routes/users.js'
config();
const App = express();
App.use(cors());
App.use(express.json({ limit: "10mb" }));
App.use('/',userRoutes)
App.get("/", async (req, res) => {
  res.send("new update from github");
});
const PORT = process.env.PORT || 3000;
 App.listen(PORT, () => {
    console.log(`the server is running  ${PORT}`);
  });
