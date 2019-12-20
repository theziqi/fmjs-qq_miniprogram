const app = getApp()

Page({
    data: {
        timer: "",
        avatarUrl: "",
        isStartGame: false,
        isClosetoEnd: false,
        isEndGame: false,
        countDownNum: 45,
        score: 0,
        wrongcount: 0,
        answer: null,
        selected: null,
        yesSrc: "../../static/3-2-dui-1.png",
        noSrc: "../../static/3-2-cuo-1.png",
        id0: "",
        title0: "",
        year0: "",
        showS0: "",
        id1: "",
        title1: "",
        year1: "",
        showS1: "",
        n_id0: "",
        n_title0: "",
        n_year0: "",
        n_id1: "",
        n_title1: "",
        n_year1: "",
        n_answer: null,
        sValue: "",
        rank: null,
        total: null,
        isfirstaction: true,
        min: "0",
        max: "5000",
        type: "invention",
        animation: "",
        history: [],
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            path: "/pages/index/index"
        }
    },

    rec() {
        this.setData({
            isStartGame: false,
            isClosetoEnd: false,
            isEndGame: false,
            score: 0,
            countDownNum: 45,
            answer: null,
            selected: null,
            percent: null
        });
    },

    updateValue: function (e) {
        let name = e.currentTarget.dataset.name;
        let nameMap = {}
        nameMap[name] = e.detail && e.detail.value
        this.setData(nameMap)
    },

    endGame: function () {
        var that = this;
        that.setData({
            isEndGame: true,
            isStartGame: false
        });

        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/game/score",
            method: "POST",
            data: {
                session_key: app.globalData.session_key,
                score: that.data.score,
                history: ""
            },
            success: function (res) {
                console.log(res.data)
                that.setData({
                    rank: res.data.rank,
                    total: res.data.total,
                    percent: Math.round((1 - res.data.rank / (res.data.total + 1)) * 100)
                });

                if (res.data.full) {
                    app.onfinishTask();
                }
            },
            fail: function (err) {
                console.log(err)
            }
        });
    },

    countDown: function () {
        let that = this;
        let countDownNum = that.data.countDownNum;
        that.data.timer = setInterval(function () {
            if (countDownNum == 0) {
                that.endGame();
                clearInterval(that.data.timer);
            } else {
                countDownNum--;
                if (countDownNum == 10) {
                    that.setData({
                        isClosetoEnd: true
                    })
                }
                that.setData({
                    countDownNum: countDownNum
                })
            }
        }, 1000)
    },

    onLoad() {
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl
        });
    },

    selectAnswer: function (e) {
        var that = this;
        let id = e.currentTarget.dataset.id;
        this.setData({
            isfirstaction: false,
            selected: id,
            showS0: that.data.answer ? "trueBox" : "falseBox",
            showS1: !that.data.answer ? "trueBox" : "falseBox",
        });
        var q = {};
        if ((id == "0" && that.data.answer) || (id == "1" && !that.data.answer)) {
            q = {
                answer: true,
                type: that.data.type,
                tp1: {
                    title: that.data.title0.slice(0, 4),
                    year: that.data.year0,
                    id: that.data.id0
                },
                tp2: {
                    title: that.data.title1.slice(0, 4),
                    year: that.data.year1,
                    id: that.data.id1
                }
            };
            that.setData({
                score: that.data.score + 1,
                history: that.data.history.concat(q)
            });
        } else {
            q = {
                answer: false,
                type: that.data.type,
                tp1: {
                    title: that.data.title0.slice(0, 4),
                    year: that.data.year0,
                    id: that.data.id0
                },
                tp2: {
                    title: that.data.title1.slice(0, 4),
                    year: that.data.year1,
                    id: that.data.id1
                }
            };
            that.setData({
                wrongcount: that.data.wrongcount + 1,
                history: that.data.history.concat(q)
            });
            if (that.data.wrongcount == 10) {
                that.endGame();
            }
        }
        that.setData({
            animation: "scale-up"
        });
        var timeOut = setTimeout(function () {
            that.setData({
                selected: null,
                showS0: "",
                showS1: "",
                isfirstaction: true,
                animation: ""
            });
            that.getQuestion();
            clearTimeout(timeOut);
        }, 800);

    },

    getn_Question() {
        var that = this;
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/game/get",
            method: "GET",
            data: {
                min: that.data.min,
                max: that.data.max,
                type: that.data.type,
            },
            success: function (res) {
                console.log(res.data)
                that.setData({
                    n_id0: res.data.picked[0],
                    n_id1: res.data.picked[1],
                    n_answer: res.data.result,
                    n_title0: res.data.tp1.title,
                    n_year0: res.data.tp1.year.replace(/-/g, '公元前') + "年",
                    n_title1: res.data.tp2.title,
                    n_year1: res.data.tp2.year.replace(/-/g, '公元前') + "年"

                });
            },
            fail: function (err) {
                console.log(err)
            }
        });
    },

    getQuestion() {
        var that = this;
        this.setData({
            id0: that.data.n_id0,
            title0: that.data.n_title0,
            year0: that.data.n_year0,
            id1: that.data.n_id1,
            title1: that.data.n_title1,
            year1: that.data.n_year1,
            answer: that.data.n_answer
        });
        that.getn_Question();

    },

    startivGame: function () {
        qq.navigateTo({
            url: "../game/game?type=invention"
        });
    },

    startitGame: function () {
        qq.navigateTo({
            url: "../game/game?type=internet"
        });
    },

    anishare: function () {
        this.setData({
            animation: "scale-up"
        })
    }
})
