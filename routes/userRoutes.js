const UsersController = require('../controllers/usersController');
const passport = require('passport');


module.exports = (app,upload) => {

    //get = traer datos
    app.get('/api/users/getAll',UsersController.getAll);
    app.get('/api/users/findDeliveryMen',UsersController.findDeliveryMen);

    //post = enviar datos 
    app.post('/api/users/create',UsersController.register);
    app.post('/api/users/login',UsersController.login);

    //ACTUALIZAR DATOS
    //401 UNAUTHORIZED
    app.put('/api/users/update', passport.authenticate('jwt',{session: false}),upload.array('image', 1), UsersController.update);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt',{session: false}), UsersController.updateWithoutImage);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt',{session: false}), UsersController.updateNotificationToken);
}