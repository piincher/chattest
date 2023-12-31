import express from 'express';
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();
const Router = express.Router();

const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_PRIVATE_API_KEY
);

const TOKEN_USER_ID_MAP = new Map();


  Router.get("/health", (req, res) => {
    res.status(200).send("OK");
  })
  Router.post(
    "/signup",
    async (req, res) => {
      const { id, name, image } = req.body;
      console.log(req.body);
      if (id == null || id === "" || name == null || name === "") {
        return res.status(400).send("Invalid request")
      }

      const existingUsers = await streamChat.queryUsers({ id });
      if (existingUsers.users.length > 0) {
        return res.status(400).send("User ID taken");
      }

       await streamChat.upsertUser({ id, name, image });

       res.status(200).send('ok');
    
    }
  );

  Router.post("/login", async (req, res) => {
    const { id } = req.body;
    if (id == null || id === "") {
      return res.status(400).send();
    }

    const {
      users: [user],
    } = await streamChat.queryUsers({ id });
    if (user == null) return res.status(401).send();

    const token = streamChat.createToken(id);
    TOKEN_USER_ID_MAP.set(token, user.id);

    return {
      token,
      user: { name: user.name, id: user.id, image: user.image },
    };
  });

  Router.post("/logout", async (req, res) => {
    const token = req.body.token;
    if (token == null || token === "") return res.status(400).send();

    const id = TOKEN_USER_ID_MAP.get(token);
    if (id == null) return res.status(400).send();

    await streamChat.revokeUserToken(id, new Date());
    TOKEN_USER_ID_MAP.delete(token);
  });

export default Router;