// pages/WNTSPersonInfo/WNTSPersonInfo.js
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    sex: "",
    nick: "",
    head: "",
    userId: "",
    userInfo: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = JSON.parse(options.userInfo);
    if (userInfo) {
      that.setData({
        userInfo
      });
    }
    var userID = that.data.userInfo.id;
    //获取用户信息
    util.requestGet(util.URL_GET_USER + userID,
      function (data) {

        that.setData({

          userInfo: data,
          sex: data.gender == 1 ? "男" : "女",

        });
      }, function (data) {
        wx.showToast({
          title: data,
          icon: "none",
          duration: 2000
        })
      })
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