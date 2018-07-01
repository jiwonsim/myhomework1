const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey.js').secret; 

module.exports = {
    sign : function(user_idx){ //user_id x
        const options = { //header 부분 
            algorithm : "HS256", 
            expiresIn : 60 * 60 * 24 * 30 // 30 days 
        }; 
        const payload = { // 정보 부분 (보안을 위해 모든 유저 정보를 담지는 않는다.)
            user_idx : user_idx
        }; 
        let token = jwt.sign(payload, secretKey, options);
        return token; 
    }, 

    verify : function(token) { 
        let decoded; 
        try {
            decoded = jwt.verify(token, secretKey); 
        }
        catch(err) {
            //TokenExpiredError name:'TokenExpiredError', message: 'jwt expired'
            if(err.message === 'jwt expired') console.log('expired token'); 
            else if(err.message === 'invalid token') console.log('invalid token');
        }
        if(!decoded) { //decoded 부분이 undefined일때, 
            return -1;
        }else {
            return decoded; 
        }
    }
}