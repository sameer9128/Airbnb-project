const Listing=require('../models/listing')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken=process.env.MAP_TOKEN
const geoCodingClient=mbxGeocoding({accessToken:mapToken})

module.exports.index=(async(req,res)=>{
    const allListings=await Listing.find({})
    res.render('listings/index',{allListings})
})

module.exports.renderNewForm=(req,res)=>{
    
    res.render('listings/new.ejs')
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params
    const listings=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:'author'
        },
    })
    .populate("owner")
    if(!listings){
         req.flash('error',"Listing you are requested does not exist")
         res.redirect('/listings')
    }
    res.render('listings/show.ejs',{listings})
}

module.exports.createListing=async(req,res,next)=>{

    // if(!req.body.listings){
    //     throw new ExpressError(400,'send valid data for listings')
    // }
    // let result=listingSchema.validate(req.body)
    // console.log(result)
    // if(result.err){
    //     throw ExpressError(400,result.err)
    // }

    let response=await geoCodingClient.forwardGeocode({
        query:req.body.listings.location,
        limit:1
    })
    .send()
    // console.log(response.body.features[0].geometry)
    // res.send('done')
     let url=req.file.path
     let filename=req.file.filename
     let newListing= new Listing(req.body.listings)
     newListing.owner=req.user._id
     newListing.image={url,filename}
     newListing.geometry=response.body.features[0].geometry
    let saveListing=await newListing.save()
    // console.log(saveListing)
    
    req.flash('success',"New Listing Created")
    res.redirect('/listings')
  

}
module.exports.editListing=async(req,res)=>{
    let {id}=req.params
    const listings=await Listing.findById(id)
    if(!listings){
         req.flash('error',"Listing you are requested does not exist")
         res.redirect('/listings')
    }
    res.render('listings/edit.ejs',{listings})
}

module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listings){
    //     throw new ExpressError(400,'send valid data for listings')
    // }
    let {id}=req.params
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listings})
     if(typeof req.file != 'undefined'){
         let url=req.file.path
     let filename=req.file.filename
     listing.image={url,filename}
     await listing.save()

     }
    
    req.flash('success',"Listing Updated")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params
    await Listing.findByIdAndDelete(id)
    req.flash('success',"Listing deleted")
    res.redirect('/listings')
}