/**
 * Created by peresthahadji on 10.06.17.
 */
module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);
    router.post('/signup', userController.signup);
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister);

    router.route('/:user_id')
        .get(userController.getUser)
        .put(userController.putUser);

    return router;

}