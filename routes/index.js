var express = require('express');
var router = express.Router();

const hotelController = require('../controllers/hotelController')

/* GET home page. */
router.get('/', hotelController.homePageFilters);

router.get('/all', hotelController.listAllHotels);
router.get('/countries',hotelController.listAllCountries);
router.get('/all/:name', function(req, res){
  const name = req.params.name
  res.render('all_hotels', {title: name});
})


//Admin routes:
router.get('/admin', hotelController.adminPage);
router.get('/admin/add', hotelController.createHotelGet);
router.post('/admin/add', hotelController.createHotelPost);
module.exports = router;