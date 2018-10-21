// Vue实例
$(function () {
    window.slide = new Vue({
        el: "#singleSlidePage",
        data: {
            projects: [],
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

            addSubentryTxt: '请选择分项',

            searchSubentry: '', //搜索分项关键字

            showSubentryTemp: false, //是否显示选择分项

            currentSubentryList: [], //当前选中的分项数组

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

            scReportShow: false, //是否显示表格

            downLoadBlockIsShow: false, //是否显示下载图表


            columnConfigData: { // 柱状图配置
                // text_title: '这是一个标题',
                series: [{
                    //name: '功耗',
                    data: []
                    //color: '#02A9D1',
                    //pointWidth: 92,
                }]
            },

            gridRenderList: [],//表格列表数据
            //顶部筛选条件
            // 图标报表
            tableTypes: [{
                name: "报表",
                code: 1
            }],
            // 计量方式
            measurementTypes: [{
                name: "总量",
                code: 1,
                selected: true
            }, {
                name: "单平米能耗",
                code: 2,
            }],
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
                code: 2,
                selected: true
            },
            {
                name: "滑动按日",
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
                    code: 1,
                }], //计量
                unit: [{
                    name: "能耗",
                    code: 1,
                }], //单位
                dimensionality: [{
                    name: "滑动按月",
                    code: 2,
                }], //区分维度
                calculate: [], //数值
            },

            onlineExplainFlag: false, //是否显示在线提示信息

            energyPointList: [],//能量拐点列表
            chartUnit: 'kWh',
            maxData: 0,
            minData: 0,
            avgData: 0,
            midData: 0,
            yAxisMaxData: 0,
            yAxisMinData: 0
        },
        methods: {
            //选择项目相关
            addProjectShow: function () {
                this.showEnergyModel = true;
            },
            addProjectHide: function () {
                this.showEnergyModel = false;
            },
            addProjectCallBack: function (item, item1) { //选择项目回调
                var that = this;
                this.projects = item;
                this.modelids = item1;
                this.showEnergyModel = false;
                var projectItem = item[0] || {};
                var energyModelItem = item1[0];

                this.searchConditionObj.projectSaveObj = {
                    projectId: projectItem.projectId,
                    projectLocalID: projectItem.projectLocalID,
                    projectName: projectItem.projectName,
                    buildingLocalId: energyModelItem.buildingLocalId,
                    energyModelId: energyModelItem.energyModelId,
                    energyModelName: energyModelItem.energyModelName
                }
                this.addProjectTxt = item[0].projectName + '>' + item1[0].energyModelName;

                //确认选择项目时，重置已选择分项
                this.addSubentryTxt = "请选择分项";
                this.currentSubentryList = [];
                this.searchConditionObj.subentrySaveArr = [];

                this.subentryDisabled = true; //添加分项启用

                //获取分项树请求
                var queryParam = {
                    buildingLocalId: that.searchConditionObj.projectSaveObj.buildingLocalId,
                    energyModelId: that.searchConditionObj.projectSaveObj.energyModelId
                }
                singleCompareController.GetEnergyModelTreeOfBuilding(queryParam).then(function (res) {

                    that.subentryTree = _.clone(res);
                    that.subentryTree = that.energyModelTree(that.subentryTree, -1);
                    that.showSubentryTemp = true;
                    console.log(that.subentryTree);
                })

            },
            energyModelTree: function (data, parent_id) { //格式化分项树
                var that = this;
                var tree = [];
                var temp;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentLocalId == parent_id) {
                        var obj = data[i];
                        temp = that.energyModelTree(data, data[i].localId);
                        if (temp.length > 0) {
                            obj.content = temp;
                        }
                        tree.push(obj);
                    }
                }
                return tree;
            },


            setYAxisShowFn: function () { //显示设置Y轴坐标弹出框
                this.setYAxisShow = true;
            },
            setYAxisHideFn: function () { //隐藏设置Y轴坐标弹出框
                this.setYAxisShow = false;
            },
            setYdataFn: function (max, min) { //确认设置Y轴坐标

                slide.singleProjectSlideChart.yAxis[0].setExtremes(min, max);
            },
            drawingChartData: function (obj) { //绘制柱状图
                var that = this;
                var arr = [];
                var max = 0;
                var min = 0;
                arr = obj[0].dataList.map(function (item) {
                    max = Math.max(max, item.data);
                    min = Math.min(min, item.data);
                    return {
                        x: item.timeSpan,
                        y: item.data,
                        unit: that.chartUnit
                    };
                });
                that.columnConfigData.series[0].data = JSON.parse(JSON.stringify(arr));
                that.columnConfigData.series[0].name = (slide.searchConditionObj.subentrySaveArr[0] || {}).name;
                that.yAxisMaxData = max;
                that.yAxisMinData = min;
                Vue.nextTick(function () {
                    that.drawPlotLine();
                });
            },
            addSubetryHide: function () {
                this.showSubentryTemp = false;
            },
            addSubetryCallBack: function (item) { //选择分项回调
                this.currentSubentryList = item;


                this.addSubentryTxt = item[0].name;
                this.searchConditionObj.subentrySaveArr = item;
                this.showSubentryTemp = false;
            },
            // 选择图标或者报表
            gridOptionChange: function (id) {
                $("#chartType").psel(false);
                $("#tableType").psel(false);
                $("#" + id).psel(true);
                if (id == 'chartType') {
                    this.searchConfig.gridOption = 0;
                } else {
                    this.searchConfig.gridOption = 1;
                }
            },
            // 区分建筑类型修改
            buildingTypeChange: function () {
                $("#buildingType").psel() ? (this.searchConfig.buildingType = 1) : (this.searchConfig.buildingType = 0);
            },
            // 文字类型筛选项通用方法
            wordSelect: function (name, value) {
                $("." + name + " li").removeClass('checked');
                $($("." + name + " li")[value]).addClass('checked');
                this.searchConfig[name] = value;
            },
            computeWidth: function () {
                //  计算宽度是否够容纳
                //                      整体宽度                             图表报表          下载详情图表                  计量方式                             单位                        区分维度                排序方式                                 

                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox1.getWidth() - 84 - this.$refs.vcheckbox2.getWidth() - this.$refs.cobxs1.getWidth() - this.$refs.cobxs2.getWidth() - this.$refs.cobxs3.getWidth() - 20) < 0);
            },
            //画辅助线
            drawPlotLine: function () {
                var that = this;
                that.query.calculate.forEach(function (curr) {
                    var value = curr.code == 0 ? that.maxData : curr.code == 1 ? that.minData : curr.code == 2 ? that.avgData : that.midData;
                    slide.singleProjectSlideChart.addPlotLineToYAxis({
                        id: curr.code.toString(),
                        value: value,
                        label: { text: curr.name + '：' + value }
                    });
                });
            },
            createHandlerClick: function (type) { //导航选中选项
                var that = this;
                return function (arr) {
                    that.query[type] = arr;
                    switch (type) {
                        case 'table':   //报表
                            that.scReportShow = arr.length > 0;
                            Vue.nextTick(function () {
                                biTool.setChartSize(slide.singleProjectSlideChart);
                            });
                            break;
                        case 'measurement': //计量方式：总量、单平米
                        case 'unit':    //能耗类型：能耗、费用、标煤等
                        case 'dimensionality':      //数据统计方式：滑动按月、滑动按日
                            $('#divConfirm').click();
                            break;
                        case 'calculate':       //辅助数据类型：最大值、最小值等
                            //先移除已有的
                            that.calculateTypes.forEach(function (curr) {
                                slide.singleProjectSlideChart.removePlotLineToYAxis({ id: curr.code.toString() });
                            });
                            that.drawPlotLine();
                            break;
                    }
                    // that.AssemblyParameterList(that.query);

                    that.chartUnit = biTool.getChartUnit(that.query.measurement[0].code, that.query.unit[0].code);
                }

            },
            transGridRenderListFn: function (arr) { //后台返回的数据格式转换成表格渲染数据格式
                var that = this;
                var arr1 = [];

                var energyItemName = that.searchConditionObj.subentrySaveArr[0].name;
                arr.forEach(function (item) {
                    arr1.push({
                        dataListArr: [{ content: item.dataList, name: energyItemName }]
                    });
                })
                arr1.forEach(function (item) {
                    item.dataListArr.forEach(function (info) {
                        info.time = info.content.map(function (t) {
                            return t.timeSpan;
                        })
                    })
                })


                arr1.forEach(function (item) {
                    item.renderTit = [];
                    item.renderCon = [];
                    item.dataListArr.forEach(function (info, index) {
                        item.renderTit.push({
                            name: info.name + '(' + that.chartUnit + ')'
                        });

                        info.content.forEach(function (c, i) {
                            item.renderCon[i] = item.renderCon[i] || [];
                            item.renderCon[i].push(info.content[i].data || info.content[i].data === 0 ? info.content[i].data : pconst.emptyReplaceStr);
                            if (index == 0) {
                                item.renderCon[i].unshift(info.time[i]);
                            }

                        })

                    })
                    item.renderTit.unshift({
                        name: "时间"
                    });
                })
                return arr1;
            },
            AssemblyParameterList: function (obj) {//选中选项后构造请求数据
                var that = this;

                var val = that.searchConditionObj;

                var paramList = {};

                var unit = obj.unit;
                var measurement = obj.measurement;
                var dimensionality = obj.dimensionality;
                if (val.projectSaveObj.hasOwnProperty('id') && val.projectSaveObj.id != '') { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (val.timeSaveArr.length > 0) {

                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].obj_id != '') { //分项id不为空

                            paramList = {
                                energyItemLocalId: val.subentrySaveArr[0].id,
                                timeFrom: new Date(val.timeSaveArr[0].startTime).format("yyyy-MM-dd hh:mm:ss"),
                                timeTo: new Date(val.timeSaveArr[0].endTime).format("yyyy-MM-dd hh:mm:ss"),
                            }

                            if (that.scChartShow) {//图表是否显示
                                that.getChartListFn(paramList, unit[0].code, measurement[0].code, dimensionality[0].code);
                            }

                        }
                    }
                }


            },
            confirmSearchListFn: function () { //查询表格数据请求
                var that = this;

                var val = that.searchConditionObj;
                if (val.projectSaveObj.projectId && val.projectSaveObj.energyModelId) { //存在项目id ， 模型id
                    if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId) { //分项id不为空
                        //获取图表数据请求
                        that.getChartListFn();
                    }
                }

            },
            getChartListFn: function () { //获取图表请求数据
                var that = this;
                var timeObj = $('#selectTimeLine').psel();
                var energyItem = that.searchConditionObj.subentrySaveArr[0] || {};
                var projectAndEnergyModel = that.searchConditionObj.projectSaveObj;
                var slideCode = (that.query.dimensionality[0] || {}).code;
                var dataKindCode = (that.query.measurement[0] || {}).code;
                var dataTypeCode = (that.query.unit[0] || {}).code;
                var queryParam = {
                    projectId: projectAndEnergyModel.projectId,
                    buildingLocalId: projectAndEnergyModel.buildingLocalId,
                    energyModelId: projectAndEnergyModel.energyModelId,
                    energyItemLocalId: energyItem.localId,
                    area: (energyItem.area || 0).toString(),
                    timeType: slideCode == 2 ? 4 : slideCode == 1 ? 2 : 4, //查询 按天 or 月 2-天，4-月
                    dataKind: dataKindCode || 1,                //类型：Number  必有字段  备注：1-能耗总量；2-单平米能耗；
                    dataType: dataTypeCode || 1,                //类型：Number  必有字段  备注：1-能耗；2-费用；3-CO2排放量；4-标煤
                    timeFrom: new Date(timeObj.startTime).format("yyyy-MM-dd hh:mm:ss"),
                    timeTo: new Date(timeObj.realEndTime).format("yyyy-MM-dd hh:mm:ss")
                };

                singleSlideController.GetItemSlidingEnergyByTime(queryParam).then(function (res) {
                    (res || []).forEach(function (curr) {
                        curr.avgData = Math.toFixed({
                            value: curr.avgData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        that.avgData = curr.avgData;

                        curr.maxData = Math.toFixed({
                            value: curr.maxData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        that.maxData = curr.maxData;

                        curr.midData = Math.toFixed({
                            value: curr.midData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        that.midData = curr.midData;

                        curr.minData = Math.toFixed({
                            value: curr.minData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        that.minData = curr.minData;

                        (curr.dataList || []).forEach(function (currDataObj) {
                            currDataObj.data = Math.toFixed({
                                value: currDataObj.data,
                                isByInt: true,
                                isToSpecial: false
                            });
                        });
                    });
                    that.dataListSubentry = res;
                    that.drawingChartData(res);
                    that.noDataChartShow = false;
                    that.scChartShow = true;
                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    //转换右侧数据列表数据

                    //存储右侧 显示列表数据
                    that.energyPointList = res[0].inflectionPoints;


                });

            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },
            /*下载图表、报表*/
            downReport: function (type) {
                switch (type) {
                    case 1: //图表
                        biTool.downReportImg({
                            container: '#divSingleSlidChartParent',
                            downName: '单项目滑动平均图表'
                        });
                        break;
                    case 2: //报表
                        var timeObj = $('#selectTimeLine').psel();
                        var slideCode = (this.query.dimensionality[0] || {}).code;
                        var formatStr = slideCode == 1 ? 'y.M.d' : 'y.M';

                        var data1 = ['项目名称', '计量方式', '能耗模型', '单位', '分析时间', '所选分项'];

                        var projectInfo = this.searchConditionObj.projectSaveObj;
                        var projectName = projectInfo.projectName;
                        var kindName = (this.query.measurement[0] || {}).name;
                        var modelName = projectInfo.energyModelName;
                        var unit = this.chartUnit;
                        var timeStr = new Date(timeObj.startTime).format(formatStr) + '~' + new Date(timeObj.endTime).format(formatStr);
                        var energyItemStr = (this.searchConditionObj.subentrySaveArr[0] || {}).name;
                        var data2 = [projectName, kindName, modelName, unit, timeStr, energyItemStr];

                        var data = [data1, data2];
                        data.push(['', '', '', '', '', '']);

                        var _obj = slide.gridRenderList[0] || {};
                        var titleData = [];
                        _obj.renderTit.forEach(function (currTit) {
                            titleData.push(currTit.name);
                        });
                        data.push(titleData);

                        _obj.renderCon.forEach(function (currCon) {
                            data.push(JSON.parse(JSON.stringify(currCon)));
                        });


                        biTool.downReportExcel({
                            downName: '单项目滑动平均报表',
                            data: data
                        });
                        break;
                }
            }
        },
        mounted: function () {
            var date = new Date();
            $('#selectTimeLine').psel({
                timeType: 'y',
                startTime: date.getTime(),
                endTime: date.getTime()
            });
        }
    });

    slide.$nextTick(function () {

        slide.computeWidth();
    })
    window.onresize = slide.computeWidth.bind(slide);
})