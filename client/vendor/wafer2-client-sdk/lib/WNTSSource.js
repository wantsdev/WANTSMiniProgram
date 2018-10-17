var WNTSSOURCE_KEY = '_SOURCE_';

var Source = {
  get: function () {
    return wx.getStorageSync(WNTSSOURCE_KEY) || null;
  },

  set: function (source) {
    wx.setStorageSync(WNTSSOURCE_KEY, source);
  },

  clear: function () {
    wx.removeStorageSync(WNTSSOURCE_KEY);
  }
};

module.exports = Source;