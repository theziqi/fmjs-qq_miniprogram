const app = getApp()

Page({
    data: {
        timer: "",
        avatarUrl: "",
        isStartGame: false,
        isClosetoEnd: false,
        isEndGame: false,
        countDownNum: 30,
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
        animation0: "",
        animation1: "",
        history: [],
        showPosterImage: false,
        postUrl: "",
        hidecanvas: false
    },

    cancel: function () {
        this.setData({
            showPosterImage: false
        })
    },

    confirm: function () {
        var that = this;
        qq.openQzonePublish({
            text: '',
            media: [
                {
                    type: 'photo',
                    path: that.data.postUrl
                }
            ]
        })
        this.setData({
            showPosterImage: false
        })
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

    // 弹出打卡海报
    showPoster: function () {
        var that = this;
        that.setData({
            showPosterImage: true
        })

        qq.showLoading({
            title: '分享图片生成中...',
            icon: 'loading',
            duration: 1000
        })


        /* 图片获取成功才执行后续代码 */
        var canvas = wx.createCanvasContext('shareCanvas')
        // 绘制背景图
        canvas.drawImage('../../static/1-beijing-1.jpg', 0, 0, 750, 937);

        // 绘制活动二维码
        canvas.drawImage('../../static/qrcode.png', 275, 668, 200, 200);

        canvas.setFontSize(44)
        canvas.setFillStyle("#ffeedf")
        canvas.setStrokeStyle('#ffeedf')
        canvas.fillText('恭喜你答对了 ' + that.data.score + ' 道题目！', 94, 217, 590)

        canvas.setFontSize(44)
        canvas.setFillStyle("#ffeedf")
        canvas.setStrokeStyle('#ffeedf')
        canvas.fillText('超过用户比例达', 94, 289, 484)

        // 绘制圆形
        canvas.save()
        canvas.beginPath()
        canvas.setStrokeStyle('#ffeedf')
        canvas.lineWidth = 5;
        canvas.arc(375, 430, 80, 0, 2 * Math.PI)
        canvas.stroke()
        canvas.restore()

        canvas.setFontSize(60)
        canvas.setFillStyle("#fcc200")
        canvas.setStrokeStyle('#fcc200')
        canvas.fillText(that.data.percent + "%", 313, 455, 484)

        /** 
        canvas.setFontSize(32)
        canvas.setFillStyle("#fefefe")
        canvas.setStrokeStyle('#fefefe')
        canvas.fillText('超过了 ' + that.data.percent + "% 的用户", 94, 583, 484)
        */
        canvas.draw()

        setTimeout(function () {
            qq.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 750,
                height: 937,
                destWidth: 750,
                destHeight: 937,
                canvasId: 'shareCanvas',
                success: function (res) {
                    that.setData({
                        postUrl: res.tempFilePath,
                        hidecanvas: true
                    })
                    qq.hideLoading()
                },
                fail: function (res) { }
            })
        }, 1000)

    },
    // 保存海报
    savePoster: function () {

        // 获取背景图片信息
        var that = this;
        qq.showLoading({
            title: '分享图片保存中...',
            icon: 'loading',
            duration: 1000
        })



    },

    hideModal: function () {
        this.setData({
            showPosterImage: false
        })
    },


    rec: function () {
        this.setData({
            isStartGame: false,
            isClosetoEnd: false,
            isEndGame: false,
            score: 0,
            countDownNum: 30,
            answer: null,
            selected: null,
            percent: null,
            wrongcount: 0,
            history: []
        });
        if (this.data.type == "invention") {
            this.startivGame();
        } else if (this.data.type == "internet") {
            this.startitGame();
        }
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
                history: that.data.history
            },
            success: function (res) {
                console.log(res.data)
                that.setData({
                    rank: res.data.rank,
                    total: res.data.total,
                    percent: Math.round((1 - res.data.rank / (res.data.total + 1)) * 100)
                });

                if(res.data.full){
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

    onSearch() {
        var that = this;
        console.log(that.data.sValue);
        qq.navigateTo({
            url: '../search/search?s=' + that.data.sValue,
            success: function (res) { console.log("跳转成功") },
            fail: function (res) { },
            complete: function (res) { },
        });
    },

    onLoad(options) {
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl
        });
        if (options.type == "invention") {
            this.startivGame();
        } else if (options.type == "internet") {
            this.startitGame();
        }
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
        if (id == "0") {
            that.setData({
                animation0: "scale-up"
            });
        } else {
            that.setData({
                animation1: "scale-up"
            });
        }
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
                that.setData({
                    wrongcount: 0
                })
                clearInterval(that.data.timer);
                that.endGame();
            }
        }

        var timeOut = setTimeout(function () {
            that.setData({
                selected: null,
                showS0: "",
                showS1: "",
                isfirstaction: true,
                animation0: "",
                animation1: ""
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
        var that = this;
        this.setData({
            type: "invention",
            isStartGame: true
        });
        this.countDown();

        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/game/get",
            method: "GET",
            data: {
                min: that.data.min,
                max: that.data.max,
                type: that.data.type,
            },
            success: function (res) {
                that.setData({
                    id0: res.data.picked[0],
                    id1: res.data.picked[1],
                    answer: res.data.result,
                    title0: res.data.tp1.title,
                    year0: res.data.tp1.year.replace(/-/g, '公元前') + "年",
                    title1: res.data.tp2.title,
                    year1: res.data.tp2.year.replace(/-/g, '公元前') + "年"
                });
                that.getn_Question();

            },
            fail: function (err) {
                console.log(err)
            }
        });
    },

    startitGame: function () {
        var that = this;
        this.setData({
            type: "internet",
            isStartGame: true
        });
        this.countDown();

        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/game/get",
            method: "GET",
            data: {
                min: that.data.min,
                max: that.data.max,
                type: that.data.type,
            },
            success: function (res) {
                that.setData({
                    id0: res.data.picked[0],
                    id1: res.data.picked[1],
                    answer: res.data.result,
                    title0: res.data.tp1.title,
                    year0: res.data.tp1.year.replace(/-/g, '公元前') + "年",
                    title1: res.data.tp2.title,
                    year1: res.data.tp2.year.replace(/-/g, '公元前') + "年"
                });
                that.getn_Question();

            },
            fail: function (err) {
                console.log(err)
            }
        });
    }
})
