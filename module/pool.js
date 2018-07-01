const pool = require('../config/dbPool.js');

module.exports = {
  //간단한 connection 문을 만들기 위한 작업들
  //파라미터가 없는 SQL 문
  queryParam_None : async function(...args){ //argument가 몇개가 들어올지 몰라 ...args로 지정해 배열로서 접근하도록
    const query = args[0];
    let result;

    try {
      var connection = await pool.getConnection();
      result = await connection.query(query) || null; //connection 또는 query 값 대입할 때 정상적으로 작동시 왼쪽, 에러시 null값이 들어감
    }catch(err){
      next(err); //에러 생기면 다음으로 걍 넘어감. 아무 작업도 하지 않고 pass
    }finally{
      connection.release();
      //잘 수행이 됐든 에러가 나서 next하든
      return result; //값을 반환한다.
    }
  },

  //파라미터가 있는 SQL 문
  queryParam_Arr : async function(...args){
    const query = args[0];
    const value = args[1]; //배열이 넘어오는 것!
    let result;

    try {
      var connection = await pool.getConnection();
      result = await connection.query(query, value) || null; //connection 또는 query 값 대입할 때 정상적으로 작동시 왼쪽, 에러시 null값이 들어감
    }catch(err){
      next(err); //에러 생기면 다음으로 걍 넘어감. 아무 작업도 하지 않고 pass
    }finally{
      //잘 수행이 됐든 에러가 나서 next하든
      return result; //값을 반환한다.
    }
  }
};
