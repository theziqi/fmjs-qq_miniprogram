import regeneratorRuntime from '../../utils/runtime.js'

const app = getApp()

var objM = {};

const getData = (url, param) => {
    return new Promise((resolve, reject) => {
        qq.request({
            url: url,
            method: 'GET',
            data: param,
            success(res) {
                console.log(res)
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

Page({
    data: {
        isEntries: false,
        sResult: [],
        showList: [],
        sValue: "",
        page: 1,
        pageSize: 10,
        isLastPage: false,
        isInputing: false
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
            url: "https://qq.timeline.hfzhang.wang/api/search",
            method: "POST",
            data: {
                keyword: that.data.sValue
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
        qq.navigateTo({
            url: '../entry/entry?id=' + e.currentTarget.dataset.id,
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

    getDetails: function (tp) {
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
            if (tp) {
                var id = item.tpid;
            } else {
                var id = item.id;
            }
            getData('https://qq.timeline.hfzhang.wang/api/getTP/' + id, {}).then((res) => {
                qq.request({
                    url: "https://qq.timeline.hfzhang.wang/api/getCount/" + id,
                    success: function (res1) {
                        qq.request({
                            url: "https://qq.timeline.hfzhang.wang/api/getComment/" + id,
                            success: function (res2) {
                                console.log(res2.data.comments)
                                objM = {
                                    title: res.timepoint.title,
                                    show: typeof res.timepoint.show.show == "string" ? res.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前') : res.timepoint.show.show,
                                    content: (res.timepoint.content.length <= 40) ? res.timepoint.content : res.timepoint.content.slice(0, 39) + "...",
                                    id: id,
                                    like: res1.data.like,
                                    comments: res2.data.comments.length
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
                            }
                        })

                    },
                    fail: function (err) {
                        console.log(err)
                    }
                })

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
                sResult: list
            });
            var tp = true;
            this.getDetails(tp);
        } else if (options.s) {
            console.log(options)
            console.log("传入搜索值：" + options.s)
            this.setData({
                sValue: options.s
            });
            this.onSearch();
        } else {
            this.onSearch();
        }
    }
})
