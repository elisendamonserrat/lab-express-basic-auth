const { Router } = require('express');
const router = new Router();

router.get('/sign-up', (req, res) => {
    res.render('auth/singup')
})



module.exports = router;