// pages/WNTSHomePage/WNTSHomePage.js
var util = require('../../utils/util.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var WNTSLoadIcon = require('../../utils/WNTSLoadIcon.js');
var app = getApp();
var blockStatus = {};
var array = [];
var array2 = [];
var array3 = [];
var array4 = [];
var turn = 'off';
var i = 0;
var j = 0;
var k = 0;
var l = 0;
var blocksIdArr = [];
var blockArrNew = [];
var subjectArrayItems = [];
//除了主题和商品详情页其余页面的转发都是分享路径都是主页
/*
跳转种类
*/
let WSMMallLayoutTargetTypeProductDetail = 1;
let WSMMallLayoutTargetTypeSellerProfile = 2;
let WSMMallLayoutTargetTypeSubjectDetail = 3;
let WSMMallLayoutTargetTypeProductOfKeywords = 4;
let WSMMallLayoutTargetTypeWeb = 5;
let WSMMallLayoutTargetTypeTab = 6;

/*
区域种类
*/
let BannerBlock_id = 1;//轮播
let HotBrandBlock_id = 2;//热门品牌
let GoodsBlock_id = 3;//优选精品
let SubjectBlock_id = 4;//主题
let RecommendBlock_id = 5;//推荐
let SubjectBlock_single_id = 6;//单个主题图的主题
let SubjectBlock_double_id = 7;//两个主题图的主题
let SubjectBlock_three_left_id = 8;//三个主题图的主题（面积最大块的主题图在左边）
let SubjectBlock_three_top_id = 9;//三个主题图的主题（面积最大块的主题图在上边）
let SubjectBlock_n_two_id = 10;//n行2列主题图的主题
let blockIdArr = [BannerBlock_id, HotBrandBlock_id, GoodsBlock_id, SubjectBlock_id, RecommendBlock_id, SubjectBlock_single_id,
  SubjectBlock_double_id, SubjectBlock_three_left_id, SubjectBlock_three_top_id, SubjectBlock_n_two_id];
let blockArr = ['BannerBlock', 'HotBrandBlock', 'GoodsBlock', 'SubjectBlock', 'RecommendBlock', 'SubjectBlock_single',
  'SubjectBlock_double', 'SubjectBlock_three_left', 'SubjectBlock_three_top', 'SubjectBlock_n_two'];
let block_id_obj = {};
//获取首页数据（小程序改版假数据）
let homepageNewData = util.HOMEPAGE_NEW_DATA;
//递归取主题商品列表

var getSubjectDataRequest1 = (arr, callback) => {
  if (turn == 'on') {
    i = 0;
    array = [];
  };
  i++;
  if (i > arr.length || i > 45) {
    callback(array);
    return;
  };
  var subject_target_id_url = util.URL_ROOT + '/aggregator/' + arr[i - 1].item_target.target_id + '/41/entity?limit=10';
  util.requestGet(subject_target_id_url, function (res) {
    array.push(res);
    turn = 'off';
    getSubjectDataRequest1(arr, callback);
  })
};

var getSubjectDataRequest2 = (arr, callback) => {
  if (turn == 'on') {
    j = 0;
    array2 = [];
  };
  j++;
  if (j > arr.length || j > 40) {
    callback(array2);
    return;
  };
  var subject_target_id_url = util.URL_ROOT + '/aggregator/' + arr[j - 1].item_target.target_id + '/41/entity?limit=10';
  util.requestGet(subject_target_id_url, function (res) {
    array2.push(res);
    turn = 'off';
    getSubjectDataRequest2(arr, callback);
  })
};


var getSubjectDataRequest3 = (arr, callback) => {
  if (turn == 'on') {
    k = 0;
    array3 = [];
  };
  k++;
  if (k > arr.length || k > 40) {
    callback(array3);
    return;
  };
  var subject_target_id_url = util.URL_ROOT + '/aggregator/' + arr[k - 1].item_target.target_id + '/41/entity?limit=10';
  util.requestGet(subject_target_id_url, function (res) {
    array3.push(res);
    turn = 'off';
    getSubjectDataRequest3(arr, callback);
  })
};


var getSubjectDataRequest4 = (arr, callback) => {
  if (turn == 'on') {
    l = 0;
    array4 = [];
  };
  l++;
  if (l > arr.length || l > 40) {
    callback(array4);
    return;
  };
  var subject_target_id_url = util.URL_ROOT + '/aggregator/' + arr[l - 1].item_target.target_id + '/41/entity?limit=10';
  util.requestGet(subject_target_id_url, function (res) {
    array4.push(res);
    turn = 'off';
    getSubjectDataRequest4(arr, callback);
  })
};

//首页各栏目名数据请求 
var get_list = function (that) {
  WNTSLoadIcon.loading(function (res) {
    that.setData({
      animationData: res,
      show: true
    });
  });
  wx.getSystemInfo({
    success: function (res) {
      that.setData({
        winWidth: res.windowWidth,
        winHeight: res.windowHeight
      });
    }
  });
  block_id_obj.BannerBlock_id = BannerBlock_id
  block_id_obj.HotBrandBlock_id = HotBrandBlock_id;
  block_id_obj.GoodsBlock_id = GoodsBlock_id;
  block_id_obj.SubjectBlock_id = SubjectBlock_id;
  block_id_obj.RecommendBlock_id = RecommendBlock_id;
  block_id_obj.SubjectBlock_single_id = SubjectBlock_single_id;
  block_id_obj.SubjectBlock_double_id = SubjectBlock_double_id;
  block_id_obj.SubjectBlock_three_left_id = SubjectBlock_three_left_id;
  block_id_obj.SubjectBlock_three_top_id = SubjectBlock_three_top_id;
  block_id_obj.SubjectBlock_n_two_id = SubjectBlock_n_two_id;
  var miniParterm = that.data.checkOutMiniProgramDataBool ? that.data.MiniProgramDataWithParterm : "";
  //获取tab 数据
  util.requestGet(WNTSApi.tabsUrl + miniParterm, function (data) {
    that.setData({
      tabs: data.tabs
    });
    var currentTabUrl = WNTSApi.tabIdUrl + (that.data.currentTabId ? that.data.currentTabId : 1) + miniParterm;
    //请求整个页面的数据（轮播图、热门品牌、layout、主题）
    util.requestGet(currentTabUrl, function (data) {
      var data = data;
      console.log(data);
      var blocksArr = data.blocks;
      var blockIdArr = [];
      for (var a = 0; a < blocksArr.length; a++) {
        if (blocksArr[a].block_id == 4) {
          blockIdArr.push(a);
          that.setData({
            blockIdArr: blockIdArr,
          });
        };
      };
      blocksIdArr = [];
      WNTSLoadIcon.hidden(function (res) {
        that.setData({
          animationData: res,
          show: false
        });
      });
      that.setData({
        tabIdData: data
      });
      that.setData({
        BannerBlock: [],
        HotBrandBlock: [],
        GoodsBlock: [],
        SubjectBlock: [],
        guessLike: [],
        RecommendBlock_idShow: true,
        cuttentTab_tags: data.tab_tags,
      });
      blockArrNew = [];
      for (var i = 0; i < data.blocks.length; i++) {
        var blockData = data.blocks[i];
        blocksIdArr.push(data.blocks[i].block_id);
        for (var b = 0; b < blockArr.length; b++) {
          if (block_id_obj[blockArr[b] + '_id'] == blockData.block_id) {
            blockArrNew.push(blockArr[b]);
          };
        };
        that.setData({
          blockArrNew: blockArrNew
        });
        switch (blockData.block_id) {
          case BannerBlock_id:
            {
              //轮播
              that.setData({
                BannerBlock: blockData.block_items
              });
              blockStatus.BannerBlock = that.data.BannerBlock;
            }
            break;
          case HotBrandBlock_id:
            {
              //热门品牌
              that.setData({
                HotBrandBlock: blockData.block_items
              });
              blockStatus.HotBrandBlock = that.data.HotBrandBlock;
            }
            break;
          case GoodsBlock_id:
            {
              //优选精品
              that.setData({
                GoodsBlock: blockData.block_items
              });
              blockStatus.GoodsBlock = that.data.GoodsBlock;
            }
            break;
          case SubjectBlock_id:
            {
              //主题
              subjectArray = [];
              var subjectArrayItem = blockData.block_items;
              if (that.data.checkOutMiniProgramDataBool==true){
                subjectArrayItems.push(subjectArrayItem[0]);
                for (var m = 0; m < subjectArrayItems.length; m++) {
                  var itemData = [];
                  for (var j = 0; j < 5; j++) {
                    var newProductEntity = {};//精简的
                    newProductEntity.imgs = "";
                    newProductEntity.small_img = "";
                    newProductEntity.title = "";
                    itemData.push(newProductEntity);
                  }
                  subjectArrayItems[m].itemData = itemData;
                };
                that.setData({
                  SubjectBlock: subjectArrayItems,
                });
              }else{
                for (var m = 0; m < subjectArrayItem.length; m++) {
                  var itemData = [];
                  for (var j = 0; j < 5; j++) {
                    var newProductEntity = {};//精简的
                    newProductEntity.imgs = "";
                    newProductEntity.small_img = "";
                    newProductEntity.title = "";
                    itemData.push(newProductEntity);
                  }
                  subjectArrayItem[m].itemData = itemData;
                };
                that.setData({
                  SubjectBlock: subjectArrayItem,
                });
              };
              
              var subjectBlock = that.data.SubjectBlock;//主题列表（暂时不包括子列表）
              if (!subjectBlock) {
                return;
              }
              getSubjectDataRequest1(subjectBlock, function (res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {};//精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    itemData.push(newProductEntity);
                  }
                  subjectBlock[i].itemData = itemData;
                  subjectBlock[i].display_style = parseFloat(subjectBlock[i].display_style);
                }
                //主题列表（set子列表进去）
                that.setData({
                  SubjectBlock: subjectBlock
                });
                console.log(that.data.SubjectBlock);
                that.loadMore();//获取猜你喜欢数据
              });
              blockStatus.SubjectBlock = that.data.SubjectBlock;
            }
            break;
          case RecommendBlock_id:
            {
              that.setData({
                RecommendBlock_idShow: true,//走到这说明需要显示猜你喜欢
              });
            }
            break;
          case SubjectBlock_single_id:
            {
              that.setData({
                SubjectBlock_single: blockData.block_items
              });
              blockStatus.SubjectBlock_single = that.data.SubjectBlock_single;
            }
            break;
          case SubjectBlock_double_id:
            {
              var subjectArray = blockData.block_items;
              for (var m = 0; m < subjectArray.length; m++) {
                var itemData = [];
                for (var j = 0; j < 5; j++) {
                  var newProductEntity = {};//精简的
                  newProductEntity.imgs = "";
                  newProductEntity.small_img = "";
                  newProductEntity.tag_price = "";
                  newProductEntity.title = "";
                  itemData.push(newProductEntity);
                }
                subjectArray[m].itemData = itemData;
              };
              that.setData({
                SubjectBlock_double: subjectArray,
              });
              //双主题图
              var SubjectBlock_double = that.data.SubjectBlock_double;//主题列表（暂时不包括子列表）
              if (!SubjectBlock_double) {
                return;
              }
              getSubjectDataRequest4(SubjectBlock_double, function (res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {};//精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    itemData.push(newProductEntity);
                  }
                  SubjectBlock_double[i].itemData = itemData;
                }
                //主题列表（set子列表进去）
                that.setData({
                  SubjectBlock_double: SubjectBlock_double
                });
              });
              blockStatus.SubjectBlock_double = that.data.SubjectBlock_double;
            }
            break;
          case SubjectBlock_three_left_id:
            {
              var subjectArray = blockData.block_items;
              for (var m = 0; m < subjectArray.length; m++) {
                var itemData = [];
                for (var j = 0; j < 5; j++) {
                  var newProductEntity = {};//精简的
                  newProductEntity.imgs = "";
                  newProductEntity.small_img = "";
                  newProductEntity.tag_price = "";
                  newProductEntity.title = "";
                  itemData.push(newProductEntity);
                }
                subjectArray[m].itemData = itemData;
              };
              that.setData({
                SubjectBlock_three_left: subjectArray,
              });
              //三块主题图（左边面积最大块）
              var SubjectBlock_three_left = that.data.SubjectBlock_three_left;//主题列表（暂时不包括子列表）

              if (!SubjectBlock_three_left) {
                return;
              }
              getSubjectDataRequest2(SubjectBlock_three_left, function (res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {};//精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    itemData.push(newProductEntity);
                  }
                  SubjectBlock_three_left[i].itemData = itemData;
                }
                //主题列表（set子列表进去）
                that.setData({
                  SubjectBlock_three_left: SubjectBlock_three_left,
                  three_left: 'on'
                });
              });
              blockStatus.SubjectBlock_three_left = that.data.SubjectBlock_three_left;
            }
            break;
          case SubjectBlock_three_top_id:
            {
              var subjectArray = blockData.block_items;
              for (var m = 0; m < subjectArray.length; m++) {
                var itemData = [];
                for (var j = 0; j < 5; j++) {
                  var newProductEntity = {};//精简的
                  newProductEntity.imgs = "";
                  newProductEntity.small_img = "";
                  //newProductEntity.price = "";
                  newProductEntity.tag_price = "";
                  newProductEntity.title = "";
                  itemData.push(newProductEntity);
                }
                subjectArray[m].itemData = itemData;
              };
              that.setData({
                SubjectBlock_three_top: subjectArray,
              });
              //三块主题图（上边面积最大块）
              var SubjectBlock_three_top = that.data.SubjectBlock_three_top;//主题列表（暂时不包括子列表）
              if (!SubjectBlock_three_top) {
                return;
              }
              getSubjectDataRequest3(SubjectBlock_three_top, function (res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {};//精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    itemData.push(newProductEntity);
                  }
                  SubjectBlock_three_top[i].itemData = itemData;
                }
                //主题列表（set子列表进去）
                that.setData({
                  SubjectBlock_three_top: SubjectBlock_three_top,
                  three_top: 'on'
                });
              });
              blockStatus.SubjectBlock_three_top = that.data.SubjectBlock_three_top;
            }
            break;
          case SubjectBlock_n_two_id:
            {
              if (blockData.block_title == '') {
                that.setData({
                  block_title: '为你推荐',
                  block_subtitle: '专业买手为你推荐'
                });
              };
              that.setData({
                SubjectBlock_n_two: blockData
              });
              blockStatus.SubjectBlock_n_two = that.data.SubjectBlock_n_two;
            }
            break;
          default:
            break;
        }
      };
    });
  });
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    MiniProgramDataWithParterm: "?app=miniapp",
    debug: false,//false布局跟线上一致 true布局2
    checkOutMiniProgramDataBool: false,//true小程序数据，falseWANTS数据
    display_style: 1,//主题布局种类
    RecommendBlock_idShow: false,//默认不显示猜你喜欢
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    tabIdData: [],//一整页的数据
    BannerBlock: [],//轮播数据
    HotBrandBlock: [],//热门品牌数据
    GoodsBlock: [],//优选精品数据
    SubjectBlock: [],//主题数据
    RecommendBlock: [],//推荐数据
    SubjectBlock_single: [],//单图主题
    SubjectBlock_three_left: [],//三图主题(面积最大块在左边)
    SubjectBlock_three_top: [],//三图主题(面积最大块在上边)
    SubjectBlock_double: [],//双主题图
    SubjectBlock_n_two: [],
    currentTabId: 1,//当前tabId
    currentIndex: 0,//当前点击的tab的index
    cuttentTab_tags: null,
    tipsSrc: '../WANTSImages/tipsOff.png',
    winWidth: 0,
    winHeight: 0,
    tabs: null,//主标题列表
    randomColor: [],
    position: 'static',
    top: '',
    guessLike: [],
    page: 1,//默认多加载一次 故初始值使用-1
    limit: 15,
    offset: 0,
    guessLikeTitle: '',
    show: false,
    animationData: null,
    randomBackgroundColor: [],
    homePage: 'old',
    default_item_id: 0,
    three_top: 'off',
    three_left: 'off',
    homePageArr: [],
    blockStatus: '',
    blockArrNew: [],
    imgOnloadStatus: false,
    backgroundColorStatus: true,
    block_title: '',
    block_subtitle: '',
    blockIdArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    get_list(that);
    that.setData({
      randomBackgroundColor: ['#2F4C52', '#414D65', '#A3A093', '#8F5B56', '#DDE8DE', '#F2E6F7', '#D0F6F9', '#F4F6B6', '#EFADCD']
    });
    for (var h = 0; h < that.data.homePageArr.length; h++) {
      if (that.data.homePageArr[h] == 1) {
        that.setData({
          blockStatus: that.data.BannerBlock
        });
      };
    };
  },
  //加载更多
  loadMore(loadMoreBool) {
    wx.stopPullDownRefresh();
    var that = this;
    if (that.data.RecommendBlock_idShow == false) return;
    var loadType = 0;//none
    var offset = 0;
    that.setData({
      guessLikeTitle: '猜你喜欢'
    });

    if (loadMoreBool) {
      var newPage = that.data.page;
      newPage++;
      loadType = 1 << 1;//2 loadmore
      offset = newPage * that.data.limit;
      that.setData({
        page: newPage,
        offset: offset,
      });
    } else {
      loadType = 1 << 0;//1 refresh
      offset = 0;
    };

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
    };
    that.setData({
      loaddingContext: "加载更多..."
    });
    var cuttTags = '';
    if (that.data.cuttentTab_tags) {
      cuttTags = '&target=' + that.data.cuttentTab_tags;
    };

    var recommendUrl = WNTSApi.recommendApi + '?scene=0&offset=' + that.data.offset
      + '&limit=' + that.data.limit + '&tabId=' + that.data.currentTabId + cuttTags;
    util.requestGet(recommendUrl, function (data) {
      var temp = util.getGessLikeDataTool(data);
      if (data.length == 0) {
        util.requestGet(recommendUrl, function (data) {

        });
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
  imageLoad: function (event) {
    var that = this;
    that.setData({
      imgOnloadStatus: true,
      backgroundColorStatus: false
    });
  },
  //进入商品详情页
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
    this.navigateToProductDetail(json_string);
  },
  //跳转主题点击更多
  band_touch: function (e) {
    var subjectItem = {};
    subjectItem.themeId = e.currentTarget.dataset.target;
    subjectItem.target_title = e.currentTarget.dataset.item_title;
    this.navigateToSubjectDetail(JSON.stringify(subjectItem));
  },
  fiveJumpToPageWithItemType(item) {
    var that = this;
    var item_type = item.item_type;
    item_type = parseFloat(item_type);
    switch (item_type) {
      case WSMMallLayoutTargetTypeProductDetail:
        //跳转到商品详情 productId=target_id
        var subject_product_all = {};
        subject_product_all.product_id = item.item_target.target_id;
        // "94094";
        var json_string = JSON.stringify(subject_product_all);
        this.navigateToProductDetail(json_string);
        break;
      case WSMMallLayoutTargetTypeSellerProfile:
        // uid=target_id
        break;
      case WSMMallLayoutTargetTypeSubjectDetail: {
        //ThemeId=target_id、 target_title
        var subjectItem = {};
        subjectItem.themeId = item.item_target.target_id;
        subjectItem.target_title = item.item_target.target_title;
        that.navigateToSubjectDetail(JSON.stringify(subjectItem));
      }
        break;
      case WSMMallLayoutTargetTypeProductOfKeywords: {
        //Keywords=target_content
        that.navigateToSerchPage(item.item_target.target_content);
      }
        break;
      case WSMMallLayoutTargetTypeWeb: {
        //Url:target_content
        //暂不支持...
      }
        break;
      case WSMMallLayoutTargetTypeTab: {
        //tabIdx = target_id切换tab
      }
        break;
      default:
        break;
    }//pop_item
  },
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
  serviceMsg(e) {
    var that = this;
    util.checkLoginStatus(function (isLogined) {
      //联系商家

    }, function (isNotLogin) {
      wx.navigateTo({
        url: '../WNTSLoginPage/WNTSLoginPage?fromTo=home'
      })
    });
  },
  //单纯跳转搜索界面
  search_touch: function (e) {
    this.navigateToSerchPage();
  },
  navigateToSerchPage(keywoeds) {
    var url = "";
    if (keywoeds) {
      url = '../WNTSSearch/WNTSSearch?keywoeds=' + keywoeds;
    } else {
      url = '../WNTSSearch/WNTSSearch';
    }
    wx.navigateTo({
      url: url
    })
  },
  navigateToSubjectDetail(subjectItem) {
    wx.navigateTo({
      url: '../WNTSBandDetail/WNTSBandDetail?subjectItem=' + subjectItem
    })
  },
  navigateToProductDetail(product) {
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + product
    })
  },
  popBandClick: function (e) {
    var that = this;
    that.fiveJumpToPageWithItemType(e.currentTarget.dataset.pop_item);
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
    var that = this;
    var newPage = 0;
    var loadType = 0;
    var offset = 0;
    // newPage++;
    loadType = 1 << 1;//2 loadmore
    offset = newPage * that.data.limit;
    that.setData({
      page: newPage,
      offset: offset
    });
    get_list(that);
  },
  onReachBottom() {
    var that = this;
    that.loadMore(true);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 用户滚动页面
  onPageScroll: function (res) {
    if (res.scrollTop >= 44.5) {
      this.setData({
        position: 'fixed', top: 0, zIndex: 9999
      })
    } else {
      this.setData({
        position: 'static', top: '', zIndex: ''
      })
    }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.current;

    var newPage = 0;
    var loadType = 0;
    var offset = 0;
    if (this.data.currentIndex === e.target.dataset.current) {
      return false;
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
      });
      turn = 'on';
      var currentTabId = that.data.tabs[index].id;
      // newPage++;
      loadType = 1 << 1;//2 loadmore
      offset = newPage * that.data.limit;

      that.setData({
        currentIndex: index,
        currentTabId: currentTabId,
        page: newPage,
        offset: offset
      })
      get_list(that);
    }
  }
})