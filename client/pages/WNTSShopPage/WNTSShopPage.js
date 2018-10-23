var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seller_detail: [],
    share_seller_detail: null,
    seller_name: '',
    seller_head: '',
    seller_id: '',
    offset: 0,
    page: 0,
    limit: 16,
    loadMoreBool: true,
    randomBackgroundColor: [],
    sendmessagepath: '',
    url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wants'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    var seller_detail_all = option.seller_detail;

    that.setData({
      sendmessagepath: '../WNTSShopPage/WNTSShopPage?seller_detail=' + seller_detail_all,
      randomBackgroundColor: ['#2F4C52', '#414D65', '#A3A093', '#8F5B56', '#DDE8DE', '#F2E6F7', '#D0F6F9', '#F4F6B6', '#EFADCD']
    });
    seller_detail_all = JSON.parse(seller_detail_all);
    that.setData({
      seller_name: seller_detail_all.seller_name,
      seller_head: seller_detail_all.seller_head,
      seller_id: seller_detail_all.seller_id,
      share_seller_detail: option.seller_detail
    });
    that.getSellerProducts();
  },
  connectSellerMsg(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家
      that.setData({
        showModal: true,
        dialog_title: '请下载APP与商家客服沟通',
        dialog_cancel: '残忍放弃',
        dialog_ok: '我要下载'
      })
    }, function (isNotLogin) {
      that.toLogin();
    });
  },
  serviceMsg(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家
    }, function (isNotLogin) {
      wx.navigateTo({
        url: '../WNTSLoginPage/WNTSLoginPage'
      })
    });
  },
  getSellerProducts() {
    var that = this;
    var seller_detail = that.data.seller_detail;
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
    util.requestGet(util.URL_ROOT + '/product/seller/' + that.data.seller_id + '?offset=' + that.data.offset + '&limit=' + that.data.limit, function (data) {
      wx.stopPullDownRefresh();
      if (!data.data.length) {
        that.setData({
          loaddingContext: "没有更多啦～"
        });
        return

      }
      var temp = util.getGessLikeMoreDataTool(data.data);
      seller_detail = seller_detail.concat(temp);
      that.setData({
        seller_detail: seller_detail
      });
    });
  },
  //上拉加载
  loadMore() {
    var that = this;
    var loadType = 0;//none
    var offset = 0;
    var newPage = that.data.page;
    newPage++;
    loadType = 1 << 1;//2 loadmore
    offset = newPage * that.data.limit;
    that.setData({
      page: newPage,
      offset: offset,
    });
    that.getSellerProducts();
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
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家
      that.setData({
        hasLogin: true
      })
    }, function (isNotLogin) {
      that.setData({
        hasLogin: false
      })
    });
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
    this.setData({
      page: 0,
      offset: 0
    });
    this.getSellerProducts();
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
    var that = this;
    return {

      title: that.data.seller_name,// 转发标题（默认：当前小程序名称）

      path: 'pages/WNTSShopPage/WNTSShopPage?seller_detail=' + that.data.share_seller_detail,// 转发路径（当前页面 path ），必须是以 / 开头的完整路径

      success(e) {

      },

      fail(e) {

      },

      complete() { }

    }
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
    wx.setClipboardData({
      data: that.data.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '下载链接已复制',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  }
})