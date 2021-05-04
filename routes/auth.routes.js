const { Router } = require('express');
const bcrypt = require('bcryptjs');

const router = new Router();

const saltRounds = 10;

router.get('/sign-up', (req, res) => {
    res.render('auth/singup')
});

router.post('/sign-up', (req, res, next) => {
    res.send(req.body)
    const { username, password } = req.body;

    bcrypt
     .genSalt(saltRounds)
     .then(salt => bcrypt.hash(password, salt))
     .then((passwordHash) => {
         console.log(passwordHash)
     })
     .catch(error => next(error))
})



module.exports = router;