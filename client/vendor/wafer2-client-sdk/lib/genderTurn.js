var genderTurn = {
  get: function () {
    return wx.getStorageSync('key') || null;
  },

  set: function (TURN) {
    wx.setStorageSync('key', TURN);
  },

  clear: function () {
    wx.removeStorageSync('key');
  }
};
module.exports = genderTurn;