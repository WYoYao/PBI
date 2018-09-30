$(function () {
    window.multiplePop = new Vue({
        el: "#multiplePopContent",
        data: {
            scChartShow: false, //是否显示图表
            scReportShow: true, //是否显示报表
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

            gridTitles:[],//表格标题

            gridList:[],//表格内容
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

            popColorType: "project", //气泡颜色区分维度类型

            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false, //在线说明显示

        },
        methods: {
            tableOptionChangeFn: function (data, item) { //切换能耗筛选条件
                var that = this;

                if (data && data.length > 0) {
                    data.forEach(function (x) {
                        x.checked = false;
                        if (x.code == item.code) {
                            x.checked = true;
                        }
                    })
                }

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
            showReportFn: function () { //显示报表
                if (!$("#chartId").psel()) {
                    $("#reportId").psel(true);
                } else {
                    this.scReportShow = !this.scReportShow;
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
            setYdataFn: function (item1, item2) { //确认设置Y轴坐标

                this.setYAxisShow = false;
            },
            checkPopColor: function (type) {//筛选条件改变从新获取气泡数据
                this.popColorType = type;
                this.confirmSearchListFn(); 
            },
            transGridRenderListFn: function (arr) { //后台返回的数据格式转换成表格渲染数据格式
                var that = this; 
                that.gridTitles = [  //表格标题
                    {
                        name:"时间",
                        key:"time",
                    },{
                        name:"项目名称",
                        key:"project"
                    },{
                        name:that.searchConditionObj.subentrySaveArr[0].localId,
                        key:"subentry"
                    }
                ];
                that.gridList = [];//表格内容
                arr.forEach(function(item){
                    var obj = {};
                    obj.time = new Date(that.searchConditionObj.timeSaveArr[0].startTime).format("yyyy-MM-dd")  +  ' ~ ' + new Date(that.searchConditionObj.timeSaveArr[0].endTime).format("yyyy-MM-dd");
                    obj.project = item.projectLocalId;
                    obj.subentry = item.data;
                    that.gridList.push(obj);
                })
                console.log(that.gridTitles,that.gridList);
            },
            confirmSearchListFn: function () { //根据选择条件生成表格    
                var that = this;
                var val = that.searchConditionObj;
                if (val.projectSaveObj && val.projectSaveObj.length > 0) { //存在项目id ， 模型id
                    //存在时间 第一项不能为请选择时间
                    if (val.timeSaveArr.length > 0 && JSON.stringify(val.timeSaveArr[0].startTime)) {

                        if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId != '') { //分项id不为空
                            var projectLocalIdList = val.projectSaveObj.map(function (item) {
                                return item.projectLocalID
                            });
                            var op = {};
                            op = that.tabOptionThree.filter(function (x) {
                                debugger
                                return x.checked
                            });
                            var timeFrom = new Date(val.timeSaveArr[0].startTime).format("yyyy-MM-dd hh:mm:ss");
                            var timeTo = new Date(val.timeSaveArr[0].endTime).format("yyyy-MM-dd hh:mm:ss");
                            var queryParam = {
                                projectLocalIdList: projectLocalIdList, //项目本地编码
                                energyModelLocalId: val.energyModelLocalId,
                                energyItemLocalId: val.subentrySaveArr[0].localId,
                                dataType: op[0].code,
                                timeFrom: timeFrom,
                                timeTo: timeTo,
                            }
                            console.log(queryParam);
                            that.getChartListFn(that.popColorType, queryParam);
                            that.scChartShow = true;
                            that.noDataChartShow = false;

                            
                        }

                    }
                }


            },
            getChartListFn: function (type, param) {
                //获取气泡图数据请求
                var that = this;
                multPopController.GetProjectBubbleCompare(param).then(function (res) {

                    that.dataListSubentry = res;
                    that.drawingChartData(type, res);
                    that.noDataChartShow = false;
                    //转换表格数据
                    debugger;
                    that.gridRenderList = that.transGridRenderListFn(res[0].dataList);

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
            // type  根据传入type 类型 进行分组 type类型包括 project  weather  manager ;  arr 对应后台返回的气泡图坐标对应的数据数组
            drawingChartData: function (type, arr) { //气泡图绘制
                var that = this;
                var series = [];
                var data = [];
                var newArr = arr[0].dataList;
                var xSign = arr[0].avgArea;
                var ySign = arr[0].avgAreaData;

                var projectType = [];

                var weatherType = [];

                var managerType = [];
                newArr.forEach(function (item) {
                    //取得所有项目类型
                    if (item.funcTypeCode != '' && projectType.indexOf(item.funcTypeCode) == '-1') {
                        projectType.push(item.funcTypeCode);
                    }
                    //取得所有气候区类型
                    if (item.climateCode != '' && weatherType.indexOf(item.climateCode) == '-1') {
                        weatherType.push(item.climateCode);
                    }
                    //取得所有管理区类型
                    if (item.manageZone != '' && managerType.indexOf(item.manageZone) == '-1') {
                        managerType.push(item.manageZone);
                    }


                })

                if (type == "project") {
                    var projectTypeObj = projectType.map(function (item) {
                        return {
                            code: item
                        }
                    })
                    projectTypeObj = that.addColor(projectTypeObj);
                } else if (type == "weather") {
                    var weatherTypeObj = weatherType.map(function (item) {
                        return {
                            code: item
                        }
                    })
                    weatherTypeObj = that.addColor(weatherTypeObj);
                } else if (type == "manager") {
                    var managerTypeObj = managerType.map(function (item) {
                        return {
                            code: item
                        }
                    })
                    managerTypeObj = that.addColor(managerTypeObj);
                }

                console.log(projectType, weatherType, managerType);
                console.log(projectTypeObj, weatherTypeObj, managerTypeObj);
                newArr.forEach(function (item, index) {
                    var obj = {
                        x: item.area,
                        y: item.areaData,
                        z: item.data,
                        xname: '面积',
                        xunit: 'm²',
                        yname: '单平米指标',
                        yunit: 'kWh/㎡',
                        zname: '能耗',
                        zunit: 'kWh',
                        name: item.projectLocalId,
                    }
                    // debugger

                    if (type == 'project' && projectType.length > 0) {
                        obj.color = that.codeTransColor(projectTypeObj, item.funcTypeCode);
                    } else if (type == 'weather' && weatherType.length > 0) {
                        obj.color = that.codeTransColor(weatherTypeObj, item.climateCode);
                    } else if (type == 'manager' && managerType.length > 0) {
                        obj.color = that.codeTransColor(managerTypeObj, item.manageZone);
                    } else if (type == "normal") {
                        obj.color = "#02a9d1"
                    }
                    data.push(obj);
                });
                //根据x轴数据进行排序
                data = data.sort(that.dataSort('x'));
                debugger
                var seObj = {
                    data: data,
                };
                series.push(seObj);
                console.log(series, xSign, ySign);
                return pchart.initBubble({
                    container: 'multiPop',
                    series: series,
                    yAxis: {
                        plotLines: [{ //y轴标识线
                            color: '#cacaca',
                            width: 2,
                            value: 100,
                            dashStyle: 'LongDash',
                            // label: {
                            //     text: ySign,
                            //     align: 'right',
                            //     x: -10
                            // }
                        }]
                    },
                    xAxis: {
                        plotLines: [{ //x轴标识线
                            color: '#cacaca',
                            width: 2,
                            value: 100,
                            dashStyle: 'LongDash',
                            // label: {
                            //     text: xSign + 'kWh/㎡',
                            //     align: 'right',
                            //     x: -10
                            // }
                        }]
                    },
                });

            },


        },
        beforeMount: function () {
            var that = this;
            //获取分项树
            multPopController.GetEnergyModelTreeOfStory({}).then(function (res) {
                that.subentryTree = that.energyModelTree(res[0].energyModelTree, '-1');
                that.searchConditionObj.energyModelLocalId = res[0].energyModelCode;
                console.log(that.subentryTree);
            })
        },
        mounted: function () {
            // this.getAllId(treeData);
            // this.totalProjectCount=multiplePopData.queryData.projectSelected.length;
            // multiplePopData.queryData.projectSelected=[];

            var that = this;

            // var chart = Highcharts.chart('chartPart', {
            //     chart: {
            //         type: 'bubble',
            //         zoomType: 'xy'
            //     },
            //     title: {text: ""},
            //     legend:{
            //         align: "right",
            //         verticalAlign: "top",
            //         floating:true,
            //         itemStyle:{
            //             fontSize:"12px",
            //             fontWeight:"normal",
            //             color:"#6D6D6D"
            //         }
            //     },
            //     credits:{enabled:false},
            //     xAxis:{
            //         title:{text:"租户面积:㎡",align:"high"}
            //     },
            //     yAxis:{
            //         title:{text:""},
            //         lineWidth: 1,
            //         gridLineWidth: 0
            //     },
            //     series: [
            //         {
            //             name:'商业建筑',
            //             color:"#E16DB4",
            //             data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
            //         }, {
            //             name:'办公建筑',
            //             color:"#F79761",
            //             data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
            //         }, {
            //             name:'其他',
            //             color:"#67CBE3",
            //             data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
            //         }
            //     ],
            //     plotOptions: {
            //         bubble: {
            //             minSize: 8,
            //             maxSize: 120
            //         },
            //         series:{
            //             shadow:{offsetX:0,offsetY:4,color:"#000000",opacity:0.12}
            //         }
            //     },
            //     tooltip:{
            //         borderColor:"#D9D9D9",
            //         backgroundColor:"#FFFFFF",
            //         followPointer:true,
            //         style:{color:"#6D6D6D",fontSize:"14px"},
            //         useHTML: true,
            //         headerFormat: '<small style="font-size: 12px">{series.name}</small><table>',
            //         pointFormat: '<tr><td>面积<i style="color: #333333"> {point.x}</i> ㎡</td></tr>' +
            //         '<tr><td><b>能耗 <i style="color: #333333">{point.y}</i> kWh</b></td></tr>'+'<tr><td><b>单平米能耗 <i  style="color: #333333">{point.z}</i> kWh/㎡</b></td></tr>',
            //         footerFormat: '</table>'
            //     }

            // });

        },
        watch: {},
        computed: {}
    });
    //初始化操作
    var val = $("#multiplePopCalendar").psel();
    var startTime = new Date(val.startTime).format("yMd000000");
    var endTime = new Date(val.endTime).format("yMd232359");

});