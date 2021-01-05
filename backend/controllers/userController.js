import User from "../models/User.js"
import expressAsyncHandler from "express-async-handler"
import generateToken from "../utils/generateToken.js"

export const authUser = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })

    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
})


export const getUserProfile = expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

export const updateUserProfile = expressAsyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user)

    if (user) {

        user.name = req.body.name
        user.email = req.body.email
        if (req.body.password) {
            user.password = req.body.password
        }
        await user.save()
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

export const registerUser = expressAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        email,
        name,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})
