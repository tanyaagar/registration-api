const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Student = require('../models/Student');
const { check, validationResult } = require('express-validator');

router.post('/',(req , res , next)=>{
    const user={
        username : 'tanya',
        email : 'tanya1999agar@gmail.com'
    }
  jwt.sign({user : user} , 'secretkey' , (err , token)=>{
      console.log('user verified');
  })
  next();
})

router.post('/', [
    check('email').isEmail().withMessage('ENTER A VALID EMAIL !')
        .custom(value => {
        return Student.findOne({email : value})
        .then(user => {
          if (user) {
            return Promise.reject('STUDENT ALREADY EXISTS');
          }
        });
      }).normalizeEmail(),
      check('studentNumber').isLength({min: 7 , max: 7}).withMessage('WRONG STUDENT NUMBER')
        .custom(value =>{
            return Student.findOne({studentNumber : value})
            .then( user =>{
                if(user){
                    return Promise.reject('STUDENT ALREADY EXISTS');
                }
            })
        }),
    check('mobileNumber').isLength({min:10 , max:10}).withMessage('INCORRECT CONTACT NUMBER'),
    check('universityNumber').isLength({min : 10 , max : 13}).withMessage('INVALID UNIVERSITY NUMBER')
    .custom(value =>{
        return Student.findOne({universityNumber : value})
        .then( user =>{
            if(user){
                return Promise.reject('STUDENT ALREADY EXISTS');
            }
        })
    }),
    check('branch').isLength({ min: 1 }).withMessage('Issue in branch'),
    check('name').isLength({ min: 1 }).withMessage('Issue in name')
  ], verifytoken,(req, res) => {
      
    jwt.verify(req.token, 'secretkey' , (err , authdata)=>{
        if(err){
            return res.sendStatus(403);
        }
        else{
            const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
  
    const name  = req.body.name
    const email = req.body.email
    const studentNumber = req.body.studentNumber;
    const universityNumber = req.body.universityNumber;
    const branch = req.body.branch;
    const mobileNumber = req.body.mobileNumber;
    const student = new Student(
        {
            name: name,
            email: email,
            studentNumber: studentNumber,
            universityNumber: universityNumber,
            branch: branch,
            mobileNumber: mobileNumber,
        });
    student.save()
        .then(result => {
            console.log('student registered');
            res.json(
                {
                    'status': 'dataPosted',
                    'error':'false'
                });
        })
        .catch(err => {
            console.log(err);
        });
        }
    });
    
  });

  function verifytoken(req , res ,next){
      const bearerHeader = req.headers['authorization'];

      if(typeof(bearerHeader) !== 'undefined'){
          const bearer = bearerHeader.split(' ');
          req.token = bearer[1];
          next();
      }
      else{
          return res.sendStatus(403);
      }
  }


  router.get('/', (req , res , next) =>{
    Student.find()
    .then(students => {
        res.status(200).json(students);
    })
    .catch(err => {
        res.status(200).json(
            {
                "error": "true"
            })
    });
  });

  module.exports = router;
