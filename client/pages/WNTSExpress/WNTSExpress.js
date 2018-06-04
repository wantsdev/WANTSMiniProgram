// pages/WNTSExpress/WNTSExpress.js
var util = require('../../utils/util.js');
var UrlRoot = util.URL_ROOT;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressData: null,
    expressList: null,
    goodsTitle: "",
    goodsImg: "",
    goodsNum: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var express_id = options.expressId;
    var goodsTitle = options.goodsTitle;
    var goodsNum = options.goodsNum;
    var goodsImg = options.goodsImg;
    this.getExpressDetail(express_id);
    this.setData({
      goodsTitle: goodsTitle,
      goodsNum: goodsNum,
      goodsImg: goodsImg,
    })
  },

  /**
   * 获取物流详情
   */
  getExpressDetail(express_id) {
    var that = this;
    util.requestGet(UrlRoot + "/express/" + express_id,
      function (data) {
        if (data.code) {
          return
        }
        var expressList = data.details;
        var tempList =[];
        for (var i = 0; i < expressList.length; i++) {
          expressList[i].date_hour = expressList[i].time.split(' ')[0];
          expressList[i].date_time = expressList[i].time.split(' ')[1];
        }
        that.setData({
          expressData: data,
          expressList: expressList,
        })
      }, function (data) {
        wx.showToast({
          title: data,
          icon: "none",
          duration: 2000
        })
      })
  },

  copy(e) {
    var that = this;
    var no = e.currentTarget.dataset.no;
    wx.setClipboardData({
      data: no,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          success: function (res) {
          }
        })
      }
    })
  },
  //底部操作栏
  opreation_1(e) {
  },

  opreation_2(e) {
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