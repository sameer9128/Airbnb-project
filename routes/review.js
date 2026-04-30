const express=require('express')
const router=express.Router({mergeParams:true})

const wrapAsync=require('../utils/wrapAsync')
const ExpressError=require('../utils/ExpressError')
const Listing = require('../models/listing')
const {reviewSchema}=require('../schema')
const Review=require('../models/review.js')
const {isLoggedIn, isReviewAuthor}=require('./middleware.js')
const reviewController=require('../controllers/review.js')

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw ExpressError(400,error)
    } else{
        next()
    }
}

// Reviews
// post review
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// post review delete
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))


module.exports=router