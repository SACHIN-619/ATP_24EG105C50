// import exp from 'express'

// export const adminApp = exp.Router()

// // Add your admin routes here
// write

import exp from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { UserModel } from '../models/usermodel.js'
import { ArticleModel } from '../models/articleSchema.js'

export const adminApp = exp.Router()

// 1. Get all users

adminApp.get('/users', verifyToken("ADMIN"), async (req, res) => {
    try {
        const users = await UserModel.find().select("-password")
        res.status(200).json({ message: "Users list", payload: users })
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message })
    }
})



// 2. Activate / Deactivate User

adminApp.patch('/users/:userId', verifyToken("ADMIN"), async (req, res) => {
    try {
        //get users from parameter
        const { userId } = req.params
        const { isUserActive } = req.body

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { isUserActive } },
            { new: true }
        ).select("-password")

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: `User ${isUserActive ? "Activated" : "Deactivated"}`,
            payload: updatedUser
        })

    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message })
    }
})



// 3. Get all articles

adminApp.get('/articles', verifyToken("ADMIN"), async (req, res) => {
    try {
        const articles = await ArticleModel.find() // find the article
            .populate("author", "email role")

        res.status(200).json({
            message: "All Articles",
            payload: articles
        })

    } catch (err) {
        res.status(500).json({ message: "Error fetching articles", error: err.message })
    }
})



// 4. Toggle Article Status

adminApp.patch('/articles/:articleId', verifyToken("ADMIN"), async (req, res) => {
    try {
        const { articleId } = req.params
        const { isArticleActive } = req.body

        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            articleId,
            { $set: { isArticleActive } },
            { new: true }
        )

        if (!updatedArticle) {
            return res.status(404).json({ message: "Article not found" })
        }

        res.status(200).json({
            message: `Article ${isArticleActive ? "Activated" : "Deactivated"}`,
            payload: updatedArticle
        })

    } catch (err) {
        res.status(500).json({ message: "Error updating article", error: err.message })
    }
})


// 5. System Stats 

adminApp.get('/dashboard', verifyToken("ADMIN"), async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments()
        const activeUsers = await UserModel.countDocuments({ isUserActive: true })

        const totalArticles = await ArticleModel.countDocuments()
        const activeArticles = await ArticleModel.countDocuments({ isArticleActive: true })

        const totalAuthors = await UserModel.countDocuments({ role: "AUTHOR" })

        res.status(200).json({
            message: "Admin Dashboard",
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
                totalAuthors,
                totalArticles,
                activeArticles,
                inactiveArticles: totalArticles - activeArticles
            }
        })

    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard", error: err.message })
    }
})