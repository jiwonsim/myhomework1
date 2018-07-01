const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');

router.get('/', async function(req, res){    
    let selectAllBoardQuery = 'SELECT * FROM board ORDER BY board_idx DESC'; 
    let selectAllBoardResult = await db.queryParam_None(selectAllBoardQuery); 

    if(!selectAllBoardResult){
        res.status(500).send({
            message : "Internal Server Error"
        }); 
    }
    else if(selectAllBoardResult.length === 1){
        res.status(200).send({
            message : "Success",
            data : selectAllBoardResult
        }); 
    }
    else {
        res.status(400).send({
            message : "No Data"
        }); 
    }
}); 

module.exports = router; 