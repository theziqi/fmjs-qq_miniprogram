const app = getApp()

Page({
    data: {
        title: "",
        show: "",
        content: "",
        convert_content: "",
        isLike: false,
        id: "",
        modalName: null,
        cmlist: [],
        likeSrc: "../../static/2-2-dianzan-1.png",
        unlikeSrc: "../../static/2-2-dianzan-2.png",
        likeCount: null,
        shareCount: null,
        cmValue: "",
        disable: true,
        isshowAll: false,
        type: "",
        voteid: "",
        vote: [],
        isVote: false,
        isVoted: false,
        selectId: null
    },

    onShareAppMessage: function (res) {
        var that = this;
        if (this.data.isVote) {
            return {
                path: "/pages/index/index"
            }
        }else{
            return{
                path: "/pages/index/index?id=" + that.data.id + "&type=" + that.data.type + "&entry=true"
            }
        }
    },

    makeChoice: function (e) {
        console.log(e)
        if (this.data.isVoted) return
        var that = this;
        this.setData({
            selectId: e.currentTarget.dataset.tpid,
            isVoted: true
        })
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/vote/" + that.data.voteid,
            method: "POST",
            data: {
                session_key: app.globalData.session_key,
                choice: that.data.selectId
            },
            success: function (res) {
                console.log(app.globalData.session_key, that.data.vote[that.data.selectId].tpid)
                console.log(res.data)
                if (res.data.full) {
                    app.onfinishTask();
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    updateValue: function (e) {
        this.setData({
            cmValue: e.detail.value,
            disable: !(e.detail.value.length > 0)
        });

    },

    getCmlist: function (a) {
        var that = this;
        var id;
        if (that.data.isVote) {
            id = that.data.voteid
        } else {
            id = that.data.id
        }
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/getComment/" + id,
            method: "POST",
            data: {
                session_key: app.globalData.session_key
            },
            success: function (res) {
                console.log("获取" + that.data.id + "评论");
                console.log(app.globalData.userInfo.nickName, that.data.cmValue);
                console.log(res.data);
                that.setData({
                    cmlist: res.data.comments
                });
                if (a) {
                    qq.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
                        // 使页面滚动到底部
                        qq.pageScrollTo({
                            scrollTop: rect.bottom + 5000
                        })
                    }).exec()
                }
            },
            fail: function (err) {
                console.log(err)
            },
            complete: function () {
                qq.hideLoading()
            }
        })
    },

    sendComment: function () {
        var that = this;
        qq.showLoading({
            title: "加载中"
        })
        if (!app.globalData.session_key) {
            qq.showToast({
                title: "您还未登陆",
                icon: "none",
                duration: 1000
            });
            qq.switchTab({
                url: '../mine/mine'
            })
            return
        }
        console.log(app.globalData);
        var id;
        if (that.data.isVote) {
            id = that.data.voteid
        } else {
            id = that.data.id
        }
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/postComment/" + id,
            method: "POST",
            data: {
                session_key: app.globalData.session_key,
                nickname: app.globalData.userInfo.nickName,
                comment: that.data.cmValue
            },
            success: function (res) {
                console.log(app.globalData.session_key, app.globalData.userInfo.nickName)
                console.log(res.data);
                that.getCmlist(true);
                that.setData({
                    cmValue: "",
                    disable: true
                });

                if (res.data.full) {
                    app.onfinishTask();
                }
            },
            fail: function (err) {
                console.log(err)
            },
            complete: function () {
                qq.hideLoading()
            }
        });

    },

    deleteComment: function (e) {
        var that = this;
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/delComment/" + e.currentTarget.dataset.id,
            method: "POST",
            data: {
                session_key: app.globalData.session_key
            },
            success: function (res) {
                console.log(res.data);
                that.getCmlist();
            },
            fail: function (err) {
                console.log(err)
            },
            complete: function () {
                qq.hideLoading()
            }
        });
    },


    onShare: function () {
        var that = this;
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/action",
            method: "POST",
            data: {
                session_key: app.globalData.session_key,
                action: "share",
                tpid: that.data.id,
                method: "POST"
            },
            success: function (res) {
                console.log(res.data);
                console.log("分享成功");
                that.getDetail();
                if (res.data.full) {
                    app.onfinishTask();
                }
            },
            fail: function (err) {
                console.log(err)
            }
        });

    },

    changeLike: function () {
        var that = this;
        qq.showLoading({
            title: "加载中"
        })
        if (!that.data.isLike) {
            qq.request({
                url: "https://qq-dev.timeline.hfzhang.wang/api/action",
                method: "POST",
                data: {
                    session_key: app.globalData.session_key,
                    action: "like",
                    tpid: that.data.id,
                    method: "POST"
                },
                success: function (res) {
                    console.log(res.data);
                    console.log("点赞成功");
                    that.setData({
                        isLike: true
                    });
                    that.getDetail();
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: function () {
                    qq.hideLoading()
                }
            })
        };
        this.getDetail();
    },

    getDetail: function () {
        var that = this;
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/getTP/" + that.data.id,
            data: {
                type: that.data.type
            },
            success: function (res) {
                console.log(res.data.timepoint.show, res.data.timepoint.content)
                that.setData({
                    title: res.data.timepoint.title,
                    show: res.data.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前'),
                    content: res.data.timepoint.content,
                    convert_content: res.data.timepoint.convert_content.length < 150 ? res.data.timepoint.convert_content : res.data.timepoint.convert_content.slice(0, 149),
                    likeCount: res.data.like,
                    shareCount: res.data.share
                });
            },
            fail: function (err) {
                console.log(err)
            },
            complete: function () {
                qq.hideLoading()
            }
        });

    },

    showAll: function () {
        this.setData({
            isshowAll: true
        })
    },

    onLoad: function (options) {
        var that = this;
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        console.log(app.globalData)
        if (options.id) {
            qq.showLoading({
                title: "加载中"
            })
            this.setData({
                id: options.id,
                type: options.type
            });
            qq.request({
                url: "https://qq-dev.timeline.hfzhang.wang/api/action",
                method: "POST",
                data: {
                    session_key: app.globalData.session_key,
                    action: "like",
                    tpid: that.data.id,
                    method: "CHECK"
                },
                success: function (res) {
                    console.log(res.data);
                    if (res.data.state)
                        that.setData({
                            isLike: res.data.like
                        });
                },
                fail: function (err) {
                    console.log(err)
                }
            })
            this.getDetail();
            this.getCmlist();
        } else if (options.voteid) {
            qq.showLoading({
                title: "加载中"
            })
            var vote = JSON.parse(options.vote);
            this.setData({
                isVote: true,
                title: options.title,
                voteid: options.voteid,
                vote: vote
            });
            qq.request({
                url: "https://qq-dev.timeline.hfzhang.wang/api/vote/getStatus",
                method: "POST",
                data: {
                    session_key: app.globalData.session_key,
                    vote_id: options.voteid
                },
                success: function (res) {
                    console.log(res.data);
                    if (!res.data.vote_status) {
                        that.setData({
                            isVoted: true,
                            selectId: res.data.vote
                        })
                    }

                },
                fail: function (err) {
                    console.log(err)
                }
            })
            this.getCmlist();
        }
    }
})
