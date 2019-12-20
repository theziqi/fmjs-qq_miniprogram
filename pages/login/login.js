const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: qq.canIUse('button.open-type.getUserInfo')
    },
    onLogin: function () {
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
                            app.globalData.session_key = res.data.session_key;
                            console.log(app.globalData.session_key);
                        }
                    });
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    onLoad: function () {
        var that = this;
        if (app.globalData.userInfo) {
            console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
            that.onLogin();
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
                that.onLogin();
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            qq.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        qq.getSystemInfo({
            success: function (res) {
                app.globalData.systemInfo = res;
            }
        })
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