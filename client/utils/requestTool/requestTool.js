var request = (method, url, paraterm, callback, failCallBack) => {
  var conten_type = 'application/json';
  if (method == "GET" || method == "DELETE" || method == "PUT") {} else if (method == "POST") {
    conten_type = "application/x-www-form-urlencoded";
  }
  //console.log(url);
  // url = encodeURI(url);
  wx.request({
    url: url,
    data: paraterm,
    header: {
      'content-type': conten_type
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      console.log(paraterm);
//console.log(res);
      if (res.statusCode == 200) {
        callback(res);
      }
    },
    fail: function(res) {
      failCallBack(res);
    },
    complete: function(res) {
    },
  })
}
module.exports = {
  request: request
}