//采用了canvas框架——wezrender
import * as zrender from '../../lib/zrender/zrender';
import * as zrhelper from '../../lib/zrender/zrender-helper';

const app = getApp();
var zr = [];
var timer;
var objM = {};
var c = 0;

Page({
    data: {
        pointsNum: 10,
        points: [],
        wWidthHalf: qq.getSystemInfoSync().windowWidth / 2,
        yearList: [],
        canvasList: [0],
        title: "",
        isAD: false,
        t_isLastPage: false,
        t_page: 0,
        startYear: 40000,
        scrollTop: null,
        isIOS: false,
        hideCanvas: false,
        isEntries: false,
        sResult: [],
        showList: [],
        sValue: "",
        s_page: 1,
        s_pageSize: 10,
        s_isLastPage: false,
        isInputing: false,
        isTimeline: true,
        t_src: "../../static/1-qiehuan-2.png",
        s_src: "../../static/1-qiehuan-1.png",
        type: "invention",
        isInvention: true,
        inputFocus: false,
        radarImg: [],
        isfirst: true,
        hideCanvas: false,
        yingdaotu: "../../static/ydt-0.png",
        ydt: [
            "https://s2.ax1x.com/2019/12/18/QHqLLV.png",
            "https://s2.ax1x.com/2019/12/18/QHqbMq.png",
            "https://s2.ax1x.com/2019/12/18/QHq7zn.png",
            "https://s2.ax1x.com/2019/12/18/QHqoGj.png",
            "https://s2.ax1x.com/2019/12/18/QHqTRs.png",
            "https://s2.ax1x.com/2019/12/18/QHqXZT.png"
        ]
    },

    changeYDT: function () {
        var that = this;
        if (c == 5) {
            this.setData({
                isfirst: false
            })
            qq.setStorageSync("isfirst", true)
        }
        c++
        this.setData({
            yingdaotu: that.data.ydt[c]
        })
    },

    /**
 * 将焦点给到 input（在真机上不能获取input焦点）
 */
    tapInput() {
        this.setData({
            //在真机上将焦点给input
            inputFocus: true,
            hideCanvas: true
        });
    },

    /**
     * input 失去焦点后将 input 的输入内容给到cover-view
     */
    blurInput(e) {
        this.setData({
            sValue: e.detail.value,
            hideCanvas: false
        });
    },

    handleCanvarToImg() {
        var that = this;
        qq.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: qq.getSystemInfoSync().windowWidth,
            height: 810,
            canvasId: 'radarCanvas',
            success: function (res) {
                that.setData({ radarImg: res.tempFilePath });
            }
        });
    },


    changetoInvention: function () {
        if (this.data.isInvention) return

        this.setData({
            type: "invention",
            isInvention: true,
            startYear: 40000,
            isAD: false
        });
        this.startS();
        this.upSearch();
        qq.pageScrollTo({
            scrollTop: 0
        });
    },

    changetoInternet: function () {
        if (!this.data.isInvention) return

        this.setData({
            type: "internet",
            isInvention: false,
            startYear: 1865,
            isAD: true
        });
        this.startS();
        this.upSearch();
        qq.pageScrollTo({
            scrollTop: 0
        });
    },

    toTop: function () {
        qq.pageScrollTo({
            scrollTop: 0
        })
    },

    onPageScroll: function (e) {
        this.setData({
            scrollTop: e.scrollTop
        });
    },

    onReady: function (e) {

    },

    downStart: function (e) {
        var that = this;
        timer = setInterval(function () {
            var dis = that.data.scrollTop + 20;
            if (dis < 0) {
                dis = 0;
            }
            qq.pageScrollTo({
                scrollTop: dis,
                duration: 0
            })
        }, 30);
    },

    downEnd: function (e) {
        clearInterval(timer);
    },

    upStart: function (e) {
        var that = this;
        timer = setInterval(function () {
            var dis = that.data.scrollTop - 20;
            if (dis < 0) {
                dis = 0;
            }
            qq.pageScrollTo({
                scrollTop: dis,
                duration: 0
            })
        }, 30);
    },

    upEnd: function (e) {
        clearInterval(timer);
    },

    changetoBC: function (e) {
        var that = this;
        if (this.data.isAD) {
            wx.showToast({
                title: '切换年份为公元前',
                icon: 'success',
                duration: 2000
            })

            this.setData({
                isAD: false,
                startYear: 40000,
                canvasList: [0],
                hideCanvas: true
            });
            setTimeout(function () {
                console.log('doSomething')
                that.setData({
                    hideCanvas: false
                })
            }, 500);
            for (var i = 0; i < zr.length; i++) {
                zr[i].clear();
            }

            this.startS();
        }
    },

    changetoAD: function (e) {
        var that = this;
        if (!this.data.isAD) {
            wx.showToast({
                title: '切换年份为公元后',
                icon: 'success',
                duration: 2000
            })

            this.setData({
                isAD: true,
                startYear: 1,
                canvasList: [0],
                hideCanvas: true
            });
            setTimeout(function () {
                console.log('doSomething')
                that.setData({
                    hideCanvas: false
                })
            }, 500);
            for (var i = 0; i < zr.length; i++) {
                zr[i].clear();
            }
            this.startS();
        }
    },

    updateValue: function (e) {
        let name = e.currentTarget.dataset.name;
        let nameMap = {}
        nameMap[name] = e.detail && e.detail.value
        this.setData(nameMap)
    },

    changeTS: function () {
        if (this.data.isTimeline) {
            this.setData({
                isTimeline: false
            });
        } else {
            this.setData({
                isTimeline: true
            });
        }
        qq.pageScrollTo({
            scrollTop: 0
        });
    },

    onReachBottom: function () {
        var that = this;
        if (that.data.isTimeline) {
            if (that.data.t_isLastPage) {
                return
            }
            that.setData({
                t_page: that.data.t_page + 1,
                canvasList: that.data.canvasList.concat(0)
            });
            console.log(that.data.t_page);
            that.t_getDetails();
        } else {
            if (that.data.s_isLastPage) {
                return
            }
            that.setData({ s_page: this.data.s_page + 1 });
            that.s_getDetails();
        }

    },


    drawTitle(y, nowX, nowY, n, i) {
        var that = this;
        qq.showLoading({
            title: "加载中"
        })
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/getList",
            data: {
                year: y,
                type: that.data.type
            },
            success: function (res) {
                res = res.data;
                if (res.list.length > 1) {
                    var xingxing = new zrender.Image({
                        style: {
                            image: "../../static/2-xingxing-1.png",
                            x: nowX - 10,
                            y: nowY - 10,
                            width: 20,
                            height: 20
                        }

                    });
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    xingxing.on('mousedown', function (e) {
                        console.log("单击了星星");

                        var obj = JSON.stringify(res.list);
                        qq.navigateTo({
                            url: '../search/search?list=' + obj + '&type=' + that.data.type,
                            success: function (res) { console.log("跳转成功") },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    });

                    zr[n].add(xingxing);
                    if (y < 0) {
                        var jiantou = new zrender.Image({
                            style: {
                                image: "../../static/1-jiantou.png",
                                x: nowX + 165,
                                y: nowY - 7,
                                width: 20,
                                height: 16.5
                            }

                        });
                    } else {
                        var jiantou = new zrender.Image({
                            style: {
                                image: "../../static/1-jiantou.png",
                                x: nowX + 85,
                                y: nowY - 7,
                                width: 20,
                                height: 16.5
                            }

                        });
                    }
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    jiantou.on('mousedown', function (e) {
                        console.log("单击了箭头");

                        var obj = JSON.stringify(res.list);
                        qq.navigateTo({
                            url: '../search/search?list=' + obj + '&type=' + that.data.type,
                            success: function (res) { console.log("跳转成功") },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    });

                    zr[n].add(jiantou);
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    var text_year = new zrender.Text({
                        style: {
                            text: y < 0 ? '公元前' + (-y) : y,
                            fontFamily: 'Source Han Sans CN',
                            fontSize: 23,
                            textFill: '#fefefe'
                        },
                        position: [nowX + 25, nowY - 10]
                    });
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    text_year.on('mousedown', function (e) {

                        var obj = JSON.stringify(res.list);
                        qq.navigateTo({
                            url: '../search/search?list=' + obj + '&type=' + that.data.type,
                            success: function (res) { console.log("跳转成功") },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    });

                    zr[n].add(text_year);
                } else {
                    if (y < 0) {
                        var text_title = new zrender.Text({
                            style: {
                                text: res.list[0].title,
                                fontFamily: 'AliHYAiHei',
                                fontSize: 18,
                                textFill: '#fefefe'
                            },
                            position: [nowX + 115, nowY - 4]
                        });
                    } else {
                        var text_title = new zrender.Text({
                            style: {
                                text: res.list[0].title,
                                fontFamily: 'AliHYAiHei',
                                fontSize: 18,
                                textFill: '#fefefe'
                            },
                            position: [nowX + 48, nowY - 4]

                        });
                    }
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    text_title.on('mousedown', function (e) {
                        console.log("单击了标题");
                        qq.navigateTo({
                            url: '../entry/entry?id=' + res.list[0].tpid + '&type=' + that.data.type,
                            success: function (res) { console.log("跳转成功") },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    });

                    zr[n].add(text_title);

                    var circle_arc = new zrender.Circle({
                        shape: {
                            cx: nowX,
                            cy: nowY,
                            r: 10
                        },
                        style: {
                            fill: "#fcc200"
                        }

                    });
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    circle_arc.on('mousedown', function (e) {
                        console.log("单击了标题");
                        qq.navigateTo({
                            url: '../entry/entry?id=' + res.list[0].tpid + '&type=' + that.data.type,
                            success: function (res) { console.log("跳转成功") },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    });

                    zr[n].add(circle_arc);

                    var text_year = new zrender.Text({
                        style: {
                            text: y < 0 ? '公元前' + (-y) : y,
                            fontFamily: 'Source Han Sans CN',
                            fontSize: 15,
                            textFill: '#a7a7a7'
                        },
                        position: [nowX + 13, nowY]
                    });
                    //利用框架的事件绑定函数，绑定mousedown事件到指定的图形对象中，执行相应的跳转功能
                    text_year.on('mousedown', function (e) {
                        console.log("单击了标题");
                        qq.navigateTo({
                            url: '../entry/entry?id=' + res.list[0].tpid + '&type=' + that.data.type,
                            success: function (res) { console.log("跳转成功") },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    });

                    zr[n].add(text_year);
                }
                qq.hideLoading()
            },
            fail: function (err) {
                console.log(err)
            },
            complete: function () {

            }
        });
    },

    toSearch: function () {
        qq.navigateTo({
            url: '../search/search'
        })
    },

    ctap: function (e) {
        console.log(e);
        let touch = e.touches[0];
        let id = e.target.dataset.id;
        //绑定触摸开始事件到指定的canvas当中
        zr[id].handler.dispatch('mousedown', {
            zrX: touch.x,
            zrY: touch.y
        });
    },

    manyList: function (list) {
        this.setData({
            isTimeline: false,
            isEntries: true,
            sResult: list,
            showList: []
        });
        this.s_getDetails();
    },


    t_getDetails() {
        var that = this;

        if (that.data.yearList.length - that.data.t_page * that.data.pointsNum >= that.data.pointsNum) {
            var showyearList = that.data.yearList.slice(that.data.t_page * that.data.pointsNum, (that.data.t_page + 1) * that.data.pointsNum);
            var p = this.data.points;
        } else {
            var showyearList = that.data.yearList.slice(that.data.t_page * that.data.pointsNum, that.data.yearList.length - 1);
            var p = this.data.points.slice(0, that.data.yearList.length - that.data.t_page * that.data.pointsNum - 1);
            that.setData({
                t_isLastPage: true
            });
        }
        var n = that.data.t_page;
        zr[n] = zrhelper.createZrender('timeline-' + n, 360, 720);

        var scale = 0.25;

        for (var i = 0; i < p.length; i++) {
            var nowX = p[i]["x"],
                nowY = p[i]["y"],
                last1X, last1Y, last2X, last2Y, nextX, nextY, cAx, cAy, cBx, cBy;

            if (i != 0) {
                if (i === 1) {
                    last1X = p[i - 1]["x"]
                    last1Y = p[i - 1]["y"]
                    last2X = p[i - 1]["x"]
                    last2Y = p[i - 1]["y"]
                    nextX = p[i + 1]["x"]
                    nextY = p[i + 1]["y"]
                } else if (i === p.length - 1) {
                    last1X = p[i - 1]["x"]
                    last1Y = p[i - 1]["y"]
                    last2X = p[i - 2]["x"]
                    last2Y = p[i - 2]["y"]
                    nextX = p[i]["x"]
                    nextY = p[i]["y"]

                } else {
                    last1X = p[i - 1]["x"]
                    last1Y = p[i - 1]["y"]
                    last2X = p[i - 2]["x"]
                    last2Y = p[i - 2]["y"]
                    nextX = p[i + 1]["x"]
                    nextY = p[i + 1]["y"]
                }

                cAx = last1X + (nowX - last2X) * scale;
                cAy = last1Y + (nowY - last2Y) * scale;
                cBx = nowX - (nextX - last1X) * scale;
                cBy = nowY - (nextY - last1Y) * scale;


                var curve_line = new zrender.BezierCurve({
                    shape: {
                        x1: last1X,
                        y1: last1Y,
                        cpx1: cAx,
                        cpy1: cAy,
                        cpx2: cBx,
                        cpy2: cBy,
                        x2: nowX,
                        y2: nowY,
                        percent: 0
                    },
                    style: {
                        lineWidth: 3,
                        stroke: '#fcc200',
                        lineDash: [5, 5],
                        lineDashOffset: 0
                    }
                });

                zr[n].add(curve_line);
                curve_line.animate('shape', false)
                    .delay(400 * i)
                    .when(400, { percent: 1 })
                    .start();
            }

            this.drawTitle(showyearList[i], nowX, nowY, n, i);


            console.log(this.data.title);


        }
    },

    drawP: function () {
        var that = this;
        zr[0] = zrhelper.createZrender('timeline-0', 360, 720);
        var p = this.data.points;
        var scale = 0.25;

        for (var i = 0; i < p.length; i++) {
            var nowX = p[i]["x"],
                nowY = p[i]["y"],
                last1X, last1Y, last2X, last2Y, nextX, nextY, cAx, cAy, cBx, cBy;

            if (i != 0) {
                if (i === 1) {
                    last1X = p[i - 1]["x"]
                    last1Y = p[i - 1]["y"]
                    last2X = p[i - 1]["x"]
                    last2Y = p[i - 1]["y"]
                    nextX = p[i + 1]["x"]
                    nextY = p[i + 1]["y"]
                } else if (i === p.length - 1) {
                    last1X = p[i - 1]["x"]
                    last1Y = p[i - 1]["y"]
                    last2X = p[i - 2]["x"]
                    last2Y = p[i - 2]["y"]
                    nextX = p[i]["x"]
                    nextY = p[i]["y"]
                } else {
                    last1X = p[i - 1]["x"]
                    last1Y = p[i - 1]["y"]
                    last2X = p[i - 2]["x"]
                    last2Y = p[i - 2]["y"]
                    nextX = p[i + 1]["x"]
                    nextY = p[i + 1]["y"]
                }

                cAx = last1X + (nowX - last2X) * scale;
                cAy = last1Y + (nowY - last2Y) * scale;
                cBx = nowX - (nextX - last1X) * scale;
                cBy = nowY - (nextY - last1Y) * scale;


                var curve_line = new zrender.BezierCurve({
                    shape: {
                        x1: last1X,
                        y1: last1Y,
                        cpx1: cAx,
                        cpy1: cAy,
                        cpx2: cBx,
                        cpy2: cBy,
                        x2: nowX,
                        y2: nowY,
                        percent: 0
                    },
                    style: {
                        lineWidth: 3,
                        stroke: '#fcc200',
                        lineDash: [5, 5],
                        lineDashOffset: 0
                    }
                });

                zr[0].add(curve_line);
                curve_line.animate('shape', false)
                    .delay(400 * i)
                    .when(400, { percent: 1 })
                    .start();
            }

            if (i != p.length - 1) {
                this.drawTitle(that.data.yearList[i], nowX, nowY, 0, i);
            }
            console.log(this.data.title);


        }
    },

    startS() {
        var that = this;
        qq.request({
            url: "https://qq-dev.timeline.hfzhang.wang/api/getYearList",
            data: {
                type: that.data.type
            },
            success: function (res) {
                console.log(res.data.year_list);
                that.setData({
                    yearList: res.data.year_list
                });

                var year_list = that.data.yearList;
                console.log(year_list);

                if (that.data.isAD) {
                    var sy = that.data.startYear;
                } else {
                    var sy = -that.data.startYear;
                }
                for (var i = 0; i < year_list.length; i++) {
                    if (sy <= year_list[i]) {
                        year_list = year_list.slice(i, year_list.length - 1);
                        break
                    }
                }
                that.setData({
                    yearList: year_list,
                    canvasList: [0],
                    t_page: 0,
                    t_isLastPage: false
                });
                zr = [];
                console.log(that.data.yearList);
                that.drawP();

            },
            fail: function (err) {
                console.log(err)
            }
        });


    },

    onLoad: function () {
        var that = this;
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });


        if (qq.getStorageSync("isfirst")) {
            this.setData({
                isfirst: false
            })
        }
        console.log(app.globalData.systemInfo.platform)
        if (app.globalData.systemInfo.platform == "ios") {
            that.setData({
                isIOS: true
            });
        }

        let a = [];
        for (var i = 0; i < that.data.pointsNum + 1; i++) {
            a.push({
                "x": that.data.wWidthHalf - 85 + 30 * Math.pow(-1, i),
                "y": 80 * i + 10
            });
            if (i == that.data.pointsNum) {
                that.setData({
                    points: a
                });
                console.log(that.data.points)
            }
        };
        that.startS();
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
                    that.s_getDetails();
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
        setTimeout(function () {
            if (app.globalData.entry) {
                console.log("kaishitiaozhu")
                qq.navigateTo({
                    url: "../entry/entry?id=" + app.globalData.entryid + "&type=" + app.globalData.entrytype
                });
            }
        },1000)

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
            isTimeline: false,
            sResult: [],
            showList: [],
            s_page: 1,
            s_isLastPage: false,
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
                    that.s_getDetails();
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

    upSearch: function () {
        var that = this;
        that.setData({
            sResult: [],
            showList: [],
            s_page: 1,
            s_isLastPage: false,
        });
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
                    that.s_getDetails();
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
        var that = this;
        console.log(e.currentTarget.dataset.id)
        qq.navigateTo({
            url: '../entry/entry?id=' + e.currentTarget.dataset.id + '&type=' + that.data.type,
            success: function (res) { console.log("跳转成功") },
            fail: function (res) { },
            complete: function (res) { },
        });
    },


    s_getDetails: function () {
        var that = this;
        var s;
        let d = [];
        var listLength = this.data.sResult.length;
        var size = this.data.s_pageSize;
        if (this.data.s_page == listLength / size) {
            s = this.data.sResult.slice(size * (this.data.s_page - 1), listLength - 1);
            that.setData({
                s_isLastPage: true
            });
        } else {
            s = this.data.sResult.slice(size * (this.data.s_page - 1), size * this.data.s_page);
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
                        content: (res.data.timepoint.convert_content.length <= 40) ? res.data.timepoint.convert_content : res.data.timepoint.convert_content.slice(0, 39) + "...",
                        id: item.tpid,
                        like: res.data.like,
                        comments: res.data.comment
                    };
                    d.push(objM);

                    if (index == 9 || (listLength < 10 && index == listLength - 1)) {
                        that.setData({
                            showList: that.data.showList.concat(d)
                        });
                        console.log(that.data.showList);
                    }
                },
                fail: function (err) {
                    console.log(err)
                }
            });
        });
    }

})
