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
                name: "图表",
                code: 0,
                lock: true,
                selected: true,
            }, {
                name: "报表",
                code: 1,
            }],
            // 面积单位
            areaTypres: [{
                name: "总量",
                code: 0,
                selected: true
            },
            {
                name: "单平米",
                code: 1,
            }
            ],
            // 能源类型
            energyTypes: [{
                name: "能耗",
                code: 0,
                selected: true
            },
            {
                name: "费用",
                code: 1,
            },
            {
                name: "碳排放量标煤",
                code: 2,
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
                    code: 0,
                }],
                energy: [{
                    name: "能耗",
                    code: 0,
                }],
            },
            // 分项模型
            energyModelList: [],
            // 对应的建筑
            energyProject: false,
            //  能耗模型
            energyModel: false,
            //  是否展示的能耗模型树
            showEnergyModel: false,
            // 对应的分项集合
            suboptionModel: [],
            // 时间控件中的时间
            timer: [],
            // 查询热图返回的数据
            res: [],
            //  查询的数据
            argu: null

        },
        methods: {
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
            //  Tab 选项切换内容
            createHandlerClick: function (type) {
                var _that = this;

                return function (arr) {



                    _that.query[type] = arr;

                    //  查询对应的值的单位
                    if (type == "energy" || type == "areas") {

                        // 重新查询数据
                        _that.createHandlerClick();


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
                this.energyProject = projects[0];
                this.energyModel = arr[0];
                //  模型面板取消选项
                this.handlercancelenergyModel();
                //  重新查询对应的分项树
                this.queryModelTree(this.energyModel.buildingLocalId, this.energyModel.energyModelId);
            },
            // 查询对应的分项树
            queryModelTree: function (buildingLocalId, energyModelLocalId) {

                var _that = this;
                singleController.querySubOption({
                    buildingLocalId: buildingLocalId,
                    energyModelLocalId: energyModelLocalId
                }).then(function (res) {
                    _that.energyModelList = res;
                })
            },
            // 分项返回值
            handlerclickSuboption: function (arr) {

                this.suboptionModel = arr;
            },
            // 获取对应的查询数据
            getQueryArgu: function (times) {
                var _that = this;

                var timeType = times[0].timeType == 'w' ? '1' : '2';

                return {
                    "projectId": _that.energyProject.projectId, //类型：String  必有字段  备注：项目id
                    "buildingLocalId": _that.energyModel.buildingLocalId, //类型：String  必有字段  备注：建筑本地编码
                    "energyModelLocalId": _that.energyModel.energyModelId, //类型：String  必有字段  备注：能耗模型本地编码
                    "timeType": timeType, //类型：Number  必有字段  备注：数据聚合时间类型1-时，2-天，4-月，5-年
                    "dataKind": _.get(_that.query.areas, '[0].code'), //类型：Number  必有字段  备注：1-总能耗；2-单平米能耗；
                    "dataType": _.get(_that.query.energy, '[0].code'), //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                    "paramList": times.map(function (item) {
                        return {
                            "energyItemLocalId": _.map(_that.suboptionModel, 'localId').join(''), //类型：String  必有字段  备注：分项本地编码
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

                return singleController.queryTable(argu).then(function (res) {

                    // 保存渲染的表格的数据
                    _that.queryBak = res;
                    _that.queryRes = res[0].dataList.map(function (item) {
                        return {
                            x: item.time,
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


                for (var index = 0; index < argu.length; index++) {
                    var item = argu[index];

                    if (item.timeType == 'y') continue;

                    if (index == 0) {
                        time = item.endTime - item.startTime;
                    } else {

                        if (time != item.endTime - item.startTime) {
                            fail("对比不同时间的数据需要保持时间间隔一致!");
                            return false;
                        }
                    }
                }

                return true;
            },
            //  时间控件点击选择事件
            timeClick: function (argu) {

                // 先赋值
                this.timer = argu;

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
                    1: date.format('yyyy-MM-dd hh:mm'),
                    2: date.format('yyyy-MM-dd'),
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
            // 查询表格数据
            submitQuery: function () {
                var _that = this;

                _that.vTimeLen(_that.timer);

                _that.argu = _that.getQueryArgu(_that.timer);

                singleController.queryTable(_that.argu).then(function (res) {

                    _that.res = res;

                    _that.$nextTick(function () {
                        _that.createChart(_.cloneDeep(res), _that.timer[0].timeType);
                    })
                })
            },
            // 创建表格
            createChart: function (list, type) {
                var _that = this;
                Promise.all(list.map(function (item, index) {

                    return new Promise(function (resolve) {

                        if (type == 'y') {
                            pchart.initYearHeatmap({
                                title: {
                                    text: _that.suboptionModel[0].name,
                                    align: 'left',
                                },
                                yAxis: {
                                    title: { text: 'kWh' },
                                    align: 'low',
                                    y: -10,
                                    x: 600
                                },
                                container: _that.$refs['chart' + index][0],
                                series: {
                                    data: item.dataList.map(function (item) {
                                        return {
                                            x: new Date(item.time).format("yyyy-MM-dd hh:mm:00"),
                                            y: item.data,
                                        }
                                    }),
                                    name: _.get(_that.query, "energy[0].name", ''),
                                }
                            }, function () {
                                resolve()
                            });
                        } else {
                            pchart.initWeekHeatmap({
                                title: {
                                    text: _that.suboptionModel[0].name,
                                    align: 'high',
                                },
                                yAxis: {
                                    title: { text: 'kWh' },
                                    align: 'low',
                                    y: -10,
                                    x: 600
                                },
                                container: _that.$refs['chart' + index][0],
                                series: {
                                    data: item.dataList.map(function (item) {
                                        return {
                                            x: new Date(item.time).format("yyyy-MM-dd hh:mm:00"),
                                            y: item.data,
                                        }
                                    }),
                                    name: _.get(_that.query, "energy[0].name", ''),
                                }
                            }, function () {
                                resolve()
                            });
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

                // _that.res = _that.res.filter(function (item) {
                //     return !(obj.subentry.energyItemLocalId == item.energyItemLocalId && obj.time.st == item.timeFrom && obj.time.et == item.timeTo)
                // });
            },
            // 是否显示表格
            isAreas: function () {
                return _.isUndefined(_.find(this.query.tables, { code: 1 }));
            },
        },
        watch: {

        },
        computed: {
            canSubmit: function () {
                var _that = this;
                return !_that.suboptionModel.length || !_that.timer.length;
            },
            selecteds: function () {
                var _that = this;

                if (!_that.argu || !_that.res.length) return [];

                var MAX = _.max(_.map(_that.res, 'sumData'));

                return _that.argu.paramList.map(function (item, index) {

                    return {
                        "time": {
                            "st": new Date(item.timeFrom).format('yyyy-MM-dd hh:mm:ss'),
                            "et": new Date(item.timeTo).format('yyyy-MM-dd hh:mm:ss'),
                        },
                        "value": {
                            "num": _that.res[index].sumData,
                            "unit": "kwh"
                        },
                        "subentry": {
                            "energyItemLocalName": _.get(_that.getItemByEnergyModelList(_that.res[index].energyItemLocalId), 'name', '--'),
                            "energyItemLocalId": _that.res[index].energyItemLocalId,
                        },
                        "base": {
                            "width": _that.fix2((_that.res[index].sumData / MAX) * 140) + "px",
                            "color": pcolor.cd[index]
                        }
                    }
                });
            },
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
            }
        }
    });


    app.$nextTick(function () {

        app.computeWidth();
    })


    window.onresize = app.computeWidth.bind(app);


    window.app = app;
})