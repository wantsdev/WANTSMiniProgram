Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataParterm:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId){
      if (options.title){
        wx.setNavigationBarTitle({
          title: options.title,
        })
     }
      var dataParterm = {
        totalPrice: options.totalPrice,
        orderId: options.orderId,
        receiver_name: options.receiver_name,
        receiver_phone: options.receiver_phone,
        receiver_address: options.receiver_address,
        title: options.title
      };
      this.setData({
        dataParterm
      });
    }
  },
  /**
   * 复制
   */
  copy_no: function (e) {
    var that = this;
    var no = e.currentTarget.dataset.no;
    wx.setClipboardData({
      data: no,
      success: function (res) {
        wx.showToast({
          title: '订单号复制成功',
          success: function (res) {
          }
        })
      }
    })
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