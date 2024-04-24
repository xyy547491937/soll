const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'sell'
});

// 连接到MySQL服务器
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});


// 查询数据
async function selectData(adress) {
  const sql = ` select t1.adress 'user_address',t1.cs 'invite_num',t1.jiangli 'invite_reward',t1.jiangli+ifnull(t2.Registration_Amount,0) 'balance' from 
  (SELECT ods_name.adress,ifnull(COUNT(ods_invite.jiangli),0) cs,SUM(ifnull(ods_invite.jiangli,0)) jiangli
  FROM ods_name LEFT JOIN ods_invite ON ods_name.adress=ods_invite.adress
   GROUP BY ods_name.adress ) t1
  left join ods_name t2 on t1.adress=t2.adress WHERE t1.adress = ?`
  return await executeQuery(sql, [adress]);
}



// 更新数据
function updateData(callback) {
  const sql = 'UPDATE your_table SET column = value WHERE condition_column = condition_value';
  connection.query(sql, callback);
}

// 删除数据
function deleteData(callback) {
  const sql = 'DELETE FROM your_table WHERE condition_column = condition_value';
  connection.query(sql, callback);
}





//封装sql执行函数
const executeQuery = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (queryErr, results) => {
      if (queryErr) {
        reject(queryErr)
      } else {
        resolve(results)
      }
    })
  })
}


module.exports = {
  executeQuery,
  selectData,
  connection
};

//connection.end();




