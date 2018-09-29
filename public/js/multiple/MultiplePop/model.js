

$(function () {
    window.multiplePop=new Vue({
        el:"#multiplePopContent",
        data:{
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
        
            setYAxisShow: false, //是否显示坐标

            onlineExplainFlag: false, //在线说明显示

        },
        methods:{
            tableOptionChangeFn:function(){

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

            setYAxisShowFn: function () { //显示设置Y轴坐标弹出框
                this.setYAxisShow = true;
            },
            setYAxisHideFn: function () { //隐藏设置Y轴坐标弹出框
                this.setYAxisShow = false;
            },
            setYdataFn: function (item1, item2) { //确认设置Y轴坐标

                this.setYAxisShow = false;
            },
            checkPopColor:function(model){
                console.log(model);
            },
            confirmSearchListFn: function () { //根据选择条件生成表格
                var that = this;
                var val = that.searchConditionObj;
                // if (val.projectSaveObj && val.projectSaveObj.length > 0) { //存在项目id ， 模型id
                //     //存在时间 第一项不能为请选择时间
                //     if (val.timeSaveArr.length > 0 && JSON.stringify(val.timeSaveArr[0].saveTimeObj) != '{}' && val.timeSaveArr[0].text != '请选择时间') {

                //         if (val.subentrySaveArr.length > 0 && val.subentrySaveArr[0].localId != '') { //分项id不为空
                //             var paramList = [];
                //             for (var i = 0, time = val.timeSaveArr; i < time.length; i++) {
                //                 if (time[i].text != "请选择时间") {
                //                     paramList.push({
                //                         timeFrom: new Date(time[i].saveTimeObj.startTime).format("yyyy-MM-dd hh:mm:ss"),
                //                         timeTo: new Date(time[i].saveTimeObj.endTime).format("yyyy-MM-dd hh:mm:ss"),
                //                     });
                //                 }
                //             }
                //             that.qParamList = paramList;
                //             var timeType = ptool.formatGranularityToJava($("#time"));
                //             //获取图表数据请求
                //             that.getChartListFn(paramList, timeType);

                //         }

                //     }
                // }
                that.getChartListFn();
                
            },
            getChartListFn:function(){
                //获取气泡图数据请求
                var that = this;
                multPopController.GetProjectBubbleCompare({}).then(function (res) {

                    that.dataListSubentry = res;
                    that.drawingChartData(res);
                    that.noDataChartShow = false;
                    //转换表格数据
                    that.gridRenderList = that.transGridRenderListFn(res);
                    //转换右侧数据列表数据

                });
            },
            drawingChartData:function(arr){//气泡图绘制
                var series = [];
                var data = [];
                var newArr = arr[0].dataList;
                newArr.forEach(function(item,index){
                    var obj = {
                        y: item.areaData,
                        x: item.area,
                        z: item.data,
                        xname: '面积',
                        xunit: 'm²',
                        yname: '单平米指标',
                        yunit: 'kWh/㎡',
                        zname:"能耗",
                        zunit:"kWh"
                    }
                    data.push(obj);
                    var seObj = {
                        data: data,
                        name: '项目' + index.toString()
                    };
                    series.push(seObj);
                })
                console.log(series);
                return pchart.initBubble({
                    yAxis: { title: { text: 'kWh' } },
                    container: 'multiPop',
                    series: series
                });
    
            },
            transGridRenderListFn:function(){

            },

        },
        beforeMount:function () {
            var that = this;
            //获取分项树
            multPopController.GetEnergyModelTreeOfStory({}).then(function(res){
                that.subentryTree = that.energyModelTree(res[0].energyModelTree, '-1');
                that.searchConditionObj.energyModelLocalId = res[0].energyModelCode;
                console.log(that.subentryTree);
            })
        },
        mounted:function () {
            // this.getAllId(treeData);
            // this.totalProjectCount=multiplePopData.queryData.projectSelected.length;
            // multiplePopData.queryData.projectSelected=[];

            var that=this;
           
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
        watch:{},
        computed:{}
    });
    //初始化操作
    var val=$("#multiplePopCalendar").psel();
    var startTime=new Date(val.startTime).format("yMd000000");
   var endTime=new Date(val.endTime).format("yMd232359");

});
