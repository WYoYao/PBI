// 工具函数集合
var tools = {
    /* id生成器 */
    generatorId: (function () {
        var basic = 'idName';
        var num = 0;
        return function (idName) {
            return idName ? idName : basic + num++;
        }
    })(),
    /* 随机数生成器 */
    generatorRandom: function (start, end, digit) { // 最小值 最大值 保留位数
        var val = Math.random() * (end - start) + start;
        val = digit ? Number(val.toFixed(digit)) : val;
        return val;
    }
}

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
                unit: "kwh"
            }, {
                isSelected: false,
                name: "自定义",
                value: "0",
                unit: "kwh"
            },],

            setMin: [{
                isSelected: true,
                name: "默认",
                value: "0",
                unit: "kwh"
            }, {
                isSelected: false,
                name: "自定义",
                value: "0",
                unit: "kwh"
            },],

            noDataChartShow: true, //无数据展示

            scChartShow: false, //是否显示报表

            scReportShow: true, //是否显示表格

            downLoadBlockIsShow: false, //是否显示下载图表


            columnConfigData: { // 柱状图配置
                text_title: '这是一个标题',
                series: [{
                    name: '功耗',
                    data: [],
                    color: '#02A9D1',
                    pointWidth: 92,
                }]
            },

            gridRenderList: [],//表格列表数据
            //顶部筛选条件
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
                code: 1,
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
                    code: 0,
                }], //计量
                unit: [{
                    name: "能耗",
                    code: 0,
                }], //单位
                dimensionality: [{
                    name: "滑动按月",
                    code: 0,
                }], //区分维度
                calculate: [], //数值
            },

            onlineExplainFlag: false, //是否显示在线提示信息

            energyPointList: [],//能量拐点列表

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
                this.projects = item;
                this.modelids = item1;
                this.showEnergyModel = false;
                this.searchConditionObj.projectSaveObj = {
                    name: item[0].projectName,
                    id: item[0].projectId,
                    modelName: item1[0].energyModelName,
                    energyModelId: item1[0].energyModelId
                }
                this.addProjectTxt = item[0].projectName + '>' + item1[0].energyModelName;

                //确认选择项目时，重置已选择分项
                this.addSubentryTxt = "请选择分项";
                this.currentSubentryList = [];
                this.searchConditionObj.subentrySaveArr = [];

                this.subentryDisabled = true; //添加分项启用

            },

            //添加时间相关
            confirmCurrTime: function () {
                var that = this;
                var time = $("#selectTimeLine").psel();
                that.searchConditionObj.timeSaveArr = [time];

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
            addSubentryFn: function (item) { //添加分项
                var that = this;

                that.searchConditionObj.subentrySaveArr = [{
                    obj_id: arguments[0].obj_id,
                    obj_name: arguments[0].obj_name
                }];

            },
            addSubetryShow: function () { //选择分项弹出框
                var that = this;
                if (!this.subentryDisabled) {
                    return;
                }

                //获取分项树请求
                var queryParam = {
                    buildingLocalId: that.searchConditionObj.projectSaveObj.id,
                    energyModelLocalId: that.searchConditionObj.projectSaveObj.energyModelId
                }
                singleCompareController.GetEnergyModelTreeOfBuilding(queryParam).then(function (res) {

                    that.subentryTree = _.clone(res);
                    that.subentryTree = that.energyModelTree(that.subentryTree, -1);
                    that.showSubentryTemp = true;

                })

            },

            setYAxisShowFn: function () { //显示设置Y轴坐标弹出框
                this.setYAxisShow = true;
            },
            setYAxisHideFn: function () { //隐藏设置Y轴坐标弹出框
                this.setYAxisShow = false;
            },
            setYdataFn: function (item1, item2) { //确认设置Y轴坐标

                this.setYAxisShow = false;
            },
            drawingChartData: function (obj) { //绘制柱状图
                var that = this;
                var arr = [];
                arr = obj[0].dataList.map(function (item) {
                    return {
                        x: item.timeSpan,
                        y: item.data
                    }
                });
                that.columnConfigData.series[0].data = JSON.parse(JSON.stringify(arr));
                // debugger;
                that.columnConfigData.series[0].name = "xxx";
                that.columnConfigData.series[0].color = "#02A9D1";
                that.columnConfigData.series[0].pointWidth = 80;

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
                // debugger
                this.iscombox = ((this.$refs.tab.clientWidth - this.$refs.vcheckbox1.getWidth() - 84 - this.$refs.vcheckbox2.getWidth() - this.$refs.cobxs1.getWidth() - this.$refs.cobxs2.getWidth() - this.$refs.cobxs3.getWidth() - 20) < 0);
            },
            createHandlerClick: function (type) { //导航选中选项
                var that = this;
                // 
                // 
                return function (arr) {
                    debugger
                    that.query[type] = arr;
                    that.AssemblyParameterList(that.query);
                }

            },
            transGridRenderListFn: function (arr) { //后台返回的数据格式转换成表格渲染数据格式
                var that = this;
                var arr1 = [];

                var energyItemLocalId = that.searchConditionObj.subentrySaveArr[0].localId;
                arr.forEach(function (item) {
                    arr1.push({
                        dataListArr: [{ content: item.dataList, name: energyItemLocalId }]
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
                            name: info.name
                        });

                        info.content.forEach(function (c, i) {
                            item.renderCon[i] = item.renderCon[i] || [];
                            item.renderCon[i].push(info.content[i].data);
                            if (index == 0) {
                                item.renderCon[i].unshift(info.time[i]);
                            }

                        })

                    })
                    item.renderTit.unshift({
                        name: "时间"
                    });
                })
                // debugger
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
                if (val.projectSaveObj.hasOwnProperty('id') && val.projectSaveObj.id != '') { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (val.timeSaveArr.length > 0) {

                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].obj_id != '') { //分项id不为空
                            var paramList = [];
                            var project = val.projectSaveObj;
                            for (var i = 0, time = val.timeSaveArr; i < time.length; i++) {
                                for (var j = 0, subentry = val.subentrySaveArr; j < subentry.length; j++) {
                                    if (time[i] && subentry[j] && time[i].text != "请选择时间") {
                                        // new Date(1536681599000).format("yyyy-MM-dd hh:mm:ss")  //时间戳转换
                                        paramList.push({
                                            // time: time[i],
                                            // project: project,
                                            energyItemLocalId: subentry[j].id,
                                            timeFrom: new Date(time[i].startTime).format("yyyy-MM-dd hh:mm:ss"),
                                            timeTo: new Date(time[i].endTime).format("yyyy-MM-dd hh:mm:ss"),
                                        });

                                    }
                                }
                            }
                            that.qParamList = paramList;
                            debugger;
                            var timeType = ptool.formatGranularityToJava($("#selectTimeLine"));
                            //获取图表数据请求
                            that.getChartListFn(paramList, timeType);

                        }

                    } else {

                    }
                }

            },
            getChartListFn: function (paramList, timeType, dataKind, dataType) { //获取图表请求数据
                var that = this;
                var _buildingLocalId = that.searchConditionObj.projectSaveObj.id;
                var _energyModelLocalId = that.searchConditionObj.projectSaveObj.energyModelId;
                var _dataKind = dataKind || 1;
                var _dataType = dataType || 1;
                var queryParam = {
                    buildingLocalId: _buildingLocalId,
                    energyModelLocalId: _energyModelLocalId,
                    timeType: timeType, //查询 按天 or 月
                    dataKind: _dataKind, //能耗总量
                    dataType: _dataType, //能耗  费用
                    paramList: paramList
                };

                singleSlideController.GetItemSlidingEnergyByTime(queryParam).then(function (res) {

                    that.dataListSubentry = res;
                    that.drawingChartData(res);
                    that.noDataChartShow = false;
                    that.scChartShow = true;
                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    debugger;
                    //转换右侧数据列表数据

                    //存储右侧 显示列表数据
                    that.energyPointList = res[0].inflectionPoints;
                    debugger;


                });

            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },
        },
        mounted: function () {
            var that = this;
            that.subentryTree = [{
                obj_id: "xxxx",
                obj_name: "建筑总能耗",
                child: [{
                    obj_id: "xxxx1",
                    obj_name: "动力用电",
                    child: [{
                        obj_id: "xxxx11",
                        obj_name: "电梯",
                        child: [{
                            obj_id: "xxx111",
                            obj_name: "自动扶梯",
                        }]
                    }]
                }, {
                    obj_id: "xxxx2",
                    obj_name: "动力用电2",
                    child: [{
                        obj_id: "xxxx22",
                        obj_name: "电梯22",
                        child: [{
                            obj_id: "xxx222",
                            obj_name: "自动扶梯222",
                        }]
                    }]
                },]
            }];

        },
        watch: {

        }

    });

    slide.$nextTick(function () {

        slide.computeWidth();
    })
    window.onresize = slide.computeWidth.bind(slide);
})