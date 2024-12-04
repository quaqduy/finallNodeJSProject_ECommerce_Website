const { validationResult } = require('express-validator');

const validateSignIn = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.signInErr = { code: '3', msg: 'Please fill all required fields correctly.' };
        req.session.oldDataFormSignIn = req.body;
        return res.redirect('/login');
    }

    next();
};

module.exports = { validateSignIn };
