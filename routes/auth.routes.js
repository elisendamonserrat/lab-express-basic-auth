const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model')

const router = new Router();

const saltRounds = 10;

router.get('/sign-up', (req, res) => {
    res.render('auth/singup')
});

router.post('/sign-up', (req, res, next) => {
    const { username, password } = req.body;

    bcrypt
     .genSalt(saltRounds)
     .then(salt => bcrypt.hash(password, salt))
     .then((hashedPassword) => {
         console.log(hashedPassword)
        return User.create({
             username,
             passwordHash: hashedPassword
         })
     })
     .then(() => res.redirect('/'))
     .catch(error => next(error))
})



module.exports = router;