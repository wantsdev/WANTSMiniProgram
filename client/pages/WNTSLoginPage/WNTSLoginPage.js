// pages/WNTSLoginPage/WNTSLoginPage.js
var login = require('../../vendor/wafer2-client-sdk/lib/login.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var WNTSToken = require('../../vendor/wafer2-client-sdk/lib/WNTSToken.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo: null,
    screenHeight: 0,
    screenWidth: 0,
    iphoneX: false,
    fromTo: "",
    closeHiden: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.fromTo){
      that.setData({
        fromTo: options.fromTo
      })
    }
    that.getSystemInfo();
    if (options.fromTo == "productDetail") {
      that.setData({
        closeHiden: true
      });

    }

  },
  /** 
  * 获取系统信息 
  */
  getSystemInfo() {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        var isIphone = (res.model == "iPhone X");
        var screenHeight = 0;
        if (isIphone) {
          screenHeight = res.screenHeight - (20 + 44 + 49);
        } else {
          screenHeight = res.screenHeight;
        }
        that.setData({
          SystemInfo: res,
          screenHeight: res.windowHeight,
          screenWidth: res.screenWidth,
          iphoneX: isIphone
        });
      }
    });
  },
  wxloginClick() {
    var that = this;
    var options = {
      method: "POST",
      loginUrl: WNTSApi.mainUrl + WNTSApi.loginApi,
    };
    options.success = function (response) {
      if (WNTSToken.get()) {
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
        var fromTo = that.data.fromTo;
        if (fromTo == "cart") { //跳转购物车
          setTimeout(function () {
            wx.switchTab({
              url: '../WNTSShoppingCartPage/WNTSShoppingCartPage',
            });
          }, 1000)
        } else if (fromTo == "user") { //跳转我的
          setTimeout(function () {
            wx.switchTab({
              url: '../WNTSUserInfo/WNTSUserInfo',
            });
          }, 1000)
        } else if (fromTo == 'productDetail' || fromTo == "") { //跳转商品详情
          setTimeout(function () {
            wx.navigateBack();
          }, 1000)
        }
        return;
      }
    },
      options.fail = function (error) {
      },
      login.login(options);
  },
  //手机号码登录
  phoneNumloginClick() {
  },
  wxclose() {
    var that = this;
    var fromTo = that.data.fromTo;
    if (fromTo == "cart" || fromTo == "user") { 
      wx.switchTab({
        url: '../WNTSHomePage/WNTSHomePage',
      });
    } else if (fromTo == 'productDetail' || fromTo == "") { 
      wx.navigateBack();
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