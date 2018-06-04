var WNTSUSERINFO = '_USERINFO_';

var UserInfo = {
  get: function () {
    return wx.getStorageSync(WNTSUSERINFO) || null;
  },

  set: function (userinfo) {
    wx.setStorageSync(WNTSUSERINFO, userinfo);
  },
  
  clear: function () {
    wx.removeStorageSync(WNTSUSERINFO);
  }
};


module.exports = UserInfo;