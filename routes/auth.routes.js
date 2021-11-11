const{Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()
const User = require('../models/User')

router.post('/register',
[
    check('email', 'this email is wrong').isEmail(),
    check('password', 'a minimal number for a password is 6, please try again').isLength({min: 6})
],
 async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Registration data is wrong: Enter the correct email or enter a password that must be at least 6 characters'
            })
        }
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            return res.status(400).json({message: 'This user is exists, please try again'})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})
        await user.save()
        res.status(201).json({message: 'The User has been created' })
    } catch(err) {
        res.status(500).json({message: "Something wrong try again"})
    }

})

router.post('/login',
[
    check('email', 'email is incorrect, please try again').normalizeEmail().isEmail(),
    check('password', 'type the password').exists().isLength({min: 6})
],
 async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Login data is wrong, please try again'
            })
        }
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'user not find, try again'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: 'wrong password or email, try again'})
        }
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        res.json({token, userId: user.id})
        
    } catch(err) {
        res.status(500).json({message: "Something wrong try again"})
    }
})

module.exports = router