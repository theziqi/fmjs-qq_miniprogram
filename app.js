//app.js
const api = require('./api/index');

App({
  onLaunch: function () {
    // 展示本地存储能力
    qq.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    });
    var logs = qq.getStorageSync('logs') || []
    logs.unshift(Date.now())
    qq.setStorageSync('logs', logs)

    // 登录
    qq.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    qq.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          qq.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      path: "/pages/index/index"
    }
  },
  onfinishTask: function(){
    if(app.globalData.finishTask) return
    app.globalData.finishTask = true;
    qq.showToast({
      title: "已完成今日任务",
      duration: 2000
    })
  },
  globalData: {
    session_key: "",
    userInfo: null,
    systemInfo: null,
    finishTask: false
  }
})
