// pages/WNTSPaySuccessPage/WNTSPaySuccessPage.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    winWidth: 0,
    winHeight: 0,
    offset: 0,
    page: 0,
    limit: 15,
    loadMoreBool: true,
    guessLike: [],
    fromTo: "",
    orderId: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 
     * 获取系统信息 
     */
    var that = this;
    var orderId = options.orderId;
    that.setData({
      orderId: orderId
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
    that.getGussLikeData(orderId);

  },
  //逛一逛
  go_shop() {
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage',
    });
  },
  /**全部的订单 */
  go_order: function () {
    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=3',
    })
  },
  //item点击跳转商品详情
  goods_item(e) {
    var subject_product = e.currentTarget.dataset.item.target;
    var subject_product_all = {};
    subject_product_all.product_imgs = subject_product.imgs;
    subject_product_all.product_id = subject_product.id;
    subject_product_all.product_title = subject_product.title;
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    var json_string = JSON.stringify(subject_product_all);
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + json_string
    })

  },

  //猜你喜欢获取数据
  getGussLikeData(orderId) {
    var that = this;
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=3&offset='
      + that.data.offset + '&limit=15&orderId=' + orderId,
      function (data) {
        var temp = util.getGessLikeDataTool(data);
        guessLike = guessLike.concat(temp);
        that.setData({
          guessLike: guessLike
        });
      }, function (data) {

      });
  },

  //猜你喜欢item 点击
  guessLike_item(e) {
    var subject_product = e.currentTarget.dataset.item;
    var subject_product_all = {};
    subject_product_all.product_imgs = subject_product.imgs;
    subject_product_all.product_id = subject_product.id;
    subject_product_all.product_title = subject_product.title;
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    var json_string = JSON.stringify(subject_product_all);
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + json_string
    })
  },



  //上拉加载
  loadMore() {
    var that = this;
    var loadMoreBool = that.data.loadMoreBool;
    var loadType = 0;//none
    var offset = 0;
    if (loadMoreBool) {
      var newPage = that.data.page;
      newPage++;
      loadType = 1 << 1;//2 loadmore
      offset = newPage * that.data.limit;
      that.setData({
        page: newPage,
        offset: offset,
      });

      that.getGussLikeData(that.data.orderId);

    } else {
      that.setData({
        loadMoreBool: false
      })
      wx.showToast({
        title: '没有更多数据啦～',
        icon: 'none'
      })
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
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})