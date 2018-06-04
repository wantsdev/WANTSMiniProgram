// pages/WNTSCreateOrderPage/WNTSCreateOrderPage.js
var util = require('../../utils/util.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var json_str;
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
    cancelOrder: false,
    fromTo: "",
    showModal: false,
    json_str: "",

    loadingHidden:true,
    iPhoneX:false



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
var that = this;
     // 获取设备信息
      wx.getSystemInfo({

        success: function (res) {
          if (res.screenHeight == 812) {
            that.setData({
              iPhoneX:true
            });
          }
        }
      })

    var selectedProducts = JSON.parse(options.selectedProducts);
    this.setData({
      selectedProducts
    });
    this.createOrder();
    this.getShoppingCartTotalPrice();
  },
  createOrder() {
    var that = this;
    util.requestMethodWithParaterm("GET", null, WNTSApi.adderssApi, function (res) {
      var data = res.data;
      var hasDefault = false;
      for (var i = 0; i < data.length; i++) {
        var address = data[i];
        if (address.def) {
          hasDefault = true;
          that.setData({
            currentAddress: address
          });
        }
      }
      if (!hasDefault && data.length > 0) {
        that.setData({
          currentAddress: data[0]
        });
      }

      // that.setData({
      //   address_list: data,
      // })
    });

  },
  getShoppingCartTotalPrice() {
    var that = this;
    let selectedProducts = this.data.selectedProducts;
    var selectedProduct_id_array = [];
    for (let i = 0; i < selectedProducts.length; i++) {
      selectedProduct_id_array.push(selectedProducts[i].id);
    }
    var url = "";
    if (selectedProducts[0].from == "productDetail") {
      url = WNTSApi.price_by_stockNewApi + "?stockId=" + selectedProducts[0].id + "&num=" + selectedProducts[0].num;
    } else {

      url = WNTSApi.shoppingCarPricetApi + "?order_product_id=" + selectedProduct_id_array;
    }

    util.requestMethodWithParaterm("GET", null, url, function (res) {
      var price = res.data.pay / 100;
      that.setData({
        totalPrice: price
      });
    });

  },
  //点击提交订单，到达“确认付款”界面
  submitOrderClick() {

    this.getOrder();

  },
  getOrder() {
    var that = this;
    var products = that.data.selectedProducts;
    var productidS = [];
    for (let i = 0; i < products.length; i++) {
      productidS.push(products[i].id);
    }
    if (productidS == null) return;
    if (!this.data.currentAddress) {
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

    paraterm.channel = "wx_lite";
    var orderData = {};
    that.setData({
      loadingHidden: false
    });

    util.requestMethodWithParaterm("POST", paraterm, url, function (res) {
      that.setData({
        loadingHidden: true
      });
      if (res.data.code) {
        wx.showToast({
          title: res.data.detail + "\t" + res.data.msg,
          icon: 'none'
        })
        return
      }
      var orderRes_Data = res.data;
      orderData.sum = orderRes_Data.sum / 100;
      orderData.pay = orderRes_Data.pay / 100;
      orderData.id = orderRes_Data.id;
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
    if (this.data.fromTo == "order") {
      wx.switchTab({
        url: '../WNTSShoppingCartPage/WNTSShoppingCartPage',
      })
      return
    }
    if (this.data.cancelOrder) {
      this.setData({
        showModal: true,
        dialog_title: '优惠不等人，商品一旦错过就不在了哦～',
        dialog_cancel: '残忍放弃',
        dialog_ok: '继续支付'
      })
    }
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
    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=0',
    })
  },

  /* 对话框确认按钮点击事件*/
  onConfirm: function () {
    var that = this;
    this.hideModal();
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
   * 生命周期函数--监听页面卸载
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