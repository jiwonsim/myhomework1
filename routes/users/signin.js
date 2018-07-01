const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');		// crypto 모듈의 promise 버전
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js')

router.post('/', async function(req, res){
    let user_id = req.body.user_id; 
    let user_pw = req.body.user_pw; 

    if(!user_id || !user_pw){ // id, pw 입력 오류
        res.status(400).send({
            message : "Null Value"
        }); 
    }
    else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?'; 
        let resultCheck = await db.queryParam_Arr(checkQuery, [user_id]); 

        // 쿼리 오류
        if(!resultCheck) {
            res.status(500).send({
                message : "Internal Server Error"
            }); 
        }
        // 유저가 존재한 경우
        else if (resultCheck.length == 1){ 
            // 입력 pw와 저장 pw가 일치하는지 검증 - hash, salt
            let hashpw = await crypto.pbkdf2(user_pw, resultCheck[0].user_salt, 100000, 32, 'sha512'); 
            //같은 경우
            if(hashpw.toString('base64') == resultCheck[0].user_pw) { 
                // 로그인 정보가 회원 정보와 일치하면 토큰을 발급한다. 
                let token = jwt.sign(resultCheck[0].user_idx);//여기서 jwt는 module/jwt.js

                // 발급된 토큰을 성공 메시지와 함께 클라로 보내기
                res.status(201).send({
                    message : "Success", 
                    token : token
                }); 
            }
            // 잘못된 비밀번호로 로그인 실패
            else { 
                res.status(400).send({
                    message : "Login Failed"
                });
                console.log("pwd is incorrect"); 
            }
        }
        //유저가 존재하지 않는 경우
        else {
            res.status(400).send({
                message : "Login Failed"
            });
            console.log("id is incorrect");
        }
    }
}); 

module.exports = router;