var MAX = 10000;
var MIN = 0;

// Vue实例
var app = new Vue({
    data: {
        addProjectTxt: '添加项目',

        searchContent: '',
        //========== 真实查询中是使用的带的左侧数据 Start
        // 对应的建筑
        energyProject: false,
        // 对应的分项集合
        suboptionModel: [],
        // 查询对应的时间
        timer: {},
        //=========== 真实查询中是使用的带的左侧数据 End
        //=========== 选中控件中左侧数据 Start
        // 对应的建筑
        energyProjectBak: [],
        // 对应的分项集合
        suboptionModelBak: [],
        // 查询对应的时间
        timerBak: {},
        //=========== 选中控件中左侧数据 End


        showProjectTemp: false, //是否显示选择项目组件

        modelids: [],
        addProjectTxt: "请选择项目",
        showEnergyModel: false,
        searchConditionObj: { //选择条件集合，包括选择项目，选择时间，选择分项
            projectSaveObj: {}, //项目集合
            timeSaveArr: [], //时间集合
            subentrySaveArr: [], //分项集合
        },
        subentryTree: [], //选择分项树
        //添加分项
        subentryDisabled: false, //是否禁用添加分项

        searchSubentry: '', //搜索分项关键字

        showSubentryTemp: false, //是否显示选择分项

        energyModel: [], //当前选中的分项数组

        setYAxisShow: false, //编辑Y轴弹框

        //设置图表纵坐标
        setMax: [{
            isSelected: true,
            name: "默认",
            value: "0",
            unit: "kWh"
        }, {
            isSelected: false,
            name: "自定义",
            value: "0",
            unit: "kWh"
        },],

        setMin: [{
            isSelected: true,
            name: "默认",
            value: "0",
            unit: "kWh"
        }, {
            isSelected: false,
            name: "自定义",
            value: "0",
            unit: "kWh"
        },],

        noDataChartShow: true, //无数据展示

        scChartShow: false, //是否显示报表

        scReportShow: true, //是否显示表格

        downLoadBlockIsShow: false, //是否显示下载图表

        columnConfigData: { // 柱状图配置
            // text_title: '这是一个标题',
            series: [{
                name: '功耗',
                data: [],
                color: '#02A9D1',
                pointWidth: 92,
            }]
        },

        gridRenderList: [], //表格列表数据
        //顶部筛选条件
        // 图标报表
        tableTypes: [{
            name: "报表",
            code: 1,
        }],
        // 计量方式
        measurementTypes: [{
            name: "总量",
            code: 1,
            selected: true
        },
        {
            name: "单平米能耗",
            code: 2,
        },
        ],
        //单位
        unitTypes: [{
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
        //区分维度
        dimensionalityTypes: [{
            name: "滑动按月",
            code: 4,
            selected: true
        },
        {
            name: "滑动按日",
            code: 2,
        }
        ],
        //常用计算
        auxiliarys: [{
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
        }
        ],

        // 是否显示缩略下拉
        iscombox: false,
        // 已选中类型
        query: {
            table: [], //表格
            measurement: [{
                name: "总量",
                code: 1,
            }], //计量
            unit: [{
                name: "能耗",
                code: 1,
            }], //单位
            dimensionality: [{
                name: "滑动按月",
                code: 4,
            }], //区分维度
            auxiliarys: [], //数值
        },

        onlineExplainFlag: false, //是否显示在线提示信息

        energyPointList: [], //能量拐点列表

        // 时间点击事件
        timer: {},
        // 分项树集合
        energyModelList: [],
        // 对应的分项集合
        suboptionModel: [],
        // 查询表格时期的备份
        queryBak: null,
        // 项目类型列表
        listFunctionTypesService: [],
        // 所有项目的集合
        ListAccountProjects: [],
        //图表实例
        chart: null,
    },
    methods: {
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
        // 获取对应的查询数据
        getQueryArgu: function (timeFrom, timeTo, timeType) {
            var _that = this;

            return {
                "projectLocalIdList": _.map(_that.energyProject, 'projectLocalID'), //类型：String  必有字段  备注：项目id
                "energyModelLocalId": _.map(_that.energyModelList, 'energyModelCode').join(''), //类型：String  必有字段  备注：能耗模型本地编码
                "energyItemLocalId": _.map(_that.suboptionModel, 'localId').join(''),
                "timeType": parseInt(_.map(app.query.dimensionality, 'code').join('')), //类型：Number  必有字段  备注：数据聚合时间类型1-时，2-天，4-月，5-年
                "dataKind": _.get(app.query.measurement, '[0].code'), //类型：Number  必有字段  备注：1-总能耗；2-单平米能耗；
                "dataType": _.get(app.query.unit, '[0].code'), //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                "timeFrom": timeFrom ? timeFrom : new Date(app.timer.startTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：开始时间yyyy-MM-dd HH:mm:ss（>=）
                "timeTo": timeTo ? timeTo : new Date(app.timer.realEndTime).format('yyyy-MM-dd hh:mm:ss'), //类型：String  必有字段  备注：结束时间yyyy-MM-dd HH:mm:ss（<）
            }
        },
        // 查询对应图表需要的信息
        queryMasterTabel: function () {

            var _that = this;

            //  获取查询数据
            var argu = _that.getQueryArgu();

            return controller.GetMultiItemSlidingEnergyByTime(argu)
        },
        // 隐藏最大值最小值弹窗
        setYAxisHide: function () {
            this.setYAxisShow = false;
        },
        // 设置最大值最小值
        setYAxis: function (max, min) {

            // 保存对应的值
            this.max = max || MAX;
            this.min = min || MIN;

            // 设置表格中的信息
            this.chart.yAxis[0].setExtremes(this.min, this.max);
        },
        createChartEl: function (series) {
            var _that = this;

            try {
                if (_.isFunction(_.get(_that.chart, 'destroy'))) _that.chart.destroy();
            } catch (error) {

            } finally {
                _that.chart = pchart.initColumnHistogram({
                    xAxis: {
                        labels: {
                            style: {
                                fontFamily: 'Arial,"微软雅黑",sans-serif'
                            },
                            formatter: function () {
                                return this.value;
                            },
                            enabled: true,
                        }
                    },
                    container: _that.$refs.chart,
                    series: [{
                        data: series.map(function (item) {
                            item.y = parseFloat(_that.fix2(item.y));
                            return item;
                        }),
                        name: _.get(_that.query, "unit[0].name", ''),
                    }]
                });

                setTimeout(function () {
                    //  保存最大的值
                    //  保存最大值最小值
                    _that.max = _that.chart.yAxis[0].getExtremes().max;
                    _that.min = _that.chart.yAxis[0].getExtremes().min;
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


        },
        // 创建表格的过程
        createCharts: function () {
            var _that = this;

            // 验证时间是否可是
            if (!_that.vtiem(_that.timerBak)) return;

            _that.queryMasterTabel().then(function (res) {

                _that.queryBak = res[0];

                var series = res[0].dataListByTime.map(function (item) {
                    return {
                        x: item.timeSpan,
                        y: _that.fix2(item.data)
                    }
                });

                _that.createChartEl(series);
            })
        },
        // 验证时间是否合适
        vtiem: function (time) {
            if ((time.realEndTime - time.startTime) < (365 * 24 * 60 * 60 * 1000)) {
                $('#globalnotice').pshow({ text: '时间间距小于365天', state: 'failure' });
                return false;
            }

            return true;
        },
        // 查询按钮点击事件
        submitQuery: function () {
            var _that = this;
            // 验证时间是否可是
            if (!_that.vtiem(_that.timerBak)) return;

            _that.energyProject = _.cloneDeep(_that.energyProjectBak);
            _that.suboptionModel = _.cloneDeep(_that.suboptionModelBak);
            _that.timer = _.cloneDeep(_that.timerBak);

            // 查询生成表格
            _that.createCharts();
        },
        // 分项返回值
        handlerclickSuboption: function (arr) {
            this.suboptionModelBak = arr;

        },
        // 查询对应的分项树
        queryModelTree: function () {

            var _that = this;
            controller.querySubOption({
                storyCode: document.getElementById("iptMCode").value,
            }).then(function (res) {
                _that.energyModelList = res;
            })
        },
        vtime: function (argu) {
            if ((argu.realEndTime - argu.startTime) > (365 * 24 * 60 * 60 * 1000)) {
                return false;
            }
            return true;
        },
        //  时间控件点击选择事件
        timeClick: function (argu) {

            this.vtime(argu);

            this.timerBak = argu;
        },
        //选择项目相关
        addProjectShow: function () {
            this.showProjectTemp = true;
        },
        addProjectHide: function () {
            this.showProjectTemp = false;
        },
        // 选择项目回调
        addProjectCallBack: function (item) { //选择项目回调
            this.energyProjectBak = item;
            this.showProjectTemp = false;
        },
        // 区分建筑类型修改
        buildingTypeChange: function () {
            $("#buildingType").psel() ? (this.searchConfig.buildingType = 1) : (this.searchConfig.buildingType = 0);
        },
        computeWidth: function () {
            //  计算宽度是否够容纳
            //                      整体宽度                             图表报表          下载详情图表                  计量方式                             单位                        区分维度                排序方式                                 
            // debugger
            this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox1.getWidth() - 84 - this.$refs.vcheckbox2.getWidth() - this.$refs.cobxs1.getWidth() - this.$refs.cobxs2.getWidth() - this.$refs.cobxs3.getWidth() - 20) < 0);
        },
        createHandlerClick: function (type) { //导航选中选项
            var _that = this;
            // 
            // 
            return function (arr) {
                _that.query[type] = arr;

                //  如果是辅助线的时候做的操作
                if (type == "auxiliarys") {

                    // 添加对应的线
                    _that.keepCreateLines();

                    //  查询对应的值的单位
                } else if (type == "measurement" || type == "unit") {

                    _that.createCharts();

                } else if (type == "dimensionality") {

                    setTimeout(function () {
                        _that.timer = _.cloneDeep(_that.timerBak);

                        _that.createCharts();
                    })

                } else {

                    setTimeout(function () {
                        _that.createCharts();
                    })
                }
            }

        },
        // 保存辅助线
        keepCreateLines: function () {
            var _that = this;

            var arr = _that.query.auxiliarys

            var obj = _that.queryBak;
            var lins = arr.map(function (item) {
                return {
                    code: item.code,
                    value: obj[item.code]
                };
            })

            // 添加对应的线
            _that.addLines(lins, _that.chart);
        },
        // 添加赋值线
        addLines: function (arr, chart) {

            var _that = this;

            //  循环所有的线有就绘制没有就移除
            _that.auxiliarys.forEach(function (item) {
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
        onlineExplainEnter: function () { //在线说明
            this.onlineExplainFlag = true;
        },
        onlineExplainLeave: function () { //在线说明
            this.onlineExplainFlag = false;
        },
        /**
         * tree 需要的转换的树数组
         * key 对应子类型的 key
         */
        tree2array: function (tree, key) {

            return tree.reduce(function (con, item) {
                var fn = arguments.callee;
                con.push(item);
                if (_.isArray(item[key])) item[key].reduce(fn, con);
                return con;
            }, [])
        },
        // 查询对应的项目分类
        queryBuildModelType: function () {
            var _that = this;

            controller.ListAccountProjects().then(function (res) {

                var arr = [];

                res[0].projectList.forEach(function (item) {

                    arr = arr.concat(item.projects.map(function (info) {
                        return Object.assign({}, { funtionType: item.funtionType }, info);
                    }))
                });

                _that.ListAccountProjects = arr;
            })

            // 查询管理分区类型
            controller.listFunctionTypesService().then(function (res) {
                _that.listFunctionTypesService = _that.tree2array(res, 'contents');
            })
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
        //  返回下载Excel的数据
        getExcelData: function () {
            var _that = this;
            var data = [
                ['项目名称', _.map(_that.energyProject, 'projectLocalName').join(','), '', '计量方式', _.map(_that.query.areas, 'name').join('')],
                ['项目数量', _that.energyProject.length, '', '单位', _that.unit],
                ['能耗模型', _.get(_that.energyModelList, '[0].energyModelCode')],
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
        // 电价下载事件
        downclick: function (type) {
            var _that = this;
            if (type == 1) {
                biTool.downReportImg({
                    container: '#barChart',
                    downName: '多项目滑动平均图表'
                });
                // 下载图表
            } else if (type == 2) {
                // 下载表格
                biTool.downReportExcel({
                    downName: '多项目滑动平均报表',
                    data: _that.getExcelData()
                });
            }
        },
    },
    computed: {
        // 单位
        unit: function () {
            var _that = this;
            var dataKind = parseInt(_.map(_that.query.measurement, 'code').join(''));
            dataKind = dataKind == 3 ? 1 : dataKind;
            var dataType = parseInt(_.map(_that.query.unit, 'code').join(''));

            return biTool.getChartUnit(dataKind, dataType)
        },
        projectlists: function () {

            var _that = this;
            if (!_that.queryBak) return [];

            return _that.queryBak.dataListByFuncType.map(function (item) {

                var project = _.find(_that.ListAccountProjects, { projectLocalID: item.projectLocalId }) || {};

                var type = _.find(_that.listFunctionTypesService, { code: project.funtionType }) || {};

                return {
                    name: project.projectLocalName,// 项目名称
                    value: _that.fix2(item.data), // 能耗值
                    funtionType: project.funtionType, // 类型id
                    funtionName: type.name // 类型名称
                }
            }).reduce(function (con, item) {

                var obj = _.find(con, { funtionType: item.funtionType });

                if (!obj) {
                    obj = {
                        funtionName: item.funtionName,
                        funtionType: item.funtionType,
                        content: [],
                    };
                    con.push(obj);
                }

                obj.content.push(item);
                return con;
            }, [])
        },
        energyModelTree: function () {
            var _that = this;
            return _.filter(_.get(_that.energyModelList, '[0].energyModelTree', []), {
                parentLocalId: "-1"
            }).map(function (info) {

                var item = _.clone(info);

                item.content = _.filter(_.get(_that.energyModelList, '[0].energyModelTree', []), {
                    parentLocalId: item.localId
                });

                if (_.isArray(item.content) && item.content.length) {
                    item.content = item.content.map(arguments.callee);
                };
                return item;
            })
        },
        compuTables: function () {
            var _that = this;
            var keys = [];
            var list = [];

            if (!_.isArray(_.get(_that, 'queryBak.dataListByTime', ''))) {
                return {
                    keys: keys,
                    list: list
                }
            }

            keys = [{
                key: 'timeSpan',
                name: '时间'
            }, {
                key: 'data',
                name: _that.suboptionModelBak[0].name + '(' + _that.unit + ')'
            }]

            list = _.get(_that, 'queryBak.dataListByTime', []).map(function (item) {
                return {
                    data: _that.fix2(item.data),
                    timeSpan: item.timeSpan,
                }
            })

            return {
                list: list,
                keys: keys,
            }
        }
    }
})

// Dom加载完成后挂载Vue
$(function () {
    app.$mount('#singleSlidePage');

    //  查询项目信息
    app.queryBuildModelType();

    app.queryModelTree();
})
