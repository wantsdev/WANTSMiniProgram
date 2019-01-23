var requestTool = require('/requestTool/requestTool.js');
var WNTSToken = require("../vendor/wafer2-client-sdk/lib/WNTSToken.js");
var WNTSSource = require("../vendor/wafer2-client-sdk/lib/WNTSSource.js");
var WNTSGenderTurn = require("../vendor/wafer2-client-sdk/lib/genderTurn.js");
var WNTSAPI = require("WNTSApi.js");
var version = "1.0.2"
var name = "WXLite"
var App_id = "ok6kktqewulxr73roo"
var randomColorArr = ['2F4C52','414D65','A3A093','8F5B56','DDE8DE','F2E6F7','D0F6F9','F4F6B6','EFADCD']
var randomNum = Math.floor(Math.random() * 8)
var WNTS_SceneType_HomePage = 0;//首页的猜你喜欢商品列表 （不需要传productId)
var WNTS_SceneType_ProductDetailPage = 1;//商品详情页的相似商品列表 (需要传productId)
var WNTS_SceneType_ShopCarPage = 2;//购物车的猜你喜欢商品列表 (不需要传productId)
//    WNTS_SceneType_FinishOrderPage;//订单完成时，购买过该商品的人可能还买过的商品列表 (需要传productId，如涉及到多个商品，暂时传递第一个)
var WNTS_SceneType_OrderFinishPayPage = 3;//订单支付完成时的推荐 orderId: 对应订单的Id
var WNTS_SceneType_OrderPage = 4;//不同订单状态列表下 (在订单为空的情况会显示)
var WNTS_SceneType_OrderExpressPage = 5;//物流详情下 orderId: 对应订单的Id
var WNTS_SceneType_UserProfilePage = 6;//我的下方的猜你喜欢
var WNTS_SceneType_HistoaryPage = 7;//浏览记录为空， 的推荐
var WNTS_SceneType_FavouritePage = 8;//收藏为空情况的猜你喜欢
var WNTS_SceneType_OrderDetailPage = 9;//订单详情猜你喜欢 orderId: 对应订单的Id

const formatTime = date => {
  const time = new Date(date);
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  return year + '年' + month + '月' + day + '日'
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimes = date => {
  const time = new Date(date);
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  // return year + '年' + month + '月' + day + '日'
  return [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getRandomColor = () =>
  '#' + randomColorArr[randomNum];
//等分分割数组
const chunk = (arr, size) => {
  var arr2 = [];
  for (var i = 0; i < arr.length; i = i + size) {
    arr2.push(arr.slice(i, i + size));
  }
  return arr2;
}

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
var network = () => {
  var network_type = "";
  wx.getNetworkType({
    success: function (res) {
      network_type = res.networkType;
    },
    fail: function (res) { },
    complete: function (res) { },
  });

  return network_type;
}
var ua = () => {
  var uaJson = wx.getSystemInfoSync();
  // var uaString = name + "/" + version + " model:" + uaJson.model +
  //   ";system:" + uaJson.system + ";wx_version:" + uaJson.version +
  //   ";language:" + uaJson.language;
  var isIos = 1;
  var device_brand = "apple";
  if (uaJson.model.indexOf("iPhone") < 0) {
    isIos = 0;
    device_brand = "Android";
  } else {
    isIos = 1;
    device_brand = "apple";
  }
  var network_type = network();

  var source = WNTSSource.get();
  var genderSwitch = WNTSGenderTurn.get();
  var gender = 0;
  if (source) {
    gender = 2;
  } else {
    gender = 0;
  };
  if (genderSwitch=='on'){
    gender = 2;
  }else{
    gender = 0;
  };
  var uadata = {
    app_id: App_id,//WANTS专有APPID
    app_name: name,//APP名称
    version: version,//APP版本号
    wechat_version: uaJson.version,//微信版本号
    bundleId: "com.wantsmini.com",//包ID

    device_brand: device_brand,//品牌
    device_mode: uaJson.model,//手机名
    device_id: "",//设备ID

    os: isIos,//ios 1;android 0
    device_system: uaJson.system,//系统版本号
    locale: uaJson.language,//语言环境
    package_name: null,//安装的其他软件-激活的时候会上传

    device_simOperrator: "",//运营商
    network_type: network_type,//网络类型
    channel: "wx",//来源渠道微信或者source
    gender: gender
  };

  var uaString = JSON.stringify(uadata);
  return uaString;
}



var requestGet = (url, callback, failCallBack) => {
  url = encodeURI(url);
  var data = {
    token: tokenGet(),
    ua: ua(),
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: Date.now()
  };
  // //这个需要放开以后支持了2.5.0新模板后
  // if (url.indexOf("/app/layout/tab") < 0){
  //   data.ua = ua();
  // }else{

  // }
  requestTool.request("GET", url, data, function (res) {
    callback(res);
  }, function (res) {
    failCallBack(res.errMsg);
  });
}
var requestGuessGet = (url, callback, failCallBack) => {

  var new_url = url;
  new_url = encodeURI(new_url);
  wx.request({
    url: new_url,
    data: {
      token: tokenGet(),
      ua: ua(),
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
      'content-Type': 'json',
    },

    success: function (res) {

      if (res) {
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
  var new_url = url;
  new_url = encodeURI(new_url);

  if (tokenGet()) {
    paraterm.token = tokenGet();
  }
  paraterm.ua = ua();
  console.log(paraterm);
  requestTool.request("POST", new_url, paraterm, function (res) {
    callback(res);
  }, null);
}
var tokenGet = () => {
  return WNTSToken.get();
}
var requestPut = (url, callback) => {
  var new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua() + "&token=" + tokenGet()) : (url + "?ua=" + ua() + "&token=" + tokenGet());
  new_url = encodeURI(new_url);
  wx.request({
    url: new_url,
    data: {
      token: tokenGet(),
      ua: ua(),
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
      'content-Type': 'json',
    },
    success: function (res) {
      if (res) {
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
  var new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua() + "&token=" + tokenGet()) : (url + "?ua=" + ua() + "&token=" + tokenGet());
  new_url = encodeURI(new_url);
  wx.request({
    url: new_url,
    data: {
      ua: ua(),
      token: tokenGet(),
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
      'content-Type': 'json',
    },
    success: function (res) {
      if (res) {
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
  var new_url = url;
  var parterm = {};
  if (paraterm) {
    parterm = paraterm;
  }
  if (method == "GET" || method == "DELETE" || method == "PUT") {
    conten_type = 'application/json'
    new_url = (url.indexOf("?") >= 0) ? (url + "&ua=" + ua() + "&token=" + tokenGet()) : (url + "?ua=" + ua() + "&token=" + tokenGet());
  } else if (method == "POST") {
    conten_type = "application/x-www-form-urlencoded";
    parterm.ua = ua();
    parterm.token = tokenGet();
  }

  requestTool.request(method, new_url, parterm, function (success) {
    if (success) {
      callback(success);
    }
  }, function (fail) {
  });
}

var pay = (orderId, success, fail, cancel) => {
  var url = URL_ROOT + "/order/" + orderId + "/charge";
  url = encodeURI(url);
  wx.request({
    url: url,
    data: {
      channel: "wx_lite",
      ua: ua(),
      token: tokenGet()
    },
    method: "POST",
    header: {
      'content-Type': "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res);
      if (res) {
        if (res.data.code == 60000) {
          wx.showToast({
            title: '支付失败,请重新下单',
            icon: 'none'
          })
          return;
        };
        if (res.data.code == 50100) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return;
        };
        var charge = res.data;
        var Pingpp = require('/pingpp.js');
        Pingpp.createPayment(charge, function (result, err) {
          if (result == "success") {
            success(result);
            // 只有微信小程序 wx_lite 支付成功的结果会在这里返回
          } else if (result == "fail") {
            wx.getSystemInfo({
              success: function (res) {
                if (res.model.indexOf("iPhone") < 0) { //
                  var index = (err.extra.errMsg).lastIndexOf(":");
                  var msg = (err.extra.errMsg).substring(index + 1, (err.extra.errMsg).length);
                  fail(msg);
                } else {
                  fail(res);
                }
              }
            });
            // charge 不正确或者微信小程序支付失败时会在此处返回
          }
        });
      } else {
        postErrorLog.call(2, 2, "post请求statusCode=" + statusCode, encodeURI(new_url + "\n" + paraterm + "\n" + res));
      }
    },
    fail: function (res) {
      console.log(res);
      fail(res);
      postErrorLog.call(2, 2, "请求charge失败", encodeURI(url + "\n" + res));
    }
  })
}
// errerType 错误终端类型 1:客户端异常  2：服务端异常 3:其他异常 4:小程序异常
//severity    严重级别  1: 严重  2:一般  3:可忽略
//description 问题的描述 
//endpoint endpoint //0：未分配 1：iOS 2：android 3：服务器 4:mini
var postErrorLog = (errerType, severity, description, detail) => {
  return;
  var paraterm = {};
  paraterm.ua = ua();
  paraterm.happenTime = Date.parse(new Date());
  paraterm.type = errerType;
  paraterm.severity = severity;
  paraterm.descrption = description;
  paraterm.endpoint = 4;
  paraterm.detail = detail;
  requestPost(paraterm, URL_EVENT_LOG,
    function (success) { },
    function (fail) { });
}
var checkSourceValidityBoolWithSource = (source) => {
  var validityBool = false;
  if (sourceArray.length) {
    for (let i = 0; i < sourceArray.length; i++) {
      var currentSource = sourceArray[i];
      if (source == currentSource) {
        validityBool = true;
      }
    }
  }
  return validityBool;
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
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    var subject_product = data[i].entity;
    var temp = {};
    var tip_background;
    var tip_icon;
    var tips;
    var showTips;
    var currentTime = Date.parse(new Date());
    var twoDayTime = 48 * 3600 * 1000;
    var time = currentTime - subject_product.created;
    var showTips = false;
    temp.title_prefix_url_label = subject_product.title_prefix_url_label;
    temp.imgs = subject_product.imgs;
    temp.id = subject_product.id;
    temp.title = subject_product.title;
    temp.price = subject_product.price;
    temp.tag_price = subject_product.tag_price;
    temp.promotion = subject_product.sales_promotion;
    temp.promotion_id = subject_product.sales_promotion_id;
    temp.promotion_label = subject_product.promotion_text_label;
    temp.promotional = subject_product.sales_promotional;
    // if (subject_product.total_stock < 500 & subject_product.total_stock > 0) {
    //   showTips = true;
    //   tips = "仅剩" + subject_product.total_stock + "件";
    //   tip_background = "../WANTSImages/discount_icon_red.png";
    //   tip_icon = "../WANTSImages/discount_icon_clock.png";
    // } else if (time <= twoDayTime) {
    //   showTips = true;
    //   tips = "最新潮品";
    //   tip_background = "../WANTSImages/discount_icon_blue.png";
    //   tip_icon = "../WANTSImages/discount_icon_new.png";
    // }

    var rateDouble = subject_product.price / subject_product.tag_price;
    var rate = rateDouble * 100;
    var discount = rate / 10;
    // if (discount <= 2) {
    //   showTips = true;
    //   tip_background = "../WANTSImages/discount_icon_yellow.png";
    //   tip_icon = "../WANTSImages/discount_icon_tips.png";
    //   if (discount < 1) {
    //     tips = "限0.1折";
    //   } else {
    //     if (parseInt(discount.toFixed(1).split(".")[1]) == 0) {
    //       tips = "限" + discount.toFixed(1).split(".")[0] + "折";
    //     } else {
    //       tips = "限" + discount.toFixed(1) + "折";
    //     }
    //   }
    // }
    // temp.tip_background = tip_background;
    // temp.tip_icon = tip_icon;
    // temp.tips = tips;
    // temp.showTips = showTips;
    guessLikes.push(temp);
  }
  return guessLikes;

}
var getGessLikeMoreDataTool = (data) => {
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
    temp.title_prefix_url_label = subject_product.title_prefix_url_label;
    temp.imgs = subject_product.imgs;
    temp.id = subject_product.id;
    temp.title = subject_product.title;
    temp.price = subject_product.price;
    temp.tag_price = subject_product.tag_price;
    temp.promotion = subject_product.promotion;
    temp.promotion_id = subject_product.promotion_id;
    temp.promotion_label = subject_product.promotion_label;
    temp.promotional = subject_product.promotional;
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

var getOngoingPromotionList = (callBack) => {
  if (!callBack) return
  requestMethodWithParaterm("GET", null, encodeURI(URL_ROOT + "/promotion"), function (res) {
    callBack(res);
  });
}
var getShoppingCartSellerList = (callBack) => {
  var token = WNTSToken.get();
  if (!token) return;
  if (!callBack) return;
  requestMethodWithParaterm("GET", null, encodeURI(URL_ROOT + "/promotion_cart/price?choose_all_products_in_cart=true"), function (res) {
    callBack(res);
  });
}
var trim = (str) => { //过滤字符串中的空格
  return str.replace(/\s/g, "");
}
var getProductsTotalThenSetTabBarBadgeWithSellerList = (sellerList) => {
  //判断小程序的API，回调，参数，组件等是否在当前版本可用。https://developers.weixin.qq.com/miniprogram/dev/api/api-caniuse.html
  if (wx.canIUse('setTabBarBadge') == false) return;
  var shoppingcarProductsTotal = 0;
  if (sellerList == null) {
    wx.removeTabBarBadge({
      index: 1
    })
    return;
  }
  for (var i = 0; i < sellerList.length; i++) {
    if (sellerList[i].order_product_list) {
      var productsList = sellerList[i].order_product_list;
    } else {
      var productsList = sellerList[i].products;
    };
    for (let j = 0; j < productsList.length; j++) {
      shoppingcarProductsTotal += productsList[j].num;

    }
  };
  if (shoppingcarProductsTotal == 0) {
    wx.removeTabBarBadge({
      index: 1
    })
  } else {
    wx.setTabBarBadge({
      index: 1,
      text: String(shoppingcarProductsTotal)
    })
  };
}
var stringWithAndCode = (strings) => {
  return strings.split('&').join(' ');
}

var stringWithEqualCode = (strings) => {
  return strings.split('=');
}

var timestampToTime = (timestamp) => {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return h + m + s;
}

const URL_ROOT = WNTSAPI.mainUrl;

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
const URL_EVENT_LOG = URL_ROOT + "/app/event_log"
//新版假数据
const NEW_MODULE_DATA = {
  "blocks": [{
    "block_id": 11,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1527476492698_500_252",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1527835246979_499_250",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1527737601007_500_250",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1527477621269_500_252",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    }
    ],
    "block_title": "高度可浮动的banner",
    "block_type": 11
  },
  {
    "block_id": 12,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528717941002_1126_122",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    }
    ],
    "block_title": "四块精品",
    "block_type": 12
  },
  {
    "block_id": 13,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528717941002_1126_122",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    },
    {
      "item_id": 6,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    }
    ],
    "block_title": "五块精品",
    "block_type": 13
  },
  {
    "block_id": 14,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528717941002_1126_122",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    },
    {
      "item_id": 6,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 7,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    }
    ],
    "block_title": "六块精品",
    "block_type": 14
  },
  {
    "block_id": 15,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528717941002_1126_122",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    },
    {
      "item_id": 6,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 7,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 8,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    }
    ],
    "block_title": "七块精品",
    "block_type": 15
  },
  {
    "block_id": 16,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528717941002_1126_122",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    },
    {
      "item_id": 6,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 7,
      "item_image": "http://static.wantscart.com/product/1528718358790_556_352",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 8,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 9,
      "item_image": "http://static.wantscart.com/product/1528718585255_272_360",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    }
    ],
    "block_title": "八块精品",
    "block_type": 16
  },
  {
    "block_id": 17,
    "block_space_show": 1,
    "block_space_bgcolor": "#EBEBEB",
    "block_items": [{
      "item_id": 1,
      "item_image": "http://static.wantscart.com/product/1528717941002_1126_122",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 2,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3128
      },
      "item_type": 3
    },
    {
      "item_id": 3,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3104
      },
      "item_type": 3
    },
    {
      "item_id": 4,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3126
      },
      "item_type": 3
    },
    {
      "item_id": 5,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3122
      },
      "item_type": 3
    },
    {
      "item_id": 6,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 7,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 8,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 9,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    },
    {
      "item_id": 10,
      "item_image": "http://static.wantscart.com/product/1528718721594_366_354",
      "item_target": {
        "target_id": 3117
      },
      "item_type": 3
    }
    ],
    "block_title": "九块精品",
    "block_type": 17
  }
  ],
  "tab_id": "1",
  "tab_name": "推荐",
  "tab_tags": "1416"
}

module.exports = {
  formatTime: formatTime,
  formatTimes: formatTimes,
  showBusy: showBusy,
  showSuccess: showSuccess,
  showModel: showModel,
  requestGet: requestGet,
  requestGuessGet,
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
  NEW_MODULE_DATA,
  checkLoginStatus,
  getGessLikeDataTool,
  getGessLikeMoreDataTool,
  getOngoingPromotionList,
  getShoppingCartSellerList,
  stringWithAndCode,
  stringWithEqualCode,
  trim,
  getProductsTotalThenSetTabBarBadgeWithSellerList,
  chunk,
  timestampToTime,
  network,
  tokenGet,
  WNTSAPI,
  // sourceArray,//合法的source数组
  // checkSourceValidityBoolWithSource,//检测source是否有效
  WNTS_SceneType_HomePage,
  WNTS_SceneType_ProductDetailPage,
  WNTS_SceneType_ShopCarPage,
  //    WNTS_SceneType_FinishOrderPage,
  WNTS_SceneType_OrderFinishPayPage,
  WNTS_SceneType_OrderPage,
  WNTS_SceneType_OrderExpressPage,
  WNTS_SceneType_UserProfilePage,
  WNTS_SceneType_HistoaryPage,
  WNTS_SceneType_FavouritePage,
  WNTS_SceneType_OrderDetailPage,
};