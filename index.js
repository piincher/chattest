import { config } from "dotenv";
import express from "express";
import userRoutes from './routes/users.js'
config();
const App = express();
App.use(express.json({ limit: "10mb" }));
App.use('/',userRoutes)
const PORT = process.env.PORT || 3000;
 App.listen(PORT, () => {
    console.log(`the server is running  ${PORT}`);
  });
