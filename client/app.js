//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('/utils/util.js')
App({
  onLaunch: function (options) {
    if (options && options.scene == 1044) {
      console.log(options.shareTicket);//小程序在群里被打开后，获取情景值和shareTicket
    }
    qcloud.setLoginUrl(config.service.loginUrl)
  },
  onError: function (options) {
    util.postErrorLog(4, 1, "小程序异常" , options);
  }
})