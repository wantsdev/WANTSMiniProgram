// pages/WNTSHistory/WNTSHistory.js
var util = require('../../utils/util.js');
var WNTSUserInfo = require("../../vendor/wafer2-client-sdk/lib/WNTSUserInfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    showNoData: false,
    winWidth: 0,
    winHeight: 0,
    offset: 0,
    page: 0,
    limit: 16,
    loadMoreBool: true,
    guessLike: []
  },
  /**
   * 获取浏览历史列表
   */
  loadHistoryData() {
    var that = this;
    var offset = that.data.offset;
    var tempList;

    // 用于下拉刷新重置 数据
    if (offset == 0) {
      tempList = [];
    } else {
      tempList = that.data.dataList;
    }

    util.requestGet(util.URL_GET_HISTORY + '?limit=16&offset=' + offset,
      function (data) {
        console.log(data);
        var size = data.data.length;
        var showNoData = (size <= 0);
        if (showNoData) {
          that.getGussLikeData();
        }
        for (var i = 0; i < data.data.length; i++) {
          var subject_product = data.data[i].target;
          console.log(subject_product);
          var subject_product_all = that.simpleData(subject_product);
          tempList.push(subject_product_all);
        }
        that.setData({
          dataList: tempList,
          showNoData: showNoData
        })
        console.log(that.data.dataList);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }, function (data) {
        wx.showToast({
          title: data.data,
          icon: "none",
          duration: 2000
        })
        wx.stopPullDownRefresh();
      })
  },

  simpleData(subject_product) {
    var subject_product_all = {};
    var tip_background;
    var tip_icon;
    var tips;
    var showTips;
    var currentTime = Date.parse(new Date());
    var twoDayTime = 48 * 3600 * 1000;
    var time = currentTime - subject_product.created;
    var showTips = false;
    subject_product_all.imgs = subject_product.imgs;
    subject_product_all.id = subject_product.id;
    subject_product_all.title = subject_product.title;
    subject_product_all.price = subject_product.price;
    subject_product_all.tag_price = subject_product.tag_price;
    subject_product_all.small_img = subject_product.small_img;
    subject_product_all.discount_info = subject_product.discount_info;
    subject_product_all.title_prefix_url_label = subject_product.title_prefix_url_label;
    if (subject_product.total_stock < 500 & subject_product.total_stock > 0) {
      showTips = true;
      tips = "仅剩" + subject_product.total_stock + "件";
      tip_background = "../WANTSImages/discount_icon_red.png";
      tip_icon = "../WANTSImages/discount_icon_clock.png";
    } else if (time <= twoDayTime) {
      showTips = true;
      tips = "最新潮品";
      tip_background = "../WANTSImages/discount_icon_blue.png";
      tip_icon = "../WANTSImages/discount_icon_new.png";
    }

    var rateDouble = subject_product.price / subject_product.tag_price;
    var rate = rateDouble * 100;
    var discount = rate / 10;
    if (discount <= 2) {
      showTips = true;
      tip_background = "../WANTSImages/discount_icon_yellow.png";
      tip_icon = "../WANTSImages/discount_icon_tips.png";
      if (discount < 1) {
        tips = "限0.1折";
      } else {
        if (parseInt(discount.toFixed(1).split(".")[1]) == 0) {
          tips = "限" + discount.toFixed(1).split(".")[0] + "折";
        } else {
          tips = "限" + discount.toFixed(1) + "折";
        }
      }
    }
    subject_product_all.tip_background = tip_background;
    subject_product_all.tip_icon = tip_icon;
    subject_product_all.tips = tips;
    subject_product_all.showTips = showTips;

    return subject_product_all;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var userInfo = WNTSUserInfo.get();
    // if (userInfo.id == 1155855) {
    //   if (options.source == undefined) {
    //   }else{
    //      var source = options.source;
    //     wx.showToast({
    //       title: source,
    //       duration: 1500,
    //       icon: 'none'
    //     });
    //   }
    // }
    // return;
    /** 
     * 获取系统信息 
     */
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    this.loadHistoryData();

  },
  //逛一逛
  go_shop() {
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage',
    });
  },
  //item点击跳转商品详情
  goods_item(e) {
    var subject_product = e.currentTarget.dataset.item;
    var subject_product_all = {};
    console.log(subject_product);
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
  //猜你喜欢获取数据
  getGussLikeData() {
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=7&offset=' + that.data.offset + '&limit=16',
      function (data) {
        var temp = util.getGessLikeDataTool(data.data);
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
    subject_product_all.product_title = util.stringWithAndCode(subject_product.title);
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    var json_string = JSON.stringify(subject_product_all);
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + json_string
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
    var that = this;
    that.setData({
      offset: 0,
      loadMoreBool: true,
    })
    this.loadHistoryData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var loadMoreBool = that.data.loadMoreBool;
    var offset = 0;
    if (loadMoreBool) {
      var newPage = that.data.page;
      newPage++;
      offset = newPage * that.data.limit;
      that.setData({
        page: newPage,
        offset: offset,
      });
      if (that.data.showNoData) {
        that.getGussLikeData();
      } else {
        that.loadHistoryData();
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})