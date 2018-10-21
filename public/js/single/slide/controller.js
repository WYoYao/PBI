;
(function () {
    var cList = {
        link: [{
            name: "GetItemSlidingEnergyByTime",
            url: "GetItemSlidingEnergyByTime",
            isNotJava: false,
            data: function () {
                return [{
                    minData: "10",
                    maxData: "100",
                    avgData: "50",
                    midData: "50",
                    inflectionPoints:[
                        {
                            time:"2018-01-01",
                            state:2
                        },{
                            time:"2018-01-02",
                            state:1
                        }
                    ],
                    dataList: [{
                            timeSpan: "2016.01~2016.02",
                            data: 150
                        },
                        {
                            timeSpan: "2016.02~2016.03",
                            data: 120
                        }, {
                            timeSpan: "2016.03~2016.04",
                            data: 220
                        }, {
                            timeSpan: "2016.04~2016.05",
                            data: 210
                        }, {
                            timeSpan: "2016.05~2016.06",
                            data: 150
                        }, {
                            timeSpan: "2016.06~2016.07",
                            data: 300
                        }, {
                            timeSpan: "2016.07~2016.08",
                            data: 222
                        }, {
                            timeSpan: "2016.09~2016.10",
                            data: 100
                        }, {
                            timeSpan: "2016.10~2016.11",
                            data: 169
                        }, {
                            timeSpan: "2016.11~2016.12",
                            data: 120
                        }, 
                    ],
                   
                }, ]
            },
        }, ]
    }
    var cteatePromise = function (arr) {
        return arr.link.reduce(function (obj, link) {
            if (obj[link.name]) {
                console.error(link.name + "链接已存在，请修改传入参数");
                return
            }
            obj[link.name] = function (argu) {
                if (link.isNotJava) {
                    return new Promise(function (resolve, reject) {
                        var data = link.data();
                        resolve(data);
                    })
                } else {
                    return new Promise(function (resolve, reject) {
                        var data = {
                            url: link.url,
                            data: Object.assign({}, link.argu, argu, arr.argu),
                            success: resolve,
                            error: function (err) {
                                $("#globalnotice").pshow({
                                    text: "获取数据失败",
                                    state: "failure"
                                })
                                reject();
                            },
                            configServiceName: link.severName,
                        };
                        link.severName ? data.configServiceName = link.severName : void 0;
                        pajax.post(data);
                    })
                }

            }
            return obj
        }, {})
    };
    window.singleSlideController = cteatePromise(cList);
})()