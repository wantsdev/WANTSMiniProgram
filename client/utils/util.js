
var version = "1.0"
var name = "FanMaiDongXi-MiniProgram"
var App_id = "ok6kktqewulxr73roo"
var randomColorArr = ['2F4C52','414D65','A3A093','8F5B56','DDE8DE','F2E6F7','D0F6F9','F4F6B6','EFADCD']
var randomNum = Math.floor(Math.random() * 8)
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getRandomColor = () =>
  '#' + randomColorArr[randomNum];

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

var getSubTarId = (arr) => {
  for (var j = 0; j < arr.length; j++) {
    var id = arr[j];

  };
}
var ua = () => {
  var uaJson = wx.getSystemInfoSync();
  var uaString = name + "/" + version + " model:" + uaJson.model
    + ";system:" + uaJson.system + ";wx_version:" + uaJson.version
    + ";language:" + uaJson.language;
  return uaString;
}
var WNTSToken = require("../vendor/wafer2-client-sdk/lib/WNTSToken.js");
var requestGet = (url, callback, failCallBack) => {
  var new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua()) : (url + "?ua=" + ua());
  
  wx.request({
    url: new_url,
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: Date.now()
    },
    method: 'GET',
    header: {
      'content-Type': 'application/json',
      'token': WNTSToken.get(),
      'app_id': App_id,
    },

    success: function (res) {

      if (res.statusCode == 200) {
        callback(res.data);
      } else {
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, new_url + "\n" + paraterm + "\n" + res);
      }
    },
    fail: function (res) {
      failCallBack(res.errMsg);
    }
  });
}
var requestPost = (paraterm, url, callback, failCallBack) => {
  var index = url.indexOf("?");
  var new_url = index >= 0 ? (url + "&ua=" + ua()) : (url + "?ua=" + ua());
  wx.request({
    url: new_url,
    data: paraterm,
    method: "POST",
    header: {
      'content-Type': "application/x-www-form-urlencoded",
      'app_id': App_id,
      'token': WNTSToken.get()
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res);
      }else{
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, new_url + "\n" + paraterm + "\n" + res);
      }

    },
    fail: function (res) {
      //errerType, severity, description, detail
      if (url == URL_EVENT_LOG) {
        return;
      }
      postErrorLog.call(2, 2, "post请求失败", new_url + "\n" + paraterm + "\n" + res);
    }
  })
}
var requestPut = (url, callback) => {
  var new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua()) : (url + "?ua=" + ua());
  wx.request({
    url: new_url,
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: Date.now()
    },
    method: 'PUT',
    header: {
      'content-Type': 'application/json',
      'app_id': App_id,
      'token': WNTSToken.get()

    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      } else {
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, new_url + "\n" + paraterm + "\n" + res);
      }
    },
    fail: function (res) {
      postErrorLog.call(2, 2, "PUT请求失败", new_url + "\n" + res);
    }
  })
}


var requestDelete = (url, callback) => {
  var new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua()) : (url + "?ua=" + ua());
  wx.request({
    url: new_url,
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: Date.now()
    },
    method: 'DELETE',
    header: {
      'content-Type': 'application/json',
      'app_id': App_id,
      'token': WNTSToken.get()
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      } else {
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, new_url + "\n" + paraterm + "\n" + res);
      }
    },

    fail: function (res) {
      postErrorLog.call(2, 2, "delete请求失败", new_url + "\n" + res);
    }
  })
}

var requestMethodWithParaterm = (method, paraterm, url, callback) => {
  var conten_type;
  if (method == "GET" || method == "DELETE" || method == "PUT") {
    conten_type = 'application/json'
  } else if (method == "POST") {
    conten_type = "application/x-www-form-urlencoded";
  }
  var new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua()) : (url + "?ua=" + ua());
  wx.request({
    url: new_url,
    data: paraterm,
    method: method ? method : 'GET',
    header: {
      'content-Type': conten_type,
      'app_id': App_id,
      'token': WNTSToken.get()
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res);
      } else {
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, new_url + "\n" + paraterm + "\n" + res);
      }
    },
    fail: function () {
      if (paraterm) {
        postErrorLog.call(2, 2, method + "-请求失败", "\n" + new_url + "\n" + paraterm + "\n" + res);
      } else {
        postErrorLog.call(2, 2, method + "-请求失败", new_url + "\n" + res);
      }
    }
  })
}
var pay = (orderId, success, fail, cancel) => {
  var paraterm = {};
  paraterm.channel = "wx_lite";
  var url = URL_ROOT + "/order/" + orderId + "/charge" + "?ua=" + ua();
  wx.request({
    url: url,
    data: paraterm,
    method: "POST",
    header: {
      'content-Type': "application/x-www-form-urlencoded",
      'app_id': App_id,
      'token': WNTSToken.get()
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if (res.data.code == 60000) {
          wx.showToast({
            title: '支付失败,请重新下单',
            icon: 'none'
          })
          return;
        }
        var charge = res.data;
        var Pingpp = require('/pingpp.js');
        Pingpp.createPayment(charge, function (result, err) {
          if (result == "success") {
            success(result);
            // 只有微信小程序 wx_lite 支付成功的结果会在这里返回
          } else if (result == "fail") {
            wx.getSystemInfo({
               success: function (res) {
                if (res.model.indexOf("iPhone")<0){//
                  var index = (err.extra.errMsg).lastIndexOf(":");
                  var msg = (err.extra.errMsg).substring(index + 1, (err.extra.errMsg).length);
                  fail(msg);
                }
              }
            });
            
            // charge 不正确或者微信小程序支付失败时会在此处返回
          }
        });

      } else {
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, new_url + "\n" + paraterm + "\n" + res);
      }
    },
    fail: function (res) {
      fail(res);
      postErrorLog.call(2, 2, "请求charge失败", url + "\n" + res);
    }
  })
}
// errerType 错误终端类型 1:客户端异常  2：服务端异常 3:其他异常 4:小程序异常
//severity    严重级别  1: 严重  2:一般  3:可忽略
//description 问题的描述 
//endpoint endpoint //0：未分配 1：iOS 2：android 3：服务器 4:mini
var postErrorLog = (errerType, severity, description, detail) => {
  var paraterm = {};
  paraterm.ua = ua();
  paraterm.happenTime = Date.parse(new Date());
  paraterm.type = errerType;
  paraterm.severity = severity;
  paraterm.descrption = description;
  paraterm.endpoint = 4;
  paraterm.detail = detail;
  requestPost(paraterm, URL_EVENT_LOG,
    function (success) {
    }, function (fail) {
    });
}

var checkLoginStatus = (isLogined, isNotLogin) => {
  var token = WNTSToken.get();
  if (token) {
    isLogined("isLogined");
  } else {
    isNotLogin("isNotLogin");
  }
}
// 数组排序
var sortArr = (arr) => {
  var arrTemp = arr;
  var temp;
  for (var i = 0; i < arrTemp.length; i++) {
    for (var j = i + 1; j < arrTemp.length; j++) {
      if (arrTemp[i] > arrTemp[j]) {
        temp = arrTemp[i];
        arrTemp[i] = arrTemp[j];
        arrTemp[j] = temp;
      }
    }
  }
  return arrTemp;
}
var getGessLikeDataTool = (data) => {
  var guessLikes = [];
  for (var i = 0; i < data.length; i++) {
    var subject_product = data[i];
    var temp = {};
    var tip_background;
    var tip_icon;
    var tips;
    var showTips;
    var currentTime = Date.parse(new Date());
    var twoDayTime = 48 * 3600 * 1000;
    var time = currentTime - subject_product.created;
    var showTips = false;
    temp.imgs = subject_product.imgs;
    temp.id = subject_product.id;
    temp.title = subject_product.title;
    temp.price = subject_product.price;
    temp.tag_price = subject_product.tag_price;
    if (subject_product.total_stock < 500 & subject_product.total_stock > 0) {
      showTips = true;
      tips = "仅剩" + subject_product.total_stock + "件";
      tip_background = "../WANTSImages/discount_icon_red.png";
      tip_icon = "../WANTSImages/discount_icon_clock.png";
    } else if (time <= twoDayTime) {
      showTips = true;
      tips = "最新潮品";
      tip_background = "../WANTSImages/discount_icon_blue.png";
      tip_icon = "../WANTSImages/discount_icon_new.png";
    }

    var rateDouble = subject_product.price / subject_product.tag_price;
    var rate = rateDouble * 100;
    var discount = rate / 10;
    if (discount <= 2) {
      showTips = true;
      tip_background = "../WANTSImages/discount_icon_yellow.png";
      tip_icon = "../WANTSImages/discount_icon_tips.png";
      if (discount < 1) {
        tips = "限0.1折";
      } else {
        if (parseInt(discount.toFixed(1).split(".")[1]) == 0) {
          tips = "限" + discount.toFixed(1).split(".")[0] + "折";
        } else {
          tips = "限" + discount.toFixed(1) + "折";
        }
      }
    }
    temp.tip_background = tip_background;
    temp.tip_icon = tip_icon;
    temp.tips = tips;
    temp.showTips = showTips;
    guessLikes.push(temp);
  }
  return guessLikes;

}
var getShoppingCartSellerList = (callBack) => {
  if (!callBack) return;
  requestMethodWithParaterm("GET", null, URL_ROOT + "/cart2", function (res) {
    callBack(res);
  });
}
var getShoppingCartSellerList = (callBack) => {
  if (!callBack) return;
  requestMethodWithParaterm("GET", null, URL_ROOT + "/cart2", function (res) {
    callBack(res);
  });
}
var getProductsTotalThenSetTabBarBadgeWithSellerList = (sellerList) => {
  if(sellerList ==null) return;
  //判断小程序的API，回调，参数，组件等是否在当前版本可用。https://developers.weixin.qq.com/miniprogram/dev/api/api-caniuse.html
  if (wx.canIUse('setTabBarBadge') == false) return;
  var shoppingcarProductsTotal = 0;
  for (var i = 0; i < sellerList.length; i++) {
    var products = sellerList[i].products;
    for (let j = 0; j < products.length; j++) {
      shoppingcarProductsTotal += products[j].num;
    }
  }
  wx.setTabBarBadge({
    index: 1,
    text: String(shoppingcarProductsTotal)
  })
}
var stringWithAndCode=(strings)=>{
  return strings.split('&').join(' ');
}
const URL_ROOT = "https://api.wantscart.com";

// 获取用户信息 | 获取订单商店名称
const URL_GET_USER = URL_ROOT + "/user/";
// 获取订单
const URL_GET_ORDER = URL_ROOT + "/order/";
// 获取订单数量
const URL_GET_ORDER_NUM = URL_ROOT + "/order/order_summary";
// 待付款
const URL_GET_ORDER_PAY = URL_ROOT + "/order/pre_pay";
// 待发货
const URL_GET_ORDER_DELIVER = URL_ROOT + "/order/wait_shipment";
// 待收货
const URL_GET_ORDER_GETTING = URL_ROOT + "/order/wait_taking_delivery";
// 全部订单
const URL_GET_ORDER_ALL = URL_ROOT + "/order";
// 完成订单
const URL_GET_ORDER_FINISH = URL_ROOT + "/order/finish";
// 查看物流
const URL_GET_LOGISTIC_DETAIL = URL_ROOT + "/express/";
// 确认收货
const URL_PUT_ORDER_OPERATE = URL_ROOT + "/order/";
//获取浏览记录
const URL_GET_HISTORY = URL_ROOT + "/aggregator/aggregated/21";
//获取收藏
const URL_GET_COLL = URL_ROOT + "/aggregator/";
//获取用户地址
const URL_GET_ADDRESS = URL_ROOT + "/user/address";
//新建地址
const URL_POST_ADDRESS = URL_ROOT + "/user/address";
//更新地址
const URL_UPDATE_ADDRESS = URL_ROOT + "/user/address/";
//event_log
const URL_EVENT_LOG =URL_ROOT + "/app/event_log"
//新版假数据
const HOMEPAGE_NEW_DATA = {
  "tab_id": "1",
  "tab_name": "推荐",
  "tab_tags": "1416,1335,1398,1336,1341,1337",
  "blocks": [
    {
      "block_id": 1,
      "block_type": 1,
      "block_items": [
        {
          "item_id": 1,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525748966684_1000_500",
          "item_target": {
            "target_id": 3041
          }
        },
        {
          "item_id": 2,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3036
          }
        },
        {
          "item_id": 3,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1523326981217_1000_500",
          "item_target": {
            "target_id": 3020
          }
        },
        {
          "item_id": 4,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525745533523_1000_500",
          "item_target": {
            "target_id": 3042
          }
        },
        {
          "item_id": 5,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1524975115323_1000_500",
          "item_target": {
            "target_id": 3024
          }
        }
      ]
    },
    {
      "block_id": 4,
      "block_title": "主题列表",
      "block_type": 4,
      "block_items": [
        {
          "item_id": 1,
          "item_type": 3,
          "item_subtitle": "春夏新品",
          "item_title": "第一时间送上最新款",
          "item_target": {
            "target_id": 3034,
            "target_title": "春夏新品"
          }
        },
        {
          "item_id": 1,
          "item_type": 3,
          "item_subtitle": "为您推荐",
          "item_title": "专业买手为您推荐",
          "item_target": {
            "target_id": 3019,
            "target_title": "为您推荐"
          }
        },
        {
          "item_id": 1,
          "item_type": 3,
          "item_subtitle": "畅销单品",
          "item_title": "最热门的单品推荐",
          "item_target": {
            "target_id": 3020,
            "target_title": "畅销单品"
          }
        }
      ]
    },
    {
      "block_id": 5,
      "block_type": 5,
      "block_title": "猜你喜欢",
      "item_subtitle": "你可能喜欢这些衣服"
    },
    {
      "block_id": 6,
      "block_type": 3,
      "block_title": "单图主题",
      "block_items": [
        {
          "item_id": 1,
          "item_type": 3,
          "item_img": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3034,
            "target_title": "title"
          }
        },
        {
          "item_id": 1,
          "item_type": 3,
          "item_img": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3019,
            "target_title": "title"
          }
        }
      ]
    },
    {
      "block_id": 7,
      "block_title": "主题",
      "block_type": 4,
      "block_items": [
        {
          "item_id": 3,
          "item_type": 3,
          "item_title": "欧美时尚复古项链",
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          // 这个设置无用："display_style": 2,  // 未设置或=1: 不显示头图,只显示标题  2: 显示主题头图，需要设置item_image 
          "item_target": {
            "target_id": 3034,
            "target_title": "欧美时尚复古项链"
          }
        },
        {
          "item_id": 3,
          "item_type": 3,
          "item_title": "GUCCI专场",
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3034,
            "target_title": "GUCCI专场"
          }
        }
      ]
    },
    {
      "block_id": 8,
      "block_title": "主题",
      "block_type": 4,
      "block_default_item_id": 3, //指定主题id，用于显示其商品列表
      "block_items": [
      {
        "item_id": 3,
        "item_type": 3,
        "item_title": "欧美时尚复古项链",
        "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
       // 这个设置无用："display_style": 2,  // 未设置或=1: 不显示头图,只显示标题  2: 显示主题头图，需要设置item_image 
        "item_target": {
          "target_id": 3019,
          "target_title": "欧美时尚复古项链"
        }
      },
      {
        "item_id": 3,
        "item_type": 3,
        "item_title": "GUCCI专场",
        "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
        "item_target": {
          "target_id": 3019,
          "target_title": "GUCCI专场"
        }
      },
      {
        "item_id": 3,
        "item_type": 3,
        "item_title": "GUCCI专场",
        "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
        "item_target": {
          "target_id": 3019,
          "target_title": "GUCCI专场"
        }
      }
      ]
    },
    {
      "block_id": 9,
      "block_title": "主题",
      "block_type": 4,
      "block_default_item_id": 3,//指定主题id，用于显示其商品列表
      "block_items": [
      {
        "item_id": 3,
        "item_type": 3,
        "item_title": "欧美时尚复古项链",
        "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
        //这个设置无用："display_style": 2,  // 未设置或=1: 不显示头图,只显示标题  2: 显示主题头图，需要设置item_image 
        "item_target": {
          "target_id": 3019,
          "target_title": "欧美时尚复古项链"
        }
      },
      {
        "item_id": 3,
        "item_type": 3,
        "item_title": "GUCCI专场",
        "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
        "item_target": {
          "target_id": 3019,
          "target_title": "GUCCI专场"
        }
      },
      {
        "item_id": 3,
        "item_type": 3,
        "item_title": "GUCCI专场",
        "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
        "item_target": {
          "target_id": 3019,
          "target_title": "GUCCI专场"
        }
      }
      ]
    },
    {
      "block_id": 10,
      "block_type": 3,
      "block_title": "主标题",
      "block_subtitle": "副标题",
      "block_items": [
        {
          "item_id": 1,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3034,
            "target_title": "每日上新"
          }
        },
        {
          "item_id": 2,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3034,
            "target_title": "特色超货"
          }
        },
        {
          "item_id": 3,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3034,
            "target_title": "销量排行"
          }
        },
        {
          "item_id": 4,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3034,
            "target_title": "限量特卖"
          }
        },
        {
          "item_id": 5,
          "item_type": 3,
          "item_image": "http://static.wantscart.com/product/1525516351925_1000_500",
          "item_target": {
            "target_id": 3019,
            "target_title": "超值低价"
          }
        }
      ]
    }
  ]
}
module.exports = {
  formatTime: formatTime,
  showBusy: showBusy,
  showSuccess: showSuccess,
  showModel: showModel,
  requestGet: requestGet,
  requestPost,
  requestPut,
  requestDelete,
  requestMethodWithParaterm,
  getRandomColor: getRandomColor,
  sortArr: sortArr,
  ua: ua,
  name: name,
  App_id: App_id,
  version: version,
  pay: pay,
  postErrorLog,
  URL_ROOT,
  URL_GET_USER,
  URL_GET_ORDER,
  URL_GET_ORDER_NUM,
  URL_GET_ORDER_PAY,
  URL_GET_ORDER_DELIVER,
  URL_GET_ORDER_GETTING,
  URL_GET_ORDER_ALL,
  URL_GET_ORDER_FINISH,
  URL_GET_LOGISTIC_DETAIL,
  URL_PUT_ORDER_OPERATE,
  URL_GET_HISTORY,
  URL_GET_COLL,
  URL_GET_ADDRESS,
  URL_POST_ADDRESS,
  URL_UPDATE_ADDRESS,
  URL_EVENT_LOG,
  HOMEPAGE_NEW_DATA,
  checkLoginStatus,
  getGessLikeDataTool,
  getShoppingCartSellerList,
  stringWithAndCode,
  getProductsTotalThenSetTabBarBadgeWithSellerList
  

};
