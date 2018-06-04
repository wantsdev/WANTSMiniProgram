
/**  timingFunction
  *  linear  动画一直较为均匀
  *  ease    从匀速到加速在到匀速
  *  ease-in 缓慢到匀速
  *  ease-in-out 从缓慢到匀速再到缓慢
  *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
  *  step-end   保持 0% 的样式直到动画持续时间结束 一闪而过
  */

var interval;
var createAnimalTool = (callBack) => {
  var animation = wx.createAnimation({
    delay: 0,
    timingFunction: 'linear',
    transformOrigin: '50% 50% 0',
    duration: 1000
  });
  var n = 0;
  interval = setInterval(function () {
    n++;
    animation.rotate(360 * n).step();
    if (callBack) {
      callBack(animation);
    }
  }, 800)
}
var loading = (callBack) => {
  if (!callBack) return;
  createAnimalTool(function (animation) {
    callBack(animation.export());
  });
}
var hidden = (callBack) => {
  if (!callBack) return;
  setTimeout(function () {
    clearInterval(interval);
    callBack('');
  }, 400)
}
module.exports = {
  createAnimalTool,
  loading,
  hidden
}