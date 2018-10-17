var util = require('../../utils/util.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var unSeletedImage = "../WANTSImages/check_unselected.png"
var seletedImage = "../WANTSImages/check_selected.png"
var isLoading = false;
var express = 0;
var appId = util.App_id;
Page({

  /**we
   * 页面的初始数据
   */
  data: {
    showModal: false,
    winHeight: 0,
    sellers: [],              //商家列表
    seletedBtnImage: seletedImage,
    unSeletedBtnImage: unSeletedImage,
    sellerIconImage: "../WANTSImages/seller.png",
    right_IconImage: "../WANTSImages/right.png",
    deleteImage: "../WANTSImages/delete.png",
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    expressPrice: 0,           // 邮价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: {
      name: "hello"
    },
    seller_list: null,
    willDelProduct: null,
    guessLike: [],
    selectedNewProducts: null,
    selectedNewProductsNum: 0,
    showNoData: false,
    express: 0,
    offset: 0,
    page: 0,
    limit: 15,
    loadMoreBool: true,
    randomBackgroundColor: [],
    guessLikeShow: false,
    cartBottomHeight: false
  },


  /**
   * 当前店铺选中事件
   */
  selectSeller(e) {
    const index = e.currentTarget.dataset.index;//选中的那一个商店
    let seller_list = this.data.seller_list;
    let currentSeller = e.currentTarget.dataset.seller;
    for (let i = 0; i < seller_list.length; i++) {
      var seller = seller_list[i].seller;
      if (seller.id == currentSeller.id) {
        seller_list[i].seller.selected = !seller.selected;
        var currentSellerProducts = seller_list[i].products;
        for (let j = 0; j < currentSellerProducts.length; j++) {
          seller_list[i].products[j].selected = seller.selected;
        }
      }
    }

    this.setData({
      seller_list: seller_list,
    });
    this.checkAllSelected();
    this.getShoppingCartTotalPrice();
  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {

    const index = e.currentTarget.dataset.index;
    let currentProduct = e.currentTarget.dataset.product;
    let seller_list = this.data.seller_list;
    let selectAllStatus = this.data.selectAllStatus;
    var section = 0;
    var row = 0;
    for (var i = 0; i < seller_list.length; i++) {
      var products = seller_list[i].products;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id == currentProduct.id) {
          section = i;
          row = j;
          seller_list[i].products[j].selected = !products[j].selected;
        }
      }
    }

    this.setData({
      seller_list: seller_list
    });
    this.checkSellerSelected(section, row);
    this.checkAllSelected();
    this.getShoppingCartTotalPrice();

  },
  //获取当前商品的索引
  getProductSectionAndRow(product) {
    let seller_list = this.data.seller_list;
    var indexPath = {};
    indexPath.section = 0;
    indexPath.row = 0;
    for (var i = 0; i < seller_list.length; i++) {
      var products = seller_list[i].products;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id == product.id) {
          indexPath.section = i;
          indexPath.row = j;
          return indexPath;
        }
      }
    }
  },
  checkSellerSelected(section, row) {
    let seller_list = this.data.seller_list;
    var products = seller_list[section].products;
    var sellerBool = seller_list[section].seller.selected;
    if (sellerBool) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].selected == false) {
          seller_list[section].seller.selected = false;
          this.setData({
            seller_list: seller_list
          });
          return;
        }
      }
    } else {
      var num = 0;
      for (var i = 0; i < products.length; i++) {
        if (products[i].selected) {
          num++;
        }
      }
      var allSelected = (num == products.length);
      if (!allSelected) return;
      seller_list[section].seller.selected = allSelected;
      this.setData({
        seller_list: seller_list
      });
    }
  },
  checkAllSelected() {

    let seller_list = this.data.seller_list;
    let selectAllStatus = this.data.selectAllStatus;
    for (let i = 0; i < seller_list.length; i++) {
      var sele = seller_list[i].seller.selected;
      if (seller_list[i].seller.selected == false) {
        this.setData({
          selectAllStatus: false
        });
        return;
      }
    }
    this.setData({
      selectAllStatus: true
    });
  },
  //全选
  shoppingCartSelectAll() {

    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let seller_list = this.data.seller_list;
    if (!seller_list) return;
    for (let i = 0; i < seller_list.length; i++) {
      seller_list[i].seller.selected = selectAllStatus;
      var products = seller_list[i].products;
      for (let j = 0; j < products.length; j++) {
        products[j].selected = selectAllStatus;
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      seller_list: seller_list
    });
    this.getShoppingCartTotalPrice();
  },

  //数量减少
  shoppingCartMinusProduct(e) {
    var that = this;
    var product = e.currentTarget.dataset.product;
    var indexPath = that.getProductSectionAndRow(product);
    var seller_list = that.data.seller_list;
    if (seller_list[indexPath.section].products[indexPath.row].num < 2) {
    } else {
      var url = WNTSApi.shoppingCarAddProductApi + "?" + "order_product_id=" + product.id + "&num=1";
      util.requestMethodWithParaterm("DELETE", null, url, function (res) {
        if (res.data.code == 1) {
          seller_list[indexPath.section].products[indexPath.row].num--;
          that.setData({
            seller_list: seller_list,
          });
          that.getShoppingCartTotalPrice();
        } else {
          // 减少失败
          wx.showToast({
            title: "减少失败 - " + res.data.msg,
            icon: "none",
            mask: true
          })
        }
      });
    }



  },
  //数量增加
  shoppingCartAddProduct(e) {
    var that = this;
    var product = e.currentTarget.dataset.product;
    var parameter = {};
    parameter.stock_id = product.product_stock_id;
    parameter.product_id = product.product_id;
    parameter.num = 1;

    util.requestMethodWithParaterm("POST", parameter, WNTSApi.shoppingCarAddProductApi, function (res) {
      if (res.data.id) {
        var indexPath = that.getProductSectionAndRow(product);
        var seller_list = that.data.seller_list;
        seller_list[indexPath.section].products[indexPath.row].num++;

        that.setData({
          seller_list: seller_list
        });
        that.getShoppingCartTotalPrice();
      } else {
        //增加失败
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      };
    });
  },
  /**
   * 更新价格
   */
  getShoppingCartTotalPrice() {

    var that = this;
    let seller_list = this.data.seller_list;
    let selectAllStatus = this.data.selectAllStatus;
    util.getProductsTotalThenSetTabBarBadgeWithSellerList(seller_list);
    var selectedProducts = [];
    var selectedNewProducts = [];
    var selectedNewProductsNum = 0;

    for (let i = 0; i < seller_list.length; i++) {
      var products = seller_list[i].products;
      for (let j = 0; j < products.length; j++) {

        if (products[j].selected) {
          var product = {};
          product.id = products[j].id;
          product.product_id = products[j].product_id;
          product.product_title = products[j].product_title;
          product.product_img = products[j].product_img;
          product.stock_descp = products[j].stock_descp;
          product.price = products[j].price;
          product.num = products[j].num;
          selectedNewProducts.push(product);
          selectedProducts.push(products[j].id);
          selectedNewProductsNum += products[j].num;
        }
      }
    }
    that.setData({
      selectedNewProducts,
      selectedNewProductsNum
    });
    //获取价格接口
    console.log(WNTSApi.shoppingCarPricetApi + "?order_product_id=" + selectedProducts + "&app_id=" + appId);
    util.requestMethodWithParaterm("GET", null, WNTSApi.shoppingCarPricetApi + "?order_product_id=" + selectedProducts, function (res) {
      console.log(res);
      var express = res.data.express;
      var price = res.data.sum / 100;
      console.log(price);
      if (selectAllStatus == false) {
        that.setData({
          totalPrice: price,
          express: 0
        });
      } else {
        that.setData({
          totalPrice: price,
          express: express
        });
      };
    });
  },
  //创建订单
  createOrderClick(e) {
    if (!this.data.selectedNewProductsNum) {
      wx.showToast({
        title: "请至少选择一件商品",
        icon: "none",
        duration: 2000
      })
      return;
    }
    //跳转确认订单界面
    var json_str = JSON.stringify(this.data.selectedNewProducts);
    wx.navigateTo({
      url: '../WNTSCreateOrderPage/WNTSCreateOrderPage' + "?selectedProducts=" + json_str,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      randomBackgroundColor: ['#2F4C52', '#414D65', '#A3A093', '#8F5B56', '#DDE8DE', '#F2E6F7', '#D0F6F9', '#F4F6B6', '#EFADCD']
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    this.loadData();
  },


  loadData() {
    var that = this;
    util.getShoppingCartSellerList(function (res) {
      wx.stopPullDownRefresh();
      var seller_list = res.data.seller_list;

      //配置数据
      var showNoData = false;
      if (!seller_list || (seller_list.length <= 0)) {
        showNoData = true;
        that.setData({
          cartBottomHeight: false
        });
      };
      that.setData({
        showNoData: showNoData
      });
      that.configCart(seller_list);
      util.getProductsTotalThenSetTabBarBadgeWithSellerList(seller_list);
      if (seller_list == null) {
        that.getGussLikeData();
        that.setData({
          guessLikeShow: true,
          cartBottomHeight: false
        });
      };
      if (seller_list !== null && seller_list.length > 0) {
        that.getGussLikeData();
        that.setData({
          guessLikeShow: true,
          cartBottomHeight: true
        });
      };
    });
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
    util.requestGet(util.URL_ROOT + '/product/recommend?scene=2&offset=' + that.data.offset + '&limit=15',
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
    that.getGussLikeData();
  },
  //
  configCart(e) {
    var that = this;
    if (!e) return;
    var seller_list_data = e;
    var tempList = [];
    for (var i = 0; i < seller_list_data.length; i++) {
      var temp = {};
      var newProducts = [];
      var newSeller = {};
      var products = seller_list_data[i].products;
      seller_list_data[i].section = i;
      for (var j = 0; j < products.length; j++) {
        products[j].row = j;
        var newProduct = {};
        newProduct.row = products[j].row;
        newProduct.id = products[j].id;
        newProduct.num = products[j].num;
        newProduct.price = products[j].price;
        newProduct.product_id = products[j].product_id;
        newProduct.product_img = products[j].product_img;
        newProduct.product_title = products[j].product_title;
        newProduct.product_stock_id = products[j].product_stock_id;
        newProduct.provider_id = products[j].provider_id;
        newProduct.stock_descp = products[j].stock_descp;
        newProduct.tag_price = products[j].tag_price;
        newProduct.stock_num = products[j].stock_num;
        newProduct.sum = products[j].sum;
        newProduct.status = products[j].status;
        newProduct.tag_price = products[j].tag_price;
        newProducts.push(newProduct);
      }
      newSeller.id = seller_list_data[i].seller.id;
      newSeller.name = seller_list_data[i].seller.name;
      temp.section = seller_list_data[i].section;
      temp.products = newProducts;
      temp.seller = newSeller;
      tempList.push(temp);
    }
    that.setData({
      seller_list: tempList,
      selectAllStatus: !that.data.selectAllStatus
    });
    that.shoppingCartSelectAll();
    that.getShoppingCartTotalPrice();
  },
  //item 点击跳转商品详情
  products_item(e) {
    var subject_product = e.currentTarget.dataset.item;
    var subject_product_all = {};
    var imgs = [subject_product.product_img];
    subject_product_all.product_imgs = imgs;
    subject_product_all.product_id = subject_product.product_id;
    subject_product_all.product_title = util.stringWithAndCode(subject_product.product_title);
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    var json_string = JSON.stringify(subject_product_all);
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + json_string
    })
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
  //逛一逛
  go_shop() {
    wx.switchTab({
      url: '../WNTSHomePage/WNTSHomePage',
    });
  },

  /**
      * 生命周期函数--监听页面显示
      */
  onShow: function () {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      that.loadData();
    }, function (isNotLogin) {
      wx.redirectTo({
        url: '../WNTSLoginPage/WNTSLoginPage?fromTo=' + "cart",
      })
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.loadData();
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

  },
  //删除弹窗确认
  shoppingCartDeleteSeller_List(e) {
    this.dialog();
    var product = e.currentTarget.dataset.product;
    this.setData({
      willDelProduct: product
    })
  },
  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var that = this;
    var product = e;
    var url = WNTSApi.shoppingCarAddProductApi + "?" + "order_product_id=" + product.id;
    util.requestMethodWithParaterm("DELETE", null, url, function (res) {
      if (res.data.code) {
        var indexPath = that.getProductSectionAndRow(product);
        var seller_list = that.data.seller_list;
        var products = seller_list[indexPath.section].products;
        if (products.length == 1) {
          seller_list.splice([indexPath.section], 1);
        } else if (products.length > 1) {
          seller_list[indexPath.section].products.splice(indexPath.row, 1);
        } else {
          that.checkAllSelected();
          //没有东西了
        }
        var showNoData = false;
        var cartBottomHeight = false;
        util.getProductsTotalThenSetTabBarBadgeWithSellerList(seller_list);
        if (seller_list.length == 0) {
          showNoData = true;
          cartBottomHeight = false;
        }
        that.setData({
          seller_list: seller_list,
          showNoData: showNoData,
          cartBottomHeight: false
        });
      } else {
      }
      that.getShoppingCartTotalPrice();
    });
  },
  /* 弹窗 */
  dialog() {
    let showModal = this.data.showModal;
    if (showModal) return;
    this.setData({
      dialog_title: "确定删除该商品吗？",
      dialog_cancel: "取消",
      dialog_ok: "确定",
      dialog_content: "",
      showModal: true,
      dilaogType: "1",

    })
  },
  /*弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {
  },

  /* 隐藏模态对话框*/
  hideModal: function () {
    let showModal = this.data.showModal;
    if (!showModal) return;
    this.setData({
      showModal: false
    });
  },

  /*对话框取消按钮点击事件*/
  onCancel: function () {
    this.hideModal();
  },

  /* 删除商品 对话框确认按钮点击事件*/
  onConfirm: function (e) {
    var that = this;
    this.hideModal();
    var willDelProduct = that.data.willDelProduct;
    that.deleteList(willDelProduct);
  }
})