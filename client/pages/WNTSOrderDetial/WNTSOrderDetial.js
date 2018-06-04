// pages/WNTSOrderDetial/WNTSOrderDetial.js

var util = require('../../utils/util.js');
var orderId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: "",
    receiver_name: "",
    products: [],
    showModal: false,
    showPhoneModal: false,
    dialog_title: "",
    dialog_cancel: "",
    dialog_content: "",
    dialog_ok: "",
    phone: "4009933951",
    showBottom: false,//控制展示底部的操作栏
    showOpreation: false,//控制是否展示退换货操作栏
    bottomOpreationText1: "",
    bottomOpreationText2: "",
    bottomOpreationText3: "",
    showChange: "",
    dilaogType: "",
    expressData: null,
    sellerName: "",
    status_descp:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderId = options.orderId;
    this.getOrderDetail(orderId);
  },
  /**
     * 获取商户名称
     */
  getSellerName(providerId) {
    var that = this;
    util.requestGet(util.URL_ROOT + "/user/" + providerId, function (data) {
      that.setData({
        sellerName: data.name,
        phone: data.user_info.tel
      })
    }, function (data) {
      wx.showToast({
        title: data,
        icon: "none",
        duration: 2000
      })
    })
  },
  /**
   * 获取订单详情
   */
  getOrderDetail(orderId) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    util.requestGet(util.URL_GET_ORDER + orderId, function (data) {
      var creatTime = util.formatTime(new Date(data.created));
      var pay_time;
      if (data.pay_time == null) {
        pay_time = null;
      } else {
        pay_time = util.formatTime(new Date(data.pay_time));
      }
      var detailData;
      var showBottom = false;
      var showOpreation;
      var showChange = false;
      var bottomOpreationText1 = "";
      var bottomOpreationText2 = "";
      var bottomOpreationText3 = "";
      detailData = data;
      detailData.created_time = creatTime;
      detailData.pay_time = pay_time;
      switch (detailData.status) {
        case 10: // 待付款

          showBottom = true;
          showOpreation = false;
          bottomOpreationText1 = "取消订单";
          bottomOpreationText2 = "立即付款";
          break;
        case 30:
          if (detailData.express_company == 0) {//待发货
            if (detailData.express_id) {
              showBottom = true;
            }
            showOpreation = false;
            bottomOpreationText3 = "提醒发货"
          } else {//待收货
            if (detailData.express_id) {
              showBottom = true;
            }
            showChange = true;
            showOpreation = true;
            bottomOpreationText1 = "查看物流";
            bottomOpreationText2 = "确认收货";
          }
          break;
        case 35: //申请退款
          showOpreation = false;
          break;
        case 43:  //结束-申请退款
        case 44:  //结束-申请换货
          if (detailData.express_id) {
            showBottom = true;
          }
          showOpreation = false;
          bottomOpreationText1 = "";
          bottomOpreationText2 = "查看物流";
          break;
        case 40:  //结束
          if (detailData.express_id) {
            showBottom = true;
          }
          showChange = true;
          showOpreation = true;
          bottomOpreationText1 = "";
          bottomOpreationText2 = "查看物流";
          break;
        case 11: //完成付款，等待系统确认
        case 41: //结束-主动取消
        case 42:  //结束-异常取消
          showBottom = false;
          showOpreation = false;
          bottomOpreationText1 = "";
          bottomOpreationText2 = "";
          break;

      }
      if (detailData.express_id) {
        that.getExpressData(detailData.express_id);
      }
      that.setData({
        detailData,
        products: data.products,
        showOpreation,
        showBottom,
        showChange,
        bottomOpreationText1,
        bottomOpreationText2,
        bottomOpreationText3
      })
      if (!that.data.sellerName) {
        if (data.products.length == 1) {
          that.getSellerName(data.products[0].provider_id);
        } else {
          var same = true;
          var provider_id = data.products[0].provider_id;
          for (var a = 1; a < data.products.length; a++) {
            if (provider_id != data.products[a].provider_id) {
              same = false;
            }
          }
          if (!same) {
            that.setData({
              sellerName: "販賣東西",
              phone: "4009933951"
            })
          } else {
            that.getSellerName(provider_id);
          }
        }
      }
      wx.hideLoading();
    }, function (data) {
      wx.showToast({
        title: data,
        icon: "none",
        duration: 2000
      })
    })
  },

  /**获取物流信息 */
  getExpressData(express_id) {
    if (!express_id) return;
    var that = this;
    util.requestGet(util.URL_GET_LOGISTIC_DETAIL + express_id, function (data) {
      var expressData = data;
      if (data.details == null) {
        that.setData({
          expressData: null
        })
        return
      }
      if (data.details.length != 0) {
        expressData.created = util.formatTime(new Date(data.details[0].created));
        expressData.detail = data.details[0].context;
        that.setData({
          expressData: expressData
        })
      }
    }, function (data) {
      wx.showToast({
        title: data,
        icon: "none",
        duration: 2000
      })
    })
  },



  /**
   * 复制
   */
  copy_no: function (e) {
    var that = this;
    var no = JSON.stringify(e.currentTarget.dataset.no);
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

  service_phone(phone) {
    var phone = this.data.phone;
    var sellerName = this.data.sellerName;
    this.setData({
      dialog_title: "联系卖家",
      dialog_cancel: "取消",
      dialog_ok: "拨打",
      dialog_content: phone,
      showModal: true,
      dilaogType: "2"
    })
  },

  /*弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {
  },

  /* 隐藏模态对话框*/
  hideModal: function () {
    this.setData({
      showModal: false,
    });
  },

  /*对话框取消按钮点击事件*/
  onCancel: function () {
    this.hideModal();
  },

  /* 对话框确认按钮点击事件*/
  onConfirm: function (e) {
    var that = this;
    this.hideModal();
    var dilaogType = this.data.dilaogType;
    if (dilaogType == "1") {
      var url = util.URL_ROOT + "/order/" + orderId + "/cancel"
      util.requestPut(url, function (data) {
        if (data.code == "1") {
          that.getOrderDetail(orderId);
        }
      }, function (data) {
        wx.showToast({
          title: data,
          icon: "none",
          duration: 2000
        })
      });
    } else {
      var phone = that.data.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
        }
      })
    }
  },

  /* 弹窗 */
  opreation_1(e) {
    var text = e.currentTarget.dataset.text;
    if (text == "查看物流") {
      this.viewExpress();
    } else if (text == "取消订单") {
      this.cancleOrder();
    }

  },
  opreation_2(e) {
    var text = e.currentTarget.dataset.text;
    if (text == "查看物流") {
      this.viewExpress();
    } else if (text == "确认收货") {
      this.confirmOrder(this.data.detailData.id);
    } else if (text == "立即付款") {
      util.pay(this.data.detailData.id,
        function () {
          wx.showToast({
            title: '支付成功',
            icon: "success",
            duration: 2000
          })
        }, function () {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 2000
          })
        }, function () {
          wx.showToast({
            title: '取消支付',
            icon: "none",
            duration: 2000
          })
        });
    }
  },

  //查看物流
  viewExpress() {
    var expressId = this.data.detailData.express_id;
    var goodsImg = this.data.detailData.products[0].product_img;
    var goodsTitle = this.data.detailData.products[0].product_title;
    var list = this.data.detailData.products;
    var goodsNum = 0;
    for (var i = 0; i < list.length; i++) {
      goodsNum += list[i].num;
    }
    this.getExpress(expressId, goodsNum, goodsImg, goodsTitle);

  },

  //取消订单
  cancleOrder() {
    this.setData({
      dialog_title: "确定取消订单吗？",
      dialog_cancel: "取消",
      dialog_ok: "确定",
      dialog_content: "",
      showModal: true,
      dilaogType: "1",
    })
  },
  //查看物流
  getExpress(expressId, goodsNum, goodsImg, goodsTitle) {
    wx.navigateTo({
      url: '../WNTSExpress/WNTSExpress?expressId=' + expressId + '&goodsNum=' + goodsNum + '&goodsImg=' + goodsImg + '&goodsTitle=' + goodsTitle,
    })
  },
  // 确认收货
  confirmOrder(orderId) {
    util.requestPut(util.URL_GET_ORDER + orderId + "/received", function (data) {
    }, function (data) {
      wx.showToast({
        title: data,
        icon: "none",
        duration: 2000
      })
    })
  },
  //点击商品跳转到商品详情
  goods_item(e) {
    var subject_product = e.currentTarget.dataset.item;
    var subject_product_all = {};
    var imgs = [];
    imgs.push(subject_product.product_img);
    subject_product_all.product_imgs = imgs;

    subject_product_all.product_id = subject_product.product_id;
    subject_product_all.product_title = subject_product.product_title;
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