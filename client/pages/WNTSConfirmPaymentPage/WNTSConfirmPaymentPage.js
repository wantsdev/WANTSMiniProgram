var util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
    debug: false,
    iPhoneX:false,
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
    var orderData = JSON.parse(options.orderData);
    this.setData({
      orderData
    });
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];//当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      cancelOrder: true,
      json_str: options.orderData
    })
  },
  //调起微信支付
  wechatPayClick(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    util.pay(orderId, function () {
      wx.showToast({
        title: '支付成功',
        icon: "success",
        duration: 2000
      })
      //告诉WANTS服务器付款成功
      util.requestGet(util.URL_ROOT + '/order/' + orderId + '/paied',
        function (success) {
        }, function (fail) {
        });
      //跳转支付成功界面
      wx.navigateTo({
        url: '../WNTSPaySuccessPage/WNTSPaySuccessPage?orderId=' + orderId
      })

    }, function () {
      wx.showToast({
        title: '支付失败',
        icon: "none",
        duration: 2000
      })
      if (that.data.debug) {
        //跳转支付成功界面
        wx.navigateTo({
          url: '../WNTSPaySuccessPage/WNTSPaySuccessPage?orderId=' + orderId
        })
      }


    }, function () {
      wx.showToast({
        title: '取消支付',
        icon: "fail",
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