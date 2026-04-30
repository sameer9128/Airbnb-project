const express=require('express')

const router=express.Router()
const wrapAsync=require('../utils/wrapAsync')
const ExpressError=require('../utils/ExpressError')
const Listing = require('../models/listing')
const {reviewSchema}=require('../schema')
const {listingSchema}=require('../schema.js')
const { isLoggedIn,isOwner } = require('./middleware.js')
const listingController=require('../controllers/listing.js')
const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload=multer({storage})
// const upload = multer({ dest: 'uploads/' })


const validateListing=(req,res,next)=>{
     let {error}=listingSchema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errmsg)
    } else{
        next()
    }
   
}

router.route('/')
.get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single("listings[image]"),validateListing,wrapAsync(listingController.createListing))
// .post(upload.single("listings[image]"),(req,res)=>{
//     res.send(req.file)
// })


// create new listings
router.get('/new',isLoggedIn,listingController.renderNewForm)

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listings[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))



// index route
// router.get('/',wrapAsync(listingController.index)
// )



// show route
// router.get('/:id',wrapAsync(listingController.showListing))

// create listings
// router.post('/',isLoggedIn,validateListing,wrapAsync(listingController.createListing))

// edit listings
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editListing))

// router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

// delete listings
// router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
// )

module.exports=router
