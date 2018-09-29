;
(function () {
    var cList = {
        link: [{
            name: "ItemEnergyByTime",
            url: "ItemEnergyByTime",
            isNotJava: true,
            data: function () {
                return [{
                    energyItemLocalId: "em1111",
                    timeFrom: "2018-09-10 00:00:00",
                    timeTo: "2018-09-10 23:59:59",
                    dataList: [{
                            time: "00:00",
                            data: "150"
                        },
                        {
                            time: "02:00",
                            data: "120"
                        }, {
                            time: "04:00",
                            data: "220"
                        }, {
                            time: "06:00",
                            data: "210"
                        }, {
                            time: "08:00",
                            data: "150"
                        }, {
                            time: "10:00",
                            data: "300"
                        }, {
                            time: "12:00",
                            data: "222"
                        }, {
                            time: "14:00",
                            data: "100"
                        }, {
                            time: "16:00",
                            data: "169"
                        }, {
                            time: "18:00",
                            data: "120"
                        }, {
                            time: "20:00",
                            data: "200"
                        }, {
                            time: "22:00",
                            data: "120"
                        }
                    ]
                }, {
                    energyItemLocalId: "em222",
                    timeFrom: "2018-09-10 00:00:00",
                    timeTo: "2018-09-11 23:59:59",
                    dataList: [{
                            time: "00:00",
                            data: "250"
                        },
                        {
                            time: "02:00",
                            data: "320"
                        }, {
                            time: "04:00",
                            data: "220"
                        }, {
                            time: "06:00",
                            data: "310"
                        }, {
                            time: "08:00",
                            data: "250"
                        }, {
                            time: "10:00",
                            data: "200"
                        }, {
                            time: "12:00",
                            data: "222"
                        }, {
                            time: "14:00",
                            data: "200"
                        }, {
                            time: "16:00",
                            data: "269"
                        }, {
                            time: "18:00",
                            data: "220"
                        }, {
                            time: "20:00",
                            data: "210"
                        }, {
                            time: "22:00",
                            data: "320"
                        }
                    ]
                }]
            },
        }, {
            name: "GetEnergyModelTreeOfBuilding", //获取分项树
            url: "GetEnergyModelTreeOfBuilding",
            isNotJava: true,
            data: function () {
                return [{
                        name: "aaa",
                        id: "123456",
                        localId: "123456",
                        parentLocalId: "-1",
                        area: 123
                    },
                    {
                        name: "bbb",
                        id: "a123456",
                        localId: "a123456",
                        parentLocalId: "123456",
                        area: 123
                    },
                ];
            }
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
    window.singleCompareController = cteatePromise(cList);
})()