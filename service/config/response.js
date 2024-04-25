// Response.js

class Response {
    constructor(data, message, code) {
      this.data = data;
      this.message = message;
      this.code = code; // 保留code属性
    }
  }
  
  // 导出成功和失败的辅助函数
  function successResponse(data, code = '1') {
    return new Response(data, 'Operation successful', code);
  }
  
  function ErrorResponse(message,data=null, code = '0') {
    return new Response(data, message, code);
  }
  
  // 导出Response类和辅助函数
  module.exports = { Response, successResponse, ErrorResponse };