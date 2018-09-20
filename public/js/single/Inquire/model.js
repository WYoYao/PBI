$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 图标报表
            tableTypes: [
                {
                    name: "图表",
                    code: 0,
                }, {
                    name: "报表",
                    code: 1,
                }
            ],
            // 辅助线
            auxiliaryTypes: [
                {
                    name: "最大值",
                    code: 0,
                },
                {
                    name: "最小值",
                    code: 1,
                },
                {
                    name: "平均值",
                    code: 2,
                },
                {
                    name: "中位数",
                    code: 3,
                },
            ],
            // 面积单位
            areaTypres: [
                {
                    name: "总量",
                    code: 0,
                },
                {
                    name: "单平米",
                    code: 1,
                },
                {
                    name: "下级拆分",
                    code: 2,
                },
            ],
            // 能源类型
            energyTypes: [
                {
                    name: "能耗",
                    code: 0,
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
                tables: [],
                auxiliarys: [],
                areas: [],
                energy: [],
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
        },
        methods: {
            createHandlerClick: function (type) {
                var _that = this;
                return function (arr) {
                    _that.query[type] = arr;
                }
            },
            getTableTypes: function () {
                console.log(arguments);
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
                console.log(this.suboptionModel);
            },
            // 创建整体图表
            createMaster: function (res) {

                var _that = this;

                return new Promise(function (resolve) {
                    {

                        _that.masterTable = Highcharts.chart(_that.$refs.masterChart, {
                            chart: {
                                zoomType: 'x',
                                events: {
                                    selection: function (event) {

                                        var extremesObject = event.xAxis[0],
                                            min = extremesObject.min,
                                            max = extremesObject.max,
                                            detailData = [],
                                            xAxis = this.xAxis[0];
                                        Highcharts.each(this.series[0].data, function (d) {
                                            if (d.x > min && d.x < max) {
                                                detailData.push([d.x, d.y]);
                                            }
                                        });
                                        xAxis.removePlotBand('mask-before');
                                        xAxis.addPlotBand({
                                            id: 'mask-before',
                                            from: max,
                                            to: min,
                                            color: 'rgba(0, 0, 0, 0.2)'
                                        });

                                        _that.detailTable.series[0].setData(detailData);

                                        // detailChart.series[0].setData(detailData);
                                        return false;
                                    }
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
                                        return xdate.format('h:m');
                                    },
                                    enabled: true,
                                },
                                type: "datetime",
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
                                // data: _.range(10).map((item, index) => index)
                            }],
                        }, function () {
                            resolve(res)
                        });
                    }

                })

            },
            // 创建单个图表
            createDetail: function (res) {

                this.detailTable = pchart.initColumnHistogram({
                    title: {
                        text: '月平均降雨量'
                    },
                    xAxis: {
                        title: {
                            y: -1 * ($("#chart").height() - 50),
                            align: 'high',
                            text: '单位：kWh',
                        },
                        labels: {
                            style: {
                                fontFamily: 'Arial,"微软雅黑",sans-serif'
                            },
                            formatter: function () {
                                var xdate = new Date(this.value);
                                return xdate.format('h:m');
                            },
                            enabled: true,
                        },
                        type: "datetime",
                    },
                    container: "chart",
                    series: [{ data: res }]
                })
            },
            // 查询对应图表需要的信息
            queryTabel: function () {

                var _that = this;

                // 查询上面的单位
                console.log(_that.query);
                // 查询对应的项目模型
                console.log(_that.energyProject);
                console.log(_that.showEnergyModel);

                singleController.queryTable().then(_that.createMaster).then(_that.createDetail)
            },
        },
        computed: {
            energyModelTree: function () {
                var _that = this;
                return _.filter(_that.energyModelList, { parentLocalId: false })
                    .map(function (info) {

                        var item = _.clone(info);

                        item.content = _.filter(_that.energyModelList, { parentLocalId: item.localId });

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

        app.queryTabel();
    })


    window.onresize = app.computeWidth.bind(app);


    window.app = app;
})