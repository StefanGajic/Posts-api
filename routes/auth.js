const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
   const { error } = registerValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const emailExist = await User.findOne({ email: req.body.email });
   if (emailExist) return res.status(400).send('Email already exists');

   const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.json(savedUser)
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is invalid');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is invalid');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET , {expiresIn: '10h'});
    res.header('auth-token', token).send(token); 
})

module.exports = router;
