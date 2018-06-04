var WNTSTOKEN_KEY = '_TOKEN_';

var Token = {
  get: function () {
    return wx.getStorageSync(WNTSTOKEN_KEY) || null;
  },

  set: function (token) {
    wx.setStorageSync(WNTSTOKEN_KEY, token);
  },

  clear: function () {
    wx.removeStorageSync(WNTSTOKEN_KEY);
  }
};

module.exports = Token;