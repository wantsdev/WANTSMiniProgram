// pages/WNTSAddressManager/WNTSAddressManager.js
var util = require("../../utils/util.js");
var addressId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    showSelected: false,
    refresh: false,
    showModal: false,
    deleteAddressId: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    addressId = options.addressId;
    this.loadData();
  },

  loadData() {
    var that = this;
    var showSelected = false;
    if (addressId) {
      showSelected = true;
      wx.setNavigationBarTitle({
        title: '选择收货地址',
      })
    } else {
      showSelected = false;
      wx.setNavigationBarTitle({
        title: '收货地址',
      })
    }
    util.requestGet(util.URL_GET_ADDRESS,
      function (data) {
        var addressList = data;
        if (addressId) {
          for (var i = 0; i < addressList.length; i++) {
            if (addressList[i].id == addressId) {
              addressList[i].selected = true;
            }
          }
        }
        that.setData({
          addressList: addressList,
          showSelected: showSelected
        })

      }, function (data) {
        wx.showToast({
          title: data.errorMsg,
          mask: true
        })
      })
  },


  addressSelect(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];//当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      currentAddress: e.currentTarget.dataset.item
    })
    wx.navigateBack();

  },
  // 编辑地址
  address_edit(e) {
    var addressData = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../WNTSCreatAddress/WNTSCreatAddress?addressData=' + addressData,
    })
  },
  // 新增地址
  add_address() {
    wx.navigateTo({
      url: '../WNTSCreatAddress/WNTSCreatAddress',
    })
  },

  //删除 弹窗询问
  address_detel(e) {
    this.setData({
      showModal: true,
      deleteAddressId: e.currentTarget.dataset.item.id,
      dialog_title: "确定删除地址吗？",
      dialog_cancel: "取消",
      dialog_ok: "确定"
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
    var that = this;
    this.hideModal();
    var url = util.URL_ROOT + "/user/address/" + this.data.deleteAddressId;
    util.requestDelete(url, function (res) {
      if (res.code == 1) {
        that.loadData();
      }
    }, function (res) {
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
    var refresh = this.data.refresh;
    var that = this; 
    if (refresh) {
      util.requestGet(util.URL_GET_ADDRESS,
        function (data) {
          var addressList = data;
          that.setData({
            addressList: addressList,
          })

        }, function (data) {
          wx.showToast({
            title: data.errorMsg,
            mask: true
          })
        })
    }

  },

  /**
   * 
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