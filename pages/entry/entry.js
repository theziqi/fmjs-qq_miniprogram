const app = getApp()

Page({
    data: {
        title: "",
        show: "",
        content: "",
        isLike: false,
        id: "",
        modalName: null,
        cmlist: [],
        likeSrc: "../../static/2-2-dianzan-1.png",
        unlikeSrc: "../../static/2-2-dianzan-2.png",
        likeCount: null,
        shareCount: null,
        cmValue: "",
        disable: true
    },

    updateValue: function (e) {
        this.setData({
            cmValue: e.detail.value,
            disable: !(e.detail.value.length > 0)
        });

    },

    getCmlist: function () {
        var that = this;
        qq.request({
            url: "https://qq.timeline.hfzhang.wang/api/getComment/" + that.data.id,
            success: function (res) {
                console.log("获取" + that.data.id + "评论");
                console.log(res.data);
                that.setData({
                    cmlist: res.data.comments
                });
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    getLSnums: function () {
        var that = this;
        console.log(that.data.id)
        qq.request({
            url: "https://qq.timeline.hfzhang.wang/api/getCount/" + that.data.id,
            success: function (res) {
                console.log(res.data);
                that.setData({
                    likeCount: res.data.like,
                    shareCount: res.data.share
                });
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    sendComment: function () {
        var that = this;
        console.log(app.globalData.userInfo.nickName,that.data.cmValue);
        qq.request({
            url: "https://qq.timeline.hfzhang.wang/api/postComment/" + that.data.id,
            method: "POST",
            data: {
                session_key: app.globalData.session_key,
                nickname: app.globalData.userInfo.nickName,
                comment: that.data.cmValue
            },
            success: function (res) {
                console.log(res.data);
            },
            fail: function (err) {
                console.log(err)
            }
        });
        that.getCmlist();
    },

    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            path: "/pages/entry/entry?id=" + this.data.id
        }
    },

    onShare: function () {
        var that = this;
        qq.request({
            url: "https://qq.timeline.hfzhang.wang/api/like",
            method: "POST",
            data: {
                session_key: app.globalData.session_key,
                action: "POST",
                tpid: that.data.id,
                choice: "share"
            },
            success: function (res) {
                console.log(res.data);
                console.log("分享成功");
            },
            fail: function (err) {
                console.log(err)
            }
        });
        this.getLSnums();
    },

    changeLike: function () {
        var that = this;
        if (that.data.isLike) {
            qq.request({
                url: "https://qq.timeline.hfzhang.wang/api/like",
                method: "POST",
                data: {
                    session_key: app.globalData.session_key,
                    action: "DELETE",
                    tpid: that.data.id,
                    choice: "like"
                },
                success: function (res) {
                    console.log(res.data);
                    console.log("取消点赞");
                    that.setData({
                        isLike: false
                    });
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        } else {
            qq.request({
                url: "https://qq.timeline.hfzhang.wang/api/like",
                method: "POST",
                data: {
                    session_key: app.globalData.session_key,
                    action: "POST",
                    tpid: that.data.id,
                    choice: "like"
                },
                success: function (res) {
                    console.log(res.data);
                    console.log("点赞成功");
                    that.setData({
                        isLike: true
                    });
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        };
        this.getLSnums();
    },

    onLoad: function (options) {
        var that = this;
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        that.data.id = options.id;
        qq.request({
            url: "https://qq.timeline.hfzhang.wang/api/getTP/" + options.id,
            success: function (res) {
                console.log(res.data.timepoint.show,res.data.timepoint.content)
                that.setData({
                    title: res.data.timepoint.title,
                    show: typeof res.data.timepoint.show.show=="string" ? res.data.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前') : res.data.timepoint.show.show,
                    content: res.data.timepoint.content
                });
            },
            fail: function (err) {
                console.log(err)
            }
        });

        this.getCmlist();
        this.getLSnums();
    }
})
