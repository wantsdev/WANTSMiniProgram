// pages/WNTSCreateOrderPage/WNTSCreateOrderPage.js
var util = require('../../utils/util.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var json_str;
var orderData;
var h;
var m;
var s;
var APPID = getApp().globalData.appid;
var APPSECRET = getApp().globalData.appSecret;
var getAcessToken = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APPSECRET;
var fId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // address_list: null,
    currentAddress: null,
    selectedProducts: null,
    quitImage: "../WANTSImages/withdraw.png",
    totalPrice: "",
    debug: false,
    // cancelOrder: false,
    fromTo: "",
    showModal: false,
    json_str: "",
    loadingHidden: true,
    iPhoneX: false,
    preTime: '',
    currentDate: '',
    created: ''
    // modalShow: modalShow
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var selectedProductsOptions = decodeURIComponent(options.selectedProducts);
    var selectedProducts = JSON.parse(selectedProductsOptions);
    var selectedProductsItemOne = selectedProducts.product[0];
    // 获取设备信息
    that.setData({
      modalShow: getApp().globalData.modalTurn
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          modalHeight: res.screenHeight * 2
        });
        if (res.screenHeight == 812) {
          that.setData({
            iPhoneX: true
          });
        }
      }
    });
    if (selectedProductsItemOne.product_img == undefined) {
      var getProductInfoUrl = WNTSApi.mainUrl + '/product/' + selectedProductsItemOne.product_id;
      util.requestGet(getProductInfoUrl, function (res) {
        var productImg = (res.data.small_img) ? (res.data.small_img) : (res.data.img[0]);
        var tagPrice = res.data.tag_price;
        var productTitle = res.data.title;
        var orderId = selectedProductsItemOne.id;
        selectedProductsItemOne.product_img = productImg;
        selectedProductsItemOne.product_tag_price = tagPrice;
        selectedProductsItemOne.product_title = productTitle;
        that.setData({
          selectedProducts,
          productImgUrl: productImg
        });
        console.log(that.data.selectedProducts);
        that.createOrder();
        that.getShoppingCartTotalPrice();
      })
    } else {
      var productImgUrl = (typeof (selectedProductsItemOne.product_img) === 'object' && selectedProductsItemOne.product_img.length > 0) ? (selectedProductsItemOne.product_img[0]) : (selectedProductsItemOne.product_img);
      var orderId = selectedProductsItemOne.id;
      selectedProducts = selectedProducts.product;
      console.log(selectedProducts);
      that.setData({
        selectedProducts,
        productImgUrl
      });
      that.createOrder();
      that.getShoppingCartTotalPrice();
    };
  },
  createOrder() {
    var that = this;
    util.requestMethodWithParaterm("GET", null, WNTSApi.adderssApi, function (res) {
      //console.log(res);
      var data = res.data;
      var hasDefault = false;
      for (var i = 0; i < data.length; i++) {
        var defData = data[i];
        if (defData.def) {
          hasDefault = true;
          that.setData({
            currentAddress: defData
          });
        }
      }
      if (!hasDefault && data.length > 0) {
        that.setData({
          currentAddress: data[0]
        });
      }
    });
  },

  getShoppingCartTotalPrice() {
    var that = this;
    let selectedProducts = that.data.selectedProducts;
    var selectedProduct_id_array = [];
    console.log(selectedProducts);
    for (let i = 0; i < selectedProducts.length; i++) {
      selectedProduct_id_array.push(selectedProducts[i].id);
    };
    var url = "";
    if (selectedProducts[0].from == "productDetail") {
      url = WNTSApi.price_by_stock_promotion_Api + "?stockId=" + selectedProducts[0].id + "&num=" + selectedProducts[0].num;
      util.requestMethodWithParaterm("GET", null, url, function (res) {
        console.log(res);
        var addPriceArr = [];
        var sum = 0;
        var price = res.data.pay / 100;
        var express = res.data.express / 100;
        for (var p = 0; p < selectedProducts.length; p++) {
          addPriceArr.push(selectedProducts[p].num * selectedProducts[p].price / 100);
        };
        for (var s = 0; s < selectedProducts.length; s++) {
          sum += addPriceArr[s];
        };
        that.setData({
          totalPrice: price,
          express: express,
          productTotalPrice: sum
        });
      });
    } else {
      url = WNTSApi.shoppingCarPricetApi + "?order_product_id=" + selectedProduct_id_array;
      util.requestMethodWithParaterm("GET", null, url, function (res) {
        var addPriceArr = [];
        var sum = 0;
        var price = res.data.pay / 100;
        var express = res.data.express / 100;
        for (var p = 0; p < selectedProducts.length; p++) {
          addPriceArr.push(selectedProducts[p].num * selectedProducts[p].price / 100);
        };
        for (var s = 0; s < selectedProducts.length; s++) {
          sum += addPriceArr[s];
        };
        that.setData({
          totalPrice: price,
          express: express,
          productTotalPrice: sum
        });
      });
    }
  },

  //点击提交订单，到达“确认付款”界面
  submitOrderClick(e) {
    var that = this;
    var fIdArr = getApp().globalData.formIdArr;
    fId = e.detail.formId;
    fIdArr.push(fId);
    if (fIdArr.length >= 4) {
      //推送formId到服务端
      console.log(fIdArr);
      var fIdUrl = WNTSApi.mainUrl + '/user/batch_add_miniapp_form_id_list';
      util.requestPost({
        "form_id_list": fIdArr
      }, fIdUrl, function (res) {
        getApp().globalData.formIdArr = [];
      })
    };
    that.getOrder();
  },

  getOrder() {
    var that = this;
    var products = that.data.selectedProducts;
    var productidS = [];

    console.log(products);
    for (let i = 0; i < products.length; i++) {
      productidS.push(products[i].id);
    }
    if (productidS == null) return;
    if (!that.data.currentAddress) {
      wx.showToast({
        title: '请填写地址',
        icon: "none"
      })
      return
    }
    var paraterm = {};
    var url = "";
    if (products[0].from == "productDetail") {
      //来自详情
      paraterm.productId = products[0].product_id;
      paraterm.stockId = products[0].id;
      paraterm.num = products[0].num;
      paraterm.addressId = that.data.currentAddress.id;
      url = WNTSApi.submitOrderNewApi;
    } else {
      paraterm.order_product_id = productidS;
      url = WNTSApi.submitOrderApi;
      paraterm.address_id = that.data.currentAddress.id;
    }

    // paraterm.channel = "wx_lite";
    orderData = {};
    that.setData({
      loadingHidden: false
    });
    console.log(url);
    console.log(paraterm);
    util.requestMethodWithParaterm("POST", paraterm, url, function (res) {
      console.log(res);
      that.setData({
        loadingHidden: true,
        created: res.data.created
      });
      if (res.data.code) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 5000
        })
        return
      };
      var orderRes_Data = res.data;
      orderData.sum = orderRes_Data.sum / 100;
      orderData.pay = orderRes_Data.pay / 100;
      orderData.id = orderRes_Data.id;
      orderData.created = orderRes_Data.created;
      orderData.receiver_address = orderRes_Data.receiver_address;
      orderData.receiver_name = orderRes_Data.receiver_name;
      orderData.receiver_phone = orderRes_Data.receiver_phone;
      orderData.warning_message_on_confirm_order_page = orderRes_Data.warning_message_on_confirm_order_page;
      json_str = JSON.stringify(orderData);
      wx.navigateTo({
        url: '../WNTSConfirmPaymentPage/WNTSConfirmPaymentPage' + "?orderData=" + json_str,
      });

    });
  },


  address_edit() {
    if (this.data.currentAddress) {
      wx.navigateTo({
        url: '../WNTSAddressManager/WNTSAddressManager' + "?addressId=" + this.data.currentAddress.id,
      });
    } else {
      wx.navigateTo({
        url: '../WNTSCreatAddress/WNTSCreatAddress',
      });
    }
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
    var that = this;
    var currentTime = new Date();
    var createdTime = that.data.created;
    var preTime = createdTime + 2 * 3600 * 1000 - currentTime;
    that.setData({
      modalShow: getApp().globalData.modalTurn
    });
    if (preTime > 0) {
      h = (parseInt(preTime / 1000 / 3600) < 10) ? ('0' + parseInt(preTime / 1000 / 3600)) : (parseInt(preTime / 1000 / 3600));
      m = (parseInt((preTime - h * 1000 * 3600) / 1000 / 60) < 10) ? ('0' + parseInt((preTime - h * 1000 * 3600) / 1000 / 60)) : (parseInt((preTime - h * 1000 * 3600) / 1000 / 60));
      s = (parseInt((preTime - h * 1000 * 3600 - m * 1000 * 60) / 1000) < 10) ? ('0' + parseInt((preTime - h * 1000 * 3600 - m * 1000 * 60) / 1000)) : (parseInt((preTime - h * 1000 * 3600 - m * 1000 * 60) / 1000));
      that.setData({
        preTime: h + ':' + m + ':' + s
      });
    };
    if (that.data.fromTo == "order") {
      wx.switchTab({
        url: '../WNTSShoppingCartPage/WNTSShoppingCartPage',
      })
      return
    }
  },
  /*弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {

  },

  /* 隐藏模态对话框*/
  // hideModal: function() {
  //   this.setData({
  //     showModal: false
  //   });
  // },

  /*对话框取消按钮点击事件*/
  // onCancel: function() {
  // },
  quite(e) {
    var that = this;
    var fIdArr = getApp().globalData.formIdArr;
    fId = e.detail.formId;
    fIdArr.push(fId);
    if (fIdArr.length >= 4) {
      //推送formId到服务端
      console.log(fIdArr);
      var fIdUrl = WNTSApi.mainUrl + '/user/batch_add_miniapp_form_id_list';
      util.requestPost({
        "form_id_list": fIdArr
      }, fIdUrl, function (res) {
        getApp().globalData.formIdArr = [];
      })
    };
    getApp().globalData.modalTurn = false;
    //发送模板消息
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          });
          util.requestGet(getAcessToken, function (res) {
            var ACCESS_TOKEN = res.data.access_token;
            var sendTempMessage = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + ACCESS_TOKEN;
            var getOpenId = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + APPSECRET + '&js_code=' + that.data.code + '&grant_type=authorization_code';

            util.requestGet(getOpenId, function (res) {
              //console.log(res.data.openid);
              var openId = res.data.openid;
              var orderId = orderData.id;
              var orderPrice = that.data.totalPrice;
              var orderTitle = that.data
              var productTitle = that.data.selectedProducts.product[0].product_title;
              var imgUrl = ["http://static.wantscart.com/product/1515599238814_750_1000"];
              console.log(fId);
              var paraterm = {
                "touser": openId,
                "template_id": 'QBN6bg4p-5kHIjvYcQWdBfTxjdRhWXQ6RBUKiNrD15s',
                "form_id": fId,
                "page": 'pages/WNTSProductdetailPage/WNTSProductdetailPage?subject={"product_imgs":imgUrl,"product_id":88490,"product_title":"adidas 春季新款三件套 外套+体恤+长裤 ","product_price":46600,"product_tag_price":149900,"shop_show":true}',
                "data": {
                  "keyword1": {
                    "value": orderId
                  },
                  "keyword2": {
                    "value": productTitle
                  },
                  "keyword3": {
                    "value": orderPrice + '元'
                  },
                  "keyword4": {
                    "value": '未支付，即将自动取消'
                  },
                  "keyword5": {
                    "value": '点击进入订单详情页完成支付'
                  }
                },
                "emphasis_keyword": true
              }
              // util.requestPost(paraterm, sendTempMessage, function (res) {
              //   console.log(paraterm);
              // });
            });


          })
        } else {
          //console.log('登录失败！' + res.errMsg)
        }
      }
    });
    that.setData({
      modalShow: getApp().globalData.modalTurn
    });

    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=0',
    })

  },
  /* 对话框确认按钮点击事件*/
  continue(e) {
    var that = this;
    // that.getOrder();
    wx.navigateTo({
      url: '../WNTSConfirmPaymentPage/WNTSConfirmPaymentPage' + "?orderData=" + that.data.json_str,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载vffffff
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})