import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import HttpException from "../exception/HttpException";
import isEmpty from "validator/lib/isEmpty";
import  Post  from "../models/Post";
import { IUserDocument } from "../models/User";

export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {page} =req.query
    const myCustomLabels = {
      totalDocs: "total_count",
      docs: "posts",
      limit: "limit_value",
      page: "current_page",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "num_pages",
      pagingCounter: "slNo",
      meta: "page"
    };
    
    const options = {
      page: page?parseInt(page as string):1,
      limit: 10,
      customLabels: myCustomLabels,
    };
    const posts = await Post.paginate({},options);
    res.json({
      success: true,
      data: posts
    })
  } catch (error) {
    next(error)
  }
}


export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    if (isEmpty(body.trim())) {
      throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'Body must be not empty', {
        body: 'The body must be not empty'
      })
    }
    const post = await Post.findById(id);
    const user = req.currentUser as IUserDocument
    if (post) {
      if (post.username === user.username) {
        // await post.update({body})
        const newPost = await Post.findByIdAndUpdate(id, { body }, { new: true })
        res.json({
          success: true,
          data: {
            message: 'update sucessfully',
            post: newPost
          }
        })
      } else {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Action not allowed')
      }

    } else {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Post not found')
    }

  } catch (error) {
    next(error)
  }
}


export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = req.currentUser as IUserDocument
    if (post) {
      if (post.username === user.username) {
        await Post.findByIdAndDelete(id)
        res.json({
          success: true,
          data: {
            message: 'delete sucessfully',
          }
        })
      } else {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Action not allowed')
      }

    } else {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Post not found')
    }

  } catch (error) {
    next(error)
  }
}

export const getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('user',"-password");
    if (post) {
      res.json({
        success: true,
        data: { post}
      })
    } else {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Post not found')
    }

  } catch (error) {
    next(error)
  }
}

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { body } = req.body;
    // console.log(body)
    if (isEmpty(body.trim())) {
      throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'Body must be not empty', {
        body: 'The body must be not empty'
      })
    }
    const user = req.currentUser as IUserDocument;
    const newPost = new Post({
      body,
      username: user.username,
      user: user.id,
      createAt: new Date().toISOString()
    })

    const post = await newPost.save()

    res.json({
      success: true,
      data: {
        message: 'created sucessfully',
        post
      }
    })
  } catch (error) {
    next(error)
  }
}

export const likePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = req.currentUser as IUserDocument
    if (post) {
      if (post.likes.find(like => like.username = user.username)) {
        post.likes = post.likes.filter(like => like.username !== user.username);
        // user.like_posts=user.like_posts.filter(post=>post.username!==user.username);
        user.like_posts=user.like_posts.filter((id:any)=>!user.like_posts.includes(id))
      } else {
        post.likes.push({
          username: user.username,
          createAt: new Date().toISOString()
        })
        user.like_posts.push(post)
        user.like_posts.push(post.id)
      }
      await post.save()
      await user.save()
      res.json({
        success: true,
        data: {
          post
        }
      })

    } else {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Post not found')
    }

  } catch (error) {
    next(error)
  }
}