// pages/WNTSSetting/WNTSSetting.js
var WNTSToken = require('../../vendor/wafer2-client-sdk/lib/WNTSToken.js');
var WNTSUserInfo = require('../../vendor/wafer2-client-sdk/lib/WNTSUserInfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
  },
  about() {
    wx.navigateTo({
      url: '../WNTSAbout/WNTSAbout',
    })
  },
  privacy() {
    wx.navigateTo({
      url: '../WNTSPrivacy/WNTSPrivacy',
    })
  },
  logout() {
    this.setData({
      showModal: true,
      dialog_title:'确定退出登录？',
      dialog_cancel:'取消',
      dialog_ok:'确定'

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
  /* 对话框确认按钮点击事件*/
  onConfirm: function () {
    this.hideModal();
    WNTSToken.clear();
    WNTSUserInfo.clear();
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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