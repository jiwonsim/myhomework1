const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js'); 
const jwt = require('../../module/jwt.js'); 
const upload = require('../../config/multer.js'); 
const moment = require('moment');


router.post('/', upload.single('board_img'), async function(req,res){

    let token = req.header.location;
    let board_title = req.body.board_title;
    let board_content = req.body.board_content; 

    console.log("token : " + token);
    let decoded = jwt.verify(token); 
    console.log("decoded :" + decoded);

    if(!req.file){
        board_img = null; 
    }
    else {
        board_img = req.file.location; 
    }

    if(!board_title || !board_content){
        res.status(400).send({
            message : "Null Value"
        }); 
    }
    else if(decoded === -1){
        res.status(500).send({
            message : "Token Decoding Error"
        }); 
    }
    else {
        let user_idx = decoded.user_idx; 
        let board_date = moment().format('YYYY-MM-DD HH:mm:ss');

        let insertBoardQuery = 'INSERT INTO board (board_title, board_content, board_img, board_date, user_idx VALUES (?,?,?,?,?)';
        let insertBoardResult = await db.queryParam_Arr(insertBoardQuery, [board_title, board_content, board_img, board_date, user_idx]); 

        if(!insertBoardResult){
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
}); 

router.delete('/', async function(req, res){
    let token = req.header.location;
})
module.exports = router; 