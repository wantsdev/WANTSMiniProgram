// pages/WNTSOrderDetial/WNTSOrderDetial.js

var util = require('../../utils/util.js');
var orderId;
var createds;
var h;
var m;
var s;
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
    showBottom: false, //控制展示底部的操作栏
    showOpreation: false, //控制是否展示退换货操作栏
    bottomOpreationText1: "",
    bottomOpreationText2: "",
    bottomOpreationText3: "",
    showChange: "",
    dilaogType: "",
    expressData: null,
    sellerName: "",
    iPhoneX: false,
    status_descp: "",
    url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wants',
    page: 0,
    limit: 16,
    offset: 0,
    iPhoneX: false,
    guessLike: [],
    createdTime: 0,
    currentTime: 0,
    Loadingtime: '',
    showLoadingTime: true,
    hour: '00',
    min: '00',
    second: '00',
    prepayCardTimeText: '',
    endTimesOne: true,
    endTimesTwo: false,
    orderStatusDescp: '',
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var currentTimes = new Date();
    var prepayCardTimeText;
    orderId = options.orderId;
    createds = parseInt(options.created);
    var orderStatusDescp = options.status_descp;
    var endTimes = (createds + 2 * 60 * 60 * 1000) - currentTimes;
    that.setData({
      orderStatusDescp,
      orderId
    });
    if (endTimes <= 0) {
      that.setData({
        showLoadingTime: false
      })
    };
    this.getOrderDetail(orderId);

    // 获取设备信息
    wx.getSystemInfo({
      success: function (res) {
        if (res.screenHeight == 812) {
          that.setData({
            iPhoneX: true
          });
        }
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          Loadingtime: setInterval(function () {
            var currentTime = new Date();
            var endTime = (that.data.createdTime + 2 * 60 * 60 * 1000) - currentTime;
            if (endTime > 0) {
              h = (parseInt(endTime / 1000 / 3600) < 10) ? ('0' + parseInt(endTime / 1000 / 3600)) : (parseInt(endTime / 1000 / 3600));
              m = (parseInt((endTime - h * 1000 * 3600) / 1000 / 60) < 10) ? ('0' + parseInt((endTime - h * 1000 * 3600) / 1000 / 60)) : (parseInt((endTime - h * 1000 * 3600) / 1000 / 60));
              s = (parseInt((endTime - h * 1000 * 3600 - m * 1000 * 60) / 1000) < 10) ? ('0' + parseInt((endTime - h * 1000 * 3600 - m * 1000 * 60) / 1000)) : (parseInt((endTime - h * 1000 * 3600 - m * 1000 * 60) / 1000));
              that.setData({
                hour: h,
                min: m,
                second: s
              });
            } else {
              that.setData({
                endTimesOne: false,
                endTimesTwo: true
              });
            }
          }, 1000),
        });
      }
    });
    //util.timestampToTime();
    that.getGussLikeData();
  },
  // })
  // },
  // getTime(time,that){
  //   return function(){
  //     that._getTime(time,that);
  //   }
  // },
  // _getTime(time,that){
  // },
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
  loadMore() {
    var loadMoreBool = true;
    var that = this;
    var loadType = 0; //none
    var offset = 0;
    that.setData({
      guessLikeTitle: '猜你喜欢'
    });
    if (loadMoreBool) {
      var newPage = that.data.page;
      newPage++;
      offset = newPage * that.data.limit;
      that.setData({
        page: newPage,
        offset: offset,
      });

      that.getGussLikeData();

    } else {
      offset = 0;

    }
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=9&orderId=' + orderId + '&offset=' + that.data.offset +
      '&limit=' + that.data.limit,
      function (res) {
        var temp = util.getGessLikeMoreDataTool(res.data);
        if (res.data.length == 0) {
          that.setData({
            loaddingContext: "没有更多啦～"
          });
        };
        guessLike = guessLike.concat(temp);
        that.setData({
          guessLike: guessLike
        });
      },
      function (data) {

      });
  },

  /**
   * 获取商户名称
   */
  getSellerName(providerId) {
    var that = this;
    util.requestGet(util.URL_ROOT + "/user/" + providerId, function (data) {
      console.log(data.data.name);
      that.setData({
        sellerName: data.data.name
        // phone: data.data.user_info.tel
      })
      console.log(that.data.sellerName);
    }, function (data) {
      wx.showToast({
        title: data.data,
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
      var creatTime = util.formatTime(new Date(data.data.created));
      var created = data.data.created;
      var pay_time;
      if (data.data.pay_time == null) {
        pay_time = null;
      } else {
        pay_time = util.formatTime(new Date(data.data.pay_time));
      }
      var detailData;
      var showBottom = false;
      var showOpreation;
      var showChange = false;
      var bottomOpreationText1 = "";
      var bottomOpreationText2 = "";
      var bottomOpreationText3 = "";
      var payStatus = "";
      detailData = data.data;
      detailData.created_time = creatTime;
      detailData.pay_time = pay_time;
      that.setData({
        createdTime: created
      });

      switch (detailData.status) {
        case 10: // 待付款

          showBottom = true;
          showOpreation = false;
          bottomOpreationText1 = "取消订单";
          bottomOpreationText2 = "立即付款";
          payStatus = '需付金额';
          break;
        case 30:
          if (detailData.express_company == 0) { //待发货
            if (detailData.express_id) {
              showBottom = true;
            }
            showOpreation = false;
            payStatus = '实付金额';
            bottomOpreationText3 = "提醒发货";
          } else { //待收货
            if (detailData.express_id) {
              showBottom = true;
            }
            showChange = true;
            showOpreation = true;
            bottomOpreationText1 = "查看物流";
            bottomOpreationText2 = "确认收货";
            payStatus = '实付金额';
          }
          break;
        case 35: //申请退款
          showOpreation = false;
          payStatus = '实付金额';
          break;
        case 43: //结束-申请退款
          payStatus = '实付金额';
          break;
        case 44: //结束-申请换货
          if (detailData.express_id) {
            showBottom = true;
          }
          showOpreation = false;
          bottomOpreationText1 = "";
          bottomOpreationText2 = "查看物流";
          break;
        case 40: //结束
          if (detailData.express_id) {
            showBottom = true;
            payStatus = '实付金额';
          }
          showChange = true;
          showOpreation = true;
          bottomOpreationText1 = "";
          bottomOpreationText2 = "查看物流";
          break;
        case 11: //完成付款，等待系统确认
          payStatus = '实付金额';
        case 41: //结束-主动取消
          payStatus = '实付金额';
        case 42: //结束-异常取消
          showBottom = false;
          showOpreation = false;
          bottomOpreationText1 = "";
          bottomOpreationText2 = "";
          payStatus = '实付金额';
          break;
      }
      if (detailData.express_id) {
        that.getExpressData(detailData.express_id);
      }
      that.setData({
        detailData,
        products: data.data.products,
        showOpreation,
        showBottom,
        showChange,
        bottomOpreationText1,
        bottomOpreationText2,
        bottomOpreationText3,
        payStatus
      })
      if (!that.data.sellerName) {
        if (data.data.products.length == 1) {
          that.getSellerName(data.data.products[0].provider_id);
        } else {
          var same = true;
          var provider_id = data.data.products[0].provider_id;
          for (var a = 1; a < data.data.products.length; a++) {
            if (provider_id != data.data.products[a].provider_id) {
              same = false;
            }
          }
          if (!same) {
            that.setData({
              sellerName: "WANTS好物",
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
        title: data.data,
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
      var expressData = data.data;
      if (data.data.details == null) {
        that.setData({
          expressData: null
        })
        return
      }
      if (data.data.details.length != 0) {
        expressData.created = util.formatTime(new Date(data.data.details[0].created));
        expressData.detail = data.data.details[0].context;
        that.setData({
          expressData: expressData
        })
      }
    }, function (data) {
      wx.showToast({
        title: data.data,
        icon: "none",
        duration: 2000
      })
    })
  },

  connectSellerMsg() {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家
      that.setData({
        showModal: true,
        dialog_title: '请下载APP与商家客服沟通',
        dialog_cancel: '残忍放弃',
        dialog_ok: '我要下载',
        dilaogType: "3"
      })
    }, function (isNotLogin) {
      that.toLogin();
    });
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
          success: function (res) { }
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
  preventTouchMove: function () { },

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
    that.hideModal();
    var dilaogType = that.data.dilaogType;
    if (dilaogType == "1") {
      var url = util.URL_ROOT + "/order/" + orderId + "/cancel"
      util.requestPut(url, function (data) {
        that.setData({
          showLoadingTime: false
        });
        clearInterval(that.data.Loadingtime);
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
    } else if (dilaogType == "2") {
      var phone = that.data.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () { }
      })
    } else if (dilaogType == "3") {
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
        },
        function () {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 2000
          })
        },
        function () {
          wx.showToast({
            title: '取消支付',
            icon: "none",
            duration: 2000
          })
        });
    }
  },
  opreation_3(e) {
    this.connectSellerMsg();
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
      dilaogType: "1"
    });
  },
  //查看物流
  getExpress(expressId, goodsNum, goodsImg, goodsTitle) {
    wx.navigateTo({
      url: '../WNTSExpress/WNTSExpress?expressId=' + expressId + '&goodsNum=' + goodsNum + '&goodsImg=' + goodsImg + '&goodsTitle=' + goodsTitle,
    })
  },
  // 确认收货
  confirmOrder(orderId) {
    var that = this;
    var orderIdNew = that.data.orderId;
    util.requestPut(util.URL_GET_ORDER + orderId + "/received", function (data) {
      that.getOrderDetail(orderIdNew);
      that.getGussLikeData();
    }, function (data) {
      wx.showToast({
        title: data.data,
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
    var that = this;
    clearInterval(that.data.Loadingtime)
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
  // onShareAppMessage: function () {

  // }
})