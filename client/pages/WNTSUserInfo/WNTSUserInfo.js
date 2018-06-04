const userId = "1001269"
const util = require('../../utils/util.js');
var WNTSToken = require("../../vendor/wafer2-client-sdk/lib/WNTSToken.js");
var WNTSUserInfo = require("../../vendor/wafer2-client-sdk/lib/WNTSUserInfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    payNum: "0",
    sendNum: "0",
    reciviedNum: "0",
    userInfo: null,
    guessLike: [],
    offset: 0,
    page: 0,
    limit: 15,
    loadMoreBool: true,
    winWidth: 0,
    winHeight: 0,
    randomBackgroundColor:[]
  },

  /**设置 */
  opration_setting: function () {
    wx.navigateTo({
      url: '../WNTSSetting/WNTSSetting',
    })
  },

  /**个人信息 */
  go_personInfo: function (e) {
    var userInfo = e.currentTarget.dataset.userinfo;
    var tourl = "";
    if (userInfo) {
      tourl = "?userInfo=" + JSON.stringify(userInfo);
    }
    wx.navigateTo({
      url: '../WNTSPersonInfo/WNTSPersonInfo' + tourl,
    })

  },

  /**我的订单 */
  go_order: function () {
    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=3',
    })
  },

  /**
   * 待付款
   */
  go_pay: function () {
    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=0',
    })
  },

  /**
   * 待发货
   */
  go_send: function () {
    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=1',
    })
  },

  /**
   * 待收货
   */
  go_recived: function () {
    wx.navigateTo({
      url: '../WNTSOrder/WNTSOrder?tab=2',
    })
  },

  /**收货地址 */
  util_address: function () {
    wx.navigateTo({
      url: '../WNTSAddressManager/WNTSAddressManager',
    })
  },

  /**
   * 浏览记录
   */
  util_history: function () {
    wx.navigateTo({
      url: '../WNTSHistory/WNTSHistory',
    })
  },

  /**
    * 我的收藏
    */
  util_cell: function () {
    var userInfo = WNTSUserInfo.get();
    wx.navigateTo({
      url: '../WNTSCell/WNTSCell?userId=' + userInfo.id,
    })
  },

  /*商家入驻 */
  util_enter: function () {
    wx.navigateTo({
      url: '../WNTSSellerEnter/WNTSSellerEnter',
    })
  },

  /*
   *关于我们
   */
  util_about: function () {
    wx.navigateTo({
      url: '../WNTSAbout/WNTSAbout',
    })
  },

  /* 弹窗 */
  util_phone: function () {
    this.setData({
      showModal: true
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
    wx.makePhoneCall({
      phoneNumber: '4009933951',
      success: function () {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 
     * 获取系统信息 
     */
    var that = this;
    that.setData({
      randomBackgroundColor:['#2F4C52','#414D65','#A3A093','#8F5B56','#DDE8DE','#F2E6F7','#D0F6F9','#F4F6B6','#EFADCD']
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.getGussLikeData();
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=6&offset=' + that.data.offset + '&limit=15',
      function (data) {
        var temp = util.getGessLikeDataTool(data);
        if (data.length == 0) {
          that.setData({
            loaddingContext: "没有更多啦～"
          });
        };
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
  showErrorDialog(data) {
    wx.showToast({
      title: data,
      icon: "none",
      duration: 2000
    });
  },
  //上拉加载
  loadMore() {
    var loadMoreBool = true;
    var that = this;
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
      that.getGussLikeData();
    } else {
      loadType = 1 << 0;//1 refresh
      offset = 0;

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
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      var userInfo = WNTSUserInfo.get();
      if (userInfo.id) {
        that.setData({
          userInfo
        });
        util.requestGet(util.URL_GET_USER + userInfo.id,
          function (data) {
            that.setData({
              userInfo: data,
            });
          }, function (data) {
            that.showErrorDialog(data);
          })

      } else {

      }

      // 获取订单数量
      util.requestGet(util.URL_GET_ORDER_NUM,
        function (data) {
          that.setData({
            payNum: data.pre_pay_order_count,
            sendNum: data.wait_shipment_order_count,
            reciviedNum: data.wait_taking_delivery_order_count
          });
        }, function (data) {
          that.showErrorDialog(data);
        })
    }, function (isNotLogin) {
      wx.redirectTo({
        url: '../WNTSLoginPage/WNTSLoginPage?fromTo=' + "user",
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