const app = getApp()

Page({
    data: {
        gamelist: []
    },
    onLoad: function () {
        qq.showLoading({
            title: "加载中"
        })
        var gamelist = app.globalData.game
        for (var i = 0; i < gamelist.length; i++) {
            let date = new Date(gamelist[i].timestamp)
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            gamelist[i].timestamp = year + "." + month + "." + day
        }
        
        this.setData({
            gamelist: gamelist.reverse()
        })
        qq.hideLoading()
    },
    toHistory: function(e){
        var that = this;
        console.log(e)
        var id = e.currentTarget.dataset.id;
        console.log(id)
        console.log(that.data.gamelist[id])
        var d = JSON.stringify(that.data.gamelist[id].data);
        qq.navigateTo({
            url: '../game-history/game-history?history=' + d + '&date=' + that.data.gamelist[id].timestamp
        })
    }
})