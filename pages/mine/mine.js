//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    itemList: [
      { icon: '../../static/5-dianzan@2x.png', desc: '我的点赞', route: 'like/like' },
      { icon: '../../static/5-zhanji@2x.png', desc: '我的小游戏战绩', route: 'game-record/game-record' },
      { icon: '../../static/5-gongxian@2x.png', desc: '我的贡献', route: 'contribution/contribution' }
    ],
    imgUrls: [
      //'../../static/activity_1.jpg',
      '../../static/activity_2.jpg',
      '../../static/activity_3.jpg'
    ],
    curActivity: 0,
    signin: false,
    signinsrc: "../../static/5-qiandao-1_1.png",
    nosigninsrc: "../../static/5-qiandao-1.png",
    showSignin: false,
    showCreditRule: false,
    showActivity: false,
    user: {},
    like: [],
    game: [],
    touxian: ["发明白丁", "发明童生", "发明秀才", "发明举人", "发明贡士", "发明进士", "发明榜眼", "发明探花", "发明状元"],
    eventid: "",
    invitenumber: "000",
    qqgroupnumber: "000",
    isInvited: false,
    isInvitedWriter: false,
    continous: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: qq.canIUse('button.open-type.getUserInfo')
  },
  askforSubs: function () {
    qq.getSetting({
      success(res) {
        if (!res.authSetting['scope.appMsgSubscribed']) {
          qq.authorize({
            scope: 'scope.appMsgSubscribed',
            success() {
              qq.request({
                url: 'https://qq-dev.timeline.hfzhang.wang/api/subscribe',
                method: 'POST',
                data: {
                  session_key: app.globalData.session_key,
                  choice: true
                },
                success: function (res) {
                  console.log(res.data)
                }
              });
            },
            fail() {
              qq.request({
                url: 'https://qq-dev.timeline.hfzhang.wang/api/subscribe',
                method: 'POST',
                data: {
                  session_key: app.globalData.session_key,
                  choice: false
                },
                success: function (res) {
                  console.log(res.data)
                }
              });
            }
          })
        }
      }
    })
  },
  onLoad: function () {
    var that = this;
    qq.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    })

    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      that.askforSubs();
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
          that.checkSignin()
        }
      })
    }


  },
  onShow: function () {
    var that = this;
    that.onLogin();
  },
  infoSubmit: function (e) {
    console.log(e.detail.value)
    console.log(e.detail.value.name)
    console.log(e.detail.value.phonenumber)
    console.log(e.detail.value.qqnumber)
    var that = this;
    var name = e.detail.value.name;
    var phonenumber = e.detail.value.phonenumber;
    var qqnumber = e.detail.value.qqnumber;
    qq.request({
      url: 'https://qq-dev.timeline.hfzhang.wang/api/participate',
      method: 'POST',
      data: {
        session_key: app.globalData.session_key,
        eventid: that.data.eventid,
        name: name,
        qq: qqnumber
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.state) {
          qq.showToast({
            title: "报名成功",
            duration: 2000
          })
          that.setData({
            showActivity: false
          })
        }
      }
    });
  },
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.askforSubs();
    this.onLogin();
  },
  getUserDetail: function () {
    var that = this;
    qq.request({
      url: 'https://qq-dev.timeline.hfzhang.wang/api/getUserDetail',
      method: 'POST',
      data: {
        session_key: app.globalData.session_key
      },
      success: function (res) {
        console.log("获取用户详情：" + app.globalData.session_key)
        console.log(res.data)
        that.setData({
          user: res.data.user,
          game: res.data.game,
          like: res.data.like
        });
        app.globalData.userDetail = res.data;
        app.globalData.game = res.data.game;
        app.globalData.like = res.data.like;
      }
    });
  },
  checkSignin: function () {
    var that = this;
    qq.request({
      url: "https://qq-dev.timeline.hfzhang.wang/api/getCheckinStatus",
      method: 'POST',
      data: {
        session_key: app.globalData.session_key
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.checkin) {
          that.setData({
            signin: false,
            continous: res.data.continous
          })
        } else {
          that.setData({
            signin: true,
            continous: res.data.continous
          })
        }
      }
    })
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
              app.globalData.session_key = res.data.session_key;
              qq.setStorageSync('session_key', res.data.session_key)
              console.log(app.globalData.session_key);
              that.getUserDetail();
              that.checkSignin();
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // 跳转其他页
  toOtherPage: function (e) {
    console.log(e)
    qq.navigateTo({
      url: e.currentTarget.dataset.route,
      fail: (res) => {
        console.log(res);
      }
    })
  },
  // 轮播图切换
  toLeft: function () {
    this.setData({
      curActivity: this.data.curActivity > 0 ? this.data.curActivity - 1 : 0
    })
  },
  toRight: function () {
    this.setData({
      curActivity: this.data.curActivity < this.data.imgUrls.length - 1 ? this.data.curActivity + 1 : this.data.imgUrls.length - 1
    })
  },
  // 签到
  signin: function (e) {
    let formId = e.detail.formId;
    console.log(formId)
    qq.request({
      url: "https://qq-dev.timeline.hfzhang.wang/api/formid",
      method: 'POST',
      data: {
        session_key: app.globalData.session_key,
        formid: formId
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    if (this.data.signin) {
      this.setData({
        showSignin: true
      })
      setTimeout(() => {
        this.setData({
          showSignin: false
        })
      }, 1000)
      return
    }
    var that = this;
    qq.request({
      url: "https://qq-dev.timeline.hfzhang.wang/api/checkin",
      method: 'POST',
      data: {
        session_key: app.globalData.session_key
      },
      success: function (res) {
        console.log("连续迁到")
        console.log(res.data)
        if (res.data.full) {
          app.onfinishTask();
        }

        if (res.data.state) {
          that.setData({
            signin: true
          })
        }
        else {
          that.setData({
            showSignin: true
          })
          setTimeout(() => {
            that.setData({
              showSignin: false
            })
          }, 1000)
        }
        that.getUserDetail()
        that.checkSignin()
      },
      complete: function () {

      }
    })
  },
  closeSignup: function () {
    this.setData({
      showActivity: false,
      isInvited: false
    })
  },
  // 积分规则模态框
  showCreditRule: function () {
    this.setData({
      showCreditRule: true
    })
  },
  closeCreditRule: function () {
    this.setData({
      showCreditRule: false
    })
  },
  copyCode: function () {
    var that = this;
    console.log(that.data.invitenumber);
    qq.setClipboardData({
      data: that.data.invitenumber,
      success(res) {
        qq.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  showActivity: function (e) {
    var that = this;
    console.log(this.data.curActivity)
    if (e.currentTarget.dataset.id == 0) {
      this.setData({
        isInvited: true
      })
      qq.request({
        url: "https://qq-dev.timeline.hfzhang.wang/api/getWriterInvitation",
        method: 'POST',
        data: {
          session_key: app.globalData.session_key
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.invited) {
            that.setData({
              invitenumber: res.data.code,
              isInvitedWriter: true
            })
            qq.request({
              url: "https://qq-dev.timeline.hfzhang.wang/api/getGroupid",
              method: 'GET',
              data: {
                type: "writer"
              },
              success: function (res0) {
                console.log(res0.data.qunid)
                that.setData({
                  qqgroupnumber: res0.data.qunid
                })
              }
            })


          } else {
            qq.showToast({
              title: "您还未获资格",
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    this.setData({
      showActivity: true,
      eventid: e.currentTarget.dataset.id
    })

  }
})
