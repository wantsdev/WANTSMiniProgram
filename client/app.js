//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');
var util = require('/utils/util.js');
var login = require('./vendor/wafer2-client-sdk/lib/login.js');
var WNTSApi = require('/utils/WNTSApi.js');
var WNTSToken = require('./vendor/wafer2-client-sdk/lib/WNTSToken.js');
// var WNTSSource = require('./vendor/wafer2-client-sdk/lib/WNTSSource');
var WNTSGenderTurn = require('./vendor/wafer2-client-sdk/lib/genderTurn');
var code;
App({
  onLaunch: function (options) {
    WNTSGenderTurn.set('off');
    // WNTSSource.clear();//清空本地source
    if (wx.canIUse('setTabBarBadge') == true) {
      //判断小程序的API，回调，参数，组件等是否在当前版本可用。https://developers.weixin.qq.com/miniprogram/dev/api/api-caniuse.html
      util.getShoppingCartSellerList(function (res) {
        util.getProductsTotalThenSetTabBarBadgeWithSellerList(res.data.seller_list);
      });
    };
    if (options && options.scene == 1044) {
      console.log(options.shareTicket);//小程序在群里被打开后，获取情景值和shareTicket
    }
    qcloud.setLoginUrl(config.service.loginUrl);
    // login.login();    
  },
  onError: function (options) {
    util.postErrorLog(4, 1, "小程序异常", options);
  },
  globalData: {
    current_product_info_arr: [],
    code: code,
    appid: "wx74a29a2f9afbb4b0",
    appSecret: '5b5a14f7b6654e0b6833cee195434b39',
    modalTurn: false,
    formIdArr: []
  }
})