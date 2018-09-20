$(function () {
    window.singleCompare = new Vue({
        el: "#singleComparePage",
        data: {
            tabOptionTwo: [ //选项2
                {
                    name: "总量",
                    checked: true,
                    code: "1"
                },
                {
                    name: "单平米",
                    checked: false,
                    code: "2"
                }
            ],
            tabOptionThree: [ //选项3
                {
                    name: "能耗",
                    checked: true,
                    code: "1",
                }, {
                    name: "费用",
                    checked: false,
                    code: "2",
                }, {
                    name: "碳排放量",
                    checked: false,
                    code: "3",
                }, {
                    name: "标煤",
                    checked: false,
                    code: "4",
                },

            ],
            scChartShow: false, //是否显示图表
            scReportShow: false, //是否显示报表
            searchConditionObj: { //选择条件集合，包括选择项目，选择时间，选择分项
                projectSaveObj: {}, //项目集合
                timeSaveArr: [

                ], //时间集合
                subentrySaveArr: [], //分项集合
            },
            subentryTree: [], //选择分项树
            downLoadBlockIsShow: false, //是否显示下载图表
            chartUnit: "kwh",

            gridRenderList: [], //报表渲染数组

            cRecordList: [], //生成的记录列表

            qParamList: [], //查询图表记录参数

            timeCurrObj: { //记录当前选择的时间
                index: '', //记录选择时间索引
            },
            showEnergyModel: false, //是否显示选择项目模板
            projects: [], //已选的项目
            modelids: [], //已选的能耗模型
            addProjectTxt: "请选择项目", //已选项目展示

            //添加分项
            subentryDisabled: false, //是否禁用添加分项

            addSubentryTxt: '请选择分项',

            searchSubentry: '', //搜索分项关键字

            showSubentryTemp: false, //是否显示选择分项

            currentSubentryList: [], //当前选中的分项数组

            //请求返回数据
            dataListSubentry: [], //图表返回数据

            noDataChartShow: true, //无数据显示

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
            }, ],

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
            }, ],

            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false, //在线说明显示

        },
        computed: {

        },
        methods: {
            tableOptionChangeFn: function (data, item) {
                var that = this;
                // console.log($(e.target));
                if (data && data.length > 0) {
                    data.forEach(function (x) {
                        x.checked = false;
                        if (x.code == item.code) {
                            x.checked = true;
                        }
                    })
                }
                var op = {};
                op['two'] = that.tabOptionTwo.filter(function (x) {
                    return x.checked
                });
                op['three'] = that.tabOptionThree.filter(function (x) {
                    return x.checked
                });
                var timeType = ptool.formatGranularityToJava($("#time"));
                if (that.qParamList && that.qParamList.length > 0 && timeType) {
                    that.getChartListFn(that.qParamList, timeType);
                }
                console.log(op);

            },
            showChatFn: function () { //显示图表
                if (!$("#reportId").psel()) {
                    $("#chartId").psel(true);
                } else {
                    this.scChartShow = !this.scChartShow;
                }

                // debugger;
            },
            showReportFn: function () { //显示报表
                if (!$("#chartId").psel()) {
                    $("#reportId").psel(true);
                } else {
                    this.scReportShow = !this.scReportShow;
                }

            },
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
                console.log(this.searchConditionObj.projectSaveObj);
            },
            addProjectFn: function () { //添加项目
                this.searchConditionObj.projectSaveObj = {
                    name: "项目1",
                    id: "project1"
                }
            },
            addTimeFn: function () { //添加时间操作
                var that = this;
                that.searchConditionObj.timeSaveArr.push({
                    timeId: ptool.produceId(),
                    text: "请选择时间",
                    type: "default"
                });
                console.log('T+1');
            },
            deleteTimeFn: function (item, index) { //删除当前时间
                var that = this;
                that.searchConditionObj.timeSaveArr.splice(index, 1);
            },
            addSubentryFn: function (item) { //添加分项
                var that = this;
                console.log(arguments);
                that.searchConditionObj.subentrySaveArr = [{
                    obj_id: arguments[0].obj_id,
                    obj_name: arguments[0].obj_name
                }];
                console.log('添加分项');
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
                    console.log(that.subentryTree);
                })
                console.log(this.currentSubentryList);
            },
            addSubetryHide: function () {
                this.showSubentryTemp = false;
            },
            addSubetryCallBack: function (item) { //选择分项回调
                this.currentSubentryList = item;

                console.log(this.currentSubentryList);
                this.addSubentryTxt = "已选" + item.length + "个分项";
                this.searchConditionObj.subentrySaveArr = item;
                this.showSubentryTemp = false;
            },
            confirmCurrTime: function () { //确认添加时间
                var that = this;
                var index = that.timeCurrObj.index;
                if (index !== '') {
                    var timeDateObj = $("#choiceTime").psel();
                    var timeInfo = $("#choiceTimePop").find('.counttime').text();
                    if (timeInfo.indexOf('~') == '-1') {
                        timeDateObj['choiceType'] = 'single';
                    } else {
                        timeDateObj['choiceType'] = 'double';
                    }
                    // timeDateObj['text'] = timeInfo;
                    // that.searchConditionObj.timeSaveArr[index]['saveTimeObj'] = timeDateObj || {};
                    // that.searchConditionObj.timeSaveArr[index]['text'] = timeInfo || '';
                    console.log(timeDateObj);
                    var tipFn = function () {
                        $("#globalnotice").pshow({
                            text: "对比不同时间的数据需要保持时间间隔一致",
                            state: "failure"
                        });
                    }
                    //判断传入的时间格式是否与当前存在的时间格式一致
                    var checkFlag = that.checkTimeType(that.searchConditionObj.timeSaveArr, timeDateObj, tipFn);
                    if (checkFlag) {
                        singleCompare.$set(that.searchConditionObj.timeSaveArr, index, {
                            saveTimeObj: timeDateObj,
                            text: timeInfo
                        });
                    }

                    // debugger;

                }
                $("#choiceTimePop").hide();
                console.log($("#choiceTime").psel());

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

            /*
                arr : 需要验证的数据源数组
                obj : 当前选择的时间对象
                fn  : 对当前验证结果的回调函数
            */
            checkTimeType: function (arr, obj, fn) {
                if (JSON.stringify(obj) == '{}') {
                    console.log('传入对象是空对象');
                    return false;
                }
                if (arr && arr.length == 0 || arr.length == 1) {
                    return true;
                } else if (!arr[0].hasOwnProperty('saveTimeObj')) {
                    return true;
                } else {
                    var timeDiff = arr[0].saveTimeObj.endTime - arr[0].saveTimeObj.startTime;
                    var currTimeDiff = obj.endTime - obj.startTime;
                    var checkObj = {
                        timeType: arr[0].saveTimeObj && arr[0].saveTimeObj.timeType,
                        choiceType: arr[0].saveTimeObj && arr[0].saveTimeObj.choiceType
                    }
                    if (obj.timeType != checkObj.timeType || obj.choiceType != checkObj.choiceType || timeDiff != currTimeDiff) {
                        if (typeof fn == 'function') {
                            fn();
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            getChartListFn: function (paramList, timeType) { //获取图表请求数据
                var that = this;
                var _buildingLocalId = that.searchConditionObj.projectSaveObj.id;
                var _energyModelLocalId = that.searchConditionObj.projectSaveObj.energyModelId;
                var _dataKind = that.tabOptionTwo.filter(function (item) {
                    return item.checked;
                })[0].code;
                var _dataType = that.tabOptionThree.filter(function (item) {
                    return item.checked;
                })[0].code;
                var queryParam = {
                    buildingLocalId: _buildingLocalId,
                    energyModelLocalId: _energyModelLocalId,
                    timeType: timeType,
                    dataKind: _dataKind,
                    dataType: _dataType,
                    paramList: paramList
                };
                console.log(queryParam);
                singleCompareController.ItemEnergyByTime(queryParam).then(function (res) {
                    console.log(res);
                    that.dataListSubentry = res;
                    that.drawingChartData(res);
                    that.noDataChartShow = false;
                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    //转换右侧数据列表数据
                    setTimeout(function () {
                        if (lineChart1) {
                            that.cRecordList = that.transRecordListFn(res, lineChart1);
                            console.log(that.cRecordList);
                        }
                    }, 0)

                });

            },
            transRecordListFn: function (arr, lineChart1) { //后台返回数据转换记录列表数据格式
                // listData ：[{
                //     time:{st:"",et:""},//时间
                //     value:{number:"",unit:""},//数值
                //     subentry:{obj_name:"",obj_id:""},//分项
                //     base:{width:"",color:""},//基础设置
                // }]
                var colorArr = lineChart1.series.map(function (item) {
                    return item.color;
                });
                var numArr = arr.map(function (item) {
                    var num = item.data.reduce(function (n, info) {
                        n += Number(info.data);
                        return n;
                    }, 0)
                    return num;
                });
                console.log(colorArr, numArr);
                var arr1 = [];
                arr.forEach(function (item, index) {
                    arr1.push({
                        time: {
                            st: item.timeFrom,
                            et: item.timeTo
                        },
                        value: {
                            num: numArr[index],
                            unit: "kwh"
                        },
                        subentry: {
                            energyItemLocalName: item.energyItemLocalId,
                            energyItemLocalId: item.energyItemLocalId
                        },
                        base: {
                            width: "140",
                            color: colorArr[index]
                        }
                    });
                })
                return arr1;
            },
            deleteRecordFn: function (item) { //删除右侧列表当前项
                console.log(item);
                var that = this;
                var itemLocalId = item.subentry.energyItemLocalId;
                var res = [];
                that.dataListSubentry.forEach(function (info) {
                    if (info.energyItemLocalId != itemLocalId) {
                        res.push(info);
                    }
                });
                that.dataListSubentry = _.clone(res);
                if (res && res.length > 0) {
                    that.drawingChartData(res);
                    that.gridRenderList = that.transGridRenderListFn(res);
                    that.cRecordList = that.transRecordListFn(res, lineChart1);
                } else {
                    that.gridRenderList = [];
                    that.scChartShow = false;
                    that.noDataChartShow = true;
                    that.cRecordList = [];
                }

                console.log(that.dataListSubentry, itemLocalId);
            },
            transGridRenderListFn: function (arr) { //后台返回的数据格式转换成表格渲染数据格式
                var arr1 = [];
                arr.forEach(function (item) {
                    if (arr1.length == 0) {
                        arr1.push({
                            energyItemLocalId: item.energyItemLocalId,
                            timeFrom: item.timeFrom,
                            timeTo: item.timeTo,
                            dataListArr: [{
                                name: item.energyItemLocalId,
                                content: item.dataList
                            }]
                        });
                    } else if (arr1.length > 0) {
                        var flag = false;
                        arr1.forEach(function (info) {
                            if (item.timeFrom == info.timeFrom && item.timeTo == info.timeTo) {
                                flag = true;
                                info.dataListArr.push({
                                    name: item.energyItemLocalId,
                                    content: item.dataList
                                });
                            }
                        })
                        if (!flag) {
                            arr1.push({
                                energyItemLocalId: item.energyItemLocalId,
                                timeFrom: item.timeFrom,
                                timeTo: item.timeTo,
                                dataListArr: [{
                                    name: item.energyItemLocalId,
                                    content: item.dataList
                                }]
                            });
                        }
                    }

                })
                arr1.forEach(function (item) {
                    item.dataListArr.forEach(function (info) {
                        info.time = info.content.map(function (t) {
                            return t.time;
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

                return arr1;
            },
            setYAxisShowFn: function () { //显示设置Y轴坐标弹出框
                this.setYAxisShow = true;
            },
            setYAxisHideFn: function () { //隐藏设置Y轴坐标弹出框
                this.setYAxisShow = false;
            },
            setYdataFn: function (item1, item2) { //确认设置Y轴坐标
                console.log(item1, item2);
                this.setYAxisShow = false;
            },
            showTimerPop: function (item, index, e) { //弹出时间控件
                var that = this;
                console.log(item);
                var top = $(e.target).offset().top;
                var left = $(e.target).offset().left;
                var isShow = $("#choiceTimePop .per-calendar-con").is(":hidden");
                console.log(isShow);
                if (isShow) {
                    $("#choiceTimePop").css({
                        "left": left,
                        "top": top
                    }).show();
                } else {
                    $("#choiceTimePop").hide();
                }
                //存储当前选中的时间索引
                that.timeCurrObj.index = index;

                console.log($(e.target).offset())
            },
            downloadChart: function () { //下载图表
                this.downLoadBlockIsShow = !this.downLoadBlockIsShow;
            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },
            drawingChartData: function (list) { //绘制线图
                var that = this;
                if (list && list.length > 0) {
                    that.scChartShow = true;
                    var _list = _.clone(list);
                    _list.forEach(function (item) {
                        item.cursor = 'pointer',
                            item.data = item.dataList.map(function (info) {
                                info.x = info.time;
                                info.y = Number(info.data);
                                info.unit = "kwh";
                                return info;
                            });
                        item.name = item.id || '项目A-暖通空调1';
                    })
                    console.log(_list);
                    var series = _list;
                    var chart1 = pchart.initLine({
                        yAxis: {
                            // plotLines: [{//标识线
                            //     color: '#cacaca',
                            //     width: 2,
                            //     value: 220,
                            //     dashStyle: 'LongDash',
                            //     label: {
                            //         text: '最大值',
                            //         align: 'right',
                            //         x: -10
                            //     }
                            // }]
                        },
                        container: 'divLineChart',
                        series: series,
                        legend: false,
                        plotOptions: {
                            series: {
                                animation: {
                                    duration: 2000
                                }
                            },

                        },

                    });
                    window.lineChart1 = chart1;
                    return chart1;
                } else {
                    that.scChartShow = false;
                    that.noDataChartShow = true;
                }
            },
            confirmSearchListFn: function () { //根据选择条件生成表格
                var that = this;
                var val = that.searchConditionObj;
                if (val.projectSaveObj.hasOwnProperty('id') && val.projectSaveObj.id != '') { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (val.timeSaveArr.length > 0 && JSON.stringify(val.timeSaveArr[0].saveTimeObj) != '{}' && val.timeSaveArr[0].text != '请选择时间') {

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
                                            timeFrom: new Date(time[i].saveTimeObj.startTime).format("yyyy-MM-dd hh:mm:ss"),
                                            timeTo: new Date(time[i].saveTimeObj.endTime).format("yyyy-MM-dd hh:mm:ss"),
                                            // value: {
                                            //     number: "111",
                                            //     unit: "kwh"
                                            // },
                                            // base: {
                                            //     width: "60%",
                                            //     color: "#d9e2e8"
                                            // }
                                        });

                                    }
                                }
                            }
                            that.qParamList = paramList;
                            var timeType = ptool.formatGranularityToJava($("#time"));
                            //获取图表数据请求
                            that.getChartListFn(paramList, timeType);
                            console.log(paramList);
                        }

                    }
                }
            },
        },
        watch: {
            searchConditionObj: {


            }
        },
        mounted: function () {
            var that = this;

            // 画图
            // that.drawingChartData();

            that.cRecordList = []
        }
    });

})