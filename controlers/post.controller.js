import { pool } from "../db.js";

export async function getAllPost(client) {
    const getPost = await pool.query("select * from posts ")
    const getComment = await pool.query("select * from comments")
    const summarize = getPost.rows.map((post) => {
        post['comment'] = []
        const sum = getComment.rows.filter((comment) => {
            if (post.post_id === comment.post_id) {
                return comment.comment
            }
        })
        post.comment = [...post.comment, ...sum]
        return post
    })
    client.emit('show-post', summarize)
}