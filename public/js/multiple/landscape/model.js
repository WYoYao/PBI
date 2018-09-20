$(function () {
    window.landscape = new Vue({
        el: "#multipleLandscape",
        data: {
            // 图标报表
            tableTypes: [{
                name: "图表",
                code: 0,
            }, {
                name: "报表",
                code: 1,
            }],
            // 计量方式
            measurementTypes: [{
                    name: "总量",
                    code: 0,
                },
                {
                    name: "单平米",
                    code: 1,
                },
                {
                    name: "平均单项目",
                    code: 2,
                },
            ],
            //单位
            unitTypes: [{
                    name: "能耗",
                    code: 0,
                },
                {
                    name: "费用",
                    code: 1,
                },
                {
                    name: "碳排放量",
                    code: 2,
                },
                {
                    name: "标煤",
                    code: 3,
                },
            ],
            //区分维度
            dimensionalityTypes: [{
                    name: "建筑类型",
                    code: 0,
                },
                {
                    name: "气候区",
                    code: 1,
                },
                {
                    name: "管理区",
                    code: 2,
                },
            ],
            //排序方式
            sortTypes: [{
                    name: "升序",
                    code: 0,
                },
                {
                    name: "降序",
                    code: 1,
                },
                {
                    name: "不排序",
                    code: 2
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
                measurement: [], //计量
                unit: [], //单位
                dimensionality: [], //区分维度
                sort: [], //排序方式
                calculate: [], //计算
            },
            projectTextShow: "请选择项目", //已选项目名称
            subentryName: "请选择分项", //已选分项名称

            onlineExplainFlag: false, //是否显示提示信息
            reportFromTitle:[],//表格title
            reportFromContent:[],//表格内容
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
                //                      整体宽度                             图表报表          下载详情图表                  计量方式                             单位                        区分维度                排序方式                                  常用计算
                // debugger
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox1.getWidth() - 84 - this.$refs.vcheckbox2.getWidth() - this.$refs.cobxs1.getWidth() - this.$refs.cobxs2.getWidth() - this.$refs.cobxs3.getWidth() - this.$refs.cobxs4.getWidth() - 20) < 0);
            },
            ordinateBuild: function () {

            },
            drawChartData: function () { //画图
                var series = [];
                var plotIcons = [];
                for (var i = 0; i < 1; i++) {
                    var data = [];
                    for (var j = 0; j < 20; j++) {
                        var y = Math.random();
                        //if (i == 1) y = parseFloat('-' + y);
                        var item = {
                            y: y,
                            x: '冷站' + (j + 1)
                        }
                        data.push(item);
                        plotIcons.push({
                            seriesIndex: 0,
                            pointIndex: j,
                            icons: [{
                                url: j % 2 == 0 ? 'https://www.highcharts.com/demo/gfx/snow.png' : 'https://www.highcharts.com/demo/gfx/sun.png',
                                height: 30,
                                width: 30
                            }]
                        });
                    }
                    series.push({
                        data: data,
                        //yAxis: i == 0 || i == 1 ? 0 : 1,
                        //type: i == 2 ? 'line' : 'column',
                        name: '冷站' + i.toString()
                    });
                }
                var xPlotBands = [{
                    from: 0,
                    to: 2,
                    label: {
                        text: '华东区'
                    }
                }, {
                    from: 3,
                    to: 5,
                    label: {
                        text: '华北区'
                    }
                }, {
                    from: 6,
                    to: 8,
                    label: {
                        text: '华中区'
                    }
                }];
                //addSeries({ series: series, xPlotBands: xPlotBands, chartPlotIcon: plotIcons }, thisChart);

                return pchart.initColumn({
                    yAxis: {
                        title: {
                            text: 'kWh'
                        }
                    },
                    container: 'divMonitorChart',
                    series: series
                });
            },
            queryTabel: function () { //查询图表入口
                var that = this;
                console.log(that.query);
                this.drawChartData();
            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },
            showInformation: function () { //展示参考信息

            },

        },
        beforeMount: function () {},
        mounted: function () {
            var that = this;
            console.log("aaa");
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
        computed: {}
    });

    landscape.$nextTick(function () {

        landscape.computeWidth();

        landscape.queryTabel();
    })


    window.onresize = landscape.computeWidth.bind(landscape);

});