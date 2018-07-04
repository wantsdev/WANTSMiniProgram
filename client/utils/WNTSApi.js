var mainUrl = "http://api.wantscart.com";
var tabsUrl = mainUrl + "/app/layout/tabs";//获取tabs
var tabIdUrl = mainUrl + '/app/layout/tab/';//获取某个tab数据
var shoppingCartApi = mainUrl + "/cart2";//获取购物车商品列表
var shoppingCarPricetApi = mainUrl + "/order/price";//获取价格
var shoppingCarAddProductApi = mainUrl + "/cart";//添加购物车
var adderssApi = mainUrl + "/user/address";//地址
var submitOrderApi = mainUrl + "/order";//提交订单{order_product_id，address_id，coupon_id，message}
var loginApi = "/login/miniapp";
var login = require('../vendor/wafer2-client-sdk/lib/login.js');
var submitOrderNewApi = submitOrderApi + "/on_click_to_create";//立即支付进来的提交订单
var price_by_stockNewApi = submitOrderApi + "/price_by_stock";//商品详情进来的时候检查价格
var recommendApi = mainUrl+'/product/recommend';//猜你喜欢接口
module.exports = {
  tabsUrl,
  tabIdUrl,
  shoppingCartApi,
  shoppingCarPricetApi,
  shoppingCarAddProductApi,
  adderssApi,
  submitOrderApi,
  loginApi,
  login,
  mainUrl,
  submitOrderNewApi,
  price_by_stockNewApi,
  recommendApi
};