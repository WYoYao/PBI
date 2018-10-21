$(function () {

    window.fail = function (text) {
        $(window.top.document.querySelector("#globalnotice")).pshow({ text: text, state: "failure" });
    }

    var MAX = 10000;
    var MIN = 0;

    //cansvas画布清空方法
    function canvasclearRect(canvas) {

        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 120, 120);
        context.beginPath();
    }
    var app = new Vue({
        el: "#app",
        data: {
            // 图标报表
            tableTypes: [{
                name: "报表",
                code: 1,
            }],
            // 面积单位
            areaTypres: [{
                name: "总量",
                code: 1,
                selected: true
            },
            {
                name: "单平米",
                code: 2,
            }
            ],
            // 能源类型
            energyTypes: [{
                name: "能耗",
                code: 1,
                selected: true
            },
            {
                name: "费用",
                code: 2,
            },
            {
                name: "碳排放量",
                code: 3,
            },
            {
                name: "标煤",
                code: 4,
            },
            ],
            // 是否显示缩略下拉
            iscombox: false,
            // 已选中类型
            query: {
                tables: [{
                    name: "图表",
                    code: 0,
                    selected: true,
                }],
                areas: [{
                    name: "总量",
                    code: 1,
                }],
                energy: [{
                    name: "能耗",
                    code: 1,
                }],
            },
            // 分项模型
            energyModelList: [],
            //========== 真实查询中是使用的带的左侧数据 Start
            // 对应的建筑
            energyProject: false,
            //  能耗模型
            energyModel: false,
            // 对应的分项集合
            suboptionModel: [],
            // 查询对应的时间
            timer: {},
            //=========== 真实查询中是使用的带的左侧数据 End
            //=========== 选中控件中左侧数据 Start
            // 对应的建筑
            energyProjectBak: false,
            //  能耗模型
            energyModelBak: false,
            // 对应的分项集合
            suboptionModelBak: [],
            // 查询对应的时间
            timerBak: {},
            //=========== 选中控件中左侧数据 End
            showEnergyModel: false,
            // 查询热图返回的数据
            // res: [],
            res: [],//  查询的数据
            argu: null,
            //  图表Table 切换的值
            tab_table: null,
            // 颜色对应的值
            color: {
                start: "#FDD38C",
                end: "#DF4569",
            },
            // 图表
            charts: [],
        },
        methods: {
            // 颜色的回调
            colorcall: function (color) {

                if (this.color.start != color.start || this.color.end != color.end) {
                    this.color = color;
                    // 重新查询数据
                    if (this.realCanSubmit) {
                        // 重新查询数据
                        this.submitQuery();
                    }
                }
            },
            // 转换时间粒度
            timeType2: function (startTime, endTime) {
                var _that = this;
                var diff = +new Date(biTool.dateStr2IE(endTime)) - new Date(biTool.dateStr2IE(startTime));
                //数据聚合时间类型1-时，2-天，4-月，5-年
                if (diff < (7 * 24 * 60 * 60 * 1000)) {
                    return 1;
                } else if (diff < (31 * 24 * 60 * 60 * 1000)) {
                    return 2;
                } else if (diff < (365 * 24 * 60 * 60 * 1000)) {
                    return 4;
                } else {
                    return 5;
                }

                return 1;
            },
            //  Tab 选项切换内容
            createHandlerClick: function (type) {
                var _that = this;

                return function (arr) {

                    _that.query[type] = arr;

                    //  查询对应的值的单位
                    if (type == "energy" || type == "areas") {

                        if (_that.realCanSubmit) {
                            // 重新查询数据
                            _that.submitQuery();
                        }

                    } else {

                    }
                }
            },
            computeWidth: function () {
                //  计算宽度是否够容纳

                //                      正行宽度                             图表报表          下载详情图表          平方单位                        能源类型                padding-right
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox.getWidth() - 84 - this.$refs.cobxs.getWidth() - this.$refs.cobxs1.getWidth() - 20) < 0);
            },
            // 模型面板取消选项
            handlercancelenergyModel: function () {
                this.showEnergyModel = false;
            },
            // 模型面板弹出选项
            handlerclickenergyModel: function (projects, arr) {
                this.energyProjectBak = projects[0];
                this.energyModelBak = arr[0];

                // 清空已经选中的能耗模型
                this.suboptionModelBak = [];
                //  模型面板取消选项
                this.handlercancelenergyModel();
                //  重新查询对应的分项树
                this.queryModelTree(this.energyModelBak.buildingLocalId, this.energyModelBak.energyModelId);
            },
            // 查询对应的分项树
            queryModelTree: function (buildingLocalId, energyModelId) {

                var _that = this;
                controller.querySubOption({
                    buildingLocalId: buildingLocalId,
                    energyModelId: energyModelId
                }).then(function (res) {
                    _that.energyModelList = res;
                })
            },
            // 分项返回值
            handlerclickSuboption: function (arr) {

                this.suboptionModelBak = arr;
            },
            // 获取对应的查询数据
            getQueryArgu: function (times) {
                var _that = this;

                _that.tab_table = 0;

                var timeType = times[0].timeType == 'w' ? '1' : '2';

                return {
                    "projectId": _that.energyProject.projectId, //类型：String  必有字段  备注：项目id
                    "buildingLocalId": _that.energyModel.buildingLocalId, //类型：String  必有字段  备注：建筑本地编码
                    "energyModelId": _that.energyModel.energyModelId, //类型：String  必有字段  备注：能耗模型本地编码
                    "timeType": parseInt(timeType), //类型：Number  必有字段  备注：数据聚合时间类型1-时，2-天，4-月，5-年
                    "dataKind": _.get(_that.query.areas, '[0].code'), //类型：Number  必有字段  备注：1-总能耗；2-单平米能耗；
                    "dataType": _.get(_that.query.energy, '[0].code'), //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                    "paramList": times.map(function (item) {
                        return {
                            "energyItemLocalId": _.map(_that.suboptionModel, 'localId').join(''), //类型：String  必有字段  备注：分项本地编码
                            "area": _.map(_that.suboptionModel, 'area').join(''),
                            "timeFrom": new Date(item.startTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：开始时间yyyy-MM-dd HH:mm:ss（>=）
                            "timeTo": new Date(item.endTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：结束时间yyyy-MM-dd HH:mm:ss（<）
                        }
                    })
                }
            },
            // 查询对应图表需要的信息
            queryMasterTabel: function () {

                var _that = this;

                //  获取查询数据
                var argu = _that.getQueryArgu();

                return controller.ItemEnergyByTime(argu).then(function (res) {

                    // 保存渲染的表格的数据
                    _that.queryBak = res;
                    _that.queryRes = res[0].dataList.map(function (item) {
                        return {
                            x: biTool.dateStr2IE(item.time),
                            y: item.data,
                        }
                    });

                    _that.queryDeatil = _.cloneDeep(_that.queryRes);

                    //  渲染的主表格
                    return _that.createMaster(_.cloneDeep(_that.queryRes));

                    //  渲染的渲染的对应子表格
                })
            },
            // 验证时间的长度是否同意
            vTimeLen: function (argu) {


                if (argu.length <= 1) return true;

                if ((argu[0].endTime - argu[0].startTime) != (argu[1].endTime - argu[1].startTime)) {
                    fail("对比不同时间的数据需要保持时间间隔一致!");
                    return false;
                }

                return true;
            },
            //  时间控件点击选择事件
            timeClick: function (argu) {

                // 先赋值
                this.timerBak = argu;

                this.vTimeLen(argu);
            },
            // 获取分享模型信息
            getItemByEnergyModelList: function (localId) {
                return _.find(this.energyModelList, {
                    localId: localId
                });
            },
            // 创建表格 父子图表
            createCharts: function () {
                var _that = this;
                if (!_that.isColumnar()) {

                    _that.queryMasterTabel().then(function () {
                        _that.getChilds(_that.suboptionModel[0].content);
                    })
                } else {
                    // 生成整体图表
                    _that.queryMasterTabel().then(function (res) {
                        // 生成参考信息
                        _that.createReference();
                        // 绑定总价
                        _that.Reference.total = _that.queryBak[0].sumData;
                        // 生成详情图表
                        _that.createDetail(res);
                    });
                }
            },
            // 根据时间粒度来转换时间字符串
            convertTimeByTimeType: function (time, timeType) {
                var date = new Date(time);

                return {
                    1: date.format('hh:00'),
                    2: date.format('MM-dd'),
                    4: date.format('yyyy-MM'),
                    5: date.format('yyyy'),
                }[timeType];
            },
            // 返回的统一的小数点
            fix2: function (num) {
                num = parseFloat(num);
                if (_.isNaN(num)) return 0;

                var len = _.get(num.toString().split('.'), '[1].length', 0);
                if (len === 0) return num;

                if (num < 1) return num.toFixed(3);
                return num.toFixed(1);
            },
            submitBtnSquery: function () {
                var _that = this;

                // 赋值
                this.timer = _.cloneDeep(this.timerBak);
                this.energyProject = _.cloneDeep(this.energyProjectBak);
                this.energyModel = _.cloneDeep(this.energyModelBak);
                this.suboptionModel = _.cloneDeep(this.suboptionModelBak);

                if (!_that.vTimeLen(_that.timer)) return false;

                _that.argu = _that.getQueryArgu(_that.timer);
                // 保存时间 
                _that.timerBak = _.cloneDeep(_that.timer);

                _that.submitQuery();
            },
            // 查询表格数据
            submitQuery: function () {
                var _that = this;


                controller.ItemEnergyByTime(_that.argu).then(function (res) {

                    _that.res = res;

                    _that.$nextTick(function () {

                        _that.createChart(_.cloneDeep(res), _that.timer[0].timeType);

                    })
                })
            },
            // 创建表格
            createChart: function (list, type) {
                var _that = this;

                _that.charts = [];

                Promise.all(list.map(function (item, index, content) {

                    return new Promise(function (resolve) {

                        if (type == 'y') {
                            var chart = pchart.initYearHeatmap({
                                // title: {
                                //     text: _that.suboptionModel[0].name,
                                //     align: 'left',
                                // },
                                // yAxis: {
                                //     title: { text: 'kWh' },
                                //     align: 'low',
                                //     y: -10,
                                //     x: 600
                                // },
                                title: {
                                    text: '',
                                    align: 'left',
                                },
                                yAxis: {
                                    title: { text: '' },
                                    align: 'low',
                                    y: -10,
                                    x: 600
                                },
                                container: _that.$refs['chart' + index][0],
                                series: {
                                    data: item.dataList.map(function (item) {
                                        return {
                                            x: new Date(biTool.dateStr2IE(item.time)).format("yyyy/MM/dd hh:mm:00"),
                                            unit: _that.unit,
                                            y: parseFloat(_that.fix2(item.data)),
                                        }
                                    }),
                                    name: _.get(_that.query, "energy[0].name", ''),
                                },
                                colorAxis: {
                                    maxColor: _that.color.end,
                                    minColor: _that.color.start,
                                }
                            }, function () {
                                resolve()
                            });
                            _that.charts.push(chart);
                        } else {

                            if (content.length == 1) {

                                var chart = pchart.initWeekHeatmap({
                                    title: {
                                        text: '',
                                        align: 'high',
                                    },
                                    yAxis: {
                                        title: { text: '' },
                                        align: 'low',
                                        y: -10,
                                        x: 600
                                    },
                                    container: _that.$refs['chart' + index][0],
                                    series: {
                                        data: item.dataList.map(function (item) {
                                            return {
                                                x: new Date(biTool.dateStr2IE(item.time)).format("yyyy/MM/dd hh:mm:00"),
                                                unit: _that.unit,
                                                y: parseFloat(_that.fix2(item.data)),
                                            }
                                        }),
                                        name: _.get(_that.query, "energy[0].name", ''),
                                    },
                                    colorAxis: {
                                        maxColor: _that.color.end,
                                        minColor: _that.color.start,
                                    }
                                }, function () {


                                    resolve()
                                });

                                _that.charts.push(chart);

                            } else if (content.length == 2) {

                                var chart = pchart.initWeekHeatmap({
                                    title: {
                                        text: '',
                                        align: 'high',
                                    },
                                    yAxis: {
                                        title: { text: '' },
                                        align: 'low',
                                        y: -10,
                                        x: 600
                                    },
                                    container: _that.$refs['chart' + index][0],
                                    series: {
                                        data: item.dataList.map(function (item, i) {
                                            return {
                                                x: new Date(biTool.dateStr2IE(item.time)).format("yyyy/MM/dd hh:mm:00"),
                                                unit: _that.unit,
                                                y: parseFloat(_that.fix2(item.data - content[index == 1 ? 0 : 1].dataList[i].data)),
                                            }
                                        }),
                                        name: _.get(_that.query, "energy[0].name", ''),
                                    },
                                    colorAxis: {
                                        maxColor: _that.color.end,
                                        minColor: _that.color.start,
                                    }
                                }, function () {


                                    resolve()
                                });

                                _that.charts.push(chart);
                            }
                        }
                    })
                }));
            },
            // 获取分享模型信息
            getItemByEnergyModelList: function (localId) {
                return _.find(this.energyModelList, {
                    localId: localId
                });
            },
            deleteRecordFn: function (obj) {

                var _that = this;

                var index = _that.selecteds.indexOf(obj);

                _that.res.splice(index, 1);

                _that.argu.paramList.splice(index, 1);

                _that.tab_table = 0;

            },
            // 是否显示表格
            isAreas: function () {
                return _.isUndefined(_.find(this.query.tables, { code: 1 }));
            },
            //  返回下载Excel的数据
            getExcelData: function () {
                var _that = this;
                var rangeArr = [];
                var data = [
                    ['项目名称', _.get(_that.energyProject, 'projectName'), '', '计量方式', _.map(_that.query.areas, 'name').join('')],
                    ['能耗模型', _.get(_that.energyModel, 'energyModelName'), '', '单位', _that.unit],
                    ['分析时间', _.map(_that.timer, 'name').join(',')],
                    ['所选分项', _.map(_that.suboptionModel, 'name').join('')],
                ];

                if (_.isArray(_that.$refs.weektable) && _that.$refs.weektable.length) {

                    //  获取周的表格
                    var weektable = _that.$refs.weektable.map(function (item) {

                        var c = [
                            ['周日'],
                            ['周一'],
                            ['周二'],
                            ['周三'],
                            ['周四'],
                            ['周五'],
                            ['周六'],
                        ]

                        c = item.comlist.reduce(function (con, x, i) {

                            x.forEach(function (item, index) {
                                var a = con[index];
                                a.push(item.data);
                            })
                            return con;
                        }, c);

                        c.splice(0, 0, [''].concat(_.range(24)));
                        return c;
                    });

                    // 保存到Execel 中
                    data = weektable.reduce(function (c, item) {
                        return c.concat(item);
                    }, data);

                }



                if (_.isArray(_that.$refs.yeartable) && _that.$refs.yeartable.length) {



                    var yeartable = _that.$refs.yeartable.map(function (item) {
                        var c = [
                            ['周日'],
                            ['周一'],
                            ['周二'],
                            ['周三'],
                            ['周四'],
                            ['周五'],
                            ['周六'],
                        ]

                        c = item.comlist.reduce(function (con, month, index) {
                            month.items.forEach(function (week) {
                                week.forEach(function (day, index) {
                                    con[index].push(day.data)
                                })
                            })

                            return con;
                        }, c)

                        c.splice(0, 0, [''].concat(item.comlist.reduce(function (c, x, i) {
                            var a = _.range(x.items.length);
                            a[0] = 1 + i + '月';
                            c = c.concat(a);
                            return c;
                        }, [])));
                        return c;
                    })



                    // 保存到Execel 中
                    data = yeartable.reduce(function (c, item, index) {

                        var colIndex = 1;

                        _that.$refs.yeartable[index].comlist.forEach(function (item, i) {

                            rangeArr.push({
                                rowIndex: data.length,
                                colIndex: colIndex,
                                colSpan: item.items.length
                            })

                            colIndex += item.items.length;
                        })

                        return c.concat(item);
                    }, data);
                }


                // data.push(_.map(_that.compuTables.keys, 'name'))

                // data = data.concat(_that.compuTables.list.map(function (item) {
                //     return _that.compuTables.keys.map(function (o) {
                //         return item[o.key]
                //     })
                // }))
                return {
                    data: data,
                    rangeArr: rangeArr
                };
            },
            //  点击下载
            downclick: function (type) {
                var _that = this;
                if (type == 1) {
                    biTool.downReportImg({
                        container: '#chart',
                        downName: '单项目热图分析图表'
                    });
                    // 下载图表
                } else if (type == 2) {
                    var getExcelData = _that.getExcelData()
                    // 下载表格
                    biTool.downReportExcel({
                        downName: '单项目热图分析报表',
                        data: getExcelData.data,
                        rangeArr: getExcelData.rangeArr
                    });
                }
            },
        },
        watch: {

        },
        computed: {
            // 单位
            unit: function () {
                var _that = this;
                var dataKind = parseInt(_.map(_that.query.areas, 'code').join(''));
                dataKind = dataKind == 3 ? 1 : dataKind;
                var dataType = parseInt(_.map(_that.query.energy, 'code').join(''));

                return biTool.getChartUnit(dataKind, dataType)
            },
            realCanSubmit: function () {
                var _that = this;
                return _that.suboptionModel.length && _that.timer.length;
            },
            canSubmit: function () {
                var _that = this;
                return _that.suboptionModelBak.length && _that.timerBak.length;
            },
            selecteds: function () {
                var _that = this;

                if (!_that.argu || !_that.res.length) return [];

                var MAX = _.max(_.map(_that.res, 'sumData'));

                return _that.argu.paramList.map(function (item, index) {

                    return {
                        "time": {
                            "st": _that.timer[index].name,
                            "et": '',
                        },
                        "value": {
                            "num": _that.fix2(_.get(_that.res[index], 'sumData', 0)),
                            "unit": _that.unit,
                        },
                        "subentry": {
                            "energyItemLocalName": _.get(_that.getItemByEnergyModelList(_.get(_that.res[index], 'energyItemLocalId', '')), 'name', '--'),
                            "energyItemLocalId": _.get(_that.res[index], 'energyItemLocalId', ''),
                        },
                        "base": {
                            "width": _that.fix2((_.get(_that.res[index], 'sumData', 0) / MAX) * 140) + "px",
                            "color": pcolor.cd[index]
                        }
                    }
                });
            },
            energyModelTree: function () {
                var _that = this;
                return _.filter(_that.energyModelList, {
                    parentLocalId: "-1"
                })
                    .map(function (info) {

                        var item = _.clone(info);

                        item.content = _.filter(_that.energyModelList, {
                            parentLocalId: item.localId
                        });

                        if (_.isArray(item.content) && item.content.length) {
                            item.content = item.content.map(arguments.callee);
                        };
                        return item;
                    })
            }
        }
    });


    app.$nextTick(function () {

        app.computeWidth();
    })


    window.onresize = app.computeWidth.bind(app);


    window.app = app;
})