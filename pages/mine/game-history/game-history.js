const app = getApp()

Page({
    data: {
        history: [],
        date: ""
    },
    onLoad: function (options) {
        qq.showLoading({
            title: "加载中"
        })
        var h = JSON.parse(options.history);
        this.setData({
            history: h,
            date: options.date
        })
        qq.hideLoading()
    }
})