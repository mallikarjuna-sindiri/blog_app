const exp = require('express')
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require('./createUserOrAuthor');
const Article = require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require("@clerk/express")
require('dotenv').config()

//authorApp.use(clerkMiddleware())
//create new author
authorApp.post("/author", expressAsyncHandler(createUserOrAuthor))

//create new article
authorApp.post("/article", expressAsyncHandler(async (req, res) => {
    try {
        //get new article obj from req
        const newArticleObj = req.body;
        
        // Validate required fields
        if (!newArticleObj.title || !newArticleObj.content || !newArticleObj.category) {
            return res.status(400).send({ 
                message: "Missing required fields: title, content, and category are required" 
            });
        }

        if (!newArticleObj.authorData || !newArticleObj.authorData.email) {
            return res.status(400).send({ 
                message: "Author information is required" 
            });
        }

        const newArticle = new Article(newArticleObj);
        const articleObj = await newArticle.save();
        res.status(201).send({ message: "article published", payload: articleObj })
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).send({ message: "Error creating article", error: error.message });
    }
}))

//read all articles - AUTHENTICATION REQUIRED (as per user preference)
authorApp.get('/articles', requireAuth({signInUrl:"unauthorized"}), expressAsyncHandler(async (req, res) => {
    try {
        //read all articles from db
        const listOfArticles = await Article.find({ isArticleActive: true }).sort({ dateOfCreation: -1 });
        res.status(200).send({ message: "articles", payload: listOfArticles })
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send({ message: "Error fetching articles", error: error.message });
    }
}))

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})

//modify an article by article id - NO AUTH REQUIRED
authorApp.put('/article/:articleId', expressAsyncHandler(async (req, res) => {
    try {
        //get modified article
        const modifiedArticle = req.body;
        console.log('Updating article:', modifiedArticle)
        
        //update article by article id
        const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
            { ...modifiedArticle },
            { returnOriginal: false })
        
        if (!latestArticle) {
            return res.status(404).send({ message: "Article not found" });
        }
        
        //send res
        res.status(200).send({ message: "article modified", payload: latestArticle })
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send({ message: "Error updating article", error: error.message });
    }
}))

//delete(soft delete) an article by article id - NO AUTH REQUIRED
authorApp.put('/articles/:articleId', expressAsyncHandler(async (req, res) => {
    try {
        //get modified article
        const modifiedArticle = req.body;
        console.log('Updating article status:', modifiedArticle)
        
        //update article by article id
        const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
            { ...modifiedArticle },
            { returnOriginal: false })
        
        if (!latestArticle) {
            return res.status(404).send({ message: "Article not found" });
        }
        
        //send res
        res.status(200).send({ message: "article deleted or restored", payload: latestArticle })
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send({ message: "Error updating article", error: error.message });
    }
}))

module.exports = authorApp;