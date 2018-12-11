const Hotel = require('../models/hotel')

// exports.homePage = (req, res) => {
//     res.render('index', {title: 'Lets Travel'});
// }
exports.homePageFilters = async (req , res, next) => {
    try{
        const hotels = await Hotel.aggregate([
            {$match: {avaliable: true}},
            {$sample: {size: 9}}
        ]);
        const countries = await Hotel.aggregate([
            {$group: { _id: '$country'}},
            {$sample: {size: 9}}
        ]);
        res.render('index', { title: 'Lets Travel', countries, hotels})
    }catch(error){
        next(error)
    }

}

exports.listAllHotels = async (req, res, next) => {
    try {
        const allHotels = await Hotel.find();
         res.render('all_hotels', {title: 'All Hotels', allHotels});
        // res.json(allHotels)
    }catch (errors){
        next(errors);
    }
 
}

exports.listAllCountries = async (req, res, next) => {
    try {
        const allCountries = await Hotel.distinct('country');
        res.render('all_countries', {title: 'Browse by Country', allCountries});
    }catch (error){
        next(error)
    }
}

exports.hotelDetail = async (req, res, next) => {
    try {
        const hotelParam = req.params.hotelId;
        const hotelData = await Hotel.find({_id: hotelParam});
        res.render('hotel_detailed', {title: `Lets Travel | ${hotelData[0].hotel_name}` , hotelData})

    }catch (error){
        next(error)
    }
}

exports.getHotelCountry = async (req, res, next) => {
    try {
        const country = req.params.country;
        const hotelData = await Hotel.find({ country: country});
        res.render('hotels_by_country', {title: `Lets Travel | ${country}`, hotelData, country})
    }catch(error){
        next(error)
    }
}

// Admin page
exports.adminPage = (req, res) => {
    res.render('admin', {title: 'Admin'})
}




//  HOTEL CRUD

exports.createHotelGet = (req, res) => {
    res.render('add_hotel', {title: 'Add New Hotel'})
}

exports.createHotelPost = async (req, res) => {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.redirect(`/all/${hotel._id}`);
}
exports.editRemoveGet = (req, res) => {
   res.render('edit_remove', {title: 'Search Hotel to Edit'})
}
exports.editRemovePost = async (req, res, next) => {
    try {
        const hotelId = req.body.hotel_id || null;
        const hotelName = req.body.hotel_name || null;

        const hotelData = await Hotel.find({ $or: [
            {_id: hotelId },
            {hotel_name: hotelName}
        ]}).collation({
            locale: 'en',
            strength: 2
        });

        if(hotelData.length > 0) {
            res.render('hotel_detail', {title: 'Add / Remove Hotel', hotelData })
            req.toastr.info('Are you the 6 fingered man?')
            return
        }else {
            res.redirect('/admin/edit-remove')
            req.toastr.error(' No hotels found')
        }
    }catch (errors) {
        next(errors)
    }
}

exports.updateHotelGet = async (req, res, next) => {
    try{
        const hotel = await Hotel.findOne({ _id: req.params.hotelId});
        res.render('add_hotel', {title: 'Update hotel', hotel})
        
    }catch(error){
        next(error)
    }
}

exports.updateHotelPost = async (req, res, next) => {
    try{
        const hotelId = req.params.hotelId;
        console.log(hotelId)
        const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {new: true});
        res.redirect(`/all/${hotelId}`)

    }catch(error){
        next(error)
    }
}

exports.deleteHotelGet = async (req, res, next) =>{
    try{
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findOne({_id: hotelId})
        res.render('add_hotel', {title: 'Delete hotel', hotel});

    }catch(error){
        next(error)
    }
}

exports.deleteHotelPost = async (req, res, next) => {
    try{
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findByIdAndRemove({ _id: hotelId})
        res.render('admin')

    }catch(error){
        next(error)
    }
}

