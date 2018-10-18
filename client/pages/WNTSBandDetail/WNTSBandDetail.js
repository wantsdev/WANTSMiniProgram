var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    band_descp: '',
    band_img: '',
    entitySubjectList: null,
    randomBackgroundColor: [],
    subjectItem: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var subjectItem = JSON.parse(options.subjectItem);
    console.log(subjectItem);
    that.setData({
      subjectItem,
      randomBackgroundColor: ['#2F4C52', '#414D65', '#A3A093', '#8F5B56', '#DDE8DE', '#F2E6F7', '#D0F6F9', '#F4F6B6', '#EFADCD']
    });
    var themeId = subjectItem.themeId;
    var target_title = subjectItem.target_title;
    if (target_title) {
      wx.setNavigationBarTitle({
        title: target_title,
      })
    }
    util.requestGet('https://api.wantscart.com/subject/' + themeId, function (res) {
      console.log(res);
      var band_descp = res.data.descp;
      var band_img = res.data.imgs[0] || res.data.cover;
      that.setData({
        band_descp: band_descp,
        band_img: band_img
      });
      that.getEntityDataWithBand_target_id(themeId);
    });

  },
  band_descpBingLongTap(e) {
    console.log(e);
    var themeId = JSON.stringify(this.data.subjectItem.themeId);
    wx.showModal({
      title: '这都被你发现了😀',
      content: '这个主题的ID是' + themeId + ',复制？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.setClipboardData({
            data: themeId,
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '已复制',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //获取主题下边的商品列表
  getEntityDataWithBand_target_id(band_target_id) {
    var that = this;
    var entitySubjectList = [];
    util.requestGet(util.URL_ROOT + '/aggregator/' + band_target_id + '/41/entity?limit=100', function (res) {
      var dataList = res;
      for (var i = 0; i < dataList.data.length; i++) {
        var entity = {};
        var product = dataList.data[i].entity;
        console.log(product);
        entity.title_prefix_url_label = product.title_prefix_url_label;
        entity.imgs = product.imgs;
        entity.price = product.price;
        entity.small_img = product.small_img;
        entity.title = product.title;
        entity.tag_price = product.tag_price;
        entity.id = product.id;
        entity.total_stock = product.total_stock;
        entity.created = product.created;
        entitySubjectList.push(entity);
      };
      var temp = util.getGessLikeDataTool(entitySubjectList);
      that.setData({
        entitySubjectList: temp
      });
    })
  },
  columnClick: function (event) {
    var subject_product = event.currentTarget.dataset.subject;
    var subject_product_all = {};
    subject_product_all.product_imgs = subject_product.imgs;
    subject_product_all.product_id = subject_product.id;
    subject_product_all.product_title = util.stringWithAndCode(subject_product.title);
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
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
    var that = this;
    return {

      title: that.data.subjectItem.target_title,// 转发标题（默认：当前小程序名称）

      path: 'pages/WNTSBandDetail/WNTSBandDetail?subjectItem=' + JSON.stringify(that.data.subjectItem),// 转发路径（当前页面 path ），必须是以 / 开头的完整路径

      success(e) {

      },

      fail(e) {

      },

      complete() { }

    }
  }
})