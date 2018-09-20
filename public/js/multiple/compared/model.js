$(function () {
    window.multipleCompare = new Vue({
        el: "#multipleComparePage",
        data: {
            searchConditionObj: { //选择条件集合，包括选择项目，选择时间，选择分项
                projectSaveObj: {}, //项目集合
                timeSaveArr: [

                ], //时间集合
                subentrySaveArr: [], //分项集合

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
            reportFromTitle: [], //表格表头
            reportFromContent: [], //表格内容

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
            addProjectShow: function () {
                this.showProjectTemp = true;
                console.log(this.currProjectResult);
            },
            addProjectHide: function () {
                this.showProjectTemp = false;
            },
            addProjectCallBack: function (item) { //选择项目回调
                this.currProjectResult = item;

                console.log(this.currProjectResult);
                this.addProjectTxt = "已选" + item.length + "个分项";
                this.searchConditionObj.projectSaveObj = item;
                this.showProjectTemp = false;
                debugger;
            },
            // confirmCb: function (list) { //添加项目回调
            //     this.currProjectResult = list;
            //     this.showProjectTemp = false;
            //     console.log(list, list.length, this.currProjectResult);
            //     // debugger;
            // },

            addSubetryShow: function () {
                this.showSubentryTemp = true;
                console.log(this.currentSubentryList);
            },
            addSubetryHide: function () {
                this.showSubentryTemp = false;
            },
            addSubetryCallBack: function (item) { //选择分项回调
                this.currentSubentryList = item;

                console.log(this.currentSubentryList);
                this.addSubentryTxt = "已选" + item.length + "个项目";
                this.searchConditionObj.projectSaveObj = item;
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
                console.log(item, index, cIndex);
                //存储当前选中的分项父级索引
                that.notMatchSubCurrObj.index = index;

                //存储当前选中的分项子集索引
                that.notMatchSubCurrObj.cIndex = cIndex;

                //显示未匹配分项组件
                that.notMatchSubCurrTemp = true;

                that.notMatchSubCurrList = item.checkedSub && item.checkedSub.length > 0 ? item.checkedSub : [];
                console.log(that.notMatchSubCurrList)
            },
            notMatchSubentryPopHide: function () { //隐藏未匹配分项选择
                var that = this;
                that.notMatchSubCurrTemp = false;
            },
            notMatchSubentryCB: function (item) { //未匹配分项回调
                var that = this;
                console.log(item);
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
                console.log('T+1');
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
            deleteTimeFn: function (item, index) { //删除当前时间
                var that = this;
                that.searchConditionObj.timeSaveArr.splice(index, 1);
            },
            // addSubentryFn: function (item) { //添加分项
            //     var that = this;
            //     console.log(arguments);
            //     that.searchConditionObj.subentrySaveArr = [{
            //         obj_id: arguments[0].obj_id,
            //         obj_name: arguments[0].obj_name
            //     }];
            //     console.log('添加分项');
            // },
            confirmCurrTime: function () { //确认选中时间
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
                        multipleCompare.$set(that.searchConditionObj.timeSaveArr, index, {
                            saveTimeObj: timeDateObj,
                            text: timeInfo
                        });
                    }

                    debugger;

                }
                $("#choiceTimePop").hide();
                console.log($("#choiceTime").psel());

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
            confirmCommitFn: function () { //确定生成报表
                console.log("sc")
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
                multCompareController.ItemEnergyByTime(queryParam).then(function (res) {
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
            drawingChartData: function (list) {
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

        },
        beforeMount() {

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
                }, ]
            }];

            // 画图
            // that.drawingChartData();

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

            that.cRecordList = [{
                    time: {
                        st: "2018.8.8",
                        et: "2018.8.8"
                    },
                    value: {
                        number: "111",
                        unit: "kwh"
                    },
                    subentry: {
                        obj_name: "暖通空调",
                        obj_id: "aaa"
                    },
                    base: {
                        width: "20%",
                        color: "#ff6666"
                    },
                },
                {
                    time: {
                        st: "2018.8.8",
                        et: "2018.8.8"
                    },
                    value: {
                        number: "111",
                        unit: "kwh"
                    },
                    subentry: {
                        obj_name: "暖通空调",
                        obj_id: "aaa"
                    },
                    base: {
                        width: "60%",
                        color: "#d9e2e8"
                    },
                },
                {
                    time: {
                        st: "2018.8.8",
                        et: "2018.8.8"
                    },
                    value: {
                        number: "111",
                        unit: "kwh"
                    },
                    subentry: {
                        obj_name: "暖通空调",
                        obj_id: "aaa"
                    },
                    base: {
                        width: "80%",
                        color: "#ddd111"
                    },
                },

            ]
        }
    });

})