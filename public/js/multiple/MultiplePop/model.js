$(function () {
    window.multiplePop = new Vue({
        el: "#multiplePopContent",
        data: {
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
            chartUnit: "kWh",

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

            noDataChartShow: true, //无数据显示

            qParamList: {},//存储请求参数

            gridTitles: [],//表格标题

            gridList: [],//表格内容
            max: 0,//最大值

            min: 0,//最小值

            tabOptionThree: [ //选项3
                {
                    name: "能耗",
                    unit: "kWh",
                    checked: true,
                    code: "1",
                }, {
                    name: "费用",
                    unit: "元",
                    checked: false,
                    code: "2",
                }, {
                    name: "碳排放量",
                    unit: "kgCO2",
                    checked: false,
                    code: "3",
                }, {
                    name: "标煤",
                    unit: "kgce",
                    checked: false,
                    code: "4",
                },

            ],
            tabOptionThreeSel: {},//选项当前选中项

            popColorType: "project", //气泡颜色区分维度类型

            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false, //在线说明显示
            popColorTypeName: '能耗',
            manageRegionList: [],    //管理区
            projectTypeList: [],        //项目类型
            climateZoneList: []         //气候区
        },
        methods: {
            /*
            *从管理区或项目类型或气候区中返回对应的项
            */
            searchObjFromRegion: function (code) {
                var type = this.popColorType;
                var list = type == 'project' ? this.projectTypeList : type == 'weather' ? this.climateZoneList : type == 'manager' ? this.manageRegionList : [];
                var _obj = type == 'project' || type == 'weather' ? list.filter(function (curr) { return curr.code == code; })[0] || {} :
                    (function () {
                        function fn(arr) {
                            for (var i = 0; i < arr.length; i++) {
                                var curr = arr[i];
                                if (curr.managePartitionId == code) {
                                    return curr;
                                }
                                var result = arguments.callee(curr.managePartitionChildren || []);
                                if (result) return result;
                            }
                        };
                        return fn(list);
                    })() || [];
                return { code: code, name: _obj.name || _obj.managePartitionName };
            },
            /** type 1 管理区    2 项目类型     3 气候区
             * 打开项目面板获取到管理区、项目类型、气候区之后，赋值给改model中对应的值
            */
            changeVal: function (type, data) {
                switch (type) {
                    case 1:
                        this.manageRegionList = data;
                        break;
                    case 2:
                        this.projectTypeList = data;
                        break;
                    case 3:
                        this.climateZoneList = data;
                        break;
                }
            },
            tableOptionChangeFn: function (item) { //切换能耗筛选条件
                var that = this;
                that.tabOptionThreeSel = item;
                var data = that.tabOptionThree;
                data.forEach(function (x) {
                    x.checked = false;
                    if (x.code == item.code) {
                        x.checked = true;
                    }
                });
                that.chartUnit = biTool.getChartUnit(1, item.code);

                that.confirmSearchListFn(); //筛选条件改变从新获取气泡数据

            },
            showChatFn: function () { //显示图表
                if (!$("#reportId").psel()) {
                    $("#chartId").psel(true);
                } else {
                    this.scChartShow = !this.scChartShow;
                }

                // debugger;
            },
            showReportFn: function (event) { //显示报表
                this.scReportShow = event.pEventAttr.state;
                Vue.nextTick(function () {
                    biTool.setChartSize(multiplePopChart);
                });
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
                // debugger;
            },

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
            //添加时间相关
            confirmCurrTime: function () {
                var that = this;
                var time = $("#selectTimeLine").psel();
                that.searchConditionObj.timeSaveArr = [time];

            },
            setYAxisShowFn: function () { //显示设置Y轴坐标弹出框
                this.setYAxisShow = true;
            },
            setYAxisHideFn: function () { //隐藏设置Y轴坐标弹出框
                this.setYAxisShow = false;
            },
            setYdataFn: function (max, min) { //确认设置Y轴坐标
                // 设置表格中的信息
                multiplePopChart.yAxis[0].setExtremes(min, max);
            },
            checkPopColor: function (type) {//筛选条件改变从新获取气泡数据
                this.popColorType = type;
                this.popColorTypeName = type == 'project' ? '项目类型' : type == 'weather' ? '气候区' : type == '管理区' ? '不分区' : '';
                this.drawingChartData(JSON.parse(JSON.stringify(this.dataListSubentry || [])));
            },
            transGridRenderListFn: function (arr) { //后台返回的数据格式转换成表格渲染数据格式
                var that = this;
                that.gridTitles = [  //表格标题
                    {
                        name: "时间",
                        key: "time",
                    }, {
                        name: "项目名称",
                        key: "project"
                    }, {
                        name: that.searchConditionObj.subentrySaveArr[0].name + '(' + that.chartUnit + ')',
                        key: "subentry"
                    }
                ];
                that.gridList = [];//表格内容
                var list = [];
                arr.forEach(function (item) {
                    var obj = {};
                    obj.time = new Date(that.searchConditionObj.timeSaveArr[0].startTime).format("y.M.d") + ' ~ ' + new Date(that.searchConditionObj.timeSaveArr[0].endTime).format("y.M.d");
                    obj.project = multiplePop.projectIdTransProjectNameFn(item.projectLocalId);
                    var subenergy = Math.toFixed({ value: item.data, isByInt: true });
                    subenergy = subenergy || subenergy === 0 ? subenergy : pconst.emptyReplaceStr;
                    obj.subentry = subenergy;
                    obj.area = Math.toFixed({ value: item.area });
                    obj.areaData = Math.toFixed({ value: item.data, isByInt: true });
                    list.push(obj);
                });
                that.gridList = list;
            },
            confirmSearchListFn: function () { //根据选择条件生成表格    
                var that = this;
                var val = that.searchConditionObj;
                if (val.projectSaveObj && val.projectSaveObj.length > 0) { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (val.timeSaveArr.length > 0 && val.timeSaveArr[0].startTime) {

                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId != '') { //分项id不为空
                            var projectLocalIdList = val.projectSaveObj.map(function (item) {
                                return item.projectLocalID
                            });
                            var op = that.tabOptionThreeSel;
                            var timeFrom = new Date(val.timeSaveArr[0].startTime).format("yyyy-MM-dd hh:mm:ss");
                            var timeTo = new Date(val.timeSaveArr[0].realEndTime).format("yyyy-MM-dd hh:mm:ss");
                            var queryParam = {
                                projectLocalIdList: projectLocalIdList, //项目本地编码
                                energyModelLocalId: val.energyModelLocalId,
                                energyItemLocalId: val.subentrySaveArr[0].localId,
                                dataType: Number(op.code),
                                timeFrom: timeFrom,
                                timeTo: timeTo,
                            }
                            that.qParamList = queryParam;
                            that.getChartListFn(queryParam);
                            that.scChartShow = true;
                            that.noDataChartShow = false;


                        }

                    }
                }


            },
            getChartListFn: function (param) {
                //获取气泡图数据请求
                var that = this;
                multPopController.GetProjectBubbleCompare(param).then(function (res) {

                    that.dataListSubentry = JSON.parse(JSON.stringify(res));
                    that.drawingChartData(res);
                    that.noDataChartShow = false;
                    //转换表格数据
                    that.transGridRenderListFn(res[0].dataList);

                });
            },
            //根据筛选条件类型添加颜色
            addColor: function (arr) {
                var num = 0;
                arr.map(function (info, index) {

                    if (index > 30) {
                        if (num > 30) {
                            num = 0;
                        } else {

                            info.color = pcolor.cd[num];
                            num++;
                        }

                    } else {
                        info.color = pcolor.cd[index];
                    }
                    return info;
                })
                return arr;
            },

            //根据code添加转换对应的颜色

            codeTransColor: function (arr, code) {
                if (arr && arr.length > 0) {
                    var _code = "";
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].code == code) {
                            _code = arr[i].color;
                            break;
                        }
                    }
                    return _code;
                }
            },
            //根据x轴数据进行排序
            dataSort: function (property) {
                return function (a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },
            //根据项目id查询项目名称
            projectIdTransProjectName: function (id) {
                var that = this;
                // var arr = that.
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
            // type  根据传入type 类型 进行分组 type类型包括 project  weather  manager ;  arr 对应后台返回的气泡图坐标对应的数据数组
            drawingChartData: function (arr) { //气泡图绘制
                var that = this;
                var type = that.popColorType;
                var series = [];
                var seriesDataArr = [];
                var tempObj = {};
                var dataArr = arr[0].dataList || [];
                var yname = '单平米' + that.tabOptionThreeSel.name;
                var yunit = that.tabOptionThreeSel.unit + '/㎡';
                var ytext = yname + '（' + yunit + ' ）';
                var proName = type == 'project' ? 'funcTypeCode' : type == 'weather' ? 'climateCode' : type == 'manager' ? 'manageZone' : '';
                dataArr.forEach(function (item) {
                    var itemArea = Math.toFixed({
                        value: item.area,
                        isToSpecial: false
                    });
                    var obj = {
                        x: itemArea,
                        y: Math.toFixed({ value: item.areaData, isByInt: true, isToSpecial: false }),
                        z: Math.toFixed({ value: item.data, isByInt: true, isToSpecial: false }) || 0,
                        xname: '面积',
                        xunit: 'm²',
                        yname: yname,
                        yunit: yunit,
                        zname: multiplePop.tabOptionThreeSel.name,
                        zunit: multiplePop.tabOptionThreeSel.unit,
                        name: multiplePop.projectIdTransProjectNameFn(item.projectLocalId)
                    };
                    switch (type) {
                        case 'normal':
                            seriesDataArr.push(obj);
                            break;
                        default:
                            var code = item[proName];
                            var name = that.searchObjFromRegion(code).name;
                            if (!tempObj[name]) {
                                tempObj[name] = [];
                            }
                            tempObj[name].push(obj);
                            break;
                    }
                });

                var legend = type == 'normal' ? false : true;
                switch (type) {
                    case 'normal':
                        series.push({
                            data: seriesDataArr
                        });
                        break;
                    default:
                        for (var tj in tempObj) {
                            if (tempObj.hasOwnProperty(tj)) {
                                series.push({
                                    name: tj,
                                    data: tempObj[tj]
                                });
                            }
                        }
                        break;
                }

                var chart1 = pchart.initBubble({
                    container: 'multiPop',
                    series: series,
                    yAxis: {
                        title: { text: ytext }
                    },
                    legend: legend
                });

                window.multiplePopChart = chart1;

                that.max = multiplePopChart.yAxis[0].getExtremes().max;
                that.min = multiplePopChart.yAxis[0].getExtremes().min;

                return chart1;
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
            /*下载图表、报表*/
            downReport: function (type) {
                switch (type) {
                    case 1: //图表
                        biTool.downReportImg({
                            container: '#multiPop',
                            downName: '多项目对比气泡图表'
                        });
                        break;
                    case 2: //报表
                        var data1 = ['项目名称', '单位', '项目数量', '区分纬度', '分析时间', '所选分项'];

                        var projectNameStr = (this.searchConditionObj.projectSaveObj || []).map(function (curr) {
                            return curr.projectLocalName;
                        }).join(';');
                        var unit = this.tabOptionThreeSel.name;
                        var projectCount = this.searchConditionObj.projectSaveObj.length;
                        var kindType = this.popColorTypeName;
                        var timeObj = this.searchConditionObj.timeSaveArr[0] || {};
                        var timeStr = new Date(timeObj.startTime).format('y.M.d') + '~' + new Date(timeObj.endTime).format('y.M.d');
                        var energyItemName = (this.searchConditionObj.subentrySaveArr[0] || {}).name;
                        var data2 = [projectNameStr, unit, projectCount, kindType, timeStr, energyItemName];

                        var data = [data1, data2];
                        data.push(['', '', '', '', '', '']);

                        var yname = '单平米' + this.tabOptionThreeSel.name;
                        var yunit = this.tabOptionThreeSel.unit + '/㎡';
                        var ytext = yname + '（' + yunit + ' ）';
                        var data3 = ['时间', '项目名称', energyItemName + '(' + this.tabOptionThreeSel.unit + ')', '面积(㎡)', ytext];
                        data.push(data3);

                        var list = this.gridList || [];
                        list.forEach(function (curr) {
                            var data4 = [];
                            data4.push(curr.time);
                            data4.push(curr.project);
                            data4.push(curr.subentry);
                            data4.push(curr.area);
                            data4.push(curr.areaData);
                            data.push(data4);
                        });

                        biTool.downReportExcel({
                            downName: '多项目对比气泡报表',
                            data: data
                        });
                        break;
                }
            }
        },
        beforeMount: function () {
            var that = this;
            //获取分项树

            multPopController.GetEnergyModelTreeOfStory({
                storyCode: document.getElementById("iptMCode").value
            }).then(function (res) {
                that.subentryTree = that.energyModelTree(res[0].energyModelTree, '-1');
                that.searchConditionObj.energyModelLocalId = res[0].energyModelCode;
            });
        },
        created: function () {
            this.tabOptionThreeSel = this.tabOptionThree[0];
            var d = new Date();
            var _d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            this.searchConditionObj.timeSaveArr = [
                {
                    timeType: "d",
                    startTime: Date.parse(new Date(_d + ' ' + '00:00:00')),
                    endTime: Date.parse(new Date(_d + ' ' + '23:59:59')),
                }
            ]
        },
        mounted: function () {
            var that = this;
            var time = $("#selectTimeLine").psel();
            that.searchConditionObj.timeSaveArr = [time];
        }
    });
});