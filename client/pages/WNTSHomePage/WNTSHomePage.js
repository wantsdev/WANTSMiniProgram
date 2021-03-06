// pages/WNTSHomePage/WNTSHomePage.js
var util = require('../../utils/util.js');
var WNTSApi = require('../../utils/WNTSApi.js');
var WNTSLoadIcon = require('../../utils/WNTSLoadIcon.js');
var WNTSUserInfo = require("../../vendor/wafer2-client-sdk/lib/WNTSUserInfo.js");
// var WNTSSource = require("../../vendor/wafer2-client-sdk/lib/WNTSSource.js");
var WNTSGenderTurn = require("../../vendor/wafer2-client-sdk/lib/genderTurn.js");
var login = require('../../vendor/wafer2-client-sdk/lib/login.js');
//var CONF = require('../../../server/config.js');
var miniAppId = 'wx74a29a2f9afbb4b0';
var miniSecret = '5b5a14f7b6654e0b6833cee195434b39';
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
var t = 0;
var s = 0;
var optionNum = 0;
var blocksIdArr = [];
var blockArrNew = [];
var subjectArrayItems = [];
var subjectArrayItem = [];
var GoodsBlockArr = [];
var GoodsBlockObjArr = [];
var subjectArrayItemChunks = [];
var subjectArrayItemChunk;
var subjectArrayItemChunkTotal;
var PageScroll;
var s = 0;
var App_id = "h6ybil3f9xuqws98h4";
var WNTSToken = require("../../vendor/wafer2-client-sdk/lib/WNTSToken.js");
var BannerBlockArr;
var SubjectBlock_new_16;
var SubjectBlock_new_14;
var SubjectBlock_new_12;
var subjectArrayNew;
var originArrItems;
var subjectBlockArrNew;
var genderSwitchButton;
var blocksIdArrToString;
var init = function() {
  app = getApp();
  blockStatus = {};
  array = [];
  array2 = [];
  array3 = [];
  array4 = [];
  turn = 'off';
  i = 0;
  j = 0;
  k = 0;
  l = 0;
  t = 0;
  s = 0;
  optionNum = 0;
  blocksIdArr = [];
  blockArrNew = [];
  subjectArrayItems = [];
  subjectArrayItem = [];
  GoodsBlockArr = [];
  GoodsBlockObjArr = [];
  subjectArrayItemChunks = [];
  subjectArrayItemChunk = []
  subjectArrayItemChunkTotal = [];
  PageScroll;
  s = 0;
  BannerBlockArr = [];
  SubjectBlock_new_16 = [];
  SubjectBlock_new_14 = [];
  SubjectBlock_new_12 = [];
  subjectArrayNew = [];
};
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
let BannerBlock_id = 1; //轮播
let HotBrandBlock_id = 2; //热门品牌
let GoodsBlock_id = 3; //优选精品
let SubjectBlock_id = 4 || 19; //主题
let RecommendBlock_id = 20; //推荐
let SubjectBlock_single_id = 6; //单个主题图的主题
let SubjectBlock_double_id = 7; //两个主题图的主题
let SubjectBlock_three_left_id = 8; //三个主题图的主题（面积最大块的主题图在左边）
let SubjectBlock_three_top_id = 9; //三个主题图的主题（面积最大块的主题图在上边）
let SubjectBlock_n_two_id = 10; //n行2列主题图的主题
let SubjectBlock_new_11_id = 11; //高度可浮动的banner
let SubjectBlock_new_12_id = 12; //四块精品
let SubjectBlock_new_13_id = 13; //五块精品
let SubjectBlock_new_14_id = 14; //六块精品
let SubjectBlock_new_15_id = 15; //七块精品
let SubjectBlock_new_16_id = 16; //八块精品
let SubjectBlock_new_17_id = 17; //九块精品
let SubjectBlock_new_18_id = 18; //H5区域
let blockIdArr = [BannerBlock_id, HotBrandBlock_id, GoodsBlock_id, SubjectBlock_id, RecommendBlock_id, SubjectBlock_single_id,
  SubjectBlock_double_id, SubjectBlock_three_left_id, SubjectBlock_three_top_id, SubjectBlock_n_two_id, SubjectBlock_new_11_id, SubjectBlock_new_12_id, SubjectBlock_new_13_id, SubjectBlock_new_14_id, SubjectBlock_new_15_id, SubjectBlock_new_16_id, SubjectBlock_new_17_id, SubjectBlock_new_18_id
];
let blockArr = ['BannerBlock', 'HotBrandBlock', 'GoodsBlock', 'SubjectBlock', 'RecommendBlock', 'SubjectBlock_single',
  'SubjectBlock_double', 'SubjectBlock_three_left', 'SubjectBlock_three_top', 'SubjectBlock_n_two', 'SubjectBlock_new_11', 'SubjectBlock_new_12', 'SubjectBlock_new_13', 'SubjectBlock_new_14', 'SubjectBlock_new_15', 'SubjectBlock_new_16', 'SubjectBlock_new_17', 'SubjectBlock_new_18'
];
let block_id_obj = {};
//获取首页数据（小程序改版假数据）
// let newModuleData = util.NEW_MODULE_DATA;
// let newModuleDataUrl = 'http://redmine.wantscart.com/attachment/jsondata.json';

// //获取工厂店板块数据
// var factoryData = function() {
//   var factoryUrl = WNTSApi.tabIdUrl + '99999';
//   util.requestGet(factoryUrl, function(res) {
//     var factoryBlock = res.data.blocks[0].block_items[0].item_target.target_content;
//   })
// };
// factoryData();
//递归取主题商品列表
var getSubjectDataRequest1 = (arr, num, max, callback) => {
  if (turn == 'on') {
    console.log('清空数组');
    i = num;
    array = [];
  };
  i++;
  if (i > num + 5 || i > max) {
    console.log(array);
    callback(array);
    return;
  };
  var subject_target_id_url = util.URL_ROOT + '/aggregator/' + arr[i - 1].item_target.target_id + '/41/entity?limit=10';
  console.log(subject_target_id_url);
  util.requestGet(subject_target_id_url, function(res) {
    console.log(res);
    array.push(res);
    turn = 'off';
    getSubjectDataRequest1(arr, num, max, callback);
  }, function(res) {})
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
  util.requestGet(subject_target_id_url, function(res) {
    array2.push(res);
    turn = 'off';
    getSubjectDataRequest2(arr, callback);
  }, function(res) {})
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
  util.requestGet(subject_target_id_url, function(res) {
    array3.push(res);
    turn = 'off';
    getSubjectDataRequest3(arr, callback);
  }, function(res) {})
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
  util.requestGet(subject_target_id_url, function(res) {
    array4.push(res);
    turn = 'off';
    getSubjectDataRequest4(arr, callback);
  }, function(res) {})
};

//首页各栏目名数据请求 
var get_list = function(that) {
  WNTSLoadIcon.loading(function(res) {
    that.setData({
      animationData: res,
      show: true
    });
  });
  wx.getSystemInfo({
    success: function(res) {
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
  block_id_obj.SubjectBlock_new_11_id = SubjectBlock_new_11_id;
  block_id_obj.SubjectBlock_new_12_id = SubjectBlock_new_12_id;
  block_id_obj.SubjectBlock_new_13_id = SubjectBlock_new_13_id;
  block_id_obj.SubjectBlock_new_14_id = SubjectBlock_new_14_id;
  block_id_obj.SubjectBlock_new_15_id = SubjectBlock_new_15_id;
  block_id_obj.SubjectBlock_new_16_id = SubjectBlock_new_16_id;
  block_id_obj.SubjectBlock_new_17_id = SubjectBlock_new_17_id;
  block_id_obj.SubjectBlock_new_18_id = SubjectBlock_new_18_id;

  var miniParterm = that.data.checkOutMiniProgramDataBool ? that.data.MiniProgramDataWithParterm : "";
  var tabUrl = WNTSApi.tabsUrl + miniParterm;
  // var newTabUrl = encodeURI(tabUrl);
  util.requestGet(WNTSApi.tabsUrl + miniParterm, function(res) {
    //工厂店的tabName加入
    // var factoryTabName = {
    //   id: 99999,
    //   name: "工厂店"
    // };
    var tabsName = res.data.tabs;
    //tabsName.splice(1, 0, factoryTabName);
    that.setData({
      tabs: tabsName
    });
    var currentTabUrl = WNTSApi.tabIdUrl + (that.data.currentTabId ? that.data.currentTabId : 1) + miniParterm;
    var currentTabUrlNew = util.trim(currentTabUrl);
    //请求整个页面的数据（轮播图、热门品牌、layout、主题）
    util.requestGet(currentTabUrlNew, function(res) {
      var data = res.data;
      console.log(data);
      var blocksArr = data.blocks;
      var blockIdArr = [];
      console.log(blocksArr);
      that.setData({
        blocks: data.blocks
      });
      for (var a = 0; a < blocksArr.length; a++) {
        if (blocksArr[a].block_id !== 4) {
          //   that.getGussLikeData();
          that.setData({
            guessLikeStartLoading: true
          });
        };
        if (blocksArr[a].block_id == 3) {
          blockIdArr.push(a);
          that.setData({
            blockIdArr: blockIdArr
          });
        };
        if (blocksArr[a].block_id == 20) {
          that.setData({
            blockType: true
          });
        };
        var locationIndex = blocksArr[a].block_location - 1;
        // // locationArr.push(locationIndex);
        // that.setData({
        //   locationArr: locationArr
        // });
      };
      blocksIdArr = [];
      WNTSLoadIcon.hidden(function(res) {
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
      GoodsBlockArr = [];
      GoodsBlockObjArr = [];
      for (var i = 0; i < data.blocks.length; i++) {
        var blockData = data.blocks[i];
        var locationId = data.blocks[i].block_location;
        blocksIdArr.push(data.blocks[i].block_id);
        for (var b = 0; b < blockArr.length; b++) {
          if (block_id_obj[blockArr[b] + '_id'] == blockData.block_id) {
            blockArrNew.push(blockArr[b]);
          };
        };
        that.setData({
          blockArrNew: blockArrNew,
          locationId: locationId
        });
        switch (blockData.block_id) {

          case BannerBlock_id:
            {
              //判断内容
              var location = blockData.block_location;
              var locationIndex = location - 1;
              BannerBlockArr.push(blocksArr[locationIndex]);
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
              GoodsBlockArr.push(blockData.block_items);
              GoodsBlockObjArr.push(blockData);
              that.setData({
                GoodsBlock: blockData.block_items,
                GoodsBlockArrOne: GoodsBlockArr[0],
                GoodsBlockArrTwo: GoodsBlockArr[1],
                GoodsBlockObjArr: GoodsBlockObjArr
              });
              var goodBlocksDataType = typeof(that.data.GoodsBlockArrTwo);
              if (goodBlocksDataType == 'undefined') {
                that.setData({
                  goodBlocksTurn: false
                });
              } else {
                that.setData({
                  goodBlocksTurn: true
                });
              };
              blockStatus.GoodsBlock = that.data.GoodsBlock;
            }
            break;
          case SubjectBlock_id:
            {
              //主题
              console.log(blockData);
              var location = blockData.block_location;
              var locationIndex = location - 1;
              subjectArrayNew.push(blocksArr[locationIndex]);
              console.log(subjectArrayNew);
            }
            break;
          case RecommendBlock_id:
            {
              // console.log(RecommendBlock_id);
              // that.setData({
              //   RecommendBlock_idShow: true, //走到这说明需要显示猜你喜欢
              // });
              console.log(blockData);
              var location = blockData.block_location;
              var locationIndex = location - 1;
              var RecommendBlockTargetId = blocksArr[locationIndex].block_items[0].item_target.target_id;
              var RecommendBlockTargetTitle = blocksArr[locationIndex].block_items[0].item_target.target_title;
              console.log(RecommendBlockTargetId);
              console.log(RecommendBlockTargetTitle);
              that.setData({
                RecommendBlockTargetId,
                RecommendBlockTargetTitle,
                blockType: true,
                startLoading: false
              });
              that.guessLikeLoadMore(true);
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
                  var newProductEntity = {}; //精简的
                  newProductEntity.imgs = "";
                  newProductEntity.small_img = "";
                  newProductEntity.tag_price = "";
                  newProductEntity.title = "";
                  newProductEntity.shop_show = "";
                  itemData.push(newProductEntity);
                }
                subjectArray[m].itemData = itemData;
              };
              that.setData({
                SubjectBlock_double: subjectArray,
              });
              //双主题图
              var SubjectBlock_double = that.data.SubjectBlock_double; //主题列表（暂时不包括子列表）
              if (!SubjectBlock_double) {
                return;
              };
              getSubjectDataRequest4(SubjectBlock_double, function(res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {}; //精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    newProductEntity.shop_show = that.data.checkOutMiniProgramDataBool;
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
                  var newProductEntity = {}; //精简的
                  newProductEntity.imgs = "";
                  newProductEntity.small_img = "";
                  newProductEntity.tag_price = "";
                  newProductEntity.title = "";
                  newProductEntity.shop_show = "";
                  itemData.push(newProductEntity);
                }
                subjectArray[m].itemData = itemData;
              };
              that.setData({
                SubjectBlock_three_left: subjectArray,
              });
              //三块主题图（左边面积最大块）
              var SubjectBlock_three_left = that.data.SubjectBlock_three_left; //主题列表（暂时不包括子列表）

              if (!SubjectBlock_three_left) {
                return;
              }
              getSubjectDataRequest2(SubjectBlock_three_left, function(res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {}; //精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    newProductEntity.shop_show = that.data.checkOutMiniProgramDataBool;
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
                  var newProductEntity = {}; //精简的
                  newProductEntity.imgs = "";
                  newProductEntity.small_img = "";
                  //newProductEntity.price = "";
                  newProductEntity.tag_price = "";
                  newProductEntity.title = "";
                  newProductEntity.shop_show = "";
                  itemData.push(newProductEntity);
                }
                subjectArray[m].itemData = itemData;
              };
              that.setData({
                SubjectBlock_three_top: subjectArray,
              });
              //三块主题图（上边面积最大块）
              var SubjectBlock_three_top = that.data.SubjectBlock_three_top; //主题列表（暂时不包括子列表）
              if (!SubjectBlock_three_top) {
                return;
              }
              getSubjectDataRequest3(SubjectBlock_three_top, function(res) {
                for (var i = 0; i < res.length; i++) {
                  var subjectItems = res[i];
                  var itemData = [];
                  for (var j = 0; j < subjectItems.length; j++) {
                    var productEntity = subjectItems[j].entity;
                    var newProductEntity = {}; //精简的
                    newProductEntity.imgs = productEntity.imgs;
                    newProductEntity.small_img = productEntity.small_img;
                    newProductEntity.price = productEntity.price;
                    newProductEntity.tag_price = productEntity.tag_price;
                    newProductEntity.title = productEntity.title;
                    newProductEntity.id = productEntity.id;
                    newProductEntity.shop_show = that.data.checkOutMiniProgramDataBool;
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
          case SubjectBlock_new_11_id:
            {
              //判断内容
              that.setData({
                SubjectBlock_new_11: blockData
              });
              blockStatus.SubjectBlock_new_11 = that.data.SubjectBlock_new_11;
            }
            break;
          case SubjectBlock_new_12_id:
            {
              //判断内容
              var location = blockData.block_location;
              var locationIndex = location - 1;
              SubjectBlock_new_12.push(blocksArr[locationIndex]);
            }
            break;
          case SubjectBlock_new_13_id:
            {
              //判断内容
              that.setData({
                SubjectBlock_new_13: blockData
              });
              blockStatus.SubjectBlock_new_13 = that.data.SubjectBlock_new_13;
            }
            break;
          case SubjectBlock_new_14_id:
            {
              //判断内容
              var location = blockData.block_location;
              var locationIndex = location - 1;
              SubjectBlock_new_14.push(blocksArr[locationIndex]);
            }
            break;
          case SubjectBlock_new_15_id:
            {
              //判断内容
              that.setData({
                SubjectBlock_new_15: blockData
              });
              blockStatus.SubjectBlock_new_15 = that.data.SubjectBlock_new_15;
            }
            break;
          case SubjectBlock_new_16_id:
            {
              //判断内容
              var location = blockData.block_location;
              var locationIndex = location - 1;
              SubjectBlock_new_16.push(blocksArr[locationIndex]);
            }
            break;
          case SubjectBlock_new_17_id:
            {
              //判断内容
              that.setData({
                SubjectBlock_new_17: blockData
              });
              blockStatus.SubjectBlock_new_17 = that.data.SubjectBlock_new_17;
            }
            break;
          case SubjectBlock_new_18_id:
            {
              //判断内容
              that.setData({
                SubjectBlock_new_18: blockData
              });
              blockStatus.SubjectBlock_new_18 = that.data.SubjectBlock_new_18;
            }
            break;
          default:
            break;
        };
      };
      // console.log(blocksIdArr);
      // blocksIdArrToString = blocksIdArr.join(' ');
      // console.log(blocksIdArrToString);
      // console.log(blocksIdArr.indexOf(4));
      if (blocksIdArr.indexOf(4)<0){
        // console.log('6666666666666666');
        that.setData({
          startLoading: true
        });
      }else{
        // console.log('88888888888');
        that.setData({
          startLoading: false
        });
      };
      that.setData({
        BannerBlockArr,
        SubjectBlock_new_16,
        SubjectBlock_new_14,
        SubjectBlock_new_12,
        subjectArrayNew,
      });
      that.subjectBlockFilter(that.data.subjectArrayNew);
    }, function(res) {});
  }, function(res) {});
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    MiniProgramDataWithParterm: "?app=miniapp",
    debug: false, //false布局跟线上一致 true布局2
    checkOutMiniProgramDataBool: true, //true小程序数据，falseWANTS数据
    display_style: 1, //主题布局种类
    RecommendBlock_idShow: false, //默认不显示猜你喜欢
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    tabIdData: [], //一整页的数据
    BannerBlock: [], //轮播数据
    HotBrandBlock: [], //热门品牌数据
    GoodsBlock: [], //优选精品数据
    SubjectBlock: [], //主题数据
    RecommendBlock: [], //推荐数据
    SubjectBlock_single: [], //单图主题
    SubjectBlock_three_left: [], //三图主题(面积最大块在左边)
    SubjectBlock_three_top: [], //三图主题(面积最大块在上边)
    SubjectBlock_double: [], //双主题图
    SubjectBlock_n_two: [],
    currentTabId: 1, //当前tabId
    currentIndex: 0, //当前点击的tab的index
    cuttentTab_tags: null,
    tipsSrc: '../WANTSImages/tipsOff.png',
    winWidth: 0,
    winHeight: 0,
    tabs: null, //主标题列表
    randomColor: [],
    position: 'static',
    top: '',
    guessLike: [],
    page: 1, //默认多加载一次 故初始值使用-1
    limit: 16,
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
    blockIdArr: [],
    bannerData: null,
    fourBlocksData: null,
    fiveBlocksData: null,
    factoryTurn: false,
    scrollTop: 0,
    startLoading: false,
    guessLikeLoadShow: false,
    GoodsBlockArrTwo: '',
    location: '',
    blocks: [],
    locationArr: [],
    location_one: false,
    location_two: false,
    location_three: false,
    guessLikeStartLoading: false,
    blockType: false,
    addToMyPgButton: true,
    addMyPgTurn: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var that = this;
    var formIdArr = getApp().globalData.formIdArr;
    //检测是否登录
    util.checkLoginStatus(function(isLogined) {
      //登录过 Nothing to do ...
    }, function(isNotLogin) {
      //未登录 
      // var source = option.source;
      // var sourceValidityBool = util.checkSourceValidityBoolWithSource(source);
      // if (sourceValidityBool) {
      //   WNTSSource.set(option.source);
      //   //登录 + source
      //   wx.redirectTo({
      //     url: '../WNTSLoginPage/WNTSLoginPage?fromTo=' + "home",
      //   })
      // } else {
      //   WNTSSource.clear(); //如果没有source清空本地source
      // }
    });

    // var codeNum = getApp().globalData.code;
    // //console.log(option);
    // console.log(codeNum);
    init();
    get_list(that);
    that.setData({
      randomBackgroundColor: ['#2F4C52', '#414D65', '#A3A093', '#8F5B56', '#DDE8DE', '#F2E6F7', '#D0F6F9', '#F4F6B6', '#EFADCD'],
      logoUrl: '../WANTSImages/logo.png'
    });
    for (var h = 0; h < that.data.homePageArr.length; h++) {
      if (that.data.homePageArr[h] == 1) {
        that.setData({
          blockStatus: that.data.BannerBlock
        });
      };
    };
    //新模板数据：
    //高度可浮动的banner：
    // util.requestGet();
    // var newBlocksArr = newModuleData.blocks;
    // for (var i = 0; i < newBlocksArr.length; i++) {
    //   var newBlockItem = newBlocksArr[i];
    //   if (newBlockItem.block_id == 11) {
    //     that.setData({
    //       bannerData: newBlockItem
    //     });
    //   } else if (newBlockItem.block_id == 12) {
    //     that.setData({
    //       fourBlocksData: newBlockItem
    //     });
    //   } else if (newBlockItem.block_id == 13) {
    //     that.setData({
    //       fiveBlocksData: newBlockItem
    //     });
    //   } else if (newBlockItem.block_id == 14) {
    //     that.setData({
    //       sixBlocksData: newBlockItem
    //     });
    //   } else if (newBlockItem.block_id == 15) {
    //     that.setData({
    //       sevenBlocksData: newBlockItem
    //     });
    //   } else if (newBlockItem.block_id == 16) {
    //     that.setData({
    //       eightBlocksData: newBlockItem
    //     });
    //   } else if (newBlockItem.block_id == 17) {
    //     that.setData({
    //       nineBlocksData: newBlockItem
    //     });
    //   }
    // };
  },
  //添加到我的小程序
  addToMyPg(e) {
    var that = this;
    that.setData({
      addMyPgTurn: true,
      addToMyPgButton: false
    });
  },
  //添加小程序按钮消失
  showOffToMyPg(e) {
    var that = this;
    that.setData({
      addMyPgTurn: false
    });
  },
  //切换男女
  turnGender(e) {
    var that = this;
    var index = 0;
    var newPage = 0;
    var loadType = 0;
    var offset = 0;
    genderSwitchButton = WNTSGenderTurn.get();
    console.log(genderSwitchButton);
    if (genderSwitchButton=='off'){
      WNTSGenderTurn.set('on');
      that.setData({
        logoUrl: '../WANTSImages/redFmdxLogo3x.png'
      });
      wx.showToast({
        title: '已切换为女版',
        duration: 3000
      })
    }else{
      WNTSGenderTurn.set('off');
      that.setData({
        logoUrl: '../WANTSImages/logo.png'
      });
      wx.showToast({
        title: '已切换为男版',
        duration: 3000
      })
    };
    init();
    wx.pageScrollTo({
      scrollTop: 0,
    });
    turn = 'on';
    var currentTabId = that.data.tabs[index].id;
    // newPage++;
    loadType = 1 << 1; //2 loadmore
    offset = newPage * that.data.limit;
    that.setData({
      currentIndex: index,
      currentTabId: currentTabId,
      page: newPage,
      offset: offset,
      startLoading: false,
      guessLikeLoadShow: false
    })
    get_list(that);
  },
  //主题页商品信息简化处理
  subjectBlockFilter(originArr) {
    var that = this;
    subjectBlockArrNew = [];
    console.log(originArr);
    for (var s = 0; s < originArr.length; s++) { //
      originArrItems = originArr[s].block_items;
      console.log(originArrItems);

      if (that.data.checkOutMiniProgramDataBool == true) {
        // subjectArrayItems.push(subjectArrayItem[0]);
        // console.log(subjectArrayItems);

        for (var m = 0; m < originArrItems.length; m++) {
          var itemData = [];
          for (var j = 0; j < 9; j++) {
            var newProductEntity = {}; //精简的
            newProductEntity.imgs = "";
            newProductEntity.small_img = "";
            newProductEntity.title = "";
            newProductEntity.shop_show = "";
            newProductEntity.promotion = "";
            newProductEntity.promotion_id = "";
            newProductEntity.promotion_label = "";
            newProductEntity.promotional = "";
            itemData.push(newProductEntity);
          }
          originArrItems[m].itemData = itemData;
          originArrItems[m].block_location = originArr[s].block_location;
        };

        that.setData({
          SubjectBlock: originArrItems,
        });
        console.log(that.data.SubjectBlock);
        console.log(that.data.SubjectBlock.length);
        if (that.data.SubjectBlock.length <= 1) {
          subjectBlockArrNew.push(originArrItems[0]);
        } else {
          subjectBlockArrNew = originArrItems;
        };
      } else {
        for (var m = 0; m < originArrItems.length; m++) {
          var itemData = [];
          for (var j = 0; j < 9; j++) {
            var newProductEntity = {}; //精简的
            newProductEntity.imgs = "";
            newProductEntity.small_img = "";
            newProductEntity.title = "";
            newProductEntity.shop_show = "";
            newProductEntity.promotion = "";
            newProductEntity.promotion_id = "";
            newProductEntity.promotion_label = "";
            newProductEntity.promotional = "";
            itemData.push(newProductEntity);
          }
          originArrItems[m].itemData = itemData;
          originArrItems[m].lookMore = '查看更多>';
        };
        that.setData({
          SubjectBlock: originArrItems[0],
        });
      };
      var subjectBlock = that.data.SubjectBlock; //主题列表（暂时不包括子列表）
      if (!subjectBlock) {
        return;
      }
      console.log(subjectBlock);
    };
    console.log(subjectBlockArrNew);

    getSubjectDataRequest1(subjectBlockArrNew, 0, subjectBlockArrNew.length, function(res) {
      for (var g = 0; g < res.length; g++) {
        var subjectItems = res[g];
        var itemData = [];
        console.log(res[g]);
        for (var j = 0; j < subjectItems.data.length; j++) {
          var productEntity = subjectItems.data[j].entity;
          // console.log(productEntity);
          var newProductEntity = {}; //精简的
          newProductEntity.title_prefix_url_label = productEntity.title_prefix_url_label;
          newProductEntity.imgs = productEntity.imgs;
          newProductEntity.small_img = productEntity.small_img;
          newProductEntity.price = productEntity.price;
          newProductEntity.tag_price = productEntity.tag_price;
          newProductEntity.title = productEntity.title;
          newProductEntity.id = productEntity.id;
          newProductEntity.category_id = productEntity.category_id;
          newProductEntity.promotion = productEntity.promotion;
          newProductEntity.promotion_id = productEntity.promotion_id;
          newProductEntity.promotion_label = productEntity.promotion_label;
          newProductEntity.promotional = productEntity.promotional;
          newProductEntity.shop_show = that.data.checkOutMiniProgramDataBool;
          itemData.push(newProductEntity);
        }
        subjectBlockArrNew[g].itemData = itemData;
        subjectBlockArrNew[g].display_style = parseFloat(subjectBlockArrNew[g].display_style);
      };
      that.guessLikeLoadMore();
      //主题列表（set子列表进去）
      console.log(subjectBlockArrNew);
      var subjectArrayItemChunk = util.chunk(subjectBlockArrNew, 5);
      console.log(subjectArrayItemChunk);
      subjectArrayItemChunkTotal = subjectArrayItemChunkTotal.concat(subjectArrayItemChunk[0]);
      that.setData({
        SubjectBlock: subjectArrayItemChunkTotal,
        SubjectBlockShow: true
      });
      console.log(subjectArrayItemChunkTotal);
      var maxIndex = subjectArrayItemChunkTotal.length - 1;
      for (var t = 0; t < subjectArrayItemChunkTotal.length; t++) {
        if (t < subjectArrayItemChunkTotal.length - 1) {
          if (subjectArrayItemChunkTotal[t].block_location !== subjectArrayItemChunkTotal[t + 1].block_location) {
            that.setData({
              loadingMoreShow: false
            });
          } else {
            that.setData({
              loadingMoreShow: true
            });
          }
        };
        if (subjectArrayItemChunkTotal[maxIndex]) {
          that.setData({
            loadingMoreShow: false
          });
        };
      };
    });
  },
  //主题数据加载更多
  subjectBlockLoadMore() {
    wx.stopPullDownRefresh();
    var that = this;
    var subjectBlockChunk = util.chunk(subjectBlockArrNew, 5);
    console.log(subjectBlockArrNew);
    optionNum = optionNum + 5;
    i = i - 1;
    getSubjectDataRequest1(subjectBlockArrNew, optionNum, subjectBlockArrNew.length, function(res) {
      for (var r = 0; r < res.length; r++) {
        var subjectItems = res[r];
        var itemData = [];
        for (var j = 0; j < subjectItems.data.length; j++) {
          var productEntity = subjectItems.data[j].entity;
          var newProductEntity = {}; //精简的
          newProductEntity.title_prefix_url_label = productEntity.title_prefix_url_label;
          newProductEntity.imgs = productEntity.imgs;
          newProductEntity.small_img = productEntity.small_img;
          newProductEntity.price = productEntity.price;
          newProductEntity.tag_price = productEntity.tag_price;
          newProductEntity.title = productEntity.title;
          newProductEntity.id = productEntity.id;
          newProductEntity.category_id = productEntity.category_id;
          newProductEntity.promotion = productEntity.promotion;
          newProductEntity.promotion_id = productEntity.promotion_id;
          newProductEntity.promotion_label = productEntity.promotion_label;
          newProductEntity.promotional = productEntity.promotional;
          newProductEntity.shop_show = that.data.checkOutMiniProgramDataBool;
          itemData.push(newProductEntity);
        }
        subjectBlockArrNew[r].itemData = itemData;
        subjectBlockArrNew[r].display_style = parseFloat(subjectBlockArrNew[r].display_style);
      }
      //主题列表（set子列表进去）
      var subjectArrayItemChunk = util.chunk(subjectBlockArrNew, 5)
      var time = optionNum / 5;
      if (time == subjectArrayItemChunk.length) {
        that.setData({
          SubjectBlockShow: false,
        });
      } else {
        that.setData({
          SubjectBlockShow: true,
        });
      };
      if (optionNum < subjectBlockArrNew.length) {
        subjectArrayItemChunkTotal = subjectArrayItemChunkTotal.concat(subjectArrayItemChunk[time]);
        that.setData({
          SubjectBlock: subjectArrayItemChunkTotal,
          guessLikeLoadShow: false
        });
        console.log(that.data.SubjectBlock);
      } else {
        that.setData({
          startLoading: true,
          guessLikeLoadShow: true
        })
        //that.guessLikeLoadMore(true);
      };
    });
  },
  //猜你喜欢数据加载更多
  guessLikeLoadMore(loadMoreBool) {
    var that = this;
    if (that.data.blockType) {
      wx.stopPullDownRefresh();
      var that = this;
      if (that.data.RecommendBlock_idShow == false) return;
      var loadType = 0; //none
      var offset = 0;
      var guessLikeTitle = that.data.RecommendBlockTargetTitle;
      that.setData({
        guessLikeTitle
      });

      if (loadMoreBool) {
        var newPage = that.data.page;
        newPage++;
        loadType = 1 << 1; //2 loadmore
        offset = newPage * that.data.limit;
        that.setData({
          page: newPage,
          offset: offset,
        });
      } else {
        loadType = 1 << 0; //1 refresh
        offset = 0;
      };
      that.getGussLikeData();
    };
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
      guessLikeLoadShow: true,
      loaddingContext: "加载更多..."
    });
    var cuttTags = '';
    if (that.data.cuttentTab_tags) {
      cuttTags = '&target=' + that.data.cuttentTab_tags;
    };
    var recommendUrl = WNTSApi.mainUrl + '/aggregator/' + that.data.RecommendBlockTargetId + '/41/entity';
    util.requestGet(recommendUrl, function(res) {
      console.log(res.data);
      var temp = util.getGessLikeDataTool(res.data);
      if (res.data.length == 0) {
        util.requestGet(recommendUrl, function(res) {

        }, function(res) {});
        that.setData({
          loaddingContext: "没有更多啦～"
        });
      };
      console.log(guessLike);
      console.log(temp);
      guessLike = [];
      guessLike = guessLike.concat(temp);
      that.setData({
        guessLike: guessLike
      });
    }, function(data) {});
  },
  imageLoad: function(ev) {
    var that = this;
    // console.log(ev);
    that.setData({
      imgOnloadStatus: true,
      backgroundColorStatus: false
    });
  },
  //进入商品详情页
  columnClick: function(event) {
    var subject_product = event.currentTarget.dataset.subject;
    var subject_product_all = {};
    subject_product_all.title_prefix_url_label = subject_product.title_prefix_url_label;
    subject_product_all.product_imgs = subject_product.imgs;
    subject_product_all.product_id = subject_product.id;
    subject_product_all.product_title = util.stringWithAndCode(subject_product.title);
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    subject_product_all.shop_show = subject_product.shop_show;
    subject_product_all.promotion = subject_product.promotion;
    subject_product_all.promotion_id = subject_product.promotion_id;
    subject_product_all.promotion_label = subject_product.promotion_label;
    subject_product_all.promotional = subject_product.promotional;
    var json_string = JSON.stringify(subject_product_all);
    this.navigateToProductDetail(json_string);
  },
  //跳转主题点击更多
  band_touch: function(e) {
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
      case WSMMallLayoutTargetTypeSubjectDetail:
        {
          //ThemeId=target_id、 target_title
          var subjectItem = {};
          subjectItem.themeId = item.item_target.target_id;
          subjectItem.target_title = item.item_target.target_title;
          that.navigateToSubjectDetail(JSON.stringify(subjectItem));
        }
        break;
      case WSMMallLayoutTargetTypeProductOfKeywords:
        {
          //Keywords=target_content
          that.navigateToSerchPage(item.item_target.target_content);
        }
        break;
      case WSMMallLayoutTargetTypeWeb:
        {
          //Url:target_content
          //暂不支持...
        }
        break;
      case WSMMallLayoutTargetTypeTab:
        {
          //tabIdx = target_id切换tab
        }
        break;
      default:
        break;
    } //pop_item
  },
  guessLike_item(e) {
    var subject_product = e.currentTarget.dataset.item;
    var subject_product_all = {};
    subject_product_all.product_imgs = subject_product.imgs;
    subject_product_all.product_id = subject_product.id;
    subject_product_all.product_title = util.stringWithAndCode(subject_product.title);
    subject_product_all.product_price = subject_product.price;
    subject_product_all.product_tag_price = subject_product.tag_price;
    subject_product_all.promotion = subject_product.promotion;
    subject_product_all.promotion_id = subject_product.promotion_id;
    subject_product_all.promotion_label = subject_product.promotion_label;
    subject_product_all.promotional = subject_product.promotional;
    var json_string = JSON.stringify(subject_product_all);
    wx.navigateTo({
      url: '../WNTSProductdetailPage/WNTSProductdetailPage?subject=' + json_string
    })
  },
  serviceMsg(e) {
    var that = this;
    util.checkLoginStatus(function(isLogined) {
      //联系商家

    }, function(isNotLogin) {
      wx.navigateTo({
        url: '../WNTSLoginPage/WNTSLoginPage?fromTo=home'
      })
    });
  },
  //单纯跳转搜索界面
  search_touch: function(e) {
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
  popBandClick: function(e) {
    var that = this;
    that.fiveJumpToPageWithItemType(e.currentTarget.dataset.pop_item);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //init();
    util.checkLoginStatus(function(isLogined) {
      //联系商家
      that.setData({
        hasLogin: true
      })
    }, function(isNotLogin) {
      that.setData({
        hasLogin: false
      })
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    var newPage = 0;
    var loadType = 0;
    var offset = 0;
    init();
    get_list(that);
    // newPage++;
    loadType = 1 << 1; //2 loadmore
    offset = newPage * that.data.limit;
    that.setData({
      page: newPage,
      offset: offset,
      guessLikeLoadShow: false,
      startLoading: false
    });
  },
  onReachBottom: function() {
    var that = this;
    if (optionNum < subjectBlockArrNew.length) {
      that.subjectBlockLoadMore();
      // subjectArrayItemChunkTotal = subjectArrayItemChunkTotal.concat(subjectArrayItemChunk[time]);
      // that.setData({
      //   SubjectBlock: subjectArrayItemChunkTotal,
      //   guessLikeLoadShow: false
      // });
    } else {
      // that.setData({
      //   startLoading: true,
      //   guessLikeLoadShow: true
      // })
      that.guessLikeLoadMore(true);
    };
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    init();
    // if (e.target.dataset.current == 1) {
    //   wx.navigateTo({
    //     url: '../WNTSFactory/WNTSFactory'
    //   })
    //   return;
    // };
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
      loadType = 1 << 1; //2 loadmore
      offset = newPage * that.data.limit;
      that.setData({
        currentIndex: index,
        currentTabId: currentTabId,
        page: newPage,
        offset: offset,
        startLoading: false,
        guessLikeLoadShow: false
      })
      get_list(that);
    };
  }
})