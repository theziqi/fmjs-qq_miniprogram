//index.js
//获取应用实例
const app = getApp()
var SWIPER_LIST_LENGTH = 10
const SWIPER_LEFT_INDEX = 0
let leftIndex
let curIndex

Page({
    data: {
        swiperList: [],
        touchStart: 0,
        date: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
        },
        cardCur: 0,
        startCur: 0
    },
    cardSwiper(e) {
        var that = this;
        this.setData({
            cardCur: e.detail.current,
            date: that.data.swiperList[e.detail.current].date
        })
    },
    onLoad: function () {
        // 初始化显示时间
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        var that = this
        const date = new Date()
        console.log(date)
        var clist = []
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/getVoteList",
            success: function (res) {
                console.log(res.data)
                clist = res.data.result;

                for (let i = 0; i < clist.length; i++) {
                    var begin = new Date(clist[i].begin);
                    var end = new Date(clist[i].end);
                    clist[i].date = { year: begin.getFullYear(), month: begin.getMonth() + 1, day: begin.getDate() }
                    if (clist[i].status == "ongoing") {
                        clist[i].inuse = true;
                        that.setData({
                            startCur: i,
                            cardCur: i,
                            date: { year: begin.getFullYear(), month: begin.getMonth() + 1, day: begin.getDate() }
                        })
                    } else {
                        clist[i].inuse = false;
                    }
                }

                that.setData({
                    swiperList: clist
                })
            },
            fail: function (err) {
                console.log(err)
            }
        });
    },
    getDateStr: function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        console.log(y + '-' + (m < 10 ? '0' + m : m) + '-' + d);
        m = 12;
        d = 16 + AddDayCount;

        this.setData({
            date: {
                year: y,
                month: m,
                day: d
            }
        })
    },
    toEntry: function (e) {
        console.log(e.currentTarget.dataset.id)
        var id = e.currentTarget.dataset.id
        var list = this.data.swiperList[id];
        console.log(list)
        var vote = list.vote
        var voteid = list.voteid
        var title = list.title
        var obj = JSON.stringify(vote);
        qq.navigateTo({
            url: '../entry/entry?voteid=' + voteid + '&vote=' + obj + '&title=' + title,
            success: function (res) { console.log("跳转成功") },
            fail: function (res) { },
            complete: function (res) { },
        });
    },
    touchStart: function (e) {
        this.setData({
            touchStart: e.touches[0].pageX
        })
    },
    touchMove: function (e) {
        this.setData({
            direction: e.touches[0].pageX > this.data.touchStart ? 'right' : 'left'
        })
    },
    touchEnd: function (e) {
        const swiperList = this.data.swiperList

        if (this.data.direction === 'right') {
            if (curIndex === 0) return
            curIndex--
            this.getDateStr(curIndex)
            for (let i = 0; i < swiperList.length; i++) {
                swiperList[i].marginLeft += 528
                swiperList[i].scale = -0.1 * Math.abs(swiperList[i].index - curIndex) + 1
            }
        } else {
            if (curIndex === SWIPER_LIST_LENGTH - 1) return
            curIndex++
            this.getDateStr(curIndex)
            for (let i = 0; i < swiperList.length; i++) {
                swiperList[i].marginLeft -= 528
                swiperList[i].scale = -0.1 * Math.abs(swiperList[i].index - curIndex) + 1
            }
            // 补充最后一个
            /**const { index: lastIndex } = swiperList[swiperList.length - 1]
            if(lastIndex-1 === curIndex){
                swiperList.push({
                    index: lastIndex + 1,
                    marginLeft: swiperList[swiperList.length - 1].marginLeft + 528,
                    scale: 0.9
                })
            }**/
        }

        this.setData({
            swiperList
        })
    },
})
