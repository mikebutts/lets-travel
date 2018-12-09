const Hotel = require('../models/hotel')

exports.homePage = (req, res) => {
    res.render('index', {title: 'Lets Travel'});
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