$(function () {
    window.singleCompare = new Vue({
        el: "#singleComparePage",
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
                }
            ],
            tabOptionThreeSel: null,
            scChartShow: false, //是否显示图表
            scReportShow: false, //是否显示报表
            searchConditionObj: { //选择条件集合，包括选择项目，选择时间，选择分项
                projectSaveObj: {}, //项目集合
                timeSaveArr: [

                ], //时间集合
                subentrySaveArr: [], //分项集合
            },
            subentryTree: [], //选择分项树
            subentryArr: [],//分项数组
            downLoadBlockIsShow: false, //是否显示下载图表
            chartUnit: "kWh",

            gridRenderList: [], //报表渲染数组

            cRecordList: [], //生成的记录列表

            qParamList: [], //查询图表记录参数
            currSelTimeArr: [],//当前选择的时间数组

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
            max: 0,//最大值

            min: 0,//最小值

            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false //在线说明显示

        },
        computed: {

        },
        methods: {
            setChartRegionSize: function () {
                Vue.nextTick(function () {
                    //20 报表和图表的间距 40 图表的单位区域
                    var heightStr;
                    if (singleCompare.scReportShow) {
                        var height = document.getElementById('scReportFrom').clientHeight + 20 + 40;
                        heightStr = 'calc(100% - ' + height + 'px)';
                    } else
                        heightStr = 'calc(100% - 40px)';
                    $('#divLineChart').css({ height: heightStr });
                    biTool.setChartSize(lineChart1);
                });
            },
            timeClick: function (arr) {
                singleCompare.currSelTimeArr = arr;
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
            tableOptionTwoChangeFn: function (item) {
                var that = this;
                that.tabOptionTwoSel = item;
                that.tabOptionTwo.forEach(function (x) {
                    x.checked = false;
                    if (x.code == item.code) {
                        x.checked = true;
                    }
                });
            },
            tableOptionThreeChangeFn: function (item) {
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
                var projectItem = item[0] || {};
                var energyModelItem = item1[0];
                this.searchConditionObj.projectSaveObj = {
                    // name: item[0].projectName,  projectName
                    // modelName: item1[0].energyModelName, energyModelName

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

            },
            addProjectFn: function () { //添加项目
                this.searchConditionObj.projectSaveObj = {
                    name: "项目1",
                    projectLocalID: "project1"
                }
            },
            addTimeFn: function () { //添加时间操作
                var that = this;
                that.searchConditionObj.timeSaveArr.push({
                    timeId: ptool.produceId(),
                    text: "请选择时间",
                    type: "default"
                });

            },
            deleteTimeFn: function (item, index) { //删除当前时间
                var that = this;
                that.searchConditionObj.timeSaveArr.splice(index, 1);
            },
            addSubetryShow: function () { //选择分项弹出框
                var that = this;
                if (!this.subentryDisabled) {
                    return;
                }

                //获取分项树请求
                var queryParam = {
                    buildingLocalId: that.searchConditionObj.projectSaveObj.buildingLocalId,
                    energyModelId: that.searchConditionObj.projectSaveObj.energyModelId
                }
                singleCompareController.GetEnergyModelTreeOfBuilding(queryParam).then(function (res) {
                    that.subentryArr = res || [];
                    that.subentryTree = _.clone(res);
                    that.subentryTree = that.energyModelTree(that.subentryTree, -1);
                    that.showSubentryTemp = true;

                })

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
            confirmCurrTime: function () { //确认添加时间
                var that = this;
                var index = that.timeCurrObj.index;
                if (index !== '') {
                    var timeDateObj = $("#choiceTime").psel();
                    var timeInfo = $("#choiceTimePop").find('.counttime').text();
                    // if (timeInfo.indexOf('~') == '-1') {
                    //     timeDateObj['choiceType'] = 'single';
                    // } else {
                    //     timeDateObj['choiceType'] = 'double';
                    // }
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
                        singleCompare.$set(that.searchConditionObj.timeSaveArr, index, {
                            saveTimeObj: timeDateObj,
                            text: timeInfo
                        });
                    }

                    // debugger;

                }
                $("#choiceTimePop").hide();


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
                that.chartTimeType = timeType;
                var _projectId = that.searchConditionObj.projectSaveObj.projectId;
                var _buildingLocalId = that.searchConditionObj.projectSaveObj.projectLocalID;
                var _energyModelId = that.searchConditionObj.projectSaveObj.energyModelId;
                var _dataKind = that.tabOptionTwo.filter(function (item) {
                    return item.checked;
                })[0].code;
                var _dataType = that.tabOptionThree.filter(function (item) {
                    return item.checked;
                })[0].code;
                var queryParam = {
                    projectId: _projectId,
                    buildingLocalId: _buildingLocalId,
                    energyModelId: _energyModelId,
                    timeType: Number(timeType),
                    dataKind: _dataKind,
                    dataType: _dataType,
                    paramList: paramList
                };

                singleCompareController.ItemEnergyByTime(queryParam).then(function (res) {

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
                    // $('#divNoChartMax').hide();
                    // $('#divChartMax').show();
                    that.noDataChartShow = false;
                    that.dataListSubentry = res;
                    that.drawingChartData(res);
                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    //转换右侧数据列表数据
                    that.cRecordList = that.transRecordListFn(res, lineChart1);
                    if (that.scReportShow)
                        that.setChartRegionSize();
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

                var maxData = 0;
                arr.forEach(function (item, index) {
                    maxData = Math.max(item.sumData, maxData);
                });

                var arr1 = [];
                var arrLength = arr.length;
                arr.forEach(function (item, index) {
                    var timeType = lineChart1.getXTimeType();
                    var tf = ptool.formatStrByTimeTypeToNormal({ value: item.timeFrom, timeType: timeType });
                    var tempDate = new Date(item.timeTo);
                    tempDate.setDate(tempDate.getDate() - 1);
                    tempDate.setHours(23);
                    tempDate.setMinutes(59);
                    tempDate.setSeconds(59);
                    var tt = ptool.formatStrByTimeTypeToNormal({ value: tempDate.getTime(), timeType: timeType });
                    var width = arrLength == 1 ? '0%' : Math.multiplication(Math.division(item.sumData, maxData), 100) + '%';
                    arr1.push({
                        time: {
                            st: tf,
                            et: tt
                        },
                        value: {
                            num: item.sumData || item.sumData === 0 ? item.sumData : pconst.emptyReplaceStr,
                            unit: singleCompare.chartUnit
                        },
                        subentry: {
                            energyItemLocalName: singleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
                            energyItemLocalId: item.energyItemLocalId
                        },
                        base: {
                            width: width,
                            color: colorArr[index],
                            lid: item.lid
                        }
                    });
                })
                return arr1;
            },
            deleteRecordFn: function (item) { //删除右侧列表当前项

                var that = this;
                var lid = item.base.lid;
                var res = [];

                that.dataListSubentry.forEach(function (info) {
                    if (info.lid != lid) {
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
            transGridRenderListFn: function (arr) { //后台返回的数据格式转换成表格渲染数据格式
                var that = this;
                var arr1 = [];
                arr.forEach(function (item) {
                    if (arr1.length == 0) {
                        arr1.push({
                            energyItemLocalId: item.energyItemLocalId,
                            timeFrom: item.timeFrom,
                            timeTo: item.timeTo,
                            dataListArr: [{
                                name: singleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
                                content: item.dataList
                            }]
                        });
                    } else if (arr1.length > 0) {
                        var flag = false;
                        arr1.forEach(function (info) {
                            if (item.timeFrom == info.timeFrom && item.timeTo == info.timeTo) {
                                flag = true;
                                info.dataListArr.push({
                                    name: singleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
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
                                    name: singleCompare.energyIdTransEnergyNameFn(item.energyItemLocalId),
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
                            name: info.name + '(' + that.chartUnit + ')'
                        });

                        info.content.forEach(function (c, i) {
                            item.renderCon[i] = item.renderCon[i] || [];
                            item.renderCon[i].push(info.content[i].data || info.content[i].data === 0 ? info.content[i].data : pconst.emptyReplaceStr);
                            if (index == 0) {
                                var timeType = lineChart1.getXTimeType();
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
            setYAxisShowFn: function () { //显示设置Y轴坐标弹出框
                this.setYAxisShow = true;
            },
            setYAxisHideFn: function () { //隐藏设置Y轴坐标弹出框
                this.setYAxisShow = false;
            },
            setYdataFn: function (max, min) { //确认设置Y轴坐标
                lineChart1.yAxis[0].setExtremes(min, max);
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
            downloadChart: function () { //下载图表
                this.downLoadBlockIsShow = !this.downLoadBlockIsShow;
            },
            onlineExplainEnter: function () { //在线说明
                this.onlineExplainFlag = true;
            },
            onlineExplainLeave: function () { //在线说明
                this.onlineExplainFlag = false;
            },

            energyIdTransEnergyNameFn: function (id) {//通过分项id查询分项名称
                var that = this;
                var arr = that.subentryArr || [];
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

            drawingChartData: function (list) { //绘制线图
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
                            info.unit = singleCompare.chartUnit;

                            var nameTimeStr = that.currSelTimeArr.length > 1 ? (function () {
                                return ptool.formatStrByTimeTypeToNormal({ timeType: that.chartTimeType, value: info.time });
                            })() : '';
                            info.name = that.currSelTimeArr.length > 1 ? nameTimeStr + ' ' + projectName + ' ' + sub : projectName + ' ' + sub;
                            return info;
                        });
                        item.name = sub;
                    })

                    var series = _list;
                    var chart1 = pchart.initLine({
                        container: 'divLineChart',
                        series: series,
                        xAxis: {
                            visible: false
                        }
                    });
                    window.lineChart1 = chart1;
                    that.max = lineChart1.yAxis[0].getExtremes().max;
                    that.min = lineChart1.yAxis[0].getExtremes().min;
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
                if (val.projectSaveObj.hasOwnProperty('projectLocalID') && val.projectSaveObj.projectLocalID != '') { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (that.currSelTimeArr.length > 0) {
                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId != '') { //分项id不为空
                            var paramList = [];
                            for (var i = 0; i < that.currSelTimeArr.length; i++) {
                                for (var j = 0, subentry = val.subentrySaveArr; j < subentry.length; j++) {
                                    var currTimeObj = that.currSelTimeArr[i];
                                    paramList.push({
                                        energyItemLocalId: subentry[j].localId,
                                        timeFrom: new Date(currTimeObj.startTime).format("yyyy-MM-dd hh:mm:ss"),
                                        timeTo: new Date(currTimeObj.realEndTime).format("yyyy-MM-dd hh:mm:ss"),
                                        area: subentry[j].area.toString()
                                    });
                                }
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
                singleCompare.chartUnit = biTool.getChartUnit(singleCompare.tabOptionTwoSel.code, singleCompare.tabOptionThreeSel.code);
            },
            /*下载图表、报表*/
            downReport: function (type) {
                switch (type) {
                    case 1: //图表
                        biTool.downReportImg({
                            container: '#divLineChart',
                            downName: '单项目数据对比图表'
                        });
                        break;
                    case 2: //报表
                        var data1 = ['项目名称', '计量方式', '能耗模型', '单位', '分析时间', '所选分项'];

                        var projectInfo = this.searchConditionObj.projectSaveObj;
                        var projectName = projectInfo.projectName;
                        var kindName = this.tabOptionTwo.filter(function (item) {
                            return item.checked;
                        })[0].name;
                        var modelName = projectInfo.energyModelName;
                        var unit = this.chartUnit;
                        var timeStr = this.currSelTimeArr.map(function (curr) { return curr.name; }).join(';');
                        var energyItemStr = this.searchConditionObj.subentrySaveArr.map(function (curr) { return curr.name; }).join(';');
                        var data2 = [projectName, kindName, modelName, unit, timeStr, energyItemStr];

                        var data = [data1, data2];
                        var list = singleCompare.gridRenderList;
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
                            downName: '单项目数据对比报表',
                            data: data
                        });
                        break;
                }
            }
        },
        watch: {
            tabOptionTwoSel: function (newValue, oldValue) {
                if (!oldValue) return;
                singleCompare.dataTypeChange();
            },
            tabOptionThreeSel: function (newValue, oldValue) {
                if (!oldValue) return;
                singleCompare.dataTypeChange();
            }
        },
        mounted: function () {
            var that = this;

            // 画图
            // that.drawingChartData();

            that.cRecordList = []
        },
        created: function () {
            this.tabOptionTwoSel = this.tabOptionTwo[0];
            this.tabOptionThreeSel = this.tabOptionThree[0];
        }
    });

})