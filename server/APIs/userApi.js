const exp=require('express')
const userApp=exp.Router();
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor");
const Article=require("../models/articleModel")

//API

//create new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor))

// Public: list articles with search/filter/sort/pagination
// GET /user-api/articles?search=&category=&author=&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&sortBy=date|title&order=desc|asc&page=1&limit=10
userApp.get('/articles', expressAsyncHandler(async (req, res) => {
    const {
        search = '',
        category = '',
        author = '',
        startDate = '',
        endDate = '',
        sortBy = 'date', // 'date' | 'title'
        order = 'desc',  // 'asc' | 'desc'
        page = '1',
        limit = '10'
    } = req.query;

    const filter = { isArticleActive: true };

    // Build OR conditions for generic search across fields
    const ors = [];
    if (search) {
        const rx = new RegExp(search, 'i');
        ors.push(
            { title: rx },
            { category: rx },
            { 'authorData.nameOfAuthor': rx }
        );
    }

    if (category) {
        // exact match by default
        filter.category = category;
    }

    if (author) {
        const rx = new RegExp(author, 'i');
        ors.push({ 'authorData.nameOfAuthor': rx });
    }

    if (ors.length) {
        filter.$or = ors;
    }

    // Date range filtering using articleId (milliseconds since epoch at creation time)
    // startDate/endDate expected in YYYY-MM-DD
    if (startDate || endDate) {
        const range = {};
        if (startDate) {
            const startTs = new Date(startDate + 'T00:00:00.000Z').getTime();
            if (!Number.isNaN(startTs)) range.$gte = String(startTs);
        }
        if (endDate) {
            const endTs = new Date(endDate + 'T23:59:59.999Z').getTime();
            if (!Number.isNaN(endTs)) range.$lte = String(endTs);
        }
        if (Object.keys(range).length) {
            filter.articleId = range;
        }
    }

    // Sorting
    const sort = {};
    if (sortBy === 'title') {
        sort.title = order === 'asc' ? 1 : -1;
    } else {
        // default: by date via articleId
        sort.articleId = order === 'asc' ? 1 : -1;
    }

    // Pagination
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
        Article.find(filter).sort(sort).skip(skip).limit(limitNum),
        Article.countDocuments(filter)
    ]);

    res.status(200).send({
        message: 'articles',
        items,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
    });
}))

//add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    console.log(commentObj,req.params.articleId)
    //add commnetObj to comments array of article
   const articleWithComments= await Article.findOneAndUpdate(
        { articleId:req.params.articleId},
        { $push:{ comments:commentObj}},
        {returnOriginal:false})

        console.log(articleWithComments)
    //send res
    res.status(200).send({message:"comment added",payload:articleWithComments})

}))

module.exports=userApp;