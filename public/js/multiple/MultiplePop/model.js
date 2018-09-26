var tableDataAry=[
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' },
    { name: '2017.02.01', age: '建筑A', hobby: '120' }
];
var treeData=[{
    name: '亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲',
    id: 'yz',
    child: [{
        name: '中国',
        id: 'zg',
        child: [{
            name: '中国人民中国大中国大中华好大一个家56个民族啊',
            id: 'bj'
        }, {
            name: '杭州',
            id: 'hz'
        }, {
            name: '上海',
            id: 'sh'
        }]
    }, {
        name: '韩国',
        dis:true,
        id: 'hg',
        child: [{
            name: '首尔',
            id: 'se'
        }, {
            name: '汉城',
            id: 'hc'
        }, {
            name: '济州岛',
            id: 'jzd'
        }]
    }]
}];
function Parameter() {//参数集合
    return {
        startTime:"",
        endTime:"",
        projectSelected:[]//选择的所有项目


    }
}

var  multiplePopData={


};


$(function () {
    window.multiplePop=new Vue({
        el:"#multiplePopContent",
        data:{
            projectTextShow:"已经选择了222个项目",//选择项目提示
            objectName:"总能耗",//分项名称
            objectSelectShow:false,//分项弹框的显示
            objectData:[],//分项数据
            showDownLoadList:false,//下载图表报表显示
            showParameter:false,//显示参数
            selectProjectCount:0,
            totalProjectCount:100,
            queryData:new Parameter(),
            chartType:0,//图表类型(0:图表,1:报表,2:)
            energySourceType:0,//能源类型(0:能耗,1:费用,2:碳排放量,3:标煤)
            dimensionType:0,//维度类型(0:建筑类型,1:气候区,2:管理区)
            unit:"能耗:kWh/㎡",
            chartForm:true
        },
        methods:{
            objectSelectMadel:function () {//显示分项弹框
                this.objectSelectShow=true;
            },
            selected:function (obj,event) {//选择某一个分项
                var  value=$("#hasSelectedObject").psel();
                
                this.objectSelectShow=false;
            },
            selCalendarTime:function () {//时间选择
                var val=$("#multiplePopCalendar").psel();
                multiplePopData.queryData.startTime=new Date(val.startTime).format("yMd000000");
                multiplePopData.queryData.endTime=new Date(val.endTime).format("yMd232359");

            },
            getAllId:function (arr) {//获取所有ID
                for (var i = 0; i < arr.length; i++) {
                    var curItem = arr[i];
                    if(curItem.child && curItem.child.length>0){
                        this.getAllId(curItem.child);
                    }else{
                        multiplePopData.queryData.projectSelected.push({nodeId:curItem.id,isEvent:true,type:1});
                    }
                }

            },
            checkAll:function () {//项目全选
                var ary=[];
                $("#projects").precover();
                multiplePopData.queryData.projectSelected=[];
                this.getAllId(treeData);
                for (var i = 0; i < multiplePopData.queryData.projectSelected.length; i++) {
                    var obj = multiplePopData.queryData.projectSelected[i];
                    $("#projects").psel(obj);
                    ary.push(obj.id);
                }
                multiplePopData.selectProjectCount=multiplePopData.queryData.projectSelected.length;
                multiplePopData.queryData.projectSelected=ary;

            },
            clearAll:function (event) {//清除选择
                $("#projects").precover();
                multiplePopData.queryData.projectSelected=[];
                multiplePopData.selectProjectCount=0;
                
            },
            reverseSelect:function () {//反选
                var projectsCopy=multiplePopData.queryData.projectSelected;
                multiplePopData.queryData.projectSelected=[];
                this.getAllId(treeData);
                if(projectsCopy && projectsCopy.length>0){
                    for (var i = 0; i < projectsCopy.length; i++) {
                        var obj = projectsCopy[i];
                        for (var j = 0; j < multiplePopData.queryData.projectSelected.length; j++) {
                            var obj1 = multiplePopData.queryData.projectSelected[j];
                            if((obj.id || obj.nodeId)==obj1.nodeId){
                                multiplePopData.queryData.projectSelected.splice(j,1);
                            }

                        }
                    }
                }
                if(multiplePopData.queryData.projectSelected.length>0){
                    $("#projects").precover();
                    for (var k = 0; k < multiplePopData.queryData.projectSelected.length; k++) {
                        var cur=multiplePopData.queryData.projectSelected[k];
                        $("#projects").psel(cur);
                    }
                    multiplePopData.selectProjectCount=multiplePopData.queryData.projectSelected.length;
                }else{
                    this.clearAll();
                }
            },
            selectProjects:function () {//项目点击选择
                Vue.nextTick(function () {
                    var selectedProjects=$("#projects").psel();
                    var selectedProjectsAry=[];
                    for (var i = 0; i < selectedProjects.length; i++) {
                        var curItem = selectedProjects[i];
                        selectedProjectsAry.push(curItem);
                    }
                    multiplePopData.queryData.projectSelected=selectedProjectsAry;
                    multiplePopData.selectProjectCount=multiplePopData.queryData.projectSelected.length;
                });


            },
            chartType:function (id) {//图表类型选择
                var chartForm=$("#chartForm").psel();
                var reportForm=$("#reportForm").psel();
                if(chartForm && reportForm){
                    multiplePopData.chartType=2;
                }else if(chartForm && !reportForm){
                    multiplePopData.chartType=0;
                }else if(!chartForm && reportForm){
                    multiplePopData.chartType=1;
                }else{
                    $("#chartForm").psel(true);
                }

            },
            calculateWay:function (event,value) {//计量单位
                this.tagsSelect(event);
            },
            energySourceType:function (event,value) {//能源类型选择
                this.tagsSelect(event);
                multiplePopData.queryData.energySourceType=value;
            },
            dimensionType:function (val) {//维度选择
                multiplePopData.queryData.dimensionType=val;
            },
            confirm:function () {
                var parameters=multiplePopData.queryData;
            },
            downLoad:function () {//下载选项显示
                this.showDownLoadList=true;
            },
            downLoadChart:function () {
                this.showDownLoadList=false;

            },
            showInformation:function () {
                $(event.target).addClass("addSelect").siblings().removeClass("addSelect");

            },
            ordinateBuild:function () {//编辑弹框显示--待修改
                $("#modalWindow").pshow();
            },
            modalHide:function () {//编辑弹框隐藏
                $("#modalWindow").phide();
            },
            showModel:function () {
                $(".model").css("display","block");
            },
            hideModel:function () {
                $(".model").css("display","none");
            },
            showParameterLists:function (event) {
                this.showParameter?this.showParameter=false:this.showParameter=true;
            },
            tagsSelect:function (event) {//标签点击
                var $target=$(event.target);
                $target.addClass("isSelected").siblings().removeClass("isSelected");
            }
        },
        beforeMount:function () {},
        mounted:function () {
            // this.getAllId(treeData);
            // this.totalProjectCount=multiplePopData.queryData.projectSelected.length;
            // multiplePopData.queryData.projectSelected=[];

            var that=this;
            that.objectData=[{
                name: '亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲',
                id: 'yz',
                child: [{
                    name: '中国',
                    id: 'zg',
                    child: [{
                        name: '中国人民中国大中国大中华好大一个家56个民族啊',
                        id: 'bj'
                    }, {
                        name: '杭州',
                        id: 'hz'
                    }, {
                        name: '上海',
                        id: 'sh'
                    }]
                }, {
                    name: '韩国',
                    dis:true,
                    id: 'hg',
                    child: [{
                        name: '首尔',
                        id: 'se'
                    }, {
                        name: '汉城',
                        id: 'hc'
                    }, {
                        name: '济州岛',
                        id: 'jzd'
                    }]
                }]
            }, {
                name: '欧洲',
                id: 'oz',
                child: [{
                    name: '英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国英国',
                    id: 'yg',
                    child: [{
                        name: '伦敦',
                        id: 'ld'
                    }, {
                        name: '牛津',
                        id: 'nj'
                    }, {
                        name: '伯明翰',
                        id: 'bmh'
                    }, {
                        name: '利物浦',
                        id: 'lwp'
                    }]
                }, {
                    name: '法国',
                    id: 'fg',
                    child: [{
                        name: '巴黎',
                        id: 'bl'
                    }, {
                        name: '奥尔良',
                        id: 'ael'
                    }, {
                        name: '布鲁斯特',
                        id: 'blst'
                    }]
                }]
            }];

            var chart = Highcharts.chart('chartPart', {
                chart: {
                    type: 'bubble',
                    zoomType: 'xy'
                },
                title: {text: ""},
                legend:{
                    align: "right",
                    verticalAlign: "top",
                    floating:true,
                    itemStyle:{
                        fontSize:"12px",
                        fontWeight:"normal",
                        color:"#6D6D6D"
                    }
                },
                credits:{enabled:false},
                xAxis:{
                    title:{text:"租户面积:㎡",align:"high"}
                },
                yAxis:{
                    title:{text:""},
                    lineWidth: 1,
                    gridLineWidth: 0
                },
                series: [
                    {
                        name:'商业建筑',
                        color:"#E16DB4",
                        data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
                    }, {
                        name:'办公建筑',
                        color:"#F79761",
                        data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
                    }, {
                        name:'其他',
                        color:"#67CBE3",
                        data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
                    }
                ],
                plotOptions: {
                    bubble: {
                        minSize: 8,
                        maxSize: 120
                    },
                    series:{
                        shadow:{offsetX:0,offsetY:4,color:"#000000",opacity:0.12}
                    }
                },
                tooltip:{
                    borderColor:"#D9D9D9",
                    backgroundColor:"#FFFFFF",
                    followPointer:true,
                    style:{color:"#6D6D6D",fontSize:"14px"},
                    useHTML: true,
                    headerFormat: '<small style="font-size: 12px">{series.name}</small><table>',
                    pointFormat: '<tr><td>面积<i style="color: #333333"> {point.x}</i> ㎡</td></tr>' +
                    '<tr><td><b>能耗 <i style="color: #333333">{point.y}</i> kWh</b></td></tr>'+'<tr><td><b>单平米能耗 <i  style="color: #333333">{point.z}</i> kWh/㎡</b></td></tr>',
                    footerFormat: '</table>'
                }

            });

        },
        watch:{},
        computed:{}
    });
    //初始化操作
    var val=$("#multiplePopCalendar").psel();
    var startTime=new Date(val.startTime).format("yMd000000");
   var endTime=new Date(val.endTime).format("yMd232359");

});
