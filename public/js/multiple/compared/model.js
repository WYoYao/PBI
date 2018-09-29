$(function () {
    window.multipleCompare = new Vue({
        el: "#multipleComparePage",
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
                projectSaveObj: [], //项目集合
                timeSaveArr: [], //时间集合
                subentrySaveArr: [], //能耗模型集合
                energyModelLocalId: '', //能耗模型id
                notMatchSubentryArr: [{
                    projectName: "aaa",
                    subArrSaveList: [],
                }, {
                    projectName: "bbb",
                    subArrSaveList: [],
                }], //未匹配的分项集合
            },
            subentryTree: [], //选择分项树
            choiceProjectList: [], //选择项目列表
            downLoadBlockIsShow: false, //是否显示下载图表
            chartUnit: "kwh",
            gridRenderList: [], //报表渲染数组

            cRecordList: [], //生成的记录列表
            timeCurrObj: { //记录当前选择的时间
                index: '', //记录选择时间索引
            },

            //添加项目
            operatSate: '', //存储选择项目的操作状态

            addProjectTxt: '添加项目',

            searchContent: '', //搜索项目关键字

            showProjectTemp: false, //是否显示选择项目组件

            currProjectResult: [], //当前选中的项目数组

            //添加分项
            branchIsShow: false, //是否显示支路

            addSubentryTxt: '添加分项',

            searchSubentry: '', //搜索分项关键字

            showSubentryTemp: false, //是否显示选择分项

            currentSubentryList: [], //当前选中的分项数组

            // 未匹配的分项
            notMatchSubCurrObj: { //记录当前选择的未匹配分项
                index: "", //未匹配的分项父级索引
                cIndex: "", //子集索引
            },
            notMatchSubCurrTemp: false, //是否显示未匹配分项

            notMatchSubSearchKey: "", //未匹配关键字搜索

            notMatchSubCurrList: [], //未匹配分项选中分项数组

            //请求返回数据
            dataListSubentry: [], //图表返回数据

            noDataChartShow: true, //无数据显示
            //设置图表纵坐标
            setMax: [{
                    isSelected: true,
                    name: "默认",
                    value: "0",
                    unit: "kwh"
                },
                {
                    isSelected: false,
                    name: "自定义",
                    value: "0",
                    unit: "kwh"
                },
            ],

            setMin: [{
                    isSelected: true,
                    name: "默认",
                    value: "0",
                    unit: "kwh"
                },
                {
                    isSelected: false,
                    name: "自定义",
                    value: "0",
                    unit: "kwh"
                },
            ],

            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false, //在线说明显示

        },
        computed: {

        },
        methods: {
            tableOptionChangeFn: function (data, item) {
                var that = this;

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
            //添加项目相关
            addProjectShow: function () {
                this.showProjectTemp = true;

            },
            addProjectHide: function () {
                this.showProjectTemp = false;
            },
            addProjectCallBack: function (item) { //选择项目回调
                this.currProjectResult = item;


                this.addProjectTxt = "已选" + item.length + "个项目";
                this.searchConditionObj.projectSaveObj = item;
                this.showProjectTemp = false;
                debugger;
            },
            // confirmCb: function (list) { //添加项目回调
            //     this.currProjectResult = list;
            //     this.showProjectTemp = false;
            //     // debugger;
            // },

            addSubetryShow: function () {
                this.showSubentryTemp = true;

            },
            addSubetryHide: function () {
                this.showSubentryTemp = false;
            },
            addSubetryCallBack: function (item) { //选择分项回调
                this.currentSubentryList = item;


                this.addSubentryTxt = "已选" + item.length + "个分项";
                this.searchConditionObj.subentrySaveArr = item;
                this.showSubentryTemp = false;
            },

            addNotMatchSubentry: function (index) { //添加未匹配分项
                var that = this;
                if (!that.searchConditionObj.notMatchSubentryArr[index].hasOwnProperty("subArrSaveList")) {
                    that.searchConditionObj.notMatchSubentryArr[index]["subArrSaveList"] = [];
                }
                that.searchConditionObj.notMatchSubentryArr[index]["subArrSaveList"].push({
                    timeId: ptool.produceId(),
                    text: "请添加分项",
                    checkedSub: [],
                    branch: [

                    ]
                });
            },
            deleteNotMatchSubentry: function (info, index, cindex) { //删除添加的分项
                var that = this;
                that.searchConditionObj.notMatchSubentryArr[index]["subArrSaveList"].splice(cindex, 1);
            },
            notMatchSubentryPopShow: function (item, index, cIndex) { //显示未匹配的项目分项
                var that = this;

                //存储当前选中的分项父级索引
                that.notMatchSubCurrObj.index = index;

                //存储当前选中的分项子集索引
                that.notMatchSubCurrObj.cIndex = cIndex;

                //显示未匹配分项组件
                that.notMatchSubCurrTemp = true;

                that.notMatchSubCurrList = item.checkedSub && item.checkedSub.length > 0 ? item.checkedSub : [];

            },
            notMatchSubentryPopHide: function () { //隐藏未匹配分项选择
                var that = this;
                that.notMatchSubCurrTemp = false;
            },
            notMatchSubentryCB: function (item) { //未匹配分项回调
                var that = this;

                var _index = that.notMatchSubCurrObj.index;
                var _cIndex = that.notMatchSubCurrObj.cIndex;
                that.searchConditionObj.notMatchSubentryArr[_index]["subArrSaveList"][_cIndex].checkedSub = item;
                that.searchConditionObj.notMatchSubentryArr[_index]["subArrSaveList"][_cIndex].branch = [{
                    name: "aaa",
                    isSelected: false
                }];
                that.searchConditionObj.notMatchSubentryArr[_index]["subArrSaveList"][_cIndex].text = "已选" + item.length + "个分项";
                //存储选中分项

                that.notMatchSubCurrTemp = false;
            },
            branchIsShowFn: function () { //是否显示支路函数
                this.branchIsShow = !this.branchIsShow;
            },
            selectedBranchOptionFn: function (item) { //选中支路事件
                item.isSelected = !item.isSelected;
            },
            addTimeFn: function () { //添加时间
                var that = this;
                that.searchConditionObj.timeSaveArr.push({
                    timeId: ptool.produceId(),
                    text: "请选择时间"
                });

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
            deleteTimeFn: function (item, index) { //删除当前时间
                var that = this;
                that.searchConditionObj.timeSaveArr.splice(index, 1);
            },
            confirmCurrTime: function () { //确认选中时间
                var that = this;
                var index = that.timeCurrObj.index;
                if (index !== '') {
                    var timeDateObj = $("#choiceTime").psel();
                    var timeInfo = $("#choiceTimePop").find('.countTime').text();
                    if (timeInfo.indexOf('~') == '-1') {
                        timeDateObj['choiceType'] = 'single';
                    } else {
                        timeDateObj['choiceType'] = 'double';
                    }
                    // timeDateObj['text'] = timeInfo;
                    // that.searchConditionObj.timeSaveArr[index]['saveTimeObj'] = timeDateObj || {};
                    // that.searchConditionObj.timeSaveArr[index]['text'] = timeInfo || '';

                    var tipFn = function () {
                        $("#globalnotice").pshow({
                            text: "对比不同时间的数据需要保持时间间隔一致",
                            state: "failure"
                        });
                    }
                    //判断传入的时间格式是否与当前存在的时间格式一致
                    var checkFlag = that.checkTimeType(that.searchConditionObj.timeSaveArr, timeDateObj, tipFn);
                    if (checkFlag) {
                        multipleCompare.$set(that.searchConditionObj.timeSaveArr, index, {
                            saveTimeObj: timeDateObj,
                            text: timeInfo
                        });
                    }

                    debugger;

                }
                $("#choiceTimePop").hide();


            },
            /*
                arr : 需要验证的数据源数组
                obj : 当前选择的时间对象
                fn  : 对当前验证结果的回调函数
            */
            checkTimeType: function (arr, obj, fn) {
                if (JSON.stringify(obj) == '{}') {

                    return false;
                }
                if (arr && arr.length == 0) {
                    return true;
                } else if (!arr[0].hasOwnProperty('saveTimeObj')) {
                    return true;
                } else {
                    var checkObj = {
                        timeType: arr[0].saveTimeObj && arr[0].saveTimeObj.timeType,
                        choiceType: arr[0].saveTimeObj && arr[0].saveTimeObj.choiceType
                    }
                    if (obj.timeType != checkObj.timeType || obj.choiceType != checkObj.choiceType) {
                        if (typeof fn == 'function') {
                            fn();
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
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
            showTimerPop: function (item, index, e) { //弹出时间控件
                var that = this;

                var top = $(e.target).offset().top;
                var left = $(e.target).offset().left;
                var isShow = $("#choiceTimePop .per-calendar-con").is(":hidden");

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
            downloadChart: function () { //下载图表
                this.downLoadBlockIsShow = !this.downLoadBlockIsShow;
            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },
            getChartListFn: function (_timeList, timeType) { //获取图表请求数据
                var that = this;
                var _projectLocalIdList = that.searchConditionObj.projectSaveObj.id;
                var _energyModelLocalId = that.searchConditionObj.projectSaveObj.energyModelId;
                var _dataKind = that.tabOptionTwo.filter(function (item) {
                    return item.checked;
                })[0].code;
                var _dataType = that.tabOptionThree.filter(function (item) {
                    return item.checked;
                })[0].code;
                var queryParam = {
                    projectLocalIdList: _projectLocalIdList,
                    energyModelLocalId: _energyModelLocalId,
                    timeType: timeType,
                    dataKind: _dataKind,
                    dataType: _dataType,
                    timeList: _timeList
                };
                //获取分项数据
                multCompareController.ItemEnergyByTime(queryParam).then(function (res) {

                    that.dataListSubentry = res;
                    that.drawingChartData(res);
                    that.noDataChartShow = false;
                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    //转换右侧数据列表数据
                    setTimeout(function () {
                        if (lineChart1) {
                            that.cRecordList = that.transRecordListFn(res, lineChart1);

                        }
                    }, 0)

                });

                //获取支路数据
                multCompareController.ListBranchesForEI().then(function(res){
                    
                })

            },
            deleteRecordFn: function (item) { //删除右侧列表当前项

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
            drawingChartData: function (list) {//绘制图表
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
                if (val.projectSaveObj && val.projectSaveObj.length > 0) { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (val.timeSaveArr.length > 0 && JSON.stringify(val.timeSaveArr[0].saveTimeObj) != '{}' && val.timeSaveArr[0].text != '请选择时间') {

                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId != '') { //分项id不为空
                            var paramList = [];
                            for (var i = 0, time = val.timeSaveArr; i < time.length; i++) {
                                if (time[i].text != "请选择时间") {
                                    paramList.push({
                                        timeFrom: new Date(time[i].saveTimeObj.startTime).format("yyyy-MM-dd hh:mm:ss"),
                                        timeTo: new Date(time[i].saveTimeObj.endTime).format("yyyy-MM-dd hh:mm:ss"),
                                    });
                                }
                            }
                            that.qParamList = paramList;
                            var timeType = ptool.formatGranularityToJava($("#time"));
                            //获取图表数据请求
                            that.getChartListFn(paramList, timeType);

                        }

                    }
                }
            },
        },
        watch: {

        },
        beforeMount() {

        },
        mounted: function () {
            var that = this;
            //获取多项目分项树
            multCompareController.GetEnergyModelTreeOfStory({}).then(function (res) {
                that.subentryTree = that.energyModelTree(res[0].energyModelTree, '-1');
                that.searchConditionObj.energyModelLocalId = res[0].energyModelCode;
                console.log(that.subentryTree);
            })


            
            that.cRecordList = []
        }
    });

})