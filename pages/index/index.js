//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: qq.canIUse('button.open-type.getUserInfo'),
    nickname: ""
  },
  onLogin: function () {
    var that = this;
    qq.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          console.log(res.code);
          qq.request({
            url: 'https://qq-dev.timeline.hfzhang.wang/api/login',
            method: 'POST',
            data: {
              code: res.code,
              nickname: app.globalData.userInfo.nickName
            },
            success: function (res) {
              console.log(res.data);
              qq.setStorageSync('session_key', res.data.session_key)
              app.globalData.session_key = res.data.session_key;
              console.log(app.globalData);
              qq.getUserInfo({
                success: function (res) {
                  console.log(res.data)
                  app.globalData.userInfo = res.data;
                  that.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                  })

                }
              });
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    qq.getSystemInfo({
      success: function (res) {
        app.globalData.systemInfo = res;
      }
    });

    qq.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {

          qq.checkSession({
            success() {
              //session_key 有效
              app.globalData.session_key = qq.getStorageSync('session_key');
              console.log(app.globalData.session_key)
              if (app.globalData.session_key) {
                qq.getUserInfo({
                  success: function (res) {
                    console.log(res.userInfo)
                    app.globalData.userInfo = res.userInfo;
                    that.setData({
                      userInfo: app.globalData.userInfo,
                      hasUserInfo: true
                    })

                  }
                });
              } else {
                that.onLogin();

              }
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              that.onLogin();
            }
          })

          

          if (options.entry) {
            app.globalData.entry = true;
            app.globalData.entryid = options.id;
            app.globalData.entrytype = options.type;
          } 

          setTimeout(function () {
            qq.switchTab({
              url: "../timeline/timeline"
            });
          }, 1500);
        } else {
          qq.switchTab({
            url: "../mine/mine"
          });
          qq.showToast({
            title: "请授权登录",
            icon: "none",
            duration: 2000
          })
        }
      }
    })



    /**qq.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {

        } else {
          qq.switchTab({
            url: "../mine/mine"
          });
          qq.showToast({
            title: "请登录",
            icon: "none",
            duration: 2000
          })
        }
      }
    })**/




  },

  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.onLogin();
  }
})
