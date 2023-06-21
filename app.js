import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { pool } from "./db.js";
import { getAllPost } from "./controlers/post.controller.js";

async function init() {
  dotenv.config();
  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());
  const server = createServer(app)
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
  app.get("/", async (req, res) => {
    try {
      await getAllPost(io)
      return res.status(200)
    } catch (error) {
      return res.status(404).json({ "error": error })
    }

  });
  app.post("/", async (req, res) => {
    try {
      const data = req.body
      if (data.title) {
        const result = await pool.query(
          `insert into posts(title,created_at) values ($1,$2) returning *`,
          [data.title, new Date()]
        );
        await getAllPost(io)
        return res.status(200)
      } else {
        return res.status(404).json({
          message: "data incorrect"
        })
      }

    } catch (error) {
      return res.status(404).json({ "error": error })
    }

  })
  app.post('/comment/:id', async (req, res) => {
    try {
      const data = req.body
      const postId = req.params.id
      if (data.text && postId) {
        const result = await pool.query(
          `insert into comments(post_id,comment,created_at) values ($1,$2,$3) returning *`,
          [postId, data.text, new Date()]
        );
        await getAllPost(io)
        return res.status(200)
      } else {
        return res.status(404).json({
          message: "data incorrect"
        })
      }

    } catch (error) {
      return res.status(404).json({ "error": error })
    }
  })
  io.on('connection', client => {
    console.log("user connected")
  })
  server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}
init();
