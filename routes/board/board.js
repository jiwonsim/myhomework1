const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js'); 
const upload = require('../../config/multer.js'); 
const moment = require('moment');
const jwt = require('../../module/jwt.js'); 

//게시글 전체 정보 가져오기 
router.get('/', async function(req, res) {
    let selectAllBoardQuery = 'SELECT * FROM board ORDER BY board_idx DESC'; 
    let selectAllBoardResult = await db.queryParam_None(selectAllBoardQuery); //파람이 없기 땜시
    console.log('selectAllBoardResult : ' + selectAllBoardResult);

    // 쿼리 접근 오류 
    if(!selectAllBoardResult){
        res.status(500).send({
            message : "Internal Server Error"
        }); 
    }
    //게시글 전체 정보가 있을 때
    else if(selectAllBoardResult.length == 1){
        res.status(200).send({
            message : "Success",
            data : selectAllBoardResult
        });
    }
    //게시글 정보가 없을 때
    else {
        res.status(200).send({
            message : "No Data"
        })
    }
}); 


//게시글 등록
router.post('/', upload.single('board_img'), async function(req, res) {
    //let user_idx = req.body.user_idx; //로그인할때 뿌려준 token으로 가려진 id를 decoing하자
    //토큰 가져오기
    let token = req.headers.user_token; 
    let board_title = req.body.board_title; 
    let board_content = req.body.board_content;
    
    //verify로 token의 payload를 decoded에 저장
    let decoded = jwt.verify(token);
    console.log("token : "+token);
    console.log("decoded : " + decoded);

    if(!req.file) { //image 파일이 없을 때
        board_img = null; 
    }
    else {//image 파일이 있을 때 
        console.log("board_img : " + req.file.location); 
        board_img = req.file.location; //뭘 넣어야될까.... path/filename/destination/location
    }
    console.log("board_img : "+board_img);

    if(!board_title || !board_content){
        res.status(400).send({
            message : "Null Value"
        }); 
    }
    else if(decoded == -1){//verify 오류시
        res.status(500).send({
            message : "Token Error"
        });
    }

    else {
        //decoding idx
        user_idx = decoded.user_idx;
        console.log("user_idx : "+ user_idx); 
        //moment를 이용해 date 세팅
        let board_date = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log("board_date : " + board_date); 
        //게시글 넣기
        let insertBoardQuery = 'INSERT INTO board (board_title, board_content, board_img, board_date, user_idx) VALUES (?, ?, ?, ?, ?)'; 
        let insertBoardResult = await db.queryParam_Arr(insertBoardQuery, [board_title, board_content, board_img, board_date, user_idx]);

        if(!insertBoardResult){
            res.status(500).send({
                message : "Internal Server Error"
            });
        }
        else{
            res.status(201).send({
                message : "Success", 
            });
        }
    }
})

router.delete('/:board_idx', async function(req, res){
    let token = req.headers.user_token;
    let decoded = jwt.verify(token);

    let board_idx = req.params.board_idx;

    if(decoded == -1){
        res.status(500).send({
            message : "Internal Server Error1"
        });
    }
    else {
        //토큰이 존재하는 정상적인 유저일때! 
        if(!board_idx){
            //게시글이 없을 때, 
            res.status(400).send({
                message : "Null Value"
            }); 
        }
        else{
            let checkBoardQuery = 'SELECT * FROM board WHERE board_idx = ?';
            let checkBoardResult = await db.queryParam_Arr(checkBoardQuery, [board_idx]); 

            if(!checkBoardResult){
                //쿼리 수행 오류
                res.status(500).send({
                    message : "Internal Server Error2"
                }); 
            }
            else if(checkBoardResult.length === 1) { //쿼리가 존재! 
                let deleteBoardQuery = 'DELETE FROM board WHERE board_idx = ?'; 
                let deleteBoardResult = await db.queryParam_Arr(deleteBoardQuery, [board_idx]); 

                if(!deleteBoardResult){
                    res.status(500).send({
                        message : "Internal Server Error3"
                    }); 
                }
                else {
                    res.status(200).send({
                        message : "Successfully Delete a Board"
                    }); 
                }
            }
            else { //쿼리가 존재하지 않음
                res.status(400).send({
                    message : "Fail to delete board"
                }); 
            }
        }
    }
})
module.exports = router; 