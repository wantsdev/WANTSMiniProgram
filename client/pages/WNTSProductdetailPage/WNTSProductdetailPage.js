// pages/WNTSProductdetailPage/WNTSProductdetailPage.js
var util = require('../../utils/util.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var current_type_arr = [];
var attribute_selected_arr = [];
var attribute_selected_items = [];
var selected_item_detail_out_arr = [];
var number = 1;
var selected_items_detail = [];
var stocks_obj_into_arr = [];
var commit_price_info_selected = [];
var commit_price_info_selected_key = {};
var current_selected_item = '';
var current_selected_item_arr = [];
var current_item_type = [];
var m = 0;
var n = 0;
var f = 0;
var turn = true;
var product_detail;
var categoryId;
var bandName;
var subCategoryName;
var tagsKeywords = [];
var productSumExpress = {};
var animation_one = wx.createAnimation({
  delay: 0,
  timingFunction: 'linear',
  duration: 250
});
var animation_two = wx.createAnimation({
  delay: 0,
  timingFunction: 'linear',
  duration: 250
});

var setStorageSync = function (that) {
  for (var a = 0; a < selected_item_detail_out_arr.length; a++) {
    commit_price_info_selected.push(selected_item_detail_out_arr[a].detail);
  };
  commit_price_info_selected_key.type = commit_price_info_selected;
  commit_price_info_selected_key.number = that.data.num;
  commit_price_info_selected_key.stock_id = that.data.current_stock_id;
  wx.setStorageSync('commit_price_info_selected_key', commit_price_info_selected_key);
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shoppingCarTotalNumber: 0,
    bubbleTurn: false,
    animationDataOne: {},
    animationDataTwo: {},
    winWidth: 0,
    winHeight: 0,
    productDetail: [],
    productImg: '',
    productPrice: '',
    guessLike: [],
    subject_product: null,
    subject_product_data: null,
    subject_item_arr: [],
    currentTab: 0,
    turn: 'off',
    isScroll: true,
    subject_product_attributes_arr: [],
    selected_item: '',
    selected_item_detail_out: [],
    current_index_one: 0,
    current_index_two: 0,
    //current_out_index: 0,
    selected_item_detail: '',
    num: 1,
    current_stock: 0,
    current_stock_id: 0,
    current_status: '确定',
    shopping_car_z_index: 1,
    buy_now_z_index: 1,
    scrollTop: 0,
    hidden: 'false',
    current_selected_item: '',
    selected: 'no',
    commit_price_info_selected: null,
    s_s: 'off',
    current_type: '',
    offset: 0,
    page: 0,
    limit: 16,
    iPhoneX: false,
    randomBackgroundColor: [],
    sendmessagepath: '',
    shop_show: false,
    shareProductDetail: null,
    nickName: '',
    avatarUrl: '',
    url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wants',
  },
  configShoppingCarTotalNumber() {
    var that = this;
    util.getShoppingCartSellerList(function (res) {
      var seller_list = res.data.seller_list;
      if (seller_list == null) return;
      var productsNum = 0;
      for (let i = 0; i < seller_list.length; i++) {
        var products = seller_list[i].order_product_list;
        for (let j = 0; j < products.length; j++) {
          productsNum += products[j].num;
        }
      }
      if (productsNum == 0) {
        that.setData({
          bubbleTurn: false
        });
      } else {
        that.setData({
          bubbleTurn: true
        });
      }
      that.setData({
        shoppingCarTotalNumber: productsNum
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    getApp().globalData.modalTurn = false;
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      },
    });

    that.setData({
      randomBackgroundColor: ['#2F4C52', '#414D65', '#A3A093', '#8F5B56', '#DDE8DE', '#F2E6F7', '#D0F6F9', '#F4F6B6', '#EFADCD']
    });
    util.checkLoginStatus(function (isLogined) {
      that.configShoppingCarTotalNumber();
    }, function (isNotLogin) {

    });
    if (option) {
      product_detail = option.subject;
      that.setData({
        shareProductDetail: option.subject,
        sendmessagepath: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + option.subject
      });
      // wx.setClipboardData({
      //   data: '',
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
      var get_commit_price_info_selected_key = wx.getStorageSync('commit_price_info_selected_key');
      product_detail = JSON.parse(product_detail);

      var subject_product_id = product_detail.product_id;
      commit_price_info_selected_key.detail_info = product_detail;
      //获取缓存信息

      that.setData({
        commit_price_info_selected: get_commit_price_info_selected_key,
        subject_product: product_detail,
        shop_show: !product_detail.shop_show,
        currentTabAuto: 0,
        productDetail: [{
          id: 0,
          backgroundColor: 'red'
        },
        {
          id: 1,
          backgroundColor: 'green'
        }
        ],
        // promotion: product_detail.promotion,
        // promotion_id: product_detail.promotion_id,
        // promotion_label: product_detail.promotion_label,
        // promotional: product_detail.promotional
      });
    } else {

    };
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
          winHeight: res.windowHeight
        });
      }
    })
    util.requestGet(util.URL_ROOT + '/product/' + subject_product_id, function (res) {
      var item_arr = [];
      categoryId = res.data.category.id;
      bandName = res.data.brand.name;
      subCategoryName = res.data.sub_category.name;
      if (res.data.keywords !== null) {
        tagsKeywords = res.data.keywords.split(',');
        that.setData({
          tagsKeywords
        });
      } else {
        tagsKeywords = res.data.keywords;
        that.setData({
          tagsKeywords
        });
      };
      res.data.detail.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
        item_arr.push(capture);
        that.setData({
          subject_item_arr: item_arr
        })
      });
      var subject_product_all = {};
      subject_product_all.product_imgs = res.data.imgs;
      subject_product_all.product_id = res.data.id;
      subject_product_all.product_title = res.data.title;
      subject_product_all.product_price = res.data.price;
      subject_product_all.product_tag_price = res.data.tag_price;
      subject_product_all.shop_show = that.data.shop_show;
      subject_product_all.promotion = res.data.promotion;
      subject_product_all.promotion_id = res.data.promotion_id;
      subject_product_all.promotion_label = res.data.promotion_label;
      subject_product_all.promotional = res.data.promotional;
      that.setData({
        subject_product: subject_product_all,
        subject_product_data: res.data
      })
    });

    that.getGussLikeData();
  },
  productNameBingLongTap(e) {
    var product_id = JSON.stringify(e.currentTarget.dataset.product_id);
    wx.showModal({
      title: '这都被你发现了😀',
      content: '这个商品的ID是' + product_id + ',复制？',
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: product_id,
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
        } else if (res.cancel) { }
      }
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=1&productId=' + that.data.subject_product.product_id + '&offset=' + that.data.offset +
      '&limit=' + that.data.limit,
      function (res) {
        var temp = util.getGessLikeDataTool(res.data);
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
  // serviceMsg(e) {
  //   var that = this;
  //   util.checkLoginStatus(function(isLogined) {
  //     //联系商家

  //   }, function(isNotLogin) {
  //     that.toLogin();
  //   });
  // },
  share_button(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家
      that.onShareAppMessage();
    }, function (isNotLogin) {
      that.toLogin();
    });
  },
  into_seller: function (e) {
    var that = this;
    // 进入店铺
    var seller_detail_obj = e.currentTarget.dataset.seller_detail;
    var seller_detail_all = {};
    seller_detail_all.seller_name = seller_detail_obj.name;
    seller_detail_all.seller_head = seller_detail_obj.head;
    seller_detail_all.seller_id = seller_detail_obj.id;
    var json_string = JSON.stringify(seller_detail_all);
    wx.navigateTo({
      url: '../WNTSShopPage/WNTSShopPage?seller_detail=' + json_string
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '../WNTSLoginPage/WNTSLoginPage?fromTo=productDetail',
    })
  },
  swiperChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  purchase_off: function (e) {
    var that = this;
    var timer = null;
    // number = 1;
    // selected_item_detail_out_arr = [];
    animation_one.bottom((that.data.iPhoneX) ? (-1042 + 'rpx') : (-992 + 'rpx')).step();
    animation_two.bottom((that.data.iPhoneX) ? (-1042 + 'rpx') : (-992 + 'rpx')).step();
    that.setData({
      turn: 'off',
      isScroll: false,
      num: number,
      // current_index_one: 0,
      // current_index_two: 0,
      animationDataOne: animation_one.export(),
      animationDataTwo: animation_two.export()
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

  attributes_selected_out: function (e) {
    var that = this;
    var selected_item_detail = {};
    var stocks = that.data.subject_product_data.stocks;
    var current_type_name = e.currentTarget.dataset.detail_attribute_item.type.name;
    var selected_item_detail_out = (e.target.dataset.attributes.name) ? (e.target.dataset.attributes.name) : (e.target.dataset.attributes);
    var type_item_id = e.target.dataset.attributes.id;
    current_type_arr.push(current_type_name);
    var subject_product_attributes = that.data.subject_product_data.attributes;

    for (var s = 0; s < subject_product_attributes.length; s++) {
      if (subject_product_attributes[s].type.name) {

      };
    };
    selected_item_detail.type = current_type_name;
    selected_item_detail.detail = selected_item_detail_out;
    selected_item_detail_out_arr.push(selected_item_detail);
    for (var i = 0; i < selected_item_detail_out_arr.length; i++) {
      var arr_length = selected_item_detail_out_arr.length;
      var arr_length_a = selected_item_detail_out_arr.length - 1;
      if (arr_length - 1 > 0 && i >= 1 && selected_item_detail_out_arr[arr_length - 1].type == selected_item_detail_out_arr[i - 1].type) {
        selected_item_detail_out_arr[i - 1] = selected_item_detail_out_arr[arr_length - 1];
        selected_item_detail_out_arr.splice(arr_length_a, 1)
      }
    };

    that.setData({
      selected_item_detail_out: selected_item_detail_out_arr,
      selected_item_detail: selected_item_detail.detail,
    });
    // console.log(selected_item_detail_out_arr);
    var selectedItemDetailOut = that.data.selected_item_detail_out;
    var subjectProductData = that.data.subject_product_data.stocks;
    // console.log(selectedItemDetailOut);
    // console.log(subjectProductData);
    for (var y = 0; y < subjectProductData.length; y++) {
      var subjectProductDataArr = subjectProductData[y].descp.split(' ');
      for (var z = 0; z < selectedItemDetailOut.length; z++) {
        var newDetailOne = selectedItemDetailOut[0].detail.split(' ');
        var newDetailTwo = selectedItemDetailOut[selectedItemDetailOut.length - 1].detail.split(' ');
        if (newDetailOne.length >= newDetailTwo.length) {
          for (var w = 0; w < newDetailOne.length; w++) {
            if (subjectProductDataArr.indexOf(newDetailOne[w]) !== -1 && subjectProductDataArr.indexOf(newDetailTwo[w]) !== -1) {
              that.setData({
                productImg: subjectProductData[y].img,
                productPrice: subjectProductData[y].price
              });
            };
          };
        } else {
          for (var w = 0; w < newDetailTwo.length; w++) {
            if (subjectProductDataArr.indexOf(newDetailOne[w]) !== -1 && subjectProductDataArr.indexOf(newDetailTwo[w]) !== -1) {
              that.setData({
                productImg: subjectProductData[y].img,
                productPrice: subjectProductData[y].price
              });
            };
          };
        }
      };
    };

    //判断点击“立即购买”时默认商品的库存量，并setData到data对象中，以备后期调用。
    for (var j = 0; j < selected_item_detail_out_arr.length; j++) {
      selected_items_detail.push(selected_item_detail_out_arr[j].detail);
    };

    for (var k = 0; k < stocks.length; k++) {
      var stocks_obj = {};
      var n = 0;
      var stock_arr = stocks[k].descp.split(' ');
      for (var p = 0; p < stock_arr.length; p++) {
        for (var q = 0; q < selected_items_detail.length; q++) {
          if (stock_arr[p] == selected_items_detail[q]) {
            n++;
            if (n >= selected_items_detail.length) {
              current_selected_item = stocks[k].descp;
              current_selected_item_arr = current_selected_item.split(' ');
              for (var t = 0; t < current_selected_item_arr.length; t++) {
                if (current_selected_item_arr[t] == selected_item_detail.detail) {
                  that.setData({
                    selected: selected_item_detail.detail
                  });
                };
              };
              that.setData({
                current_stock: stocks[k].stock,
                current_stock_id: stocks[k].id,
                current_selected_item: stocks[k].descp
              });
            };
          };
        };
      };

      stocks_obj.arr = stock_arr;
      stocks_obj_into_arr.push(stocks_obj)
    };
    if (that.data.current_stock == 0) {
      that.setData({
        current_status: '已售完'
      });
    } else {
      that.setData({
        current_status: '确定'
      });
    };
  },

  attribute_selected_one: function (e) {
    var that = this;
    var subject_product_attributes = that.data.subject_product_data.attributes;
    // console.log(subject_product_attributes);
    turn = false;
    f = 0;
    for (var s = 0; s < subject_product_attributes.length; s++) {
      for (var d = 0; d < subject_product_attributes[s].attribute.length; d++) {
        if (subject_product_attributes[s].attribute[d].name == e.currentTarget.dataset.attributes.name) {
          var current_type = subject_product_attributes[s].type.name;
          // console.log(current_type);
          that.setData({
            current_type: current_type
          });
          current_item_type.push(subject_product_attributes[s].type.name);
        };
      }
    }
    selected_items_detail = [];
    stocks_obj_into_arr = [];
    var index = e.target.dataset.item_index_one;
    var selected_item_detail = (e.target.dataset.attributes.name) ? (e.target.dataset.attributes.name) : (e.target.dataset.attributes);
    // console.log(selected_item_detail);
    number = 1;
    that.setData({
      selected_item: '"' + selected_item_detail + '"',
      current_index_one: index,
      num: number
    });
  },

  attribute_selected_two: function (e) {
    var that = this;
    var subject_product_attributes = that.data.subject_product_data.attributes;
    turn = false;
    f = 0;

    for (var s = 0; s < subject_product_attributes.length; s++) {
      for (var d = 0; d < subject_product_attributes[s].attribute.length; d++) {
        if (subject_product_attributes[s].attribute[d].name == e.currentTarget.dataset.attributes.name) {
          var current_type = subject_product_attributes[s].type.name;
          that.setData({
            current_type: current_type
          });
          current_item_type.push(subject_product_attributes[s].type.name);
        };
      }
    }
    selected_items_detail = [];
    stocks_obj_into_arr = [];
    var index = e.target.dataset.item_index_two;
    var selected_item_detail = (e.target.dataset.attributes.name) ? (e.target.dataset.attributes.name) : (e.target.dataset.attributes);
    number = 1;
    that.setData({
      selected_item: '"' + selected_item_detail + '"',
      current_index_two: index,
      num: number
    });
  },

  shoppingCartPageClick() {
    //跳转购物车
    wx.switchTab({
      url: "../WNTSShoppingCartPage/WNTSShoppingCartPage"
    });
  },

  //加入购物车
  add_shopping_cars: function (e) {
    var that = this;
    var fId = e.detail.formId;
    var fIdArr = getApp().globalData.formIdArr;
    fIdArr.push(fId);
    if (fIdArr.length >= 4) {
      //推送formId到服务端
      console.log(fIdArr);
      var fIdUrl = WNTSApi.mainUrl + '/user/batch_add_miniapp_form_id_list';
      util.requestPost({
        "form_id_list": fIdArr
      }, fIdUrl, function (res) {
        getApp().globalData.formIdArr = [];
      })
    };

    util.checkLoginStatus(function (isLogined) {

      var stocks = that.data.subject_product_data.stocks;
      var subject_product_attributes = that.data.subject_product_data.attributes;
      var click_type = e.target.dataset.type;
      var subject_product_attributes_arr_one;
      var subject_product_attributes_arr_two;
      selected_items_detail = [];
      stocks_obj_into_arr = [];
      // var sub_attribute = subject_product_attributes_arr_one.sub_attribute_alias;
      // console.log(sub_attribute);
      selected_items_detail = [];
      stocks_obj_into_arr = [];
      if (turn == true) {
        selected_item_detail_out_arr = [];
      };
      if (click_type == 'shopping_car') {
        that.setData({
          shopping_car_z_index: 5,
          buy_now_z_index: 1
        })
      } else {
        that.setData({
          buy_now_z_index: 5,
          shopping_car_z_index: 1
        })
      };
      for (var i = 0; i < subject_product_attributes.length; i++) {
        var selected_item_detail = {};
        if (subject_product_attributes[i].sub_attribute_alias == null || subject_product_attributes[i].sub_attribute_alias[0] == '') {
          subject_product_attributes[i].attribute = subject_product_attributes[i].sub_attribute;
        } else {
          subject_product_attributes[i].attribute = subject_product_attributes[i].sub_attribute_alias;

          for (var m = 0; m < subject_product_attributes[i].attribute.length; m++) {
            var name = subject_product_attributes[i].attribute[m];
            if (name == '') {
              subject_product_attributes[i].attribute[m] = subject_product_attributes[i].sub_attribute[m].name;
            } else {
            }
          }
        };
        selected_item_detail.type = subject_product_attributes[i].type.name;
        if (turn == true) {
          selected_item_detail.detail = (subject_product_attributes[i].attribute[0].name) ? (subject_product_attributes[i].attribute[0].name) : (subject_product_attributes[i].attribute[0]);
          selected_item_detail_out_arr.push(selected_item_detail);
        };
      };
      for (var j = 0; j < selected_item_detail_out_arr.length; j++) {
        selected_items_detail.push(selected_item_detail_out_arr[j].detail);

      };
      //判断点击“立即购买”时默认商品的库存量，并setData到data对象中，以备后期调用。
      for (var k = 0; k < stocks.length; k++) {
        var stocks_obj = {};
        var stock_arr = stocks[k].descp;
        n = 0;
        for (var p = 0; p < selected_items_detail.length; p++) {
          var index = stock_arr.indexOf(selected_items_detail[p]);
          if (index >= 0) {
            n++;
            if (n == selected_items_detail.length) {
              if (stocks[k].stock == 0) {
                that.setData({
                  current_status: '已售完'
                });
              } else {
                that.setData({
                  current_status: '确定'
                });
              };
              that.setData({
                current_stock: stocks[k].stock,
                current_stock_id: stocks[k].id
              })
            };
          };
        };
        stocks_obj.arr = stock_arr;
        stocks_obj_into_arr.push(stocks_obj)
      };
      that.setData({
        // turn: 'on',
        isScroll: true,
        subject_product_attributes_arr: subject_product_attributes,
        selected_item_detail_out: selected_item_detail_out_arr
      });
      //选择商品属性，更新商品价格
      var selectedItemDetailOut = that.data.selected_item_detail_out;
      var subjectProductData = that.data.subject_product_data.stocks;
      // console.log(selectedItemDetailOut);
      // console.log(subjectProductData);
      for (var y = 0; y < subjectProductData.length; y++) {
        var subjectProductDataArr = subjectProductData[y].descp.split(' ');
        for (var z = 0; z < selectedItemDetailOut.length; z++) {
          var newDetailOne = selectedItemDetailOut[0].detail.split(' ');
          var newDetailTwo = selectedItemDetailOut[selectedItemDetailOut.length - 1].detail.split(' ');
          if (newDetailOne.length >= newDetailTwo.length) {
            for (var w = 0; w < newDetailOne.length; w++) {
              if (subjectProductDataArr.indexOf(newDetailOne[w]) !== -1 && subjectProductDataArr.indexOf(newDetailTwo[w]) !== -1) {
                that.setData({
                  productImg: subjectProductData[y].img,
                  productPrice: subjectProductData[y].price
                });
              };
            };
          } else {
            for (var w = 0; w < newDetailTwo.length; w++) {
              if (subjectProductDataArr.indexOf(newDetailOne[w]) !== -1 && subjectProductDataArr.indexOf(newDetailTwo[w]) !== -1) {
                that.setData({
                  productImg: subjectProductData[y].img,
                  productPrice: subjectProductData[y].price
                });
              };
            };
          }
        };
      };
      if (subject_product_attributes.length > 1) {
        subject_product_attributes_arr_one = subject_product_attributes[0];
        subject_product_attributes_arr_two = subject_product_attributes[1];
        if ((subject_product_attributes_arr_one.sub_attribute_alias !== null && subject_product_attributes_arr_one.sub_attribute_alias.length == 1 || subject_product_attributes_arr_one.sub_attribute !== null && subject_product_attributes_arr_one.sub_attribute.length == 1) && (subject_product_attributes_arr_two.sub_attribute_alias !== null && subject_product_attributes_arr_two.sub_attribute_alias.length == 1 || subject_product_attributes_arr_two.sub_attribute !== null && subject_product_attributes_arr_two.sub_attribute.length == 1)) {
          that.add_shopping_car();
        } else {
          animation_one.bottom(0).step();
          that.setData({
            turn: 'on',
            animationDataOne: animation_one.export()
          });
        };
      } else {
        subject_product_attributes_arr_one = subject_product_attributes[0];
        if ((subject_product_attributes_arr_one.sub_attribute_alias !== null && subject_product_attributes_arr_one.sub_attribute_alias.length == 1) || (subject_product_attributes_arr_one.sub_attribute !== null && subject_product_attributes_arr_one.sub_attribute.length == 1)) {
          that.add_shopping_car();
        } else {
          animation_one.bottom(0).step();
          that.setData({
            turn: 'on',
            animationDataOne: animation_one.export()
          });
        };
      };

    },
      function (isNotLogin) {
        that.toLogin();
      });
  },

  //立即购买
  buy_now: function (e) {
    var that = this;
    var fId = e.detail.formId;
    var fIdArr = getApp().globalData.formIdArr;
    fIdArr.push(fId);
    if (fIdArr.length >= 4) {
      //推送formId到服务端
      // console.log(fIdArr);
      var fIdUrl = WNTSApi.mainUrl + '/user/batch_add_miniapp_form_id_list';
      util.requestPost({
        "form_id_list": fIdArr
      }, fIdUrl, function (res) {
        // console.log(res);
        getApp().globalData.formIdArr = [];
      })
    };
    util.checkLoginStatus(function (isLogined) {
      animation_one.bottom(0).step();
      that.setData({
        animationDataOne: animation_one.export()
      });
      var stocks = that.data.subject_product_data.stocks;
      var subject_product_attributes = that.data.subject_product_data.attributes;
      var click_type = e.target.dataset.type;
      var subject_product_attributes_arr_one;
      var subject_product_attributes_arr_two;
      // console.log(subject_product_attributes);
      selected_items_detail = [];
      stocks_obj_into_arr = [];
      if (subject_product_attributes.length > 0) {
        subject_product_attributes_arr_one = subject_product_attributes[0];
        subject_product_attributes_arr_two = subject_product_attributes[1];
      } else {
        subject_product_attributes_arr_one = subject_product_attributes[0];
      };
      // if ((subject_product_attributes_arr_one.attribute.length == 0 || 1) && (subject_product_attributes_arr_two.attribute.length == 0 || 1)) {
      //   that.add_shopping_car();
      // };

      if (turn == true) {
        selected_item_detail_out_arr = [];
      };
      if (click_type == 'shopping_car') {
        that.setData({
          shopping_car_z_index: 5,
          buy_now_z_index: 1
        })
      } else {
        that.setData({
          buy_now_z_index: 5,
          shopping_car_z_index: 1
        })
      };
      for (var i = 0; i < subject_product_attributes.length; i++) {
        var selected_item_detail = {};
        if (subject_product_attributes[i].sub_attribute_alias == null || subject_product_attributes[i].sub_attribute_alias[0] == '') {
          subject_product_attributes[i].attribute = subject_product_attributes[i].sub_attribute;
        } else {
          subject_product_attributes[i].attribute = subject_product_attributes[i].sub_attribute_alias;
          for (var m = 0; m < subject_product_attributes[i].attribute.length; m++) {
            var name = subject_product_attributes[i].attribute[m];
            if (name == '') {
              subject_product_attributes[i].attribute[m] = subject_product_attributes[i].sub_attribute[m].name;
            } else {

            }

          }

        };
        selected_item_detail.type = subject_product_attributes[i].type.name;
        if (turn == true) {
          selected_item_detail.detail = (subject_product_attributes[i].attribute[0].name) ? (subject_product_attributes[i].attribute[0].name) : (subject_product_attributes[i].attribute[0]);
          selected_item_detail_out_arr.push(selected_item_detail)
          // console.log(selected_item_detail_out_arr);
        };
      };
      for (var j = 0; j < selected_item_detail_out_arr.length; j++) {
        selected_items_detail.push(selected_item_detail_out_arr[j].detail);

      };
      //判断点击“立即购买”时默认商品的库存量，并setData到data对象中，以备后期调用。
      for (var k = 0; k < stocks.length; k++) {
        var stocks_obj = {};
        var stock_arr = stocks[k].descp;
        n = 0;
        for (var p = 0; p < selected_items_detail.length; p++) {
          var index = stock_arr.indexOf(selected_items_detail[p]);
          if (index >= 0) {
            n++;
            if (n == selected_items_detail.length) {
              if (stocks[k].stock == 0) {
                that.setData({
                  current_status: '已售完'
                });
              } else {
                that.setData({
                  current_status: '确定'
                });
              };
              that.setData({
                current_stock: stocks[k].stock,
                current_stock_id: stocks[k].id
              })
            };
          };
        };
        stocks_obj.arr = stock_arr;
        stocks_obj_into_arr.push(stocks_obj)
      };
      that.setData({
        turn: 'on',
        isScroll: true,
        subject_product_attributes_arr: subject_product_attributes,
        selected_item_detail_out: selected_item_detail_out_arr
      });
      var selectedItemDetailOut = that.data.selected_item_detail_out;
      var subjectProductData = that.data.subject_product_data.stocks;
      for (var y = 0; y < subjectProductData.length; y++) {
        var subjectProductDataArr = subjectProductData[y].descp.split(' ');
        for (var z = 0; z < selectedItemDetailOut.length; z++) {
          var newDetailOne = selectedItemDetailOut[0].detail.split(' ');
          var newDetailTwo = selectedItemDetailOut[selectedItemDetailOut.length - 1].detail.split(' ');
          if (newDetailOne.length >= newDetailTwo.length) {
            for (var w = 0; w < newDetailOne.length; w++) {
              if (subjectProductDataArr.indexOf(newDetailOne[w]) !== -1 && subjectProductDataArr.indexOf(newDetailTwo[w]) !== -1) {
                that.setData({
                  productImg: subjectProductData[y].img,
                  productPrice: subjectProductData[y].price
                });
              };
            };
          } else {
            for (var w = 0; w < newDetailTwo.length; w++) {
              if (subjectProductDataArr.indexOf(newDetailOne[w]) !== -1 && subjectProductDataArr.indexOf(newDetailTwo[w]) !== -1) {
                that.setData({
                  productImg: subjectProductData[y].img,
                  productPrice: subjectProductData[y].price
                });
              };
            };
          }
        };
      };
    }, function (isNotLogin) {
      that.toLogin();
    });
  },
  promotionShow: function (e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      animation_two.bottom(0).step();
      that.setData({
        turn: 'on',
        moduleHeight: 800,
        animationDataTwo: animation_two.export()
      });
    }, function (isNotLogin) {
      that.toLogin();
    });
  },
  subtract: function (e) {
    var that = this;

    if (number >= 2) {
      number--;
    };
    that.setData({
      num: number
    });
  },

  add: function (e) {
    var that = this;

    if (number < that.data.current_stock) {
      number++;
    } else {
      wx.showToast({
        title: '此商品仅剩余' + that.data.current_stock + '件',
        duration: 1500,
        icon: 'none',
      });
    };
    that.setData({
      num: number
    });
  },

  into_shoppingcar: function (e) {
    var that = this;


  },


  commit_price_info: function (event) {
    var that = this;
    var fId = event.detail.formId;
    var fIdArr = getApp().globalData.formIdArr;
    fIdArr.push(fId);
    if (fIdArr.length >= 4) {
      //推送formId到服务端
      // console.log(fIdArr);
      var fIdUrl = WNTSApi.mainUrl + '/user/batch_add_miniapp_form_id_list';
      util.requestPost({
        "form_id_list": fIdArr
      }, fIdUrl, function (res) {
        // console.log(res);
        getApp().globalData.formIdArr = [];
      })
    };
    commit_price_info_selected = [];
    var commit_price_info_selected_arr = [];
    if (that.data.current_status == '确定') {
      setStorageSync(that);
      var get_commit_price_info_selected_key = wx.getStorageSync('commit_price_info_selected_key');
      //传数据到订单确认
      var commit_price_info = get_commit_price_info_selected_key;
      var commit_price_info_all = {};
      animation_one.bottom((that.data.iPhoneX) ? (-1042 + 'rpx') : (-992 + 'rpx')).step();
      that.setData({
        animationDataOne: animation_one.export()
      });
      commit_price_info_all.product_id = commit_price_info.detail_info.product_id;
      commit_price_info_all.product_img = (that.data.productImg) ? (that.data.productImg) : (commit_price_info.detail_info.product_imgs);
      commit_price_info_all.product_title = commit_price_info.detail_info.product_title;
      commit_price_info_all.price = that.data.productPrice;
      commit_price_info_all.product_tag_price = commit_price_info.detail_info.product_tag_price;
      commit_price_info_all.stock_descp = commit_price_info.type;
      commit_price_info_all.id = commit_price_info.stock_id;
      commit_price_info_all.num = commit_price_info.number;
      commit_price_info_all.from = "productDetail";
      commit_price_info_selected_arr.push(commit_price_info_all);
      productSumExpress.product = commit_price_info_selected_arr;
      var json_string = JSON.stringify(productSumExpress);
      var json_string = encodeURIComponent(json_string);
      that.setData({

        turn: 'off',
        // current_index_one: 0,
        // current_index_two: 0
      });

      wx.navigateTo({
        url: '../WNTSCreateOrderPage/WNTSCreateOrderPage?selectedProducts=' + json_string
      })

    };
  },

  nav_to_shoppingcar: function (e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      wx.switchTab({
        url: '../WNTSShoppingCartPage/WNTSShoppingCartPage'
      })
    }, function (isNotLogin) {
      that.toLogin();
    });
  },

  nav_to_homePage: function (e) {
    var that = this;
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage'
    })
  },
  //标签点击跳转搜索商品页
  hot_tap_touch: function (e) {
    var that = this;
    var current_hot_word = e.currentTarget.dataset.hot_word;


    var json_string = current_hot_word;
    //json_string = util.stringWithAndCode(json_string);
    wx.navigateTo({
      url: '../WNTSSearch/WNTSSearch?keywoeds=' + json_string
    });


  },

  add_shopping_car: function (event) {
    var that = this;
    if (event !== undefined) {
      var fId = event.detail.formId;
      var fIdArr = getApp().globalData.formIdArr;
      fIdArr.push(fId);
      if (fIdArr.length >= 4) {
        //推送formId到服务端
        // console.log(fIdArr);
        var fIdUrl = WNTSApi.mainUrl + '/user/batch_add_miniapp_form_id_list';
        util.requestPost({
          "form_id_list": fIdArr
        }, fIdUrl, function (res) {
          // console.log(res);
          getApp().globalData.formIdArr = [];
        })
      };
    };
    commit_price_info_selected = [];
    if (that.data.current_status == '确定') {
      setStorageSync(that);
      var get_commit_price_info_selected_key = wx.getStorageSync('commit_price_info_selected_key');
      var add_product_id = get_commit_price_info_selected_key.detail_info.product_id;
      var add_num = get_commit_price_info_selected_key.number;
      var add_stock_id = get_commit_price_info_selected_key.stock_id;
      var add_shopping_car_url = util.URL_ROOT + '/cart';
      animation_one.bottom((that.data.iPhoneX) ? (-1042 + 'rpx') : (-992 + 'rpx')).step();
      that.setData({
        animationDataOne: animation_one.export()
      });
      util.requestPost({
        stock_id: add_stock_id,
        product_id: add_product_id,
        num: add_num
      }, add_shopping_car_url,
        function (data) {
          that.setData({
            turn: 'off',
            // current_index_one: 0,
            // current_index_two: 0
          });
          wx.showToast({
            title: '成功加入购物车，请在购物车中查看',
            duration: 1500,
            icon: 'none'
          });
          //在这里请求购物车列表，获取总个数
          that.configShoppingCarTotalNumber();

        },
        function (fail) {

        });

    };
  },

  selected_item_datas: function (e) {
    var that = this;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onPageScroll: function (e) {
    var that = this;
    that.setData({
      scrollTop: -e.scrollTop
    });
  },

  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.showShareMenu({
      withShareTicket: true
    });
    getApp().globalData.modalTurn = false;
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
    selected_item_detail_out_arr = [];
    number = 1;
    turn = true;
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
    var that = this;
    var sharePic;
    var keyWordOne;
    var keyWordTwo;
    var imgUrl = that.data.subject_product.product_imgs[0];
    var indexNumOne;
    var indexNumTwo;
    switch (categoryId) {
      //鞋类
      case 1398:
        keyWordOne = 'GUCCI DIY个性定制运动鞋';
        keyWordTwo = 'GUCCI GG Supreme运动鞋';
        indexNumOne = that.data.subject_product_data.title.indexOf(keyWordOne);
        indexNumTwo = that.data.subject_product_data.title.indexOf(keyWordTwo);
        if (indexNumOne !== -1 || indexNumTwo !== -1) {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a320';
        } else {
          if (subCategoryName == '凉鞋' || '拖鞋') {
            sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a500';
          } else {
            sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a425';
          };
        }
        break;
      //T恤
      case 1334:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        break;
      //裤子
      case 1392:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        break;
      //包
      case 1416:
        if (subCategoryName == '旅行箱包') {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a180';
        } else {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        };
        break;
      //首饰
      case 1437:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        break;
      //钱包/小物/数码
      case 1468:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        break;
      //帽子
      case 1430:
        if (bandName == 'draconite') {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a270';
        } else {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a400';
        };
        break;
      //夹克/外套
      case 1349:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        break;
      //连衣裙
      case 1371:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a150';
        break;
      //裙子
      case 1389:
        if (subCategoryName == '半身裙') {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a330';
        } else if (subCategoryName == '牛仔裙') {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a400';
        } else {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        };
        break;
      //家纺
      case 23163:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a320';
        break;
      //时尚配件
      case 1455:
        if (subCategoryName == '太阳镜') {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a400';
        } else {
          sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        };
        break;
      //水杯
      case 23192:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a200';
        break;
      //内衣
      case 1493:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a300';
        break;
      //头饰
      case 1448:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a350';
        break;
      //其他
      case 1581:
        sharePic = that.data.subject_product.product_imgs[0] + '?imageMogr2/crop/!4000x1000a0a320';
        break;
    }
    return {
      title: '￥' + that.data.subject_product.product_price / 100 + ' | ' + that.data.subject_product.product_title, // 转发标题（默认：当前小程序名称）
      path: 'pages/WNTSProductdetailPage/WNTSProductdetailPage?subject=' + that.data.shareProductDetail, // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      imageUrl: sharePic,
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
  },
  // 预览图片
  previewImage: function (e) {
    var current = e.target.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.subject_item_arr // 需要预览的图片http链接列表
    })
  }
})