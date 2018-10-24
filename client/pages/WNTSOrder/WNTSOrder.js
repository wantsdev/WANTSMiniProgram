// pages/WNTSOrder/WNTSOrder.js
var app = getApp()
var currentTabNum = 0;
var util = require('../../utils/util.js');
var WNTSToken = require("../../vendor/wafer2-client-sdk/lib/WNTSToken.js");
var Pingpp = require('../../utils/pingpp.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面配置 
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    block_subject: [],
    orderlist: ["待付款", "待发货", "待收货", "全部"],
    dataList: [],
    button1: "",
    button2: "",
    showModal: false,
    orderId: "",
    guessLike: [],
    offset: 0,
    page: 0,
    limit: 16,
    loadMoreBool: true,
    winWidth: 0,
    winHeight: 0,
    dialog_title: "",
    dialog_type: null,
    orderShow: false,
    owner: ''
  },

  /**
   * 获取商户名称
   */
  getSellerName(providerId, i) {
    var that = this;
    util.requestGet(util.URL_ROOT + "/user/" + providerId, function (data) {
      var data_list = that.data.dataList;
      data_list[i].sellerName = data.data.name;
      that.setData({
        dataList: data_list,
      })
    }, function (data) {
      wx.showToast({
        title: data.data,
        icon: "none",
        duration: 2000,
        orderShow: true
      })
    })
  },
  /**
   * 获取商户名称
   */
  createPromise() {
    var promise;
    promise = new Promise(function (resolve, reject) {
      var elapse = Math.random() * 2000;
      setTimeout(resolve, elapse);
    });
    return promise;
  },

  /**
   * 获取订单数据
   */
  getData(currTabNum) {
    var that = this;
    var url;
    if (currTabNum == 0) {
      url = util.URL_GET_ORDER_PAY
    } else if (currTabNum == 1) {
      url = util.URL_GET_ORDER_DELIVER
    } else if (currTabNum == 2) {
      url = util.URL_GET_ORDER_GETTING
    } else if (currTabNum == 3) {
      // url = util.URL_GET_ORDER_FINISH
      url = util.URL_GET_ORDER_ALL
    }
    that.httpData(url);
  },

  //http 请求数据
  httpData(url) {
    var that = this;
    var offset = that.data.offset;
    var limit = that.data.limit;
    util.requestGet(url + "?offset=" + offset + "&limit=" + limit, function (data) {
      that.successData(data.data);
    }, function (data) {
      wx.showToast({
        title: data.data,
        icon: "none",
        duration: 2000,
        orderShow: true
      })
    })
  },

  //数据请求成功
  successData(data) {
    var that = this;
    var isSame = false;
    var sellerName = "販賣東西";
    var data_list = data.list;
    var offset = that.data.offset;
    var tempList;
    if (offset == 0) {
      tempList = [];
    } else {
      tempList = that.data.dataList;
    }
    // 获取订单商品总额
    for (var i = 0; i < data_list.length; i++) {
      var total = 0;
      var created = data_list[i].created;
      var products = data_list[i].products;
      var express_id = data_list[i].express_id;
      var owner = data_list[i].receiver_name;
      var currentTimes = new Date();
      var endTimes = (created + 2 * 60 * 60 * 1000) - currentTimes;
      if (endTimes <= 0) {
        // that.cancelOrder(e);
        // that.setData({
        //   showLoadingTime: false
        // });
      };

      that.initSellerName(products, i);
      switch (data_list[i].status) {
        case 10: // 待付款
          data_list[i].button1 = "取消订单";
          data_list[i].button2 = "立即付款";
          data_list[i].button4 = "查看订单";
          data_list[i].opreation = true;
          break;
        case 30: //待收货
          if (data_list[i].express_company == 0) { //待发货
            data_list[i].button1 = null;
            data_list[i].button2 = null;
            data_list[i].button3 = "提醒发货";
            data_list[i].opreation = true;
          } else { //待收货
            data_list[i].button1 = express_id ? "查看物流" : null;
            data_list[i].button2 = "确认收货";
            data_list[i].button3 = null;
            data_list[i].opreation = true;
          }
          break;
        case 35: //申请退款
        case 43: //结束-申请退款
        case 44: //结束-申请换货
        case 40: //结束
          data_list[i].button1 = null;
          data_list[i].button2 = express_id ? "查看物流" : null;
          data_list[i].button3 = null;
          data_list[i].opreation = express_id ? true : false;
          break;
        case 11: //完成付款，等待系统确认
        case 41: //结束-主动取消
        case 42: //结束-异常取消
          data_list[i].button1 = null;
          data_list[i].button2 = null;
          data_list[i].button3 = null;
          data_list[i].opreation = false;
          break;
      }
      for (var j = 0; j < products.length; j++) {
        var product = products[j];
        total += product.sum / 100;
      }
      //设置订单商品总额
      data_list[i].totalPrice = total;

      //简化 数据
      data = that.buildData(data_list[i]);
      tempList.push(data);
    }
    //如果数据为空 加载猜你喜欢
    if (tempList.length == 0) {
      that.getGussLikeData();
      tempList = null;
    }
    var loadMoreBool = true;
    if (data_list == null || data_list.length < that.data.limit) {
      loadMoreBool = false;
    }
    that.setData({
      dataList: tempList,
      loadMoreBool: loadMoreBool,
      owner: owner
    });
    wx.stopPullDownRefresh();
  },

  //简化数据
  buildData(data_list_item) {
    var data = {};
    data.created = data_list_item.created;
    data.status = data_list_item.status;
    data.status_descp = data_list_item.status_descp;
    data.totalPrice = data_list_item.totalPrice;
    data.button1 = data_list_item.button1;
    data.button2 = data_list_item.button2;
    data.button3 = data_list_item.button3;
    data.button4 = data_list_item.button4;
    data.opreation = data_list_item.opreation;
    data.owner = data_list_item.receiver_name;
    data.id = data_list_item.id;
    data.express_id = data_list_item.express_id;
    data.exptess_no = data_list_item.exptess_no
    data.product_num = data_list_item.product_num;
    data.address_id = data_list_item.address_id;
    data.pay = data_list_item.pay;
    data.provider_id = data_list_item.provider_id;
    data.sum = data_list_item.sum;
    data.receiver_name = data_list_item.receiver_name;
    data.receiver_phone = data_list_item.receiver_phone;
    data.receiver_address = data_list_item.receiver_address;
    var products = data_list_item.products;
    var prductsList = [];
    for (var j = 0; j < products.length; j++) {
      var product_item = products[j];
      var new_product_item = {};
      new_product_item.product_img = product_item.product_img;
      new_product_item.product_id = product_item.product_id;
      new_product_item.price = product_item.price;
      new_product_item.product_title = product_item.product_title;
      new_product_item.product_stock_id = product_item.product_stock_id;
      new_product_item.provider_id = product_item.provider_id;
      new_product_item.stock_descp = product_item.stock_descp;
      new_product_item.tag_price = product_item.tag_price;
      new_product_item.sum = product_item.sum;
      new_product_item.num = product_item.num;
      prductsList.push(new_product_item);
    }
    data.products = prductsList;
    return data;
  },

  //获取店铺名称
  initSellerName(products, i) {
    var that = this;
    var provider_id;
    var same = true;
    if (products.length == 1) {
      provider_id = products[0].provider_id;
    } else {
      provider_id = products[0].provider_id;
      for (var a = 1; a < products.length; a++) {
        if (provider_id != products[a].provider_id) {
          same = false;
        }
      }
    }
    if (same) {
      that.getSellerName(provider_id, that.data.offset + i);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      currentTab: options.tab,
    });
    currentTabNum = options.tab;
    //获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.getData(currentTabNum);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      fromTo: 'order'
    })
  },


  /**
   * 立即付款
   */
  pay(orderId) {
    var that = this;
    var paraterm = {};
    util.pay(orderId, function () {
      wx.showToast({
        title: '支付成功',
        icon: "success",
        duration: 2000
      })
      //告诉WANTS服务器付款成功
      util.requestGet(util.URL_ROOT + '/order/' + orderId + '/paied',
        function (success) { },
        function (fail) { });
      //刷新订单列表，显示最新状态
      that.refesh();
    }, function (fial) {
      wx.showToast({
        title: fial,
        icon: "none",
        duration: 2000
      })
    }, function () {
      wx.showToast({
        title: '取消支付',
        icon: "none",
        duration: 2000
      })
    });
  },

  /**
   * 查看物流
   */
  getExpress(expressId, goodsNum, goodsImg, goodsTitle, goodsPrice, goodsOwner) {
    wx.navigateTo({
      url: '../WNTSExpress/WNTSExpress?expressId=' + expressId + '&goodsNum=' + goodsNum + '&goodsImg=' + goodsImg + '&goodsTitle=' + goodsTitle + '&goodsPrice=' + goodsPrice + '&goodsOwner=' + goodsOwner,
    })
  },

  //猜你喜欢获取数据
  getGussLikeData() {
    var that = this;
    var orderStatus = that.data.orderlist[that.data.currentTab];
    var guessLike = that.data.guessLike;
    //数据量超过1m导致无法显示数据，最大量在75左右，考虑字段长度不一，故限定为70
    if (that.data.page >= 70) {
      that.setData({
        loaddingContext: "没有更多啦～"
      });
      return
    }
    that.setData({
      loaddingContext: "加载更多..."
    });
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=4&offset=' + that.data.offset + '&limit=16&orderStatus=' + orderStatus,
      function (data) {
        var temp = util.getGessLikeMoreDataTool(data.data);
        guessLike = guessLike.concat(temp);
        console.log(guessLike);
        var loadMoreBool = true;
        if (data == null || data.length < that.data.limit) {
          loadMoreBool = false;
        }
        that.setData({
          guessLike: guessLike,
          loadMoreBool: loadMoreBool
        });
      },
      function (data) {

      });
  },


  //猜你喜欢item 点击
  guessLike_item(e) {
    var subject_product = e.currentTarget.dataset.item;
    var subject_product_all = {};
    subject_product_all.product_imgs = subject_product.imgs;
    subject_product_all.product_id = subject_product.id;
    subject_product_all.product_title = util.stringWithAndCode(subject_product.title);
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    var json_string = JSON.stringify(subject_product_all);
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + json_string
    })
  },

  //逛一逛
  go_shop() {
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage',
    });
  },

  /**
   * 操作栏 第一个按钮
   */
  opreation_1: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.seller.id;
    var expressId = e.currentTarget.dataset.seller.express_id;
    var goodsPrice = e.currentTarget.dataset.seller.products[0].sum / 100;
    var goodsTitle = e.currentTarget.dataset.seller.products[0].product_title;
    var goodsOwner = e.currentTarget.dataset.seller.receiver_name;
    var goodsImg = e.currentTarget.dataset.seller.products[0].product_img;
    var list = e.currentTarget.dataset.seller.products;
    var goodsNum = 0;
    for (var i = 0; i < list.length; i++) {
      goodsNum += list[i].num;
    }
    that.setData({
      orderId
    })
    var buttonText = e.currentTarget.dataset.seller.button1;
    if (buttonText == "取消订单") {
      var title = "确认取消订单吗？";
      var dialog_type = buttonText;
      that.showDialog(title, dialog_type);
    } else if (buttonText == "查看物流") {
      that.getExpress(expressId, goodsNum, goodsImg, goodsTitle, goodsPrice, goodsOwner);
    }
  },

  /**
   * 操作栏 第二个按钮
   */
  opreation_2: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.seller.id;
    var expressId = e.currentTarget.dataset.seller.express_id;
    var goodsTitle = e.currentTarget.dataset.seller.products[0].product_title;
    var goodsImg = e.currentTarget.dataset.seller.products[0].product_img;
    var list = e.currentTarget.dataset.seller.products;
    var goodsNum = 0;
    for (var i = 0; i < list.length; i++) {
      goodsNum += list[i].num;
    }
    that.setData({
      orderId
    })
    var buttonText = e.currentTarget.dataset.seller.button2;
    if (buttonText == "立即付款") {
      that.pay(orderId);
    } else if (buttonText == "提醒发货") {
      that.remindSend();
    } else if (buttonText == "确认收货") {
      var title = "确认收到商品吗？";
      var dialog_type = buttonText;
      that.showDialog(title, dialog_type);
    } else if (buttonText == "查看物流") {
      that.getExpress(expressId, goodsNum, goodsImg, goodsTitle);
    }
  },

  //订单列表加载更多
  loadMoreDataList() {
    var that = this;
    var offset = 0;
    if (that.data.loadMoreBool) {
      var newPage = that.data.page;
      newPage++;
      offset = newPage * that.data.limit;
      that.setData({
        page: newPage,
        offset: offset,
      });
      that.getData(that.data.currentTab);
      that.setData({
        loaddingContext: "加载更多..."
      });
    } else {
      wx.showToast({
        title: '没有更多数据啦～',
        icon: 'none'
      })
    }
  },

  //猜你喜欢加载更多
  loadMoreGuessLike() {
    var that = this;
    var offset = 0;
    if (that.data.loadMoreBool) {
      var newPage = that.data.page;
      newPage++;
      offset = newPage * that.data.limit;
      that.setData({
        page: newPage,
        offset: offset,
      });
      that.getGussLikeData();
    } else {
      wx.showToast({
        title: '没有更多数据啦～',
        icon: 'none'
      })
    }
  },

  /**
   * 跳转至 订单详情
   */
  go_orderDetail: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset);
    var orderId = e.currentTarget.dataset.order.id;
    var sellerName = e.currentTarget.dataset.order.sellerName;
    var status_descp = e.currentTarget.dataset.order.status_descp;
    var created = e.currentTarget.dataset.order.created;
    wx.navigateTo({
      url: '../WNTSOrderDetial/WNTSOrderDetial?orderId=' + orderId + '&created=' + created + '&status_descp=' + status_descp,
    })
  },

  /**
   * orderDetail 所需数据整理
   */
  formateOrderData(order) {
    var orderDetail;
    return orderDetail;
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    var currTabNum = e.target.dataset.current;
    if (this.data.currentTab === currTabNum) {
      return false;
    } else {
      that.setData({
        currentTab: currTabNum,
        offset: 0,
        page: 0
      })
      currentTabNum = currTabNum;
    }
    that.getData(currTabNum);
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /* 弹窗 */
  showDialog(title, dialogType) {
    this.setData({
      showModal: true,
      dialog_title: title,
      dialog_type: dialogType
    })
  },

  /*弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {

  },

  /* 隐藏模态对话框*/
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /*对话框取消按钮点击事件*/
  onCancel: function () {
    this.hideModal();
  },

  /*对话框确认按钮点击事件*/
  onConfirm: function (e) {
    var that = this;
    this.hideModal();
    var dialogType = that.data.dialog_type;
    var confirm = "确认收货";
    var cancel = "取消订单";
    if (dialogType == confirm) {
      that.confirmRecivied(e);
    } else if (dialogType == cancel) {
      that.cancelOrder(e);
    }
  },

  //取消订单
  cancelOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var url = util.URL_ROOT + "/order/" + orderId + "/cancel"
    util.requestPut(url, function (data) {
      if (data.code == 1) {
        that.getData(that.data.currentTab);
        that.getGussLikeData();
      }
    }, function (data) {
      wx.showToast({
        title: data,
        icon: "none",
        duration: 2000
      })
    });
  },

  /**
   * 确认收货
   */
  confirmRecivied(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var url = URL_GET_ORDER + orderId + "/received";
    util.requestPut(url, function (data) {
      if (data.data.code == 1) {
        wx.showToast({
          title: '收货成功',
          icon: "success"
        })
        that.getData(that.data.currentTab);
        that.getGussLikeData();
      }
    }, function (data) {
      wx.showToast({
        title: data.data,
        icon: "none",
        duration: 2000
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData(currentTabNum);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      offset: 0,
      page: 0,
      loadMoreBool: true
    })
    that.getData(that.data.currentTab);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var loadMoreBool = this.data.loadMoreBool;
    if (loadMoreBool) {
      if (this.data.dataList) {
        this.loadMoreDataList();
      } else {
        this.loadMoreGuessLike();
      }
    } else {
      this.setData({
        loaddingContext: "没有更多啦～"
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})