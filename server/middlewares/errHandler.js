function errorHandler(err, req, res, next){
    let statusCode, errorMessage, errorCode;
    errorCode = err.name;
    
    switch(err.name){
        case 'TokenNotFound':
            statusCode = 404;
            errorMessage = 'Token not found';
            break;
        case 'UserNotFound':
            statusCode = 404;
            errorMessage = 'User not found';
            break;
        case 'DataNotFound':
            statusCode = 404;
            errorMessage = 'Data not found';
            break;
        case 'Unauthorized':
            statusCode = 403;
            errorMessage = 'Not Authorized to do this';
            break;
        case 'SequelizeValidationError':
            const validationErrors = [];
            err.errors.forEach(el => {
                validationErrors.push(el.message);
            });
            console.log(err.errors);
            statusCode = 400;
            errorMessage = validationErrors;
            break;
        case 'UserAlreadyExists':
            statusCode = 409;
            errorMessage = 'Email is already taken';
            break;
        case 'EmailNotFound':
            statusCode = 404;
            errorMessage = 'The Email is incorrect';
            break;
        case 'WrongPassword':
            statusCode = 400;
            errorMessage = 'The Password you\'ve entered is wrong';
            break;
        default:
            statusCode = 500;
            errorMessage = 'Internal Server Error';
            console.log(err);
    }
    res.status(statusCode).json({ errorCode, message: errorMessage });
}
module.exports = errorHandler;