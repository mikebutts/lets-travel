const Hotel = require('../models/hotel')

// exports.homePage = (req, res) => {
//     res.render('index', {title: 'Lets Travel'});
// }

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

exports.adminPage = (req, res) => {
    res.render('admin', {title: 'Admin'})
}

exports.createHotelGet = (req, res) => {
    res.render('add_hotel', {title: 'Add New Hotel'})
}

exports.createHotelPost = async (req, res) => {
    const hotel = new Hotel(req.body);
    await hotel.save();

}

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
