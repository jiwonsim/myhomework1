const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js'); 
const upload = require('../../config/multer.js'); 
const moment = require('moment');
const jwt = require('../../module/jwt.js'); 


//북마크 등록
router.post('/', async function(req, res){
    //let user_idx = req.body.user_idx;
    let board_idx = req.body.board_idx; 
    let token =req.headers.user_token; 

    let decoded = jwt.verify(token);

    if(!board_idx) { //게시글이 없을 때
        res.status(400).send({
            message : 'Null Value'
        }); 
    }
    else {
        if(decoded === -1){
            res.status(500).send({
                message : 'Token Error'
            });
        }    
        else {
            let user_idx = decoded.user_idx; 
            let insertBookmarkQuery = 'INSERT INTO bookmark (board_idx, user_idx) VALUES (?, ?)'; 
            let insertBookmarkResult = await db.queryParam_Arr(insertBookmarkQuery, [board_idx, user_idx]); 

            if(!insertBookmarkResult){
                res.status(500).send({
                    message : 'Internal Server Error'
                });
            }

            else {
                res.status(201).send({
                    message : 'Success'
                })
            }
        }
    }
    
})

//북마크 삭제
router.delete('/', async function(req, res){
    //let user_idx = req.body.user_idx;
    let board_idx = req.body.board_idx; 
    let token =req.headers.user_token; 

    let decoded = jwt.verify(token);

    if(!board_idx) { //게시글이 없을 때
        res.status(400).send({
            message : 'Null Value'
        }); 
    }
    else {
        if(decoded === -1){
            res.status(500).send({
                message : 'Token Error'
            });
        }    
        else {
            let user_idx = decoded.user_idx; 
            let checkBookmarkQuery = 'SELECT * FROM bookmark WHERE user_idx = ? AND board_idx = ?'; 
            let checkBookmarkResult = await db.queryParam_Arr(checkBookmarkQuery, [user_idx, board_idx]); 

            if(!checkBookmarkResult){ // DB 쿼리 오류
                res.status(500).send({
                    message : 'Internal Server Error'
                }); 
            }
            else if(checkBookmarkResult.length === 0){ //삭제할 쿼리가 없을 때 
                res.status(400).send({
                    message : 'Null Value'
                }); 
            }
            else {
                let deleteBookmarkQuery = 'DELETE FROM bookmark WHERE user_idx = ? AND board_idx = ?'; 
                let deleteBookmarkResult = await db.queryParam_Arr(deleteBookmarkQuery, [user_idx, board_idx]); 

                if(!deleteBookmarkResult){
                    res.status(500).send({
                        message : 'Internal Server Error'
                    }); 
                }
                else{
                    res.status(200).send({
                        message : 'Success'
                    }); 
                }
            }
        }
    }
}); 


module.exports = router; 