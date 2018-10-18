var util = require('../../utils/util.js');
var current_product_info_arr = getApp().globalData.current_product_info_arr;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    hotwords: [],
    value_key: '',
    current_product_info_arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.keywoeds) {
      var keywoeds = options.keywoeds;
      that.setData({
        value_key: keywoeds
      });
      util.requestGet(util.URL_ROOT + '/product/w/' + keywoeds, function (res) {
        var data = res.data;
        current_product_info_arr = [];
        for (var i = 0; i < data.length; i++) {
          var current_product_info = {};
          current_product_info.title_prefix_url_label = data[i].title_prefix_url_label;
          current_product_info.price = data[i].price;
          current_product_info.tag_price = data[i].tag_price;
          current_product_info.imgs = data[i].imgs;
          current_product_info.id = data[i].id;
          current_product_info.title = data[i].title;
          current_product_info.discount_info = data[i].discount_info;
          current_product_info.promotion = data[i].promotion;
          current_product_info.promotion_id = data[i].promotion_id;
          current_product_info.promotion_label = data[i].promotion_label;
          current_product_info.promotional = data[i].promotional;
          current_product_info_arr.push(current_product_info);
        };
        that.setData({
          current_product_info_arr: current_product_info_arr
        });
      });
    } else {
      that.setData({
        current_product_info_arr: []
      });
      util.requestGet(util.URL_ROOT + '/config?key=search_hotwords', function (res) {
        var data = res.data;
        var hotwords = data[0];
        that.setData({
          hotwords: hotwords
        });
      })
    };
  },

  hot_tap_touch: function (e) {
    var that = this;
    var current_hot_word = e.currentTarget.dataset.hot_word;
    that.setData({
      value_key: current_hot_word
    });
    util.requestGet(util.URL_ROOT + '/product/w/' + current_hot_word, function (res) {
      console.log(util.URL_ROOT + '/product/w/' + current_hot_word);
      var data = res.data;
      getApp().current_product_info_arr = [];
      for (var i = 0; i < data.length; i++) {
        var current_product_info = {};
        current_product_info.title_prefix_url_label = data[i].title_prefix_url_label;
        current_product_info.price = data[i].price;
        current_product_info.tag_price = data[i].tag_price;
        current_product_info.imgs = data[i].imgs;
        current_product_info.id = data[i].id;
        current_product_info.title = data[i].title;
        current_product_info.discount_info = data[i].discount_info;
        current_product_info.promotion = data[i].promotion;
        current_product_info.promotion_id = data[i].promotion_id;
        current_product_info.promotion_label = data[i].promotion_label;
        current_product_info.promotional = data[i].promotional;
        current_product_info_arr = getApp().current_product_info_arr;
        current_product_info_arr.push(current_product_info);
      };
      that.setData({
        current_product_info_arr: current_product_info_arr
      });
    })
  },

  searchProduct: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  search_start: function (e) {
    var that = this;
    var current_hot_word = e.detail.value;
    util.requestGet(util.URL_ROOT + '/product/w/' + current_hot_word, function (res) {
      var data = res.data;
      getApp().current_product_info_arr = [];
      for (var i = 0; i < data.length; i++) {
        var current_product_info = {};
        current_product_info.title_prefix_url_label = data[i].title_prefix_url_label;
        current_product_info.price = data[i].price;
        current_product_info.tag_price = data[i].tag_price;
        current_product_info.imgs = data[i].imgs;
        current_product_info.id = data[i].id;
        current_product_info.title = data[i].title;
        current_product_info.discount_info = data[i].discount_info;
        current_product_info.promotion = data[i].promotion;
        current_product_info.promotion_id = data[i].promotion_id;
        current_product_info.promotion_label = data[i].promotion_label;
        current_product_info.promotional = data[i].promotional;
        getApp().current_product_info_arr.push(current_product_info);
      };
      if (getApp().current_product_info_arr.length == 0) {
        wx.showToast({
          title: '没有搜索到相关商品，试试其他的吧',
          duration: 1500,
          icon: 'none'
        })
      };
      that.setData({
        current_product_info_arr: getApp().current_product_info_arr
      });
    })
  },

  search_back: function (e) {
    var that = this;
    getApp().current_product_info_arr = [];
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage'
    })
  },

  search_subject_touch: function (e) {
    var that = this;
    var search_subject = e.currentTarget.dataset.search_subject;
    var search_subject_all = {};
    search_subject_all.title_prefix_url_label = search_subject.title_prefix_url_label;
    search_subject_all.product_imgs = search_subject.imgs;
    search_subject_all.product_id = search_subject.id;
    search_subject_all.product_title = search_subject.title;
    search_subject_all.product_price = search_subject.price;
    search_subject_all.product_tag_price = search_subject.tag_price;
    search_subject_all.promotion = search_subject.promotion;
    search_subject_all.promotion_id = search_subject.promotion_id;
    search_subject_all.promotion_label = search_subject.promotion_label;
    search_subject_all.promotional = search_subject.promotional;
    var json_string = JSON.stringify(search_subject_all);
    json_string = util.stringWithAndCode(json_string);
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