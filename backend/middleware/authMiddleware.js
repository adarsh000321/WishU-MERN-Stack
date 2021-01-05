import jwt from "jsonwebtoken"
import User from "../models/User.js"
import expressAsyncHandler from "express-async-handler"


export const protect = expressAsyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {
            token = req.headers.authorization.split(" ")[1]
            const { id } = jwt.verify(token, process.env.JWT_SECRET)
            req.user = id
            next()
        } catch (e) {
            console.error(e)
            res.status(401)
            throw new Error("Not authorized, no token")
        }

    }

    if (!token) {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})