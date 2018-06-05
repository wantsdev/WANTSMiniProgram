// pages/WNTSProductdetailPage/WNTSProductdetailPage.js
var util = require('../../utils/util.js');
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
var n = 0;
var animation_one = wx.createAnimation({
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
    animationData: {},
    winWidth: 0,
    winHeight: 0,
    productDetail: [],
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
    limit: 15,
    iPhoneX:false,
    randomBackgroundColor:[],
    sendmessagepath:'',
    shop_show:false,
    shareProductDetail:null
  },
  configShoppingCarTotalNumber() {
    var that = this;
    util.getShoppingCartSellerList(function (res) {
      var seller_list = res.data.seller_list;
      if (seller_list==null) return;
      var productsNum = 0;
      for (let i = 0; i < seller_list.length; i++) {
        var products = seller_list[i].products;
          for (let j = 0;j < products.length; j++) {
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
    wx.showShareMenu({
      withShareTicket: true
    });
    var that = this;
    that.setData({
      randomBackgroundColor:['#2F4C52','#414D65','#A3A093','#8F5B56','#DDE8DE','#F2E6F7','#D0F6F9','#F4F6B6','#EFADCD']
    });
    util.checkLoginStatus(function (isLogined) {
      that.configShoppingCarTotalNumber();
    }, function (isNotLogin) {

    });
    if (option) {

      var product_detail = option.subject;
      console.log(option);
      that.setData({
        shareProductDetail: option.subject,
        sendmessagepath:'../WNTSProductdetailPage/WNTSProductdetailPage?subject='+ option.subject
      });
      var get_commit_price_info_selected_key = wx.getStorageSync('commit_price_info_selected_key');
      product_detail = JSON.parse(product_detail);
      var subject_product_id = product_detail.product_id;
      commit_price_info_selected_key.detail_info = product_detail;

     
        //获取缓存信息

      that.setData({
        commit_price_info_selected: get_commit_price_info_selected_key
      });
      that.setData({
        subject_product: product_detail,
        shop_show: !product_detail.shop_show,
        subject_product_data: product_detail,
        currentTabAuto: 0,
        productDetail: [
          {
            id: 0,
            backgroundColor: 'red'
          },
          {
            id: 1,
            backgroundColor: 'green'
          }
        ]
      });
    }
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
    util.requestGet(util.URL_ROOT + '/product/' + subject_product_id, function (data) {
      var item_arr = [];
      data.detail.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
        item_arr.push(capture);
        that.setData({
          subject_item_arr: item_arr
        })
      });
      var subject_product_all = {};
      subject_product_all.product_imgs = data.imgs;
      subject_product_all.product_id = data.id;
      subject_product_all.product_title = data.title;
      subject_product_all.product_price = data.price;
      subject_product_all.product_tag_price = data.tag_price;
      subject_product_all.shop_show = data.shop_show;
      that.setData({
        subject_product: subject_product_all,
        subject_product_data: data
      })
    });
    console.log(that.data.subject_product);
    that.getGussLikeData();
  },
  loadMore() {
    var loadMoreBool = true;
    var that = this;
    var loadType = 0;//none
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=1&offset=' + that.data.offset
      + '&limit=' + that.data.limit,
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


  connectSellerMsg(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家

    }, function (isNotLogin) {
      that.toLogin();
    });
  },
  serviceMsg(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家

    }, function (isNotLogin) {
      that.toLogin();
    });
  },
  share_button(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家

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
    number = 1;
    selected_item_detail_out_arr = [];
    animation_one.bottom((that.data.iPhoneX)?(-1042+'rpx'):(-992 + 'rpx')).step();
    that.setData({
      turn: 'off',
      isScroll: false,
      num: 1,
      current_index_one: 0,
      current_index_two: 0,
      animationData: animation_one.export()
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
              })
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
    for (var s = 0; s < subject_product_attributes.length; s++) {
      for (var d = 0; d < subject_product_attributes[s].attribute.length; d++) {
        if (subject_product_attributes[s].attribute[d].name == e.currentTarget.dataset.attributes.name) {
          var current_type = subject_product_attributes[s].type.name;
          that.setData({
            current_type: current_type
          });
          current_item_type.push(subject_product_attributes[s].type.name);
          if (current_item_type[current_item_type.length - 1] !== current_item_type[current_item_type.length - 2]) {
            that.setData({
              s_s: 'on'
            });
          } else {
            that.setData({
              s_s: 'off'
            });
          };
        };
      }
    }
    selected_items_detail = [];
    stocks_obj_into_arr = [];
    var index = e.target.dataset.item_index_one;
    var selected_item_detail = (e.target.dataset.attributes.name) ? (e.target.dataset.attributes.name) : (e.target.dataset.attributes);
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
    for (var s = 0; s < subject_product_attributes.length; s++) {
      for (var d = 0; d < subject_product_attributes[s].attribute.length; d++) {
        if (subject_product_attributes[s].attribute[d].name == e.currentTarget.dataset.attributes.name) {
          var current_type = subject_product_attributes[s].type.name;
          that.setData({
            current_type: current_type
          });
          current_item_type.push(subject_product_attributes[s].type.name);
          if (current_item_type[current_item_type.length - 1] !== current_item_type[current_item_type.length - 2]) {
            that.setData({
              s_s: 'on'
            });
          } else {
            that.setData({
              s_s: 'off'
            });
          };
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
  add_shopping_car_buy_now: function (e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      
      animation_one.bottom(0).step();
      that.setData({
        animationData: animation_one.export()
      });
      var stocks = that.data.subject_product_data.stocks;
      var subject_product_attributes = that.data.subject_product_data.attributes;
      var click_type = e.target.dataset.type;
      selected_items_detail = [];
      stocks_obj_into_arr = [];
      selected_item_detail_out_arr = [];

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

          for (var m = 0; m < subject_product_attributes[i].attribute.length;m++){
            var name = subject_product_attributes[i].attribute[m];
            if(name == ''){
              subject_product_attributes[i].attribute[m] = subject_product_attributes[i].sub_attribute[m].name;
            }else{

            }

          }

        };
        selected_item_detail.type = subject_product_attributes[i].type.name;
        selected_item_detail.detail = (subject_product_attributes[i].attribute[0].name) ? (subject_product_attributes[i].attribute[0].name) : (subject_product_attributes[i].attribute[0]);
        selected_item_detail_out_arr.push(selected_item_detail)
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
    }else{
      wx.showToast({
        title: '此商品仅剩余'+that.data.current_stock+'件',
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
    commit_price_info_selected = [];
    var commit_price_info_selected_arr = [];
    if (that.data.current_status == '确定') {
      setStorageSync(that);
      var get_commit_price_info_selected_key = wx.getStorageSync('commit_price_info_selected_key');
      //传数据到订单确认
      var commit_price_info = get_commit_price_info_selected_key;
      var commit_price_info_all = {};
      animation_one.bottom((that.data.iPhoneX)?(-1042+'rpx'):(-992 + 'rpx')).step();
      that.setData({
        animationData: animation_one.export()
      });
      commit_price_info_all.product_id = commit_price_info.detail_info.product_id;
      commit_price_info_all.product_img = commit_price_info.detail_info.product_imgs[0];
      commit_price_info_all.product_title = commit_price_info.detail_info.product_title;
      commit_price_info_all.price = commit_price_info.detail_info.product_price;
      commit_price_info_all.product_tag_price = commit_price_info.detail_info.product_tag_price;
      commit_price_info_all.stock_descp = commit_price_info.type;
      commit_price_info_all.id = commit_price_info.stock_id;
      commit_price_info_all.num = commit_price_info.number;
      commit_price_info_all.from = "productDetail";
      commit_price_info_selected_arr.push(commit_price_info_all);
      var json_string = JSON.stringify(commit_price_info_selected_arr);
      that.setData({
        turn: 'off',
        current_index_one: 0,
        current_index_two: 0
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

  add_shopping_car: function () {
    var that = this;
    commit_price_info_selected = [];
    if (that.data.current_status == '确定') {
      setStorageSync(that);
      var get_commit_price_info_selected_key = wx.getStorageSync('commit_price_info_selected_key');
      var add_product_id = get_commit_price_info_selected_key.detail_info.product_id;
      var add_num = get_commit_price_info_selected_key.number;
      var add_stock_id = get_commit_price_info_selected_key.stock_id;
      var add_shopping_car_url = util.URL_ROOT + '/cart';
      animation_one.bottom((that.data.iPhoneX)?(-1042+'rpx'):(-992 + 'rpx')).step();
      that.setData({
        animationData: animation_one.export()
      });
      util.requestPost({ stock_id: add_stock_id, product_id: add_product_id, num: add_num }, add_shopping_car_url, 
      function (data) {
        that.setData({
          turn: 'off',
          current_index_one: 0,
          current_index_two: 0
        });
        wx.showToast({
          title: '成功加入购物车，请在购物车中查看',
          duration: 1500,
          icon: 'none'
        });
        //在这里请求购物车列表，获取总个数
        that.configShoppingCarTotalNumber();
      }, function (fail) {
        
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
    wx.showShareMenu({
      withShareTicket: true
    })
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
    selected_item_detail_out_arr = [];
    number = 1;
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
    return {

      title: that.data.subject_product.product_title,// 转发标题（默认：当前小程序名称）

      path: 'pages/WNTSProductdetailPage/WNTSProductdetailPage?subject=' + that.data.shareProductDetail,// 转发路径（当前页面 path ），必须是以 / 开头的完整路径

      success(e) {

      },

      fail(e) {

      },

      complete() { }

    }
  }
})