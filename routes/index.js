var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.originalname.toString().indexOf('.jpg') > 0) {
            cb(null, 'uploads/');
        } else {
            cb(new Error('JPG Only!!!!'))
        }
    },
    filename: function (req, file, cb) {
        cb(null, Math.random() + Date.now() + file.originalname);
    },
});
var upload = multer({
    storage: storage,
    limits: {fileSize: 1 * 1024 * 1024}
});

var db = 'mongodb+srv://demo:1234@cluster0.ffqlh.mongodb.net/test'
const mongoose = require('mongoose');
const {Schema} = mongoose;
mongoose.connect(db).catch(error => {
    if (error) {
        console.log("co loi xay ra" + error.message)
    }
});
;


const Student = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String
})

const SV = mongoose.model('Student', Student)

var uploadSingle = upload.single('avatar')

router.post('/single', function (req, res) {

    uploadSingle(req, res, function (error) {
        if (error) {
            console.log('Co loi xay ra' + error.message);
            res.render('index', {message: error.message})
        } else {
            res.redirect('/')
        }
    })

})

router.post('/singleapi', function (req, res) {

    uploadSingle(req, res, function (error) {
        if (error) {
            console.log('Co loi xay ra' + error.message);
            res.send({
                code : 200,
                message : error.message
            })
        } else {
            res.send({
                code : 200,
                message : 'Thanh Cong'
            })
        }
    })

})

router.post('/multi', upload.array('avatar', 2), function (req, res) {

    res.redirect('/')
})


/* GET home page. */
router.get('/', async function (req, res, next) {
    console.log("vao trang chu")

    // lay danh sach
    var sinhviens = await SV.find({});

    res.render('index', {data: sinhviens});
});

router.get('/xoa', async function (req, res, next) {
    console.log("vao trang chu")

    await SV.deleteOne({_id: req.query.id})

    // quay ve trang chu
    res.redirect('/');
});

router.get('/chitiet', async function (req, res, next) {
    console.log("vao trang chu")

    var sinhVien = await SV.find({_id: req.query.id})

    // quay ve trang chu
    res.render('chitiet', {data: (sinhVien[0])})
});

router.get('/sua', async function (req, res, next) {
    console.log("vao trang chu")

    var id = req.query.id;


    res.render('sua', {id: id});
});

router.get('/car', function (req, res, next) {
    console.log("vao trang o to")
    var data = 'Xin chao kiem tra thu'

    var mang = [3, 4, 5, 4, 3, 3, 5, 6, 7, 56, 5]

    var sinhVien = {name: 'Huy Nguyen', tuoi: 33}

    res.render('car', {title: 'Express', duLieu: data, mangSo: mang, student: sinhVien});
});


router.post('/insertUser', function (req, res) {
    console.log("insertUser")
    //     <input name="email" placeholder="Nhap email cua ban">
    var email = req.body.email;
    //     <input name="firstName" placeholder="Nhap First Name cua ban">
    var firstName = req.body.firstName;
    //     <input name="lastName" placeholder="Nhap LastName cua ban">
    var lastName = req.body.lastName;
    //     <input name="password" placeholder="Nhap password cua ban">
    var password = req.body.password;

    console.log(email + " - " + firstName + " - " + lastName + "  -  " + password)
    var data = email + " - " + firstName + " - " + lastName + "  -  " + password

    // viet cau lenh them
    // b1 : định nghĩa khung của model - Sinh Vien ( id, name, email, ...) - Schema

    // b2 : mở kết nối đến collection - bảng
    // b3 : gọi câu lệnh insert với dữ liệu của mình


    const sinhVienMoi = new SV({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
    })

    sinhVienMoi.save(function (error) {
        if (error) {
            res.render('index', {message: "Them KO thanh cong nhe !!!! " + error.message})
        } else {
            res.render('index', {message: "Them thanh cong nhe !!!!"})
        }
    })

})

router.post('/updateSinhVien', async function (req, res) {

    var id = req.body.id;
    console.log('AAAAAAAAAA' + id)
    //     <input name="email" placeholder="Nhap email cua ban">
    var email = req.body.email;
    //     <input name="firstName" placeholder="Nhap First Name cua ban">
    var firstName = req.body.firstName;
    //     <input name="lastName" placeholder="Nhap LastName cua ban">
    var lastName = req.body.lastName;
    //     <input name="password" placeholder="Nhap password cua ban">
    var password = req.body.password;


    var sinhVienMoi = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
    }
    await SV.findOneAndUpdate({_id: id}, sinhVienMoi, function (error) {
        res.redirect('/')
    })


})

module.exports = router;
