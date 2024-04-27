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
async function selectData(address) {
    const sql = `
    SELECT t1.adress AS user_address, 
           t1.Invitation_Link AS shareLink, 
           t1.cs AS invite_num, 
           t1.jiangli AS invite_reward, 
           t1.jiangli + IFNULL(t2.Registration_Amount, 0) AS balance 
    FROM (
      SELECT ods_name.adress, 
             ods_name.Invitation_Link, 
             IFNULL(COUNT(ods_invite.jiangli),0) AS cs, 
             SUM(IFNULL(ods_invite.jiangli, 0)) AS jiangli
      FROM ods_name
      LEFT JOIN ods_invite ON ods_name.adress = ods_invite.adress
      GROUP BY ods_name.adress, ods_name.Invitation_Link
    ) t1
    LEFT JOIN ods_name t2 ON t1.adress = t2.adress
    WHERE t1.adress = ?
    LIMIT 0, 1000`;
    
    return await executeQuery(sql, [address]);
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





//封装sql执行函数  添加事务
const executeQuery = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(function(err) {
      if (err) {
        reject(err)
        return console.error('Error starting transaction: ', err);
      }
      connection.query(sql, values, (queryErr, results) => {
        if (queryErr) {
          connection.rollback(function() {
            console.log('Transaction is rolled back');
            reject(queryErr)
          });
          
        } else {
          connection.commit(function(commitErr) {
            if (commitErr) {
              console.error('Error committing transaction: ', commitErr);
              reject(commitErr)
            } else {
              console.log('Transaction committed successfully');
              resolve(results)
            }
          });
          
        }
      })
    });
    

  })
}


module.exports = {
  executeQuery,
  selectData,
  connection
};

//connection.end();




