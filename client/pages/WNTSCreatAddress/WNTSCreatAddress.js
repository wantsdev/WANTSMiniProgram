// pages/WNTSCreatAddress/WNTSCreatAddress.js
var address = require("../../utils/city.js");
var util = require("../../utils/util.js");
var animation;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    index: 0,
    indexC: 0,
    indexD: 0,
    name: '',
    phoneNum: '',
    detailAddress: '',
    pId: '',
    cId: '',
    dId: '',
    pName: '',
    cName: '',
    dName: '',
    addressInfo: {},

    defaultSelect: false,
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    addressId: "",
    province: "",
    city: "",
    area: "",
  },
  //省
  bindProvinceChange: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    that.setData({
      province: that.data.provinces[value[0]].name,
      city: that.data.citys[value[1]].name,
      area: that.data.areas[value[2]].name,
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citysda
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },

  //收货人赋值
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号赋值
  bindPhoneInput: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //详细地址赋值
  bindAddressInput: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  //设置默认
  addressSelect() {
    var that = this;
    var defaultSelect = !that.data.defaultSelect;
    that.setData({
      defaultSelect
    })
  },
  //保存
  addAddress: function () {
    var that = this;
    var PHONE_REGULAR = "^1[345789]\\d{9}$";
    if (that.data.name.length == 0) {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none',
        mask: true
      })
    } else if (that.data.phoneNum.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        mask: true
      })
    } else if (!that.data.phoneNum.match(PHONE_REGULAR)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        mask: true
      })
    } else if (that.data.detailAddress.length == 0) {
      wx.showToast({
        title: '详细地址不能为空为空',
        icon: 'none',
        mask: true
      })
    } else if (that.data.province.length == 0 || that.data.city.length == 0 || that.data.area.length == 0) {
      wx.showToast({
        title: '省市区不能为空为空',
        icon: 'none',
        mask: true
      })
    } else {
      var paraterm = {};
      paraterm.province = this.data.province;
      paraterm.city = this.data.city;
      paraterm.region = this.data.area;
      paraterm.address = this.data.detailAddress;
      paraterm.phone = this.data.phoneNum;
      paraterm.name = this.data.name;
      paraterm.default = this.data.defaultSelect ? "1" : "0";
      var paratermStr = "?province=" + this.data.province + "&city=" + this.data.city
        + "&region=" + this.data.area + "&address=" + this.data.detailAddress + "&phone=" + this.data.phoneNum
        + "&name=" + this.data.name + "&default=" + (this.data.defaultSelect ? "1" : "0");
      var url;
      var method;
      if (that.data.addressId) {
        url = util.URL_UPDATE_ADDRESS + that.data.addressId + paratermStr;
        paraterm = null;
        method = "PUT"
      } else {
        url = util.URL_POST_ADDRESS;
        method = "POST"
      }
      util.requestMethodWithParaterm(method, paraterm, url,
        function (e) {
          var addressId = e.data.id;
          var addressInfo = {};
          addressInfo.id = addressId;
          addressInfo.name = that.data.name;
          addressInfo.phone = that.data.phoneNum;
          addressInfo.province = that.data.province;
          addressInfo.region = that.data.area;
          addressInfo.city = that.data.city;
          addressInfo.address = that.data.detailAddress;
          addressInfo.def = that.data.defaultSelect;
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];//当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            currentAddress: addressInfo,
            refresh: true
          })
          wx.navigateBack();
        })
    }
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    var hasData = JSON.stringify(options) == '{}' ? false : true;
    if (hasData) {
      wx.setNavigationBarTitle({
        title: '编辑地址',
      })
      var addressData = JSON.parse(options.addressData);
      var that = this;
      that.setData({
        addressInfo: addressData,
        addressId: addressData.id,
        name: addressData.name,
        phoneNum: addressData.phone,
        detailAddress: addressData.address,
        defaultSelect: addressData.def,
        province: addressData.province,
        city: addressData.city,
        area: addressData.region,
      });
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址',
      })
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