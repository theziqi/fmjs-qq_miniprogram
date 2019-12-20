const app = getApp()

var objM = {};

Page({
    data: {
        isEntries: false,
        sResult: [],
        showList: [],
        sValue: "",
        page: 1,
        pageSize: 10,
        isLastPage: false,
        isInputing: false,
        type: ""
    },

    updateValue: function (e) {
        let name = e.currentTarget.dataset.name;
        let nameMap = {}
        nameMap[name] = e.detail && e.detail.value
        this.setData(nameMap)
    },

    inputing: function () {
        this.setData({
            isInputing: true
        })
    },

    uninputed: function () {
        this.setData({
            isInputing: false
        })
    },
    onSearch: function () {
        var that = this;
        that.setData({
            sResult: [],
            showList: [],
            page: 1,
            isLastPage: false
        });
        console.log("开始搜索：" + this.data.sValue);
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/search",
            method: "POST",
            data: {
                keyword: that.data.sValue,
                type: that.data.type
            },
            success: function (res) {
                if (res.data.result.length) {
                    that.setData({
                        sResult: res.data.result
                    });
                    console.log(that.data.sResult);
                    that.getDetails();
                } else {
                    wx.showToast({
                        title: 'Sorry~还未收录相关信息QAQ',
                        icon: 'none',
                        duration: 2000,
                    })

                }

            },
            fail: function (err) {
                console.log(err)
            }
        });

    },

    toEntry: function (e) {
        console.log(e.currentTarget.dataset.id)
        var that = this;
        qq.navigateTo({
            url: '../entry/entry?id=' + e.currentTarget.dataset.id + "&type=" + that.data.type,
            success: function (res) { console.log("跳转成功") },
            fail: function (res) { },
            complete: function (res) { },
        });
    },

    onReachBottom: function () {
        if (this.data.isLastPage) {
            return
        }
        this.setData({ page: this.data.page + 1 });
        this.getDetails();
    },

    getDetails: function () {
        var that = this;
        var s;
        let d = [];
        var listLength = this.data.sResult.length;
        var size = this.data.pageSize;
        if (this.data.page == listLength / size) {
            s = this.data.sResult.slice(size * (this.data.page - 1), listLength - 1);
            that.setData({
                isLastPage: true
            });
        } else {
            s = this.data.sResult.slice(size * (this.data.page - 1), size * this.data.page);
        }
        s.forEach(function (item, index) {
            qq.request({
                url: 'https://qq-dev.timeline.hfzhang.wang/api/getTP/' + item.tpid,
                data: { type: that.data.type },
                success: function (res) {
                    console.log(res.data);
                    objM = {
                        title: res.data.timepoint.title,
                        show: res.data.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前'),
                        content: (res.data.timepoint.convert_content.length <= 25) ? res.data.timepoint.convert_content : res.data.timepoint.convert_content.slice(0, 24) + "...",
                        id: item.tpid,
                        like: res.data.like,
                        comments: res.data.comment
                    };
                    d.push(objM);
                    if (index == 9 || (listLength < 10 && index == listLength - 1)) {
                        that.setData({
                            showList: that.data.showList.concat(d)
                        });
                        console.log(d);
                    }
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: function () {
                    qq.hideLoading()
                }
            });
        });
    },

    onLoad: function (options) {
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        if (options.list != null) {
            var list = JSON.parse(options.list);
            console.log(list)
            this.setData({
                isEntries: true,
                sResult: list,
                type: options.type
            });
            qq.showLoading({
                title: "加载中"
            })
            this.getDetails();

        } else if (options.s) {
            console.log(options)
            console.log("传入搜索值：" + options.s)
            this.setData({
                sValue: options.s
            });
            qq.showLoading({
                title: "加载中"
            })
            this.onSearch();
        } else {
            qq.showLoading({
                title: "加载中"
            })
            this.onSearch();
        }
    }
})
