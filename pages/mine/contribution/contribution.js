const app = getApp();
Page({
    data: {
        curTab: 0,
        tabList: [
            {
                title: '我要加词条',
                marginLeft: 0
            },
            {
                title: '我贡献的词条',
                marginLeft: 750
            }
        ],
        contributionList: [],
        keyword: '',
        input: ''
    },
    onLoad: function () {
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        wx.request({
            url: 'https://qq-dev.timeline.hfzhang.wang/api/getRecommendation',
            method: 'POST',
            data: {
                session_key: app.globalData.session_key
            },
            success: (res) => {
                console.log(res)
                this.setData({
                    contributionList: res.data.result
                })
            }
        })

    },
    tabSelect: function (e) {
        let tabList = this.data.tabList
        if (e.currentTarget.dataset.index === 1) {
            tabList[0].marginLeft = -750
            tabList[1].marginLeft = 0
        } else {
            tabList[0].marginLeft = 0
            tabList[1].marginLeft = 750
        }
        this.setData({
            curTab: e.currentTarget.dataset.index,
            tabList
        })
    },
    input: function (e) {
        this.setData({
            keyword: e.detail.value
        })
    },
    submit: function () {
        wx.request({
            url: 'https://qq-dev.timeline.hfzhang.wang/api/recommand',
            method: 'POST',
            data: {
                session_key: app.globalData.session_key,
                keyword: this.data.keyword
            },
            success: (res) => {
                console.log(res)
                if (res.data.full) {
                    app.onfinishTask();
                }
                if (res.data.state) {
                    wx.showToast({
                        title: '谢谢您的反馈',
                        icon: 'success',
                        duration: 1000
                    })
                    this.onLoad()
                    this.setData({ input: '' })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    }
})