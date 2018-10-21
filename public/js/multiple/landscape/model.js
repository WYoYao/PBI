$(function () {
    var MAX = 10000;
    var MIN = 0;
    window.app = new Vue({
        el: "#multipleLandscape",
        data: {
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
                name: "单平米",
                code: 2,
            }
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
            dimensionalityTypes: [
                {
                    name: "不分区",
                    code: -1
                }, {
                    name: "项目类型",
                    code: 0,
                },
                {
                    name: "气候区",
                    code: 1,
                },
                {
                    name: "管理区",
                    code: 2,
                }
            ],
            //排序方式
            sortTypes: [{
                name: "不排序",
                code: -1
            }, {
                name: "升序",
                code: 0,
            },
            {
                name: "降序",
                code: 1,
            }
            ],
            //常用计算
            calculateTypes: [{
                name: "最大值",
                code: 0,
            },
            {
                name: "最小值",
                code: 1,
            },
            {
                name: "平均值",
                code: 2
            }, {
                name: "中位数",
                code: 3
            }
            ],
            // 是否显示缩略下拉
            iscombox: false,
            // 已选中类型
            query: {
                table: [], //表格
                measurement: [{
                    name: "总量",
                    code: 1
                }], //计量
                unit: [{
                    name: "能耗",
                    code: 1
                }], //单位
                dimensionality: [], //区分维度
                sort: [], //排序方式
                calculate: [], //计算
            },
            projectTextShow: "请选择项目", //已选项目名称
            subentryName: "请选择分项", //已选分项名称

            onlineExplainFlag: false, //是否显示提示信息
            reportFromTitle: [],//表格title
            reportFromContent: [],//表格内容
            showProjectTemp: false,// 展示项目弹窗
            searchContent: '', //搜索项目关键字
            timer: {}, // 时间点击事件
            // 分项树集合
            energyModelList: [],
            queryBak: [],
            //设置图表纵坐标
            setMax: [{
                isSelected: true,
                name: "默认",
                value: MAX
            },
            {
                isSelected: false,
                name: "自定义",
                value: MAX
            }
            ],
            setMin: [{
                isSelected: true,
                name: "默认",
                value: MIN
            },
            {
                isSelected: false,
                name: "自定义",
                value: MIN
            }
            ],
            // 详细表格的最大值和最小值
            max: MAX,
            min: MIN,
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
            energyProjectBak: [],
            //  能耗模型
            energyModelBak: false,
            // 对应的分项集合
            suboptionModelBak: [],
            // 查询对应的时间
            timerBak: {},
            //=========== 选中控件中左侧数据 End
            chart: false,
            // 辅助线文字的集合
            textArr: [],
        },
        methods: {
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
                        container: '#down',
                        downName: '多项目横向对比图表'
                    });
                    // 下载图表
                } else if (type == 2) {
                    // 下载表格
                    biTool.downReportExcel({
                        downName: '多项目横向对比报表',
                        data: _that.getExcelData()
                    });
                }
            },
            // 设置最大值最小值
            setYAxis: function (max, min) {

                // 保存对应的值
                this.max = max || MAX;
                this.min = min || MIN;

                // 设置表格中的信息
                this.chart.yAxis[0].setExtremes(this.min, this.max);
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
            // 获取建筑类型
            getItemByBuildModelList: function (item) {

                var projectInfo;
                var funcTypeCode;
                var climateCode;
                var manageZone;
                //本身信息
                projectInfo = _.find(this.ListAccountProjects, { projectLocalID: item.projectLocalId }) || {};
                // 建筑类型
                funcTypeCode = _.find(this.listFunctionTypesService, { code: item.funcTypeCode });
                // 气候区
                climateCode = _.find(this.listClimateZoneService, { code: item.climateCode });
                // 管理分区
                manageZone = _.find(this.listManagementPartitionsService, { managePartitionId: item.manageZone });

                return _.assign({}, item, projectInfo, {
                    funcTypeCode: funcTypeCode,
                    climateCode: climateCode,
                    manageZone: manageZone
                })
            },
            // 查询对应的项目分类
            queryBuildModelType: function () {
                var _that = this;
                // 查询管理分区列表
                controller.listManagementPartitionsService().then(function (res) {
                    _that.listManagementPartitionsService = _that.tree2array(res, 'managePartitionChildren');
                })
                // 获取气候区信息
                controller.listClimateZoneService().then(function (res) {
                    _that.listClimateZoneService = _that.tree2array(res, 'contents');
                })
                // 查询管理分区列表
                controller.listFunctionTypesService().then(function (res) {
                    _that.listFunctionTypesService = _that.tree2array(res, 'contents');
                })
                // 查询项目信息
                controller.ListAccountProjects().then(function (res) {
                    _that.ListAccountProjects = res[0].projectList.reduce(function (con, item) {
                        return item.projects.reduce(function (c, info) {
                            c.push(info);
                            return c;
                        }, con)
                    }, [])
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
            // 查询对应的分项树
            queryModelTree: function () {

                var _that = this;
                controller.querySubOption({
                    storyCode: document.getElementById("iptMCode").value,
                }).then(function (res) {

                    _that.energyModelList = res;
                })
            },
            addSubetryCallBack: function (item) { //选择分项回调
                this.suboptionModelBak = item;
            },
            //  时间控件点击选择事件
            timeClick: function (argu) {
                this.timerBak = argu;
            },
            // 选择项目回调
            addProjectCallBack: function (item) { //选择项目回调
                this.energyProjectBak = item;
                this.projectTextShow = "已选" + item.length + "个项目";
                this.addProjectHide();
            },
            addProjectHide: function () {
                this.showProjectTemp = false;
            },
            //  根据数据绘制线
            keepCreateLines: function () {
                var _that = this;

                var arr = _that.query.calculate

                var obj;

                var da = _.map(_that.queryBak, 'data')

                obj = {
                    0: parseInt(_.max(da)),
                    1: parseInt(_.min(da)),
                    2: parseInt(_.sum(da) / da.length),
                    3: parseInt(da.length % 2 == 1 ? da[_.ceil(da.length / 2)] : _.mean([da[_.ceil(da.length / 2)], da[_.ceil(da.length / 2) - 1]]))
                }

                var lins = arr.map(function (item) {
                    return {
                        code: item.code,
                        value: obj[item.code]
                    };
                })

                // 添加对应的线
                _that.addLines(lins, _that.chart);
            },
            clearIcon: function (chart) {
                var _that = this;
                var chart = _that.chart;


                try {
                    var o = _that.textArr.splice(-1, 1);
                    if (o && o.length) {
                        o.destroy();
                    }

                } catch (error) {

                }

                if (_.isArray(chart.series)) {
                    var obj = chart.series.slice(-1);
                    while (obj.length && (obj[0].type == 'line' || obj[0].oldType == 'line' || obj[0].type == 'line')) {
                        try {
                            obj[0].destroy();
                        } catch (error) {
                            console.log(error);
                        } finally {
                            obj = chart.series.slice(-1);
                        }
                    }
                }
            },
            // 添加赋值线
            addLines: function (arr, chart) {

                var _that = this;

                _that.clearIcon();

                // 获取分组的数据
                var groups = _that.createGroups(_.cloneDeep(_that.queryBak));
                var list = groups.map(function (arr) {
                    var da = _.map(arr, 'y').map(function (num) {
                        return parseFloat(num);
                    })
                    return {
                        0: parseInt(_.max(da)),
                        1: parseInt(_.min(da)),
                        2: parseInt(_.sum(da) / da.length),
                        3: parseInt(_.mean(da)),
                    }
                });

                //  循环所有的线有就绘制没有就移除
                _that.calculateTypes.forEach(function (item) {
                    var obj = _.find(arr, {
                        code: item.code
                    });

                    //  如果存在对应的线
                    if (obj) {

                        var max = chart.yAxis[0].getExtremes().max
                        // 画上对应文字
                        groups.reduce(function (con, item, index) {

                            con += 2;

                            var info = list[index];

                            var shapeArgs = chart.series[0].data[con].shapeArgs;

                            var height = shapeArgs.height / (parseFloat(item[0].y) / max);

                            con += (item.length + 1);

                            var name = _.find(_that.calculateTypes, { code: obj.code }).name;

                            _that.textArr.push(
                                chart.renderer.text(name + ':' + info[obj.code] + _that.unit, shapeArgs.x, (1 - (info[obj.code] / max)) * height + 28).css({
                                    zIndex: 1000,
                                    color: pcolor.cd[obj.code]
                                }).add()
                            );

                            return con;
                        }, -1)

                        // 画上对应的线
                        var data = list.reduce(function (con, info, index) {

                            var arr = [];

                            if (index != 0) arr.push('');

                            arr.push('');
                            arr = arr.concat(_.map(groups[index], 'x'))
                            arr.push('');

                            var arr = arr.map(function (name, i, content) {
                                if (index != 0 && i == 0) {
                                    return {
                                        x: name,
                                        y: null
                                    }
                                }

                                return {
                                    x: name,
                                    y: info[item.code],
                                    unit: _that.unit
                                }
                            });

                            return con.concat(arr);
                        }, [])

                        chart.addSeriesBatch({
                            type: "line",
                            dashStyle: 'ShortDash',
                            lineWidth: 1,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: { enabled: false, }
                                }
                            },
                            color: pcolor.cd[item.code],
                            name: item.name,
                            data: data,
                        });
                    }
                })
            },
            createHandlerClick: function (type) {
                var _that = this;
                return function (arr) {
                    _that.query[type] = arr;

                    if (type == "dimensionality" && _.map(arr, 'code').join('') == '-1') {
                        _that.query[type] = [];
                    }

                    if (type == "sortTypes" && _.map(arr, 'code').join('') == '-1') {
                        _that.query[type] = [];
                    }

                    if (type == "dimensionality" || type == "sort") {
                        _that.createChartEl(_that.obj2series(_.cloneDeep(_that.queryBak)));
                    } else if (type == "calculate") {
                        // 添加对应的线
                        _that.keepCreateLines();
                    } else {
                        //  重新查询对应的内容
                        _that.submitQuery();
                    }
                }
            },
            computeWidth: function () {
                //  计算宽度是否够容纳
                //                      整体宽度                             图表报表          下载详情图表                  计量方式                             单位                        区分维度                排序方式                                  常用计算
                // debugger
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox1.getWidth() - 84 - this.$refs.vcheckbox2.getWidth() - this.$refs.cobxs1.getWidth() - this.$refs.cobxs2.getWidth() - this.$refs.cobxs3.getWidth() - this.$refs.cobxs4.getWidth() - 20) < 0);
            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },
            // 获取对应的数据
            copyArgu: function () {
                var _that = this;
                _that.energyProject = _.cloneDeep(_that.energyProjectBak);
                _that.suboptionModel = _.cloneDeep(_that.suboptionModelBak);
                _that.timer = _.cloneDeep(_that.timerBak);

                _that.submitQuery();
            },
            // 查询按钮点击事件
            submitQuery: function () {
                var _that = this;

                // 查询生成表格
                _that.createCharts();
            },
            // 获取对应的查询数据
            getQueryArgu: function (timeFrom, timeTo, timeType) {
                var _that = this;

                return {
                    "projectLocalIdList": _.map(_that.energyProject, 'projectLocalID'), //类型：String  必有字段  备注：项目id
                    "energyModelLocalId": _.map(_that.energyModelList, 'energyModelCode').join(''), //类型：String  必有字段  备注：能耗模型本地编码
                    "energyItemLocalId": _.map(_that.suboptionModel, 'localId').join(''),
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

                return controller.GetProjectTransverseCompare(argu)
            },
            // 获取排序的
            sort: function sort(arr, type) {
                return arr.sort(function (a, b) {

                    // 不排序
                    if (type == -1) return +a.projectLocalId - (+b.projectLocalId);
                    // 升序
                    if (type == 0) return a.data - b.data;
                    // 降序
                    if (type == 1) return b.data - a.data;
                })
            },
            //  根据类型来进行分组
            createGroupByType: function (obj, ds) {
                //  获取区分维度类型
                if (ds == 0) type = 'funcTypeCode';
                if (ds == 1) type = 'climateCode';
                if (ds == 2) type = 'manageZone';

                var dses = [];

                // 返回数据中区分维度集合
                dses = _.uniq(_.map(obj, type))

                return dses.map(function (code) {
                    var o = {};
                    o[type] = code;
                    return _.filter(obj, o)
                })
            },
            fillInfo: function (item, type) {
                // 查询对应的分类
                var _that = this;

                item = _that.getItemByBuildModelList(item);

                return {
                    x: item.projectLocalName,
                    y: _that.fix2(item.data),
                    unit: _that.unit,
                    item: item
                }
            },
            // 创建对应的分组
            createGroups: function (obj) {
                var _that = this;
                // 区分维度
                var ds = _.map(_that.query.dimensionality, 'code').join('') || -1;
                // 排序方式
                var sort = _.map(_that.query.sort, 'code').join('') || -1;


                var groups = [];
                var type = null

                // 获取分组信息
                groups = ds != -1 ? _that.createGroupByType(obj, ds) : [obj];

                // 根据分组进行排序
                groups = groups.map(function (arr) {
                    return _that.sort(arr, sort)
                })

                return groups.map(function (item) {
                    return item.map(function (info) {
                        return _that.fillInfo(info);
                    })
                })
            },
            // 将对应的参数转换成为的图表参数
            obj2series: function (obj) {

                var _that = this;
                //  获取分组完成的数据
                _that.createGroups(obj);

                return _that.createGroups(obj).reduce(function (con, item, index) {
                    var arr = [];
                    arr.push({
                        x: '   ',
                        y: 0
                    })

                    if (index != 0) {
                        arr.push({
                            x: '   ',
                            y: 0
                        })
                    }

                    arr = arr.concat(item)

                    arr.push({
                        x: '   ',
                        y: 0
                    })

                    return con.concat(arr);
                }, []);
            },
            // 创建表格的过程
            createCharts: function () {
                var _that = this;

                _that.queryMasterTabel().then(function (res) {

                    _that.queryBak = res;

                    _that.createChartEl(_that.obj2series(res));
                })
            },
            // 创建具体的表格
            createChartEl: function (series) {
                var _that = this;
                var x = -1;
                _that.chart = pchart.initColumnHistogram({
                    xAxis: {
                        labels: {
                            style: {
                                fontFamily: 'Arial,"微软雅黑",sans-serif'
                            },
                            formatter: function () {

                                x = ++x % series.length
                                var obj = series[x];
                                if (_that.query.dimensionality.length) {
                                    var text = "<br>";
                                    // // 获取对应的索引
                                    // var index = this.axis.categories.indexOf(this.value);


                                    // 判断为空的时候直接返回空
                                    if (obj.y == 0 && obj.value == 0 && obj.ptime == "   ") return '';

                                    var ds = _.map(_that.query.dimensionality, 'code').join('') || -1;
                                    if (ds == 0) text += _.get(obj, 'item.funcTypeCode.name', '--');
                                    if (ds == 1) text += _.get(obj, 'item.climateCode.name', '--');
                                    if (ds == 2) text += _.get(obj, 'item.manageZone.managePartitionName', '--');

                                    return obj.ptime + '<br>' + text;
                                }
                                return obj.ptime;
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
                        name: _.get(_that.query, "measurement[0].name", ''),
                    }],
                    tooltip: {
                        "enabled": true,
                        "animation": true,
                        "borderColor": null,
                        "borderWidth": 0,
                        "shadow": false,
                        "backgroundColor": null,
                        "useHTML": true,
                        "shared": true,
                        "style": { "zIndex": 6 },
                        "formatter": function () {

                            var temp = this.points || this.point;
                            var tempPointArr = temp instanceof Array == true ? temp : [temp];

                            /*当图表上的每个series的对应的点上，对应的x坐标一样时才显示title*/
                            var isShowTitle = true;
                            var pointArr = [];
                            for (var i = 0; i < tempPointArr.length; i++) {
                                var tempPoint = tempPointArr[i].point || tempPointArr[i];
                                pointArr.push(tempPoint);
                            }

                            var currPoint = pointArr[0];

                            if (currPoint.ptime == "   ") return false;

                            var formatChartTip = function () {

                                var temp = this.points || this.point;
                                var tempPointArr = temp instanceof Array == true ? temp : [temp];

                                /*当图表上的每个series的对应的点上，对应的x坐标一样时才显示title*/
                                var isShowTitle = true;
                                var pointArr = [];
                                for (var i = 0; i < tempPointArr.length; i++) {
                                    var tempPoint = tempPointArr[i].point || tempPointArr[i];
                                    pointArr.push(tempPoint);
                                }

                                var currPoint = pointArr[0];
                                var currSeries = currPoint.series;
                                var chart = currSeries.chart;
                                var chartType = currSeries.userOptions.type || chart.options.chart.type;
                                var extendObj = chart[pchart.appendChartProName];
                                var pointIndex = currPoint.index;
                                var seriesAll = chart.series;

                                for (var xy = 1; xy < seriesAll.length; xy++) {
                                    var __point = seriesAll[xy].points[pointIndex];
                                    var prevPoint = seriesAll[xy - 1].points[pointIndex];
                                    if (!__point || !prevPoint) continue;
                                    if (__point.ptime != prevPoint.ptime) {
                                        isShowTitle = false;
                                        break;
                                    }
                                }


                                //标题，饼图为当前块的名称；散点图、气泡图为当前点或当前series的名称、热力图为当前点的时间、
                                //      否则为：x轴是时间时，显示当前点对应的时间，否则显示当前点对应的x轴的名称
                                var title, itemColor, itemName, itemVal, itemUnit;
                                if (isShowTitle) {
                                    var currPointDate = new Date(currPoint.ptime);
                                    switch (chartType) {
                                        default:
                                            if (currPointDate == 'Invalid Date')
                                                title = currPoint.ptime;
                                            else {
                                                var timeType = extendObj[pchart.extendTimeTypeName];
                                                title = timeType == 5 ? currPointDate.format('y') : timeType == 4 ? currPointDate.format('y.M') :
                                                    timeType == 3 ? currPointDate.format('y.M.d') : currPointDate.format('y.M.d h:m');
                                            }
                                            break;
                                    }
                                }

                                var itemHtml = '';
                                seriesAll.slice(0, 1).forEach(function (_currSeries) {
                                    var _chartType = _currSeries.userOptions.type || chart.options.chart.type;
                                    var _point = _currSeries.points[pointIndex];
                                    switch (_chartType) {
                                        default:
                                            itemColor = _chartType == 'scatter' || _chartType == 'bubble' ? '' : _point.color;
                                            itemName = _chartType == 'pie' || _chartType == 'heatmap' ? '' : _point.name || _point.series.name || '';
                                            itemVal = ((_point.value || _point.value === 0) ? _point.value : (_point.y || _point.y === 0) ? _point.y : pconst.emptyReplaceStr).toString();
                                            itemUnit = _point.unit || '';

                                            var colorHtml = itemColor ? '<i style="background-color:' + itemColor + '"></i>' : '';
                                            var nameHtml = itemName ? '<span>' + itemName + '：</span>' : '';
                                            var valHtml = itemVal ? '<b>' + itemVal + '</b>' : '';
                                            var unitHtml = itemUnit ? '<em>' + itemUnit + '</em>' : '';
                                            itemHtml += '<li>' + colorHtml + nameHtml + valHtml + unitHtml + '</li>';
                                            break;
                                    };
                                });

                                //有联动chart时，需触发联动chart的hover
                                var currChartId = extendObj[pchart.extendChartIdPro];
                                var relvCharts = extendObj[pchart.extendChartRelv] || [];
                                for (var i = 0; i < relvCharts.length; i++) {
                                    var _chart = relvCharts[i];
                                    if (_chart[pchart.appendChartProName][pchart.extendChartIdPro] == currChartId) continue;
                                    var _point = _chart.series[0].points[currPoint.index];
                                    if (_point.state == 'hover') continue;
                                    _point.onMouseOver();
                                }

                                return (isShowTitle ? '<div>' + title + '</div>' : '') + '<ul>' + itemHtml + '</ul>';
                            };

                            return formatChartTip.call(this);
                        }
                    },
                    call: function () {

                    }
                });

                //  再次绘线
                _that.keepCreateLines();

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
            },
        },
        beforeMount: function () { },
        mounted: function () {
            var that = this;

            // this.drawChartData();
            //添加表头
            that.reportFromTitle = [{
                name: "时间",
                width: "130px"
            },
            {
                name: "暖通空调",
                width: "130px"
            },
            {
                name: "暖通空调2",
                width: "130px"
            },
            {
                name: "时间",
                width: "130px"
            },
            {
                name: "暖通空调",
                width: "130px"
            },
            {
                name: "暖通空调2",
                width: "130px"
            },
            ];
            that.reportFromContent = [
                [
                    '00:00 ~ 00:59', '119.9', '119.9', '119.9', '119.9', '119.9'
                ],
                [
                    '00:00 ~ 00:59', '119.9', '119.9', '119.9', '119.9', '119.9'
                ],
                [
                    '00:00 ~ 00:59', '119.9', '119.9', '119.9', '119.9', '119.9'
                ],
                [
                    '00:00 ~ 00:59', '119.9', '119.9', '119.9', '119.9', '119.9'
                ],
                [
                    '00:00 ~ 00:59', '119.9', '119.9', '119.9', '119.9', '119.9'
                ]


            ];
        },
        watch: {},
        computed: {
            // 单位
            unit: function () {
                var _that = this;
                var dataKind = parseInt(_.map(_that.query.measurement, 'code').join(''));
                dataKind = dataKind == 3 ? 1 : dataKind;
                var dataType = parseInt(_.map(_that.query.unit, 'code').join(''));

                return biTool.getChartUnit(dataKind, dataType)
            },
            // 用于遍历的表哥时候需要的内容
            compuTables: function () {
                var _that = this;
                var keys = [];
                var list = [];

                // 如果查询内容不存在直接返回
                if (!_that.queryBak) return {
                    list: list,
                    keys: keys,
                }

                //表头信息
                keys = keys.concat([{
                    name: '时间',
                    key: "x",
                }, {
                    name: "项目名称",
                    key: "z",
                }, {
                    name: _.get(_that.suboptionModel, "[0].name") + "(" + _that.unit + ")",
                    key: "y",
                }])

                // 表依赖的数据
                list = _that.queryBak.map(function (item) {
                    return {
                        x: new Date(app.timer.startTime).format("yyyy-MM-dd hh:mm:ss") + "-" + new Date(app.timer.realEndTime).format("yyyy-MM-dd hh:mm:ss"),
                        y: _that.fix2(item.data),
                        z: (_.find(_that.energyProject, { projectLocalID: item.projectLocalId }) || {}).projectLocalName
                    }
                })

                return {
                    list: list,
                    keys: keys,
                }
            },
            energyModelTree: function () {
                var _that = this;
                return _.filter(_.get(_that.energyModelList, '[0].energyModelTree', []), {
                    parentLocalId: "-1"
                })
                    .map(function (info) {

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
        }
    });

    app.$nextTick(function () {

        app.computeWidth();

        app.queryModelTree();

        app.queryBuildModelType();
    })


    window.onresize = app.computeWidth.bind(app);

});