//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('/utils/util.js')
App({
  onLaunch: function (options) {
    if (wx.canIUse('setTabBarBadge') == true) {
      //判断小程序的API，回调，参数，组件等是否在当前版本可用。https://developers.weixin.qq.com/miniprogram/dev/api/api-caniuse.html
      util.getShoppingCartSellerList(function (res) {
        util.getProductsTotalThenSetTabBarBadgeWithSellerList(res.data.seller_list);
      });
    };
    if (options && options.scene == 1044) {
      console.log(options.shareTicket);//小程序在群里被打开后，获取情景值和shareTicket
    }
    qcloud.setLoginUrl(config.service.loginUrl)
  },
  onError: function (options) {
    util.postErrorLog(4, 1, "小程序异常", options);
  }
})