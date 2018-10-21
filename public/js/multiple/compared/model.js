$(function () {
    window.multipleCompare = new Vue({
        el: "#multipleComparePage",
        data: {
            tabOptionTwo: [ //选项2
                {
                    name: "总量",
                    checked: true,
                    code: 1
                },
                {
                    name: "单平米",
                    checked: false,
                    code: 2
                }
            ],
            tabOptionTwoSel: null,
            tabOptionThree: [ //选项3
                {
                    name: "能耗",
                    checked: true,
                    code: 1,
                }, {
                    name: "费用",
                    checked: false,
                    code: 2,
                }, {
                    name: "碳排放量",
                    checked: false,
                    code: 3,
                }, {
                    name: "标煤",
                    checked: false,
                    code: 4,
                },

            ],
            tabOptionThreeSel: null,
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

            subentryArr: [],//选择分项数组

            choiceProjectList: [], //选择项目列表
            downLoadBlockIsShow: false, //是否显示下载图表
            chartUnit: "kWh",
            gridRenderList: [], //报表渲染数组

            currSelTimeArr: [],//当前选择的时间数组

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
                unit: "kWh"
            },
            {
                isSelected: false,
                name: "自定义",
                value: "0",
                unit: "kWh"
            },
            ],

            setMin: [{
                isSelected: true,
                name: "默认",
                value: "0",
                unit: "kWh"
            },
            {
                isSelected: false,
                name: "自定义",
                value: "0",
                unit: "kWh"
            },
            ],

            max: "0",

            min: "0",

            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false, //在线说明显示

        },
        computed: {

        },
        methods: {
            setChartRegionSize: function () {
                Vue.nextTick(function () {
                    //20 报表和图表的间距 40 图表的单位区域
                    var heightStr;
                    if (multipleCompare.scReportShow) {
                        var height = document.getElementById('scReportFrom').clientHeight + 20 + 40;
                        heightStr = 'calc(100% - ' + height + 'px)';
                    } else
                        heightStr = 'calc(100% - 40px)';
                    $('#divLineChart').css({ height: heightStr });
                    biTool.setChartSize(multipleCompare.lineChart1);
                });
            },
            timeClick: function (arr) {//确认选中时间
                this.currSelTimeArr = arr;
            },
            checkTimeArrtype: function () {//查询数据时验证对比时间是否合法
                var arr = this.currSelTimeArr;
                var flag = false;
                if (arr.length == 1) {
                    flag = true;
                } else if (arr.length > 1) {
                    arr.forEach(function (item) {
                        item.diffTime = item.endTime - item.startTime;
                    });
                    var type = arr[0].timeType;
                    var diff = arr[0].diffTime;
                    var typeResult = arr.every(function (d) {
                        return d.timeType == type;
                    });
                    var diffResult = arr.every(function (type) {
                        return type.diffTime == diff;
                    });
                    flag = typeResult && diffResult;
                }
                return flag;
            },
            tableOptionTwoChangeFn: function (item) {//选项2切换
                var that = this;
                that.tabOptionTwoSel = item;
                that.tabOptionTwo.forEach(function (x) {
                    x.checked = false;
                    if (x.code == item.code) {
                        x.checked = true;
                    }
                });
            },
            tableOptionThreeChangeFn: function (item) {//选项3切换
                var that = this;
                that.tabOptionThreeSel = item;
                that.tabOptionThree.forEach(function (x) {
                    x.checked = false;
                    if (x.code == item.code) {
                        x.checked = true;
                    }
                });
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
                this.scReportShow = !this.scReportShow;
                this.setChartRegionSize();
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
            setYdataFn: function (max, min) { //确认设置Y轴坐标
                multipleCompare.lineChart1.yAxis[0].setExtremes(min, max);
            },
            deleteTimeFn: function (item, index) { //删除当前时间
                var that = this;
                that.searchConditionObj.timeSaveArr.splice(index, 1);
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
                var timeType = multipleCompare.lineChart1.getXTimeType();
                arr.forEach(function (item) {
                    if (arr1.length == 0) {
                        arr1.push({
                            energyItemLocalId: item.energyItemLocalId,
                            timeFrom: item.timeFrom,
                            timeTo: item.timeTo,
                            dataListArr: [{
                                // name: multipleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
                                name: item.name,
                                content: item.dataList
                            }]
                        });
                    } else if (arr1.length > 0) {
                        var flag = false;
                        arr1.forEach(function (info) {
                            if (item.timeFrom == info.timeFrom && item.timeTo == info.timeTo) {
                                flag = true;
                                info.dataListArr.push({
                                    // name: multipleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
                                    name: item.name,
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
                                    // name: multipleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
                                    name: item.name,
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

                var that = this;
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
                                item.renderCon[i].unshift(ptool.formatStrByTimeTypeToNormal({ value: info.time[i], timeType: timeType }));
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
                that.chartTimeType = timeType;
                var _projectLocalIdList = that.searchConditionObj.projectSaveObj.map(function (item) {
                    return item.projectLocalID;
                });
                var _energyModelLocalId = that.searchConditionObj.energyModelLocalId;

                var _energyItemLocalIdList = that.searchConditionObj.subentrySaveArr.map(function (item) {
                    return item.localId;
                });
                var _dataKind = that.tabOptionTwo.filter(function (item) {
                    return item.checked;
                })[0].code;
                var _dataType = that.tabOptionThree.filter(function (item) {
                    return item.checked;
                })[0].code;
                var queryParam = {
                    projectLocalIdList: _projectLocalIdList,
                    energyItemLocalIdList: _energyItemLocalIdList,
                    energyModelLocalId: _energyModelLocalId,
                    timeType: Number(timeType),
                    dataKind: _dataKind,
                    dataType: _dataType,
                    timeList: _timeList
                };
                //获取分项数据
                multCompareController.GetMutiCompareData(queryParam).then(function (res) {

                    res = res || [];
                    res.forEach(function (curr) {
                        curr.lid = ptool.produceId();
                        curr.avgData = Math.toFixed({
                            value: curr.avgData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        curr.maxData = Math.toFixed({
                            value: curr.maxData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        curr.midData = Math.toFixed({
                            value: curr.midData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        curr.minData = Math.toFixed({
                            value: curr.minData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        curr.sumData = Math.toFixed({
                            value: curr.sumData,
                            isByInt: true,
                            isToSpecial: false
                        });
                        (curr.dataList || []).forEach(function (currDataObj) {
                            currDataObj.data = Math.toFixed({
                                value: currDataObj.data,
                                isByInt: true,
                                isToSpecial: false
                            });
                        });
                    });

                    that.noDataChartShow = false;
                    that.dataListSubentry = res;
                    that.drawingChartData(res);

                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    //转换右侧数据列表数据
                    that.cRecordList = that.transRecordListFn(res);
                    if (that.scReportShow)
                        that.setChartRegionSize();

                });

                //获取支路数据
                // multCompareController.ListBranchesForEI().then(function(res){

                // })

            },

            energyIdTransEnergyNameFn: function (id) {//通过分项id查询分项名称
                var that = this;
                var arr = that.subentryArr[0].energyModelTree || [];
                var name = ""
                arr.forEach(function (item) {
                    if (item.localId == id) {
                        name = item.name;
                    }
                })
                return name || '';
            },

            projectIdTransProjectNameFn: function (id) {//通过项目id查询项目名称
                var that = this;
                var arr = window.multProjectList || [];
                var name = "";
                arr.forEach(function (item) {
                    if (item.projectLocalID == id) {
                        name = item.projectLocalName;
                    }
                })
                return name || '';
            },
            deleteRecordFn: function (item) { //删除右侧列表当前项
                multipleCompare.lineChart1.removeSeries(item.index);
                var list = JSON.parse(JSON.stringify(this.cRecordList));
                list.splice(item.index, 1);

                var maxData = 0;
                list.forEach(function (curr, index) {
                    curr.index = index;
                    maxData = Math.max(curr.value.num, maxData);
                });

                list.forEach(function (item, index) {
                    var width = (Math.multiplication(Math.division(item.value.num, maxData), 100) || 0) + '%';
                    item.base.width = width;
                });

                this.cRecordList = list;
            },
            transRecordListFn: function (arr) { //后台返回数据转换记录列表数据格式
                var colorArr = multipleCompare.lineChart1.series.map(function (item) {
                    return item.color;
                });

                var maxData = 0;
                arr.forEach(function (item, index) {
                    maxData = Math.max(item.sumData, maxData);
                });

                var arr1 = [];
                var arrLength = arr.length;
                arr.forEach(function (item, index) {
                    var timeType = multipleCompare.lineChart1.getXTimeType();
                    var tf = ptool.formatStrByTimeTypeToNormal({ value: item.timeFrom, timeType: timeType });
                    var tempDate = new Date(item.timeTo);
                    tempDate.setDate(tempDate.getDate() - 1);
                    tempDate.setHours(23);
                    tempDate.setMinutes(59);
                    tempDate.setSeconds(59);
                    var tt = ptool.formatStrByTimeTypeToNormal({ value: tempDate.getTime(), timeType: timeType });
                    var width = arrLength == 1 ? '0%' : (Math.multiplication(Math.division(item.sumData, maxData), 100) || 0) + '%';
                    var projectName = multipleCompare.projectIdTransProjectNameFn(item.projectLocalId);
                    arr1.push({
                        time: {
                            st: tf,
                            et: tt
                        },
                        value: {
                            num: item.sumData || item.sumData === 0 ? item.sumData : pconst.emptyReplaceStr,
                            unit: multipleCompare.chartUnit
                        },
                        subentry: {
                            energyItemLocalName: projectName + ' ' + multipleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
                            energyItemLocalId: item.energyItemLocalId
                        },
                        base: {
                            width: width,
                            color: colorArr[index],
                            lid: item.lid,
                        },
                        index: index
                    });
                });
                return arr1;
            },
            drawingChartData: function (list) {//绘制图表
                var that = this;
                if (list && list.length > 0) {
                    that.scChartShow = true;
                    var _list = _.clone(list);
                    _list.forEach(function (item) {
                        var projectName = that.projectIdTransProjectNameFn(item.projectLocalId);
                        var sub = that.energyIdTransEnergyNameFn(item.energyItemLocalId);
                        item.data = item.dataList.map(function (info) {
                            info.x = info.time;
                            info.y = info.data;
                            info.unit = multipleCompare.chartUnit;

                            var nameTimeStr = that.currSelTimeArr.length > 1 ? (function () {
                                return ptool.formatStrByTimeTypeToNormal({ timeType: that.chartTimeType, value: info.time });
                            })() : '';
                            info.name = that.currSelTimeArr.length > 1 ? nameTimeStr + ' ' + projectName + ' ' + sub : projectName + ' ' + sub;

                            return info;
                        });



                        item.name = projectName + ' ' + sub;
                    })

                    var series = _list;
                    var chart1 = pchart.initLine({
                        container: 'divLineChart',
                        series: series,
                        xAxis: {
                            visible: false
                        }
                    });
                    multipleCompare.lineChart1 = chart1;

                    that.max = multipleCompare.lineChart1.yAxis[0].getExtremes().max;
                    that.min = multipleCompare.lineChart1.yAxis[0].getExtremes().min;
                    return chart1;
                } else {
                    that.scChartShow = false;
                    that.noDataChartShow = true;
                }
            },
            confirmSearchListFn: function () { //根据选择条件生成表格
                var that = this;
                var val = that.searchConditionObj;
                var flag = that.checkTimeArrtype();
                if (!flag) {//验证时间跨度、类型是否相同
                    biTool.fail("请选择相同时间跨度进行对比");
                    return;
                }
                if (val.projectSaveObj && val.projectSaveObj.length > 0) { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (that.currSelTimeArr.length > 0) {
                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId != '') { //分项id不为空
                            var paramList = [];
                            for (var i = 0; i < that.currSelTimeArr.length; i++) {
                                var currTimeObj = that.currSelTimeArr[i];
                                paramList.push({
                                    timeFrom: new Date(currTimeObj.startTime).format("yyyy-MM-dd hh:mm:ss"),
                                    timeTo: new Date(currTimeObj.realEndTime).format("yyyy-MM-dd hh:mm:ss")
                                });
                            }
                            that.qParamList = paramList;
                            var timeType = ptool.formatGranularityToJavaByTime({ start: that.currSelTimeArr[0].startTime, end: that.currSelTimeArr[0].endTime });
                            //获取图表数据请求
                            that.getChartListFn(paramList, timeType);

                        }

                    }
                }
            },
            dataTypeChange: function () {
                var that = this;
                if (that.qParamList && that.qParamList.length > 0 && that.currSelTimeArr.length > 0) {
                    var timeType = ptool.formatGranularityToJavaByTime({ start: that.currSelTimeArr[0].startTime, end: that.currSelTimeArr[0].endTime });
                    that.getChartListFn(that.qParamList, timeType);
                }
                that.chartUnit = biTool.getChartUnit(that.tabOptionTwoSel.code, that.tabOptionThreeSel.code);
            },
            /*下载图表、报表*/
            downReport: function (type) {
                switch (type) {
                    case 1: //图表
                        biTool.downReportImg({
                            container: '#divLineChart',
                            downName: '多项目数据对比图表'
                        });
                        break;
                    case 2: //报表

                        var data1 = ['项目名称', '项目数量', '计量方式', '单位', '分析时间', '所选分项'];

                        var _obj = this.searchConditionObj;
                        var projectName = _obj.projectSaveObj.map(function (curr) { return curr.projectLocalName; }).join(';');
                        var projectNum = _obj.projectSaveObj.length;
                        var kindName = this.tabOptionTwoSel.name;
                        var unit = biTool.getChartUnit(this.tabOptionTwoSel.code, this.tabOptionThreeSel.code);

                        var timeType = multipleCompare.lineChart1.getXTimeType();
                        var tempArr = [];
                        this.currSelTimeArr.forEach(function (curr) {
                            var _str = ptool.formatStrByTimeTypeToNormal({ value: curr.startTime, timeType: timeType }) + '~' +
                                ptool.formatStrByTimeTypeToNormal({ value: curr.endTime, timeType: timeType });
                            tempArr.push(_str);
                        });
                        var timeStr = tempArr.join(';');

                        var energyItemStr = _obj.subentrySaveArr.map(function (curr) { return curr.name; }).join(';');

                        var data2 = [projectName, projectNum, kindName, unit, timeStr, energyItemStr];

                        var data = [data1, data2];

                        var list = multipleCompare.gridRenderList;
                        list.forEach(function (curr) {
                            var emptyData = ['', '', '', '', '', ''];
                            data.push(emptyData);

                            var titleData = [];
                            curr.renderTit.forEach(function (currTit) {
                                titleData.push(currTit.name);
                            });
                            data.push(titleData);

                            curr.renderCon.forEach(function (currCon) {
                                data.push(JSON.parse(JSON.stringify(currCon)));
                            });
                        });


                        biTool.downReportExcel({
                            downName: '多项目数据对比报表',
                            data: data
                        });
                        break;
                }
            }
        },
        watch: {
            tabOptionTwoSel: function (newValue, oldValue) {
                if (!oldValue) return;
                multipleCompare.dataTypeChange();
            },
            tabOptionThreeSel: function (newValue, oldValue) {
                if (!oldValue) return;
                multipleCompare.dataTypeChange();
            }
        },
        beforeMount() {

        },
        mounted: function () {
            var that = this;
            //获取多项目分项树
            var code = document.getElementById("iptMCode").value;
            multCompareController.GetEnergyModelTreeOfStory({ storyCode: code }).then(function (res) {
                that.subentryArr = res || [];
                that.subentryTree = that.energyModelTree(res[0].energyModelTree, '-1');
                that.searchConditionObj.energyModelLocalId = res[0].energyModelCode;
                // debugger;
                console.log(that.subentryTree);
            })



            that.cRecordList = [];

        },
        created: function () {
            this.tabOptionTwoSel = this.tabOptionTwo[0];
            this.tabOptionThreeSel = this.tabOptionThree[0];
        }
    });

})