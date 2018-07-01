const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js'); 
const upload = require('../../config/multer.js'); 
const moment = require('moment');
const jwt = require('../../module/jwt.js'); 


//코멘트 보기
router.get('/:board_idx', async function(req, res){
    let board_idx = req.params.board_idx; 
    
    if(!board_idx){
        res.status(400).send({
            message : "Null Value"
        }); 
    }
    else {
        let selectCommentQuery = 'SELECT * FROM comment WHERE board_idx = ?'; 
        let selectCommentResult = await db.queryParam_Arr(selectCommentQuery, [board_idx]);

        if(!selectCommentQuery){
            res.status(500).send({
                //쿼리 에러
                message : "Internal Server Error"
            }); 
        }
        else {
            res.status(200).send({
                message : "Success", 
                data : selectCommentResult
            }); 
        }
    }
})

//코멘트 작성
router.post('/', async function(req, res){
    let token = req.headers.user_token; 
    let board_idx = req.body.board_idx; 
    let comment_title = req.body.comment_title; 
    let comment_content = req.body.comment_content; 
    let comment_date = moment().format('YYYY-MM-DD HH:mm:ss'); 

    if(!comment_title || comment_content){
        res.status(400).send({
            message : "Null Value"
        }); 
        return; 
    }

    if(!token || token === undefined){
        res.status(500).send({
            message : "Token Error"
        });
        return; 
    }

    let decoded = jwt.verify(token); 
    if(decoded == -1) {
        res.status(500).send({
            message : "Decoing Error"
        }); 
    }
    else {
        let user_idx = decoded.user_idx; 

        let insertCommentQuery = 'INSERT INTO comment (comment_title, comment_content, comment_date, user_idx, board_idx) VALUES (?, ?, ?, ?, ?)'; 
        let insertCommentResult = await db.queryParam_Arr(insertCommentQuery, [comment_title, comment_content, comment_date, user_idx, board_idx]); 

        if(!insertCommentResult){
            res.status(500).send({
                //쿼리 에러
                message : "Internal Server Error"
            }); 
        }
        else{
            res.status(201).send({
                message : "Success"
            }); 
        }
    }
});


//코멘트 삭제 
router.delete('/:comment_idx', async function(req, res){
    let token = req.headers.user_token; 
    let decoded = jwt.verify(token);
    let comment_idx = req.params.comment_idx;  

    if(decoded == -1){
        res.status(500).send({
            message : "Token Error"
        }); 
    }
    else {
        if(!comment_idx){
            res.status(400).send({
                //존재하지 않는 댓글
                message : "Null Value"
            }); 
            return; 
        }

        let user_idx = decoded.user_idx; 

        
        let checkCommentQuery = 'SELECT * FROM comment WHERE comment_idx = ?';
        let checkCommentResult = await db.queryParam_Arr(checkCommentQuery, [comment_idx]); 

        if(!checkCommentResult){
            res.status(500).send({
                message : "Internal Server Error"
            }); 
        }
        else if(checkCommentResult.length === 1){ //결과가 존재하는 경우
            let deleteCommentQuery = 'DELETE FROM comment WHERE comment_idx = ?';
            let deleteCommentResult = await db.queryParam_Arr(deleteCommentQuery, [comment_idx]); 

            if(!deleteCommentResult){
                res.status(500).send({
                    message : "Internal Server Error"
                }); 
            }
            else {
                res.status(201).send({
                    message : "Success"
                }); 
            }
        }
        else {
            res.status(400).send({
                message : "Wrong Comment_idx"
            }); 
        }

    }
})
module.exports = router; 