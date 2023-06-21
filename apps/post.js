import { Router } from "express";
import { pool } from "../db.js";
import { getAllPost } from "../controlers/post.controller.js";


const post = Router()

post.get('/', async (req, res) => {

})
export default post;