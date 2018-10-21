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
            // 图标报表
            tableTypes: [{
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
                name: "总量",
                code: 1,
                selected: true
            },
            {
                name: "单平米",
                code: 2,
            },
            {
                name: "下级拆分",
                code: 3,
            },
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
                auxiliarys: [],
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
            //  是否展示的能耗模型树
            showEnergyModel: false,
            // 父级的对应的表
            masterTable: null,
            // 详情对应的表
            detailTable: null,
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
                unit: "kWh"
            },
            {
                isSelected: false,
                name: "自定义",
                value: MAX,
                unit: "kWh"
            }],
            setMin: [{
                isSelected: true,
                name: "默认",
                value: MIN,
                unit: "kWh"
            },
            {
                isSelected: false,
                name: "自定义",
                value: MIN,
                unit: "kWh"
            }],
            // 详细表格的最大值和最小值
            max: MAX,
            min: MIN,
            // 辅助信息tab
            helpTab: true,
            // 辅助数据全部的集合
            // 0-焓值；1-温度；2-湿度；3-PM2.5; 4-CO2；5-天气状态；6-日出日落
            helpData: [
                {
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
            pie: null,
            //  辅助信息的列表
            helpDataList: {
                name: '',
                data: []
            },
        },
        methods: {
            // 隐藏最大值最小值弹窗
            setYAxisHide: function () {
                this.setYAxisShow = false;
            },
            // 设置最大值最小值
            setYAxis: function (max, min) {

                // 保存对应的值
                this.max = max || MAX;
                this.min = min || MIN;
                this.setYAxisShow = false;

                // 设置表格中的信息
                this.detailTable.yAxis[0].setExtremes(this.min, this.max);
            },
            // 转换时间粒度
            timeType2: function (startTime, endTime) {
                var _that = this;
                var diff = +new Date(biTool.dateStr2IE(endTime)) - new Date(biTool.dateStr2IE(startTime));
                //数据聚合时间类型1-时，2-天，4-月，5-年
                if (diff <= (7 * 24 * 60 * 60 * 1000)) {
                    return 1;
                } else if (diff <= (31 * 24 * 60 * 60 * 1000)) {
                    return 2;
                } else if (diff <= (366 * 24 * 60 * 60 * 1000)) {
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

                    //  没有表格不进行操作
                    if (!_that.hasChart) return;

                    //  如果是辅助线的时候做的操作
                    if (type == "auxiliarys") {

                        // 添加对应的线
                        _that.keepCreateLines();

                        //  查询对应的值的单位
                    } else if (type == "energy" || type == "areas") {

                        _that.createCharts()

                    } else {

                        if (_that.isColumnar()) {
                            // 生成对应的图表
                            _that.createMaster(_.cloneDeep(_that.queryRes)).then(function (res) {
                                _that.createDetail();
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

                // 获取基础数据
                _that.getSlideData(arr).then(function (series) {
                    _that.createCascadingStyle(series)
                        .then(function (data) {
                            // 创建对应的图标
                        })
                })
            },
            // 获取下级分项的数据
            /**
             * arr {Array} 分项集合
             */
            getSlideData: function (arr) {
                var _that = this;
                // 获取基础查询信息
                var argu = _that.getQueryArgu();
                argu.timeType = _that.timeType2(_that.selector.timeFrom, _that.selector.timeTo);
                var timeFrom = _that.selector.timeFrom;
                var timeTo = _that.selector.timeTo;
                // 查询对应的集合
                argu.paramList = arr.map(function (item) {
                    return {
                        energyItemLocalId: item.localId,
                        "area": _.map(_that.suboptionModel, 'area').join(''),
                        timeFrom: new Date(timeFrom).format("yyyy-MM-dd hh:mm:ss"),
                        timeTo: new Date(timeTo).format("yyyy-MM-dd hh:mm:ss")
                    }
                });

                argu.dataKind = 1;

                return new Promise(function (resolve) {

                    controller.ItemEnergyByTime(argu).then(function (res) {

                        _that.queryDeatilBak = _.cloneDeep(res[0]);
                        _that.queryDeatil = res[0].dataList.map(function (item) {
                            return {
                                x: item.time,
                                y: item.data,
                            }
                        });

                        //  查询层叠的时候赋值的参考信息
                        _that.createSubReference(res);

                        var series = res.map(function (item, index) {

                            //  获取X 集合
                            // categories = _.map(item.dataList, 'time').map(function (item) {
                            //     return new Date(item).format('yyyy-MM-dd hh:mm:ss');
                            // });

                            // 获取每项的数据集合
                            return {
                                name: _that.getItemByEnergyModelList(argu.paramList[index].energyItemLocalId).name,
                                data: item.dataList.map(function (item, index) {
                                    return {
                                        x: new Date(item.time).format('yyyy/MM/dd hh:mm:ss'),
                                        y: item.data
                                    }
                                }),
                                // data: _.map(item.dataList, 'data'),
                            }
                        });

                        //  返回需要渲染的数据
                        resolve(series);
                    })
                })
            },
            computeWidth: function () {
                //  计算宽度是否够容纳

                //                      正行宽度                             图表报表          下载详情图表                  辅助线                              平方单位                        能源类型                padding-right
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox.getWidth() - 84 - this.$refs.vcheckbox1.getWidth() - this.$refs.cobxs.getWidth() - this.$refs.cobxs1.getWidth() - 20) < 0);
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
            //  查询父级和顶级的数据
            queryParent: function (timeFrom, timeTo) {
                var _that = this;
                var argu = _that.getQueryArgu();

                var selectParentByParentLocalId = function (item) {

                    if (item.parentLocalId == -1) return item;
                    return arguments.callee(_.find(_that.energyModelList, { localId: item.parentLocalId }));
                }

                if (_.map(app.suboptionModel, 'parentLocalId').join('') != -1) {

                    // 查询总级
                    var superparent = selectParentByParentLocalId(_that.suboptionModel[0])

                    argu.paramList = argu.paramList.map(function (item) {
                        item.energyItemLocalId = superparent.localId;
                        item.timeFrom = new Date(timeFrom).format("yyyy-MM-dd hh:mm:ss");
                        item.timeTo = new Date(timeTo).format("yyyy-MM-dd hh:mm:ss");
                        return item;
                    })
                }

                _that.Reference.superparent = 1;
                _that.Reference.parent = 1;

                controller.ItemEnergyByTime(argu).then(function (res) {
                    _that.Reference.superparent = _.get(res, '[0].sumData');
                })
                // 查询父级
                var argu = _that.getQueryArgu();

                if (_.map(app.suboptionModel, 'parentLocalId').join('') != -1) {

                    // 查询父级
                    var parent = _.find(_that.energyModelList, function (item) {
                        return item.localId == _that.suboptionModel[0].parentLocalId;
                    });

                    argu.paramList = argu.paramList.map(function (item) {
                        item.timeFrom = new Date(timeFrom).format("yyyy-MM-dd hh:mm:ss");
                        item.timeTo = new Date(timeTo).format("yyyy-MM-dd hh:mm:ss");
                        if (parent) item.energyItemLocalId = parent.localId;
                        return item;
                    })
                }



                controller.ItemEnergyByTime(argu).then(function (res) {
                    _that.Reference.parent = _.get(res, '[0].sumData');
                })
            },
            // 补全所有的整个时间段
            fillTime: function (startTime, endTime) {

                startTime = new moment(startTime);
                endTime = new moment(endTime);

                //同一个月
                if (startTime.format('YYYYMM') == endTime.format('YYYYMM')) {
                    startTime.startOf('month');
                    endTime.startOf('month').add(startTime.daysInMonth(), 'd');
                } else if (startTime.format('YYYY') == endTime.format('YYYY')) {
                    // 同一年
                    startTime.startOf('year');
                    endTime.startOf('year').add(1, 'y');
                } else if (startTime.format('YYYY') != endTime.format('YYYY')) {
                    // 不同年
                    startTime.startOf('year');
                    endTime.startOf('year').add(1, 'y');
                }

                return {
                    startTime: startTime.toDate().format('yyyy/MM/dd hh:mm:ss'),
                    endTime: endTime.toDate().format('yyyy/MM/dd hh:mm:ss'),
                }
            },
            submitQuery: function () {
                var _that = this;

                // 赋值
                this.timer = _.cloneDeep(this.timerBak);

                //  保存对应的时间
                _that.selector.timeFrom = this.timerBak.startTime;
                _that.selector.timeTo = this.timerBak.realEndTime;

                this.energyProject = _.cloneDeep(this.energyProjectBak);
                this.energyModel = _.cloneDeep(this.energyModelBak);
                this.suboptionModel = _.cloneDeep(this.suboptionModelBak);

                // 计算大表格的时间
                var t = _that.fillTime(_that.selector.timeFrom, _that.selector.timeTo);
                _that.timer.startTime = t.startTime;
                _that.timer.realEndTime = t.endTime;

                // 查询生成表格
                _that.createCharts();
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
            // 将时间转换成为的整数的时间
            getQueryTimeType: function (min, max) {
                var _that = this;
                // 获取柱状的单位

                var start = moment(min);
                var end = moment(max);
                var startTime = moment(_that.timer.startTime);
                var endTime = moment(_that.timer.endTime);
                if (startTime.format('YYYYMM') == endTime.format('YYYYMM')) {

                    start.startOf('day');
                    end.startOf('day').add(24, 'h')
                } else if (startTime.format('YYYY') == endTime.format('YYYY')) {
                    start.startOf('month');
                    end.startOf('month').add(end.daysInMonth(), 'd')
                }

                return {
                    timeFrom: start.toDate().format('yyyy/MM/dd hh:mm:ss'),
                    timeTo: end.toDate().format('yyyy/MM/dd hh:mm:ss'),
                }

                var diff = _that.timeType2(min, max);
                var timeFrom, timeTo;
                var next = false;

                // 根据时间类型返回不同的开始时间和结束时间
                function returnTimeByType(min, max) {
                    // 将时间转换成为的整数的时间

                    if (diff == 5) {
                        timeFrom = new Date(new Date(min).setFullYear(new Date(min).getFullYear() + 1)).format('yyyy/01/01 hh:00:00');
                        timeTo = new Date(max).format('yyyy/01/01 hh:00:00');
                    }
                    if (diff == 4) {
                        timeFrom = new Date(new Date(min).setMonth(new Date(min).getMonth() + 1)).format('yyyy/MM/01 00:00:00');
                        timeTo = new Date(max).format('yyyy/MM/01 00:00:00');
                    }
                    if (diff == 2) {
                        timeFrom = new Date(new Date(min).setDate(new Date(min).getDate() + 1)).format('yyyy/MM/dd 00:00:00');
                        timeTo = new Date(max).format('yyyy/MM/dd 00:00:00');
                    }
                    if (diff == 1) {
                        timeFrom = new Date(new Date(min).setHours(new Date(min).getHours() + 1)).format('yyyy/MM/dd hh:00:00');
                        timeTo = new Date(max).format('yyyy/MM/dd hh:00:00');
                    }
                    return {
                        timeFrom: timeFrom,
                        timeTo: timeTo
                    };
                }

                var o = returnTimeByType(min, max, diff);
                timeFrom = o.timeFrom;
                timeTo = o.timeTo;


                if (diff == _that.timeType2(timeFrom, timeTo)) {
                    return {
                        timeFrom: timeFrom,
                        timeTo: timeTo
                    };
                } else {
                    var t = {
                        '1': 1,
                        '2': 1,
                        '4': 2,
                        '5': 4,
                    }[diff]

                    return _that.timeType2(min, max, t)
                }
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

                // 获取时间粒度
                var timeType = _that.timeType2(_that.timer.startTime, _that.timer.realEndTime);
                if (timeType == 2) {
                    // 时间粒度为日的时候开始时间hchart 开始时间会多传一天
                    min -= (8 * 60 * 60 * 1000);
                    max -= (8 * 60 * 60 * 1000);
                }

                var t = _that.getQueryTimeType(min, max);

                timeFrom = t.timeFrom;
                timeTo = t.timeTo;

                // 保存选择的区域
                _that.selector.timeFrom = timeFrom;
                _that.selector.timeTo = timeTo;

                if (timeType == 2) {
                    // 时间粒度为日的时候开始时间hchart 开始时间会多传一天
                    timeFrom = +new Date(timeFrom) + (8 * 60 * 60 * 1000);
                    timeTo = +new Date(timeTo) + (8 * 60 * 60 * 1000);
                }

                app.$refs.timer.$refs.ptime.psel({
                    startTime: +new Date(timeFrom),
                    endTime: +new Date(timeTo) - 1000
                })

                xAxis.removePlotBand('mask-before');
                xAxis.addPlotBand({
                    id: 'mask-before',
                    from: +new Date(timeFrom),
                    to: +new Date(timeTo),
                    color: 'rgba(0, 0, 0, 0.2)'
                });

                _that.createDetail();

                return false;
            },
            //  返回下载Excel的数据
            getExcelData: function () {
                var _that = this;
                var data = [
                    ['项目名称', _.get(_that.energyProject, 'projectName'), '', '计量方式', _.map(_that.query.areas, 'name').join('')],
                    ['能耗模型', _.get(_that.energyModel, 'energyModelName'), '', '单位', _that.unit],
                    ['分析时间', _that.timer.name],
                    ['所选分项', _.map(_that.suboptionModel, 'name').join('')],
                ];

                data.push(_.map(_that.compuTables.keys, 'name'))

                data = data.concat(_that.compuTables.list.map(function (item) {
                    return _that.compuTables.keys.map(function (o) {
                        return item[o.key]
                    })
                }))
                return data;
            },
            downclick: function (type) {
                var _that = this;
                if (type == 1) {
                    biTool.downReportImg({
                        container: '#down',
                        downName: '单项目数据查询图表'
                    });
                    // 下载图表
                } else if (type == 2) {
                    // 下载表格
                    biTool.downReportExcel({
                        downName: '单项目数据查询报表',
                        data: _that.getExcelData()
                    });
                }
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

                // 获取时间粒度
                var timeType = _that.timeType2(_that.timer.startTime, _that.timer.realEndTime);
                if (timeType == 2) {
                    // 时间粒度为日的时候开始时间hchart 开始时间会多传一天
                    min -= (8 * 60 * 60 * 1000);
                    max -= (8 * 60 * 60 * 1000);
                }

                var t = _that.getQueryTimeType(min, max);

                timeFrom = t.timeFrom;
                timeTo = t.timeTo;

                // 保存选择的区域
                _that.selector.timeFrom = timeFrom;
                _that.selector.timeTo = timeTo;

                if (timeType == 2) {
                    // 时间粒度为日的时候开始时间hchart 开始时间会多传一天
                    timeFrom = +new Date(timeFrom) + (8 * 60 * 60 * 1000);
                    timeTo = +new Date(timeTo) + (8 * 60 * 60 * 1000);
                }
                xAxis.removePlotBand('mask-before');
                xAxis.addPlotBand({
                    id: 'mask-before',
                    from: +new Date(timeFrom),
                    to: +new Date(timeTo),
                    color: 'rgba(0, 0, 0, 0.2)'
                });

                // 重新查询对应的数据
                _that.getChilds(_that.suboptionModel[0].content);

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
                                type: 'datetime',
                                showLastTickLabel: true,
                                labels: {
                                    style: {
                                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                                    },
                                    formatter: function () {
                                        var xdate = new Date(this.value);

                                        var type = new Date(_that.timer.startTime).getFullYear() == new Date(_that.timer.realEndTime).getFullYear() ? 2 : 4;

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
                                    // lineWidth: 1,
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
                            resolve(_.cloneDeep(res))
                        });
                    }
                })

            },
            createDetail: function () {
                var _that = this;
                //  清除原来的图标
                _that.clearIcon();
                // 查询生成参考信息
                _that.createReference();

                var timeFrom = _that.selector.timeFrom;
                var timeTo = _that.selector.timeTo;

                // 查询的总数据
                if (_.find(app.query.areas, { code: 1 })) _that.queryParent(timeFrom, timeTo);

                controller.ItemEnergyByTime(
                    _that.getQueryArgu(new Date(timeFrom).format("yyyy-MM-dd hh:mm:00"), new Date(timeTo).format("yyyy-MM-dd hh:mm:00"), _that.timeType2(timeFrom, timeTo))
                ).then(function (res) {
                    _that.queryDeatilBak = _.cloneDeep(res[0]);

                    // 绑定总价
                    _that.Reference.total = _that.queryDeatilBak.sumData;

                    _that.queryDeatil = res[0].dataList.map(function (item) {
                        return {
                            x: item.time,
                            y: item.data,
                        }
                    });

                    return _that.createDetailChart(_.cloneDeep(_that.queryDeatil))

                })
            },
            // 创建单个图表
            createDetailChart: function (res) {

                var _that = this;

                // 详情对应的表
                try {
                    if (_.isFunction(_.get(_that.detailTable, 'destroy'))) _that.detailTable.destroy();
                } catch (error) {

                } finally {

                    return new Promise(function (resolve) {
                        //  同时记录返回的对应的数量
                        _that.detailTable = pchart.initColumn({
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
                            container: _that.$refs.chart,
                            series: [{
                                data: res.map(function (item) {
                                    item.y = +_that.fix2(item.y);
                                    item.unit = _that.unit;
                                    return item;
                                }),
                                name: _.get(_that.query, "energy[0].name", ''),
                            }],
                            call: function () {
                                //  等表格创建成功之后进行查询
                                setTimeout(function () {
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
                                        _that.helpClick(_.find(_that.helpData, { code: _that.helpSelected }));
                                    }
                                    resolve(res);
                                })
                            }
                        });
                    })

                }

            },
            // 创建层层叠样式表
            createCascadingStyle: function (series) {
                var _that = this;

                _that.queryDeatilBak = _.cloneDeep(series);


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
                            series: series.map(function (item) {
                                item.data = item.data.map(function (info) {
                                    info.y = parseFloat(_that.fix2(info.y)) || 0;
                                    info.unit = _that.unit;
                                    return info;
                                })
                                return item;
                            }),
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
                                _that.helpClick(_.find(_that.helpData, { code: _that.helpSelected }));
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
                    chart.yAxis[0].removePlotLine(item.code);

                    if (!_.isUndefined(obj)) {

                        chart.yAxis[0].addPlotLine({
                            value: obj.value,
                            color: item.color,
                            width: 2,
                            id: obj.code,
                            label: {
                                text: item.name + ":" + _that.fix2(obj.value) + _that.unit,
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
                    "projectId": _that.energyProject.projectId, //类型：String  必有字段  备注：项目id
                    "buildingLocalId": _that.energyModel.buildingLocalId, //类型：String  必有字段  备注：建筑本地编码
                    "energyModelId": _that.energyModel.energyModelId, //类型：String  必有字段  备注：能耗模型本地编码
                    "timeType": timeType ? timeType : _that.timeType2(timeFrom || _that.timer.startTime, timeTo || _that.timer.realEndTime), //类型：Number  必有字段  备注：数据聚合时间类型1-时，2-天，4-月，5-年
                    "dataKind": _.get(_that.query.areas, '[0].code'), //类型：Number  必有字段  备注：1-总能耗；2-单平米能耗；
                    "dataType": _.get(_that.query.energy, '[0].code'), //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                    "paramList": [ //类型：Array  必有字段  备注：无
                        { //类型：Object  必有字段  备注：无
                            "energyItemLocalId": _.map(_that.suboptionModel, 'localId').join(''), //类型：String  必有字段  备注：分项本地编码
                            "area": _.map(_that.suboptionModel, 'area').join(''),
                            "timeFrom": timeFrom ? timeFrom : new Date(app.timer.startTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：开始时间yyyy-MM-dd HH:mm:ss（>=）
                            "timeTo": timeTo ? timeTo : new Date(app.timer.realEndTime).format('yyyy-MM-dd hh:mm:ss') //类型：String  必有字段  备注：结束时间yyyy-MM-dd HH:mm:ss（<）
                        }
                    ]
                }
            },
            // 查询对应图表需要的信息
            queryMasterTabel: function () {

                var _that = this;

                //  获取查询数据
                var argu = _that.getQueryArgu();

                if (new Date(_that.timer.startTime).getFullYear() == new Date(_that.timer.endTime).getFullYear()) {
                    argu.timeType = 2;
                } else {
                    argu.timeType = 4;
                }

                return controller.ItemEnergyByTime(argu).then(function (res) {

                    // 保存渲染的表格的数据
                    _that.queryDeatilBak = _.cloneDeep(res[0]);

                    _that.queryBak = res;
                    _that.queryRes = res[0].dataList.map(function (item) {
                        return {
                            x: item.time,
                            y: item.data,
                        }
                    });

                    // _that.queryDeatil = _.cloneDeep(_that.queryRes);

                    //  渲染的主表格
                    return _that.createMaster(_.cloneDeep(_that.queryRes));

                    //  渲染的渲染的对应子表格
                })
            },
            //  时间控件点击选择事件
            timeClick: function (argu) {
                this.timerBak = argu;
            },
            // 获取分享模型信息
            getItemByEnergyModelList: function (localId) {
                return _.find(this.energyModelList, {
                    localId: localId
                });
            },
            // 是柱状图表还是层叠图表
            isColumnar: function () {
                return _.isUndefined(_.find(this.query.areas, { code: 3 }));
            },
            // 创建表格 父子图表
            createCharts: function () {
                var _that = this;
                if (!_that.isColumnar()) {

                    _that.queryMasterTabel().then(function () {
                        _that.getChilds(_that.suboptionModel[0].content);
                    })
                } else {

                    _that.queryMasterTabel().then(function () {
                        // 生成详情图表
                        _that.createDetail();
                    });
                }
            },
            // 根据时间粒度来转换时间字符串
            convertTimeByTimeType: function (time, timeType) {
                var date = new Date(time);

                var o = {
                    1: date.format('hh:00'),
                    2: date.format('MM.dd'),
                    4: date.format('yyyy.MM'),
                    5: date.format('yyyy'),
                };

                if (!o.hasOwnProperty(timeType)) {
                    return date.format('yyyy.MM.dd hh:mm:ss');
                }

                return o[timeType];
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
                    ctx.lineCap = 'round';//圆角
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

                //  同比粒度比查询粒度大一级
                var timeType = _that.timeType2(timeFrom, timeTo) + 1;

                timeType > 5 ? timeType = 5 : void 0;

                return {
                    projectId: _that.energyProject.projectId,
                    buildingLocalId: _that.energyModel.buildingLocalId,
                    energyModelId: _that.energyModel.energyModelId,
                    energyItemLocalId: _that.suboptionModel[0].localId,
                    compareSize: timeType,
                    compareType: compareType ? compareType : 2,
                    area: app.suboptionModel[0].area.toString(),
                    dataKind: dataKind,
                    dataType: _that.query.energy[0].code,
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
            createReference: function (timeFrom, timeTo, compareType) {
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

                _that.Reference.series = res.map(function (item) {

                    return {
                        x: _.get(_.find(_that.energyModelList, { localId: item.energyItemLocalId }), 'name', '--'),
                        y: _that.fix2(item.sumData),
                        unit: _that.unit,
                    }
                }).sort(function (a, b) {
                    return parseFloat(b.y) - parseFloat(a.y);
                });

                try {
                    if (_that.pie && _.get(_that.pie, 'destroy')) {
                        _that.pie.destroy()
                    }
                } catch (error) {

                } finally {

                    _that.$nextTick(function () {
                        _that.pie = pchart.initPie({
                            yAxis: { title: { text: '' } },
                            container: _that.$refs.pie,
                            series: [{
                                data: _.cloneDeep(_that.Reference.series),
                                point: {
                                    events: {
                                        click: function () { }
                                    }
                                }
                            }],
                            legend: false
                        });
                    })
                }
            },
            // 返回的统一的小数点
            fix2: function (num) {
                num = parseFloat(num);
                if (_.isNaN(num)) return 0;
                var z;
                z = num < 0 ? -1 : 1;

                num = Math.abs(num);

                var len = _.get(num.toString().split('.'), '[1].length', 0);
                if (len === 0) return num;

                if (num < 1) return num.toFixed(3);
                return +num.toFixed(1) * z;
            },
            // 计算占比
            compare: function (now, old) {

                old = old || 0;
                now = now || 0;
                return this.fix2(Math.abs(now - old) / (old || now) * 100);
            },
            clearIcon: function (chart) {
                var _that = this;
                var chart = _that.detailTable;
                try {
                    // 清空原来保存的值
                    _that.helpDataList = {
                        name: '',
                        data: []
                    }

                    chart.series.forEach(function (item) {
                        if (item.options.type == 'line' || item.oldType == 'line' || item.type == 'line') item.remove();
                    });

                    // 销毁之前的天气
                    for (var key in chart._pchartPros.iconMark) {
                        if (chart._pchartPros.iconMark.hasOwnProperty(key)) {
                            var element = chart._pchartPros.iconMark[key];
                            element.destroy();
                        }
                    }
                    chart._pchartPros.iconMark = {};
                    chart._pchartPros = [];
                } catch (error) {

                }
            },
            helpClick: function (item) {
                var _that = this;
                var code = item.code;
                _that.helpSelected = code;

                var argu = {
                    projectId: _that.energyProject.projectId,
                    dataType: code,
                    timeType: _that.timeType2(_that.selector.timeFrom, _that.selector.timeTo),
                    timeFrom: new Date(_that.selector.timeFrom).format('yyyy-MM-dd hh:mm:ss'),
                    timeTo: new Date(_that.selector.timeTo).format('yyyy-MM-dd hh:mm:ss'),
                }

                _that.clearIcon();

                controller.GetAssistantData(argu).then(function (res) {

                    if (argu.dataType < 5) {
                        _that.helpDataList.name = item.name;
                        _that.helpDataList.data = _.map(res, function (item) {
                            return {
                                x: new Date(biTool.dateStr2IE(item.time)).format('yyyy/MM/dd hh:mm:ss'),
                                color: pcolor.cd[argu.dataType],
                                unit: biTool.getHelpDataUnit(argu.dataType),
                                y: _that.fix2(item.data)
                            }
                        });

                        _that.detailTable.addSeriesBatch({
                            type: "line",
                            color: pcolor.cd[argu.dataType],
                            name: item.name,
                            data: _.cloneDeep(_that.helpDataList.data)
                        })
                    } else if (argu.dataType == 5) {

                        app.detailTable.addPlotIcon(res.map(function (item, index) {
                            return {
                                seriesIndex: 0, pointIndex: index, icons: [{
                                    url: '../../../images/wea/' + (index % 10 + 1) + '.png', height: 30, width: 30
                                }]
                            };
                        }))

                    } else if (argu.dataType == 6) {
                        var arr = [];

                        res.forEach(function (item) {

                            _that.detailTable.xAxis[0].categories.forEach(function (a, index) {
                                var time = new Date(item.time).format('yyyy-MM-dd hh');
                                if (time == new Date(a).format('yyyy-MM-dd hh')) {

                                    arr.push({
                                        seriesIndex: 0, pointIndex: index, icons: [{
                                            url: '../../../images/wea/' + (item.data ? 25 : 26) + '.png', height: 30, width: 30
                                        }]
                                    });
                                }
                            })

                        })


                        arr = arr.filter(function (item) {
                            return item;
                        })

                        _that.detailTable.addPlotIcon(arr)
                    }
                })
            }
        },
        watch: {
            "Reference.parent": {
                handler: function (newValue) {
                    var _that = this;
                    _that.createPie(_that.$refs.parentchart, _that.fix2(_that.Reference.total / newValue * 100));
                },
                immediate: true,
                deep: true,
            },
            "Reference.superparent": {
                handler: function (newValue) {
                    var _that = this;
                    _that.createPie(_that.$refs.superparent, _that.fix2(_that.Reference.total / newValue * 100));
                },
                immediate: true,
                deep: true,
            },
            "Reference.total": {
                handler: function (newValue) {
                    var _that = this;
                    _that.createPie(_that.$refs.parentchart, _that.fix2(newValue / _that.Reference.parent * 100));
                    _that.createPie(_that.$refs.superparent, _that.fix2(newValue / _that.Reference.superparent * 100));
                },
                immediate: true,
                deep: true,
            },
        },
        computed: {
            hasChart: function () {
                return !!this.masterTable;
            },
            // 单位
            unit: function () {
                var _that = this;
                var dataKind = parseInt(_.map(_that.query.areas, 'code').join(''));
                dataKind = dataKind == 3 ? 1 : dataKind;
                var dataType = parseInt(_.map(_that.query.energy, 'code').join(''));

                return biTool.getChartUnit(dataKind, dataType)
            },
            // 能耗模型树
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
            // 用于遍历的表哥时候需要的内容
            compuTables: function () {
                var _that = this;
                var keys = [];
                var list = [];

                // 如果查询内容不存在直接返回

                if (_that.isColumnar()) {
                    if (!_that.queryDeatil) return {
                        list: list,
                        keys: keys,
                    }
                } else {
                    if (!(_.isArray(_that.queryDeatilBak) && !_that.isColumnar())) return {
                        list: list,
                        keys: keys,
                    }
                }

                keys = [{
                    name: '时间',
                    key: "x",
                }]

                // 非下级分项
                if (_that.isColumnar()) {
                    keys.push({
                        name: _.get(_that.suboptionModel, "[0].name") + "(" + _that.unit + ")",
                        key: "y",
                    })

                    // 表依赖的数据
                    list = _that.queryDeatil.map(function (item, index) {

                        var o = {};

                        if (_that.helpDataList.data.length) {
                            o.h = _.get(_that.helpDataList, 'data[' + index + '].y', 0);
                        }

                        return Object.assign({}, o, {
                            x: new Date(item.x).format("yyyy.MM.dd hh:mm:ss"),
                            y: _that.fix2(item.y)
                        })
                    })


                } else {
                    // 下级分项
                    keys = keys.concat(_that.queryDeatilBak.map(function (item) {
                        return {
                            name: item.name + "(" + _that.unit + ")",
                            key: psecret.create(item.name)
                        }
                    }))

                    // 表依赖的数据
                    list = _that.queryDeatilBak.reduce(function (con, item, index) {

                        return item.data.reduce(function (c, info, index, content) {
                            // 每个实例
                            var source = content[index]
                            if (con[index] == undefined) con[index] = {};
                            var target = con[index]
                            var o = {};
                            //创建时间
                            target.x = new Date(info.x).format("yyyy.MM.dd hh:mm:ss");
                            // 绑定对应的项
                            target[psecret.create(item.name)] = _that.fix2(source.y);

                            return c;
                        }, con);
                    }, []).map(function (item, index) {
                        var o = {};
                        if (_that.helpDataList.data.length) {
                            o.h = _.get(_that.helpDataList, 'data[' + index + '].y', 0);
                        }

                        return Object.assign({}, o, item)
                    })
                }

                // 添加辅助数据
                if (_that.helpDataList.data.length) {
                    var h = _that.helpDataList.data[0];
                    keys.push({
                        name: _that.helpDataList.name + '(' + h.unit + ')',
                        key: "h"
                    })
                }

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
            },
            // 是否是时间段
            isTimeSpan: function () {
                var _that = this;
                // 日
                if ((_that.selector.timeTo - _that.selector.timeFrom) == (24 * 60 * 60 * 1000)) {
                    return true;
                }
                // 周
                if ((_that.selector.timeTo - _that.selector.timeFrom) == (7 * 24 * 60 * 60 * 1000)) {
                    return true;
                }
                // 月
                if (+new Date(_that.selector.timeFrom).setMonth(new Date(_that.selector.timeFrom).getMonth() + 1) == _that.selector.timeTo) {
                    return true;
                }

                // 年
                if (+new Date(_that.selector.timeFrom).setFullYear(new Date(_that.selector.timeFrom).getFullYear() + 1) == _that.selector.timeTo) {
                    return true;
                }

                return false;
            }
        }
    });


    app.$nextTick(function () {

        app.computeWidth();

        // app.createCharts();
    })


    window.onresize = app.computeWidth.bind(app);


    window.app = app;
})