const app = getApp()

var objM = {};
Page({
    data: {
        likeList: [],
        showList: [],
        page: 1,
        pageSize: 10,
        isLastPage: false,
    },
    onLoad: function () {
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        const likeList = app.globalData.like
        console.log(app.globalData.like)
        this.setData({
            likeList: likeList
        })
        this.getDetails()
    },
    toEntry: function (e) {
        console.log(e.currentTarget.dataset.id)
        console.log(e.currentTarget.dataset.type)
        var that = this;
        qq.navigateTo({
            url: '../../entry/entry?id=' + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
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
        var listLength = this.data.likeList.length;
        var size = this.data.pageSize;
        if (this.data.page == listLength / size) {
            s = this.data.likeList.slice(size * (this.data.page - 1), listLength - 1);
            that.setData({
                isLastPage: true
            });
        } else {
            s = this.data.likeList.slice(size * (this.data.page - 1), size * this.data.page);
        }
        s.forEach(function (item, index) {
            qq.request({
                url: 'https://qq-dev.timeline.hfzhang.wang/api/getTP/' + item.tpid,
                data: { type: item.type },
                success: function (res) {
                    console.log(res.data);
                    objM = {
                        title: res.data.timepoint.title,
                        show: res.data.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前'),
                        content: (res.data.timepoint.convert_content.length <= 25) ? res.data.timepoint.convert_content : res.data.timepoint.convert_content.slice(0, 24) + "...",
                        id: item.tpid,
                        like: res.data.like,
                        comments: res.data.comment,
                        type: item.type
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
            });
        });
    },
})