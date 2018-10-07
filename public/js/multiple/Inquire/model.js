$(function () {

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
            // 多项目搜索
            searchContent: '',
            // 图标报表
            tableTypes: [{
                name: "图表",
                code: 0,
                lock: true,
                selected: true,
            }, {
                name: "报表",
                code: 1,
            }],
            // 辅助线
            auxiliaryTypes: [{
                    name: "最大值",
                    code: "maxData",
                    color: pcolor.cd[0]
                },
                {
                    name: "最小值",
                    code: "minData",
                    color: pcolor.cd[1]
                },
                {
                    name: "平均值",
                    code: "avgData",
                    color: pcolor.cd[2]
                },
                {
                    name: "中位数",
                    code: "midData",
                    color: pcolor.cd[3]
                },
            ],
            // 面积单位
            areaTypres: [{
                    name: "总能耗",
                    code: 1,
                    selected: true
                },
                {
                    name: "单平米",
                    code: 2,
                },
                {
                    name: "平均单项目",
                    code: 3,
                },
            ],
            // 区分类型
            distinguish: [{
                name: "区分类型",
                code: true,
            }],
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
                    name: "碳排放量标煤",
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
                auxiliarys: [],
                areas: [{
                    name: "总量",
                    code: 0,
                }],
                energy: [{
                    name: "能耗",
                    code: 0,
                }],
                // 是否区分类型
                distinguish: []
            },
            // 分项模型
            energyModelList: [],
            // 对应的建筑
            energyProject: false,
            //  能耗模型
            energyModel: false,
            //  是否展示的能耗模型树
            showEnergyModel: false,
            // 父级的对应的表
            masterTable: null,
            // 详情对应的表
            detailTable: null,
            // 对应的分项集合
            suboptionModel: [],
            // 时间控件中的时间
            timer: {

            },
            queryBak: null,
            queryRes: null,
            queryDeatil: null,
            queryDeatilBak: null,
            selector: {
                timeFrom: "",
                timeTo: "",
            },
            // 显示设置表格最大值最小值
            setYAxisShow: false,
            //设置图表纵坐标
            setMax: [{
                    isSelected: true,
                    name: "默认",
                    value: MAX,
                    unit: "kwh"
                },
                {
                    isSelected: false,
                    name: "自定义",
                    value: MAX,
                    unit: "kwh"
                }
            ],
            setMin: [{
                    isSelected: true,
                    name: "默认",
                    value: MIN,
                    unit: "kwh"
                },
                {
                    isSelected: false,
                    name: "自定义",
                    value: MIN,
                    unit: "kwh"
                }
            ],
            // 详细表格的最大值和最小值
            max: MAX,
            min: MIN,
            // 辅助信息tab
            helpTab: true,
            // 辅助数据全部的集合
            // 0-焓值；1-温度；2-湿度；3-PM2.5; 4-CO2；5-天气状态；6-日出日落
            helpData: [{
                    name: "焓值",
                    code: 0,
                    can: [1, 2]
                },
                {
                    name: "温度",
                    code: 1,
                    can: [1, 2]
                },
                {
                    name: "湿度",
                    code: 2,
                    can: [1, 2]
                },
                {
                    name: "PM2.5",
                    code: 3,
                    can: [1, 2]
                },
                {
                    name: "CO2",
                    code: 4,
                    can: [1, 2]
                },
                {
                    name: "天气状态",
                    code: 5,
                    can: [2]
                },
                {
                    name: "日出日落",
                    code: 6,
                    can: [1]
                },
            ],
            //  辅助数据的选择项
            helpSelected: null,
            // 参考信息
            Reference: {
                // 当前能耗
                total: "",
                // 环比能耗值
                circleData: "",
                // 同比能耗值
                sameData: "",
                // 父级能耗
                parent: "",
                // 总能耗
                superparent: "",
                // 
                series: [],
            },
            pie: null
        },
        methods: {
            // 隐藏最大值最小值弹窗
            setYAxisHide: function () {
                this.setYAxisShow = false;
            },
            // 设置最大值最小值
            setYAxis: function (max, min) {

                // 保存对应的值
                this.max = parseInt(_.map(max, "value").join()) || MAX;
                this.min = parseInt(_.map(min, "value").join()) || MIN;
                this.setYAxisShow = false;

                // 设置表格中的信息
                this.detailTable.yAxis[0].setExtremes(this.min, this.max);
            },
            // 转换时间粒度
            timeType2: function (startTime, endTime) {
                var _that = this;
                var diff = +new Date(endTime) - new Date(startTime);
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
            //  根据数据绘制线
            keepCreateLines: function () {
                var _that = this;

                var arr = _that.query.auxiliarys

                var obj = _that.queryDeatilBak;
                var lins = arr.map(function (item) {
                    return {
                        code: item.code,
                        value: obj[item.code]
                    };
                })

                // 添加对应的线
                _that.addLines(lins, _that.detailTable);
            },
            //  Tab 选项切换内容
            createHandlerClick: function (type) {
                var _that = this;
                return function (arr) {
                    _that.query[type] = arr;

                    //  如果是辅助线的时候做的操作
                    if (type == "auxiliarys") {

                        // 添加对应的线
                        _that.keepCreateLines();

                        //  查询对应的值的单位
                    } else if (type == "energy" || type == "areas") {

                        // 查询的总数据
                        if (_.find(_that.query.areas, {
                                code: 0
                            })) _that.queryParent(_that.selector.timeFrom, _that.selector.timeTo);

                        _that.createCharts();

                    } else if (type == "distinguish") {

                        try {
                            if (_that.pie && _.get(_that.pie, 'destroy')) {
                                _that.pie.destroy()
                            }
                        } catch (error) {
        
                        }

                        _that.createCharts();
                    } else {

                        if (_that.isColumnar()) {
                            // 重新查询数据
                            // 查询参考信息
                            _that.createReference();
                            // 生成对应的图表
                            _that.createMaster(_.cloneDeep(_that.queryRes)).then(function (res) {
                                _that.createDetail(res);
                            })
                        } else {
                            // 重新查询数据
                            _that.createMaster(_.cloneDeep(_that.queryRes)).then(function () {
                                _that.createCascadingStyle(_.cloneDeep(_that.queryDeatilBak));
                            })
                        }

                    }
                }
            },
            // 查询下级的分项
            getChilds: function (arr) {
                var _that = this;

                _that.createCascadingStyle(series)
                    .then(function (data) {
                        // 创建对应的图标
                    })

            },
            //  查询父级和顶级的数据
            queryParent: function (timeFrom, timeTo) {
                var _that = this;
                var argu = _that.getQueryArgu();

                argu.timeFrom = timeFrom || argu.timeFrom;
                argu.timeFrom = timeTo || argu.timeTo;

                var superparent = _.find(_that.energyModelList, {
                    parentLocalId: false
                });
                argu.energyModelLocalId = superparent.localId;

                controller.queryTable(argu).then(function (res) {
                    _that.Reference.superparent = _.get(res, '[0].sumData');
                    console.log(_that.Reference.superparent);
                    // console.log("顶级内容");
                    // console.log(res);
                })

                var parent = _.find(_that.energyModelList, function (item) {
                    return item.localId == _that.suboptionModel[0].parentLocalId;
                });
                argu.energyModelLocalId = parent.localId;

                controller.queryTable(argu).then(function (res) {
                    _that.Reference.parent = _.get(res, '[0].sumData');
                    console.log(_that.Reference.parent);
                })
            },
            // 转换成层叠的数据
            convertSlideData: function (obj) {
                var _that = this;
                var series = obj.funcTypeDataList.map(function (item, index) {

                    // 获取每项的数据集合
                    return {
                        name: _that.getItemByBuildModelList(item.funcTypeCode).name,
                        data: item.dataList.map(function (item, index) {
                            return {
                                x: new Date(item.time).format('yyyy-MM-dd hh:mm:ss'),
                                y: item.data
                            }
                        }),
                        // data: _.map(item.dataList, 'data'),
                    }
                });

                return series;
            },
            // 获取下级分项的数据
            /**
             * arr {Array} 分项集合
             */
            getSlideData: function (obj) {
                var _that = this;

                // 父级直接传递到子页面
                if (obj && obj.length) {

                    return new Promise(function (resolve) {
                        _that.queryDeatilBak = obj[0];
                        _that.Reference.total = obj[0].sumData;

                        //  查询层叠的时候赋值的参考信息
                        _that.createSubReference(obj[0]);
                        resolve(_that.convertSlideData(obj[0]))
                    })
                } else {

                    // 获取基础查询信息
                    var argu = _that.getQueryArgu();
                    argu.timeFrom = _that.selector.timeFrom;
                    argu.timeTo = _that.selector.timeTo;
                    argu.timeType = _that.timeType2(argu.timeFrom, argu.timeTo);


                    return new Promise(function (resolve) {

                        controller.queryTable(argu).then(function (res) {

                            //  查询层叠的时候赋值的参考信息
                            _that.createSubReference(res[0]);
                            _that.queryDeatilBak = res[0];
                            _that.Reference.total = res[0].sumData;
                            var series = _that.convertSlideData(res[0])

                            //  返回需要渲染的数据
                            resolve(series);
                        })
                    })
                }
            },
            computeWidth: function () {
                //  计算宽度是否够容纳

                //                      正行宽度                             图表报表          下载详情图表                  辅助线                       区分类型                             平方单位                        能源类型                padding-right
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox.getWidth() - 84 - this.$refs.vcheckbox1.getWidth() - this.$refs.distinguish.getWidth() - this.$refs.cobxs.getWidth() - this.$refs.cobxs1.getWidth() - 20) < 0);
            },
            // 模型面板取消选项
            handlercancelenergyModel: function () {
                this.showEnergyModel = false;
            },
            // 模型面板弹出选项
            handlerclickenergyModel: function (projects) {
                this.energyProject = projects;
                // this.energyModel = arr[0];
                //  模型面板取消选项
                this.handlercancelenergyModel();
                //  重新查询对应的分项树
                // this.queryModelTree(this.energyModel.buildingLocalId, this.energyModel.energyModelId);
            },
            // 查询对应的图表信息
            submitQuery: function () {
                var _that = this;

                // // 查询的总数据
                if (_.find(_that.query.areas, {
                        code: 0
                    })) _that.queryParent();

                // 查询生成表格
                _that.createCharts();
            },
            // 查询对应的分项树
            queryModelTree: function () {

                var _that = this;
                controller.querySubOption({
                    storyCode: window.parent.document.getElementById("type").value,
                }).then(function (res) {
                    _that.energyModelList = res;
                })
            },
            // 分项返回值
            handlerclickSuboption: function (arr) {
                this.suboptionModel = arr;

            },
            // 父级图表子图表是柱状的情况下的滑动事件
            chartColumnarClick: function (that, chart, event) {
                var _that = that;
                var extremesObject = event.xAxis[0],
                    min = extremesObject.min,
                    max = extremesObject.max,
                    timeTo,
                    timeFrom,
                    detailData = [],
                    xAxis = chart.xAxis[0];


                Highcharts.each(chart.series[0].data, function (d, index) {



                    if (d.x > min && d.x < max) {

                        if (timeTo === undefined) timeTo = d.x;
                        if (timeFrom === undefined) timeFrom = d.x;

                        if (d.x < timeFrom) {
                            timeFrom = d.x;
                        }
                        if (d.x > timeTo) {
                            timeTo = d.x;
                        }
                    }
                });
                xAxis.removePlotBand('mask-before');
                xAxis.addPlotBand({
                    id: 'mask-before',
                    from: max,
                    to: min,
                    color: 'rgba(0, 0, 0, 0.2)'
                });

                // 保存选择的区域
                _that.selector.timeFrom = timeFrom;
                _that.selector.timeTo = timeTo;


                var argu = _that.getQueryArgu();

                argu.timeFrom = new Date(timeFrom).format("yyyy-MM-dd hh:mm:00")
                argu.timeTo = new Date(timeTo).format("yyyy-MM-dd hh:mm:00"),
                    argu.timeType = _that.timeType2(timeFrom, timeTo);

                controller.queryTable(
                    argu
                ).then(function (res) {
                    _that.Reference.total = res[0].sumData;
                    _that.queryDeatilBak = _.cloneDeep(res[0]);

                    // 生成参考信息
                    // _that.createReference(timeFrom, timeTo);
                    // 绑定总价
                    // _that.Reference.total = _that.queryDeatilBak.sumData;

                    _that.queryDeatil = res[0].dataList.map(function (item) {
                        return {
                            x: item.time,
                            y: item.data,
                        }
                    });

                    _that.detailTable.axes[0].setCategories(_.map(_that.queryDeatil, 'x'));
                    _that.detailTable.series[0].setData(_.map(_that.queryDeatil, 'y'));

                    // 如果辅助线已经选择了内容绘制辅助线
                    if (_that.helpSelected != null) {
                        _that.helpClick(_.find(_that.helpData, {
                            code: _that.helpSelected
                        }));
                    }

                })
                return false;
            },
            // 父级图表子图表层叠的情况下滑动的事件
            chartSlideClick: function (that, chart, event) {
                var _that = that;
                var extremesObject = event.xAxis[0],
                    min = extremesObject.min,
                    max = extremesObject.max,
                    timeTo,
                    timeFrom,
                    detailData = [],
                    xAxis = chart.xAxis[0];


                Highcharts.each(chart.series[0].data, function (d, index) {


                    if (d.x > min && d.x < max) {

                        if (timeTo === undefined) timeTo = d.x;
                        if (timeFrom === undefined) timeFrom = d.x;

                        if (d.x < timeFrom) {
                            timeFrom = d.x;
                        }
                        if (d.x > timeTo) {
                            timeTo = d.x;
                        }
                    }
                });
                xAxis.removePlotBand('mask-before');
                xAxis.addPlotBand({
                    id: 'mask-before',
                    from: max,
                    to: min,
                    color: 'rgba(0, 0, 0, 0.2)'
                });

                // 保存选择的区域
                _that.selector.timeFrom = timeFrom;
                _that.selector.timeTo = timeTo;

                // 重新查询层叠的数据
                _that.getSlideData().then(function (series) {
                    _that.createCascadingStyle(series);
                });

                return false;
            },
            // 邦定父级的选择事件
            bindChartEvent: function (event) {
                var _that = this;
                _that.masterTable.hcEvents.selection = [event.bind(_that.masterTable, _that, _that.masterTable)];
            },
            // 创建整体图表
            createMaster: function (res, selection) {

                var _that = this;

                // 每次生成主图表的时候保存开始的结束时间
                _that.selector = {
                    timeFrom: _that.timer.startTime,
                    timeTo: _that.timer.endTime,
                }

                //清空辅助线
                _that.helpSelected = null;

                return new Promise(function (resolve) {
                    {

                        // 销毁图表
                        // 父级的对应的表
                        if (_.isFunction(_.get(_that.masterTable, 'destroy'))) _that.masterTable.destroy();

                        _that.masterTable = Highcharts.chart(_that.$refs.masterChart, {
                            chart: {
                                zoomType: 'x',
                                events: {
                                    selection: selection
                                }
                            },
                            title: {
                                text: null
                            },
                            tooltip: {
                                formatter: function () {
                                    return false;
                                }
                            },
                            yAxis: {
                                title: {
                                    text: null
                                },
                                maxZoom: 0.1
                            },
                            xAxis: {
                                labels: {
                                    style: {
                                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                                    },
                                    formatter: function () {
                                        var xdate = new Date(this.value);

                                        var type = _that.timeType2(_that.timer.startTime, _that.timer.endTime)

                                        return _that.convertTimeByTimeType(xdate, type);
                                    },
                                    enabled: true,
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    fillColor: {
                                        linearGradient: [0, 0, 0, 70],
                                        stops: [
                                            [0, Highcharts.getOptions().colors[0]],
                                            [1, 'rgba(255,255,255,0)']
                                        ]
                                    },
                                    lineWidth: 1,
                                    marker: {
                                        enabled: false
                                    },
                                    shadow: false,
                                    states: {
                                        hover: {
                                            lineWidth: 1
                                        }
                                    },
                                    enableMouseTracking: false
                                }
                            },
                            series: [{
                                type: 'area',
                                data: res
                            }],
                        }, function () {

                            resolve(res)
                        });
                    }

                })

            },
            // 创建单个图表
            createDetail: function (res) {

                var _that = this;

                // 详情对应的表
                if (_.isFunction(_.get(_that.detailTable, 'destroy'))) _that.detailTable.destroy();

                return new Promise(function (resolve) {
                    //  同时记录返回的对应的数量
                    _that.detailTable = pchart.initColumnHistogram({
                        // yAxis: {
                        //     max: _that.max,
                        //     min: _that.min
                        // },
                        xAxis: {
                            labels: {
                                style: {
                                    fontFamily: 'Arial,"微软雅黑",sans-serif'
                                },
                                formatter: function () {
                                    var xdate = new Date(this.value);

                                    var type = _that.timeType2(_that.timer.startTime, _that.timer.endTime)

                                    return _that.convertTimeByTimeType(xdate, type);
                                },
                                enabled: true,
                            }
                        },
                        container: _that.$refs.chart,
                        series: [{
                            data: res,
                            name: _.get(_that.query, "energy[0].name", ''),
                        }]
                    });

                    _that.bindChartEvent(_that.chartColumnarClick);

                    //  保存最大的值
                    //  保存最大值最小值
                    _that.max = _that.detailTable.yAxis[0].getExtremes().max;
                    _that.min = _that.detailTable.yAxis[0].getExtremes().min;
                    _that.setMax = _that.setMax.map(function (item) {
                        item.value = _that.max;
                        return item;
                    })
                    _that.setMin = _that.setMin.map(function (item) {
                        item.value = _that.min;
                        return item;
                    })

                    // 添加对应的线
                    _that.keepCreateLines();

                    // 如果辅助线已经选择了内容绘制辅助线
                    if (_that.helpSelected != null) {
                        _that.helpClick(_.find(_that.helpData, {
                            code: _that.helpSelected
                        }));
                    }
                    resolve(res);
                })

            },
            // 创建层层叠样式表
            createCascadingStyle: function (series) {
                var _that = this;

                return new Promise(function (resolve) {
                    // 销毁图表
                    // 父级的对应的表
                    try {
                        if (_.isFunction(_.get(_that.detailTable, 'destroy'))) _that.detailTable.destroy();
                    } catch (error) {

                    } finally {

                        _that.detailTable = pchart.initColumnStacking({
                            // yAxis: { title: { text: 'kWh' } },
                            container: _that.$refs.chart,
                            series: series,
                            // legend: true,
                            xAxis: {
                                labels: {
                                    style: {
                                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                                    },
                                    formatter: function () {
                                        var xdate = new Date(this.value);

                                        var type = _that.timeType2(_that.selector.timeFrom, _that.selector.timeTo)

                                        return _that.convertTimeByTimeType(xdate, type);
                                    },
                                    enabled: true,
                                }
                            },
                        });

                        setTimeout(function () {

                            _that.bindChartEvent(_that.chartSlideClick);
                            // 添加对应的线
                            _that.keepCreateLines();


                            // 如果辅助线已经选择了内容绘制辅助线
                            if (_that.helpSelected != null) {
                                _that.helpClick(_.find(_that.helpData, {
                                    code: _that.helpSelected
                                }));
                            }

                            //  保存最大值最小值
                            _that.max = _that.detailTable.yAxis[0].getExtremes().max;
                            _that.min = _that.detailTable.yAxis[0].getExtremes().min;
                            _that.setMax = _that.setMax.map(function (item) {
                                item.value = _that.max;
                                return item;
                            })
                            _that.setMin = _that.setMin.map(function (item) {
                                item.value = _that.min;
                                return item;
                            })
                        })

                    }

                })
            },
            // 添加赋值线
            addLines: function (arr, chart) {

                var _that = this;

                //  循环所有的线有就绘制没有就移除
                _that.auxiliaryTypes.forEach(function (item) {
                    var obj = _.find(arr, {
                        code: item.code
                    });
                    if (_.isUndefined(obj)) {

                        chart.yAxis[0].removePlotLine(item.code);

                    } else {

                        chart.yAxis[0].addPlotLine({
                            value: obj.value,
                            color: item.color,
                            width: 2,
                            id: obj.code,
                            label: {
                                text: item.name,
                                style: {
                                    color: item.color,
                                    fontWeight: 'bold'
                                },
                                useHTML: true,
                            },
                            zIndex: 10
                        });
                    }
                })
            },
            // 获取对应的查询数据
            getQueryArgu: function (timeFrom, timeTo, timeType) {
                var _that = this;

                return {
                    "projectLocalIdList": _.map(_that.energyProject, 'projectLocalID'), //类型：String  必有字段  备注：项目id
                    "energyModelLocalId": _that.energyModel.energyModelId, //类型：String  必有字段  备注：能耗模型本地编码
                    "timeType": timeType ? timeType : _that.timeType2(timeFrom || app.timer.startTime, timeTo || app.timer.endTime), //类型：Number  必有字段  备注：数据聚合时间类型1-时，2-天，4-月，5-年
                    "dataKind": _.get(app.query.areas, '[0].code'), //类型：Number  必有字段  备注：1-总能耗；2-单平米能耗；
                    "dataType": _.get(app.query.energy, '[0].code'), //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                    "timeFrom": timeFrom ? timeFrom : new Date(app.timer.startTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：开始时间yyyy-MM-dd HH:mm:ss（>=）
                    "timeTo": timeTo ? timeTo : new Date(app.timer.endTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：结束时间yyyy-MM-dd HH:mm:ss（<）
                    "showByFuncType": _.get(app.query.distinguish, '[0].code', false), //类型：Number true-区分项目类型；false-不区分项目类型
                }
            },
            // 查询对应图表需要的信息
            queryMasterTabel: function () {

                var _that = this;

                //  获取查询数据
                var argu = _that.getQueryArgu();

                return controller.queryTable(argu).then(function (res) {

                    _that.queryBak = res;

                    _that.queryDeatilBak = _.cloneDeep(res[0]);

                    //是否区分
                    if (_that.isColumnar()) {
                        // 不区分
                        _that.queryRes = res[0].dataList.map(function (item) {
                            return {
                                x: item.time,
                                y: item.data,
                            }
                        });

                        _that.queryDeatil = _.cloneDeep(_that.queryRes);

                        //  渲染的主表格
                        return _that.createMaster(_.cloneDeep(_that.queryRes));

                    } else {
                        // 区分
                        _that.queryRes = res[0].funcTypeDataList.reduce(function (con, item) {

                            item.dataList.forEach(function (info) {
                                //  如果没有则保存
                                if (!_.filter(con, {
                                        x: info.time
                                    }).length) con.push({
                                    x: info.time,
                                    y: 0
                                });

                                _.find(con, {
                                    x: info.time
                                }).y += info.data;
                                return con;
                            })

                            return con;
                        }, []).sort(function (a, b) {
                            return +new Date(a.x) - (+new Date(b.x))
                        });

                        _that.queryDeatil = _.cloneDeep(_that.queryRes);

                        //  渲染的主表格
                        return _that.createMaster(_.cloneDeep(_that.queryRes));
                    }


                })
            },
            //  时间控件点击选择事件
            timeClick: function (argu) {
                this.timer = argu;

            },
            // 获取分享模型信息
            getItemByEnergyModelList: function (localId) {
                return _.find(this.energyModelList, {
                    localId: localId
                });
            },
            // 获取建筑类型
            getItemByBuildModelList: function (code) {

                console.log('使用的时假数据需要替换');
                return {
                    "code": "p1", //类型：String  必有字段  备注：编码
                    "name": "项目类型1", //类型：String  必有字段  备注：名称
                }
            },
            // 是柱状图表还是层叠图表
            isColumnar: function () {

                return _.isUndefined(_.find(this.query.distinguish, {
                    code: true
                }));
            },
            // 创建表格 父子图表
            createCharts: function () {
                var _that = this;

                _that.queryMasterTabel().then(function (res) {

                    _that.Reference.total = res[0].sumData;

                    // 是柱状图
                    if (_that.isColumnar()) {

                        _that.createDetail(_that.queryRes);
                    } else {

                        //  是层叠柱状
                        _that.getSlideData(_.cloneDeep(_that.queryBak)).then(function (series) {
                            _that.createCascadingStyle(series);
                        })
                    }
                })
            },
            // 根据时间粒度来转换时间字符串
            convertTimeByTimeType: function (time, timeType) {
                var date = new Date(time);

                return {
                    1: date.format('yyyy-MM-dd hh:mm'),
                    2: date.format('yyyy-MM-dd'),
                    4: date.format('yyyy-MM'),
                    5: date.format('yyyy'),
                } [timeType];
            },
            // 创建圆形的图
            createPie: function (canvas, bili) {

                if (!canvas) return;

                var color = '#0094c2';

                if (!canvas) return;
                var backBili = bili / 50;
                canvasclearRect(canvas);
                //获取Canvas对象(画布)
                if (canvas.getContext) {
                    var ctx = canvas.getContext("2d");
                    ctx.beginPath();
                    ctx.arc(50, 50, 40, 0, Math.PI * 2, false);
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#f6f4f4';
                    ctx.stroke();


                    ctx.beginPath();
                    ctx.arc(50, 50, 40, Math.PI * 1.5, Math.PI * (backBili + 1.5), false);
                    ctx.lineCap = 'round'; //圆角
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = color;
                    ctx.stroke();
                }
            },
            //  获取查询同比环比的参数
            getQueryReferenceArgu: function (timeFrom, timeTo, compareType) {
                var _that = this;

                // ：1-总能耗；2-单平米能耗
                var dataKind = _that.query.areas[0].code == 3 ? 1 : _that.query.areas[0].code;

                return {
                    projectId: _that.energyProject.projectId,
                    buildingLocalId: _that.energyModel.buildingLocalId,
                    energyModelLocalId: _that.energyModel.energyModelId,
                    energyItemLocalId: _that.suboptionModel[0].localId,
                    compareSize: _that.timeType2(timeFrom, timeTo),
                    compareType: compareType ? compareType : 2,
                    dataKind: dataKind,
                    dataType: _that.query.energy[0].code + 1,
                    timeFrom: new Date(timeFrom).format('yyyy-MM-dd hh:mm:ss'),
                    timeTo: new Date(timeTo).format('yyyy-MM-dd hh:mm:ss')
                }
            },
            // 绑定对应的辅助信息
            useReferenceRes: function (res) {
                var _that = this;
                if (!res.length) return;
                _that.Reference.circleData = res[0].circleData;
                _that.Reference.sameData = res[0].sameData;
            },
            // 创建参考信息
            createReference(timeFrom, timeTo, compareType) {
                var _that = this;
                timeFrom = timeFrom || _that.selector.timeFrom;
                timeTo = timeTo || _that.selector.timeTo;

                // 查询对应的环比
                controller.ItemEnergyCompare(_that.getQueryReferenceArgu(timeFrom, timeTo, compareType))
                    .then(_that.useReferenceRes)
            },
            // 创建下级分项的参考信息 
            createSubReference: function (res) {

                var _that = this;

                _that.Reference.series = res.funcTypeStatic.map(function (item) {
                    
                    return {
                        x: _that.getItemByBuildModelList(item.funcTypeCode).name,
                        y: item.data
                    }
                });

                try {
                    if (_that.pie && _.get(_that.pie, 'destroy')) {
                        _that.pie.destroy()
                    }
                } catch (error) {

                } finally {

                    _that.pie = pchart.initPie({
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        container: _that.$refs.pie,
                        series: [{
                            data: _.cloneDeep(_that.Reference.series),
                            point: {
                                events: {
                                    click: function () {}
                                }
                            }
                        }],
                        legend: false
                    });

                }


                // return pchart.initDoughnutPie({
                //     // yAxis: { title: { text: 'kWh' } },
                //     container: _that.$refs.pie,
                //     series: series,
                //     title: { text: '' },
                //     subtitle: { text: '1008' },
                //     titleUnit: { text: 'kWh' }
                // });
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
            helpClick: function (item) {
                var _that = this;
                var code = item.code;
                _that.helpSelected = code;

                var argu = {
                    projectId: _that.energyProject.projectId,
                    dataType: code,
                    timeType: _that.timeType2(_that.selector.timeFrom, _that.selector.timeTo),
                    timeFrom: _that.selector.timeFrom,
                    timeTo: _that.selector.timeTo
                }

                controller.GetAssistantData(argu).then(function (res) {

                    _that.detailTable.series.forEach(function (item) {
                        if (item.type == 'line') item.remove();
                    })

                    _that.detailTable.addSeries({
                        type: "line",
                        color: pcolor.cd[1],
                        name: item.name,
                        data: _.map(res, 'data')
                    })
                })

            }
        },
        watch: {
            "Reference.parent": function (newValue) {
                var _that = this;
                _that.createPie(_that.$refs.parentchart,  _that.Reference.total/newValue * 100);
            },
            "Reference.superparent": function (newValue) {
                var _that = this;
                _that.createPie(_that.$refs.superparent, _that.Reference.total/newValue * 100);
            },
            "Reference.total": function (newValue) {
                var _that = this;
                _that.createPie(_that.$refs.parentchart, newValue/_that.Reference.parent  * 100);
                _that.createPie(_that.$refs.superparent, newValue/_that.Reference.superparent  * 100);
            },
        },
        computed: {
            energyModelTree: function () {
                var _that = this;
                return _.filter(_that.energyModelList, {
                        parentLocalId: false
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
            },
            canQuery: function () {

            },
            // 用于遍历的表哥时候需要的内容
            compuTables: function () {
                var _that = this;
                var keys = [];
                var list = [];

                // 如果查询内容不存在直接返回
                if (!_that.queryDeatil) return {
                    list: list,
                    keys: keys,
                }

                //表头信息
                keys = keys.concat([{
                    name: '时间',
                    key: "x",
                }, {
                    name: _.get(_that.suboptionModel, "[0].name") + "(kWh)",
                    key: "y",
                }])

                // 表依赖的数据
                list = _that.queryDeatil.map(function (item) {
                    return {
                        x: new Date(item.x).format("yyyy-MM-dd mm:hh:ss"),
                        y: item.y
                    }
                })

                return {
                    list: list,
                    keys: keys,
                }
            },
            abledHelpList: function () {
                var _that = this;
                var timetype = _that.timeType2(_that.selector.timeFrom, _that.selector.timeTo)

                return _that.helpData.filter(function (item) {
                    return item.can.indexOf(timetype) != -1;
                })
            }
        }
    });


    app.$nextTick(function () {

        // 查询对应的能耗模型树
        app.queryModelTree();

        app.computeWidth();

        // app.createCharts();
    })


    window.onresize = app.computeWidth.bind(app);


    window.app = app;
})