var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const {Schema} = mongoose;
var multer = require('multer');
var hash = "";

//Ket noi mongoose
const uri = "mongodb+srv://admin:hkZNWjDXrDwIaa2l@cluster0.onoec.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri).catch(err => console.log('Co loi xay ra'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    hash = Date.now() + '-' + Math.random() + '-';
    cb(null, hash + file.originalname);
  }
})

var upload = multer({
  storage: storage,
  dest: 'public/images/',
  limits: {fileSize: 2 * 1024 * 1024},
}).single('file');

const PRODUCTS = mongoose.model('thi', new Schema({
  tieuDe:String,
  noiDung:String,
  baiViet:String,
  fileName: String
}));
/* GET home page. */
router.get('/', function (req, res, next) {
  PRODUCTS.find({}, function (error, result) {
    if (error) throw error;
    res.render('index', {data: result});
  })
});

//Chuyen sang trang add
router.get('/add', function (req, res, next) {
  PRODUCTS.find({}, function (error, result) {
    if (error) throw error;
    res.render('add', {title: 'Express', data: result});
  })
});

//add product
router.post('/create', async function (req, res) {
//load image
  upload(req, res, async function (err) {
    if (err != null) {
      res.send(err.message);
    } else {
//khong loi thi day dl len mongoose
      var tieuDe = req.body.tieuDe;
      var noiDung = req.body.noiDung;
      var baiViet = req.body.baiViet;
      var fileName = hash + req.file.originalname;
      var pr = new PRODUCTS({
        tieuDe: tieuDe,
        noiDung: noiDung,
        baiViet: baiViet,
        fileName: fileName
      })
      await pr.save();
      res.redirect('/list');
    }
  })
})

//Chuyen sang trang list
router.get('/list', function (req, res, next) {
  PRODUCTS.find({}, function (error, result) {
    if (error) throw error;
    res.render('listsproduct', {data: result});
  })
});
router.post('/delete', function(req, res, next) {
  PRODUCTS.deleteOne({ _id: req.body.id }, function(err) {
    PRODUCTS.find({}, function(err, result) {
      res.redirect('/list');
    });
  })
});

//dang JSON
router.get('/getJSON', function (req, res) {

  const ListImageAPI = mongoose.model('thi');

  ListImageAPI.find({}, function (error, result) {
    res.send(result);
  })
})
module.exports = router;
