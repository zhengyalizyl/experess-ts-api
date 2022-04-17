import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import HttpException from "../exception/HttpException";
import isEmpty from "validator/lib/isEmpty";
import Post from "../models/Post";
import { IUserDocument } from "../models/User";


export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as IUserDocument
        const { body } = req.body;
        const { id } = req.params;
        if (isEmpty(body.trim())) {
            throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'Body must be not empty', {
                body: 'The body must be not empty'
            })
        }
        const post = await Post.findById(id);
        if (!post) {
            throw new HttpException(StatusCodes.NOT_FOUND, 'Post not found')
        } else {

            post.comments.unshift({
                username: user.username,
                createAt: new Date().toISOString(),
                body

            })
            await post.save()
            res.json({
                successfull: true,
                data: {
                    message: 'comment has been  created sucessfully',
                    post
                }
            })
        }
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as IUserDocument
        const { body } = req.body;
        const { id, commentId } = req.params;
        if (isEmpty(body.trim())) {
            throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'Body must be not empty', {
                body: 'The body must be not empty'
            })
        }
        const post = await Post.findById(id);
        if (!post) {
            throw new HttpException(StatusCodes.NOT_FOUND, 'Post not found')
        } else {
            const commentIndex = post.comments.findIndex(item => item.id === commentId)
            if (!post.comments[commentIndex]) {
                throw new HttpException(StatusCodes.NOT_FOUND, "Comment not found")
            } else {
                if (post.comments[commentIndex].username = user.username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save();
                    res.json({
                        successfull: true,
                        data: {
                            message: 'comment has been  created sucessfully',
                            post
                        }
                    })
                } else {

                    throw new HttpException(StatusCodes.UNAUTHORIZED, "delete comment can not be allowed")

                }

            }

        }
    } catch (error) {
        next(error)
    }
}
