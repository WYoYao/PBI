
var multiplePopEvent={
    selCalendarTime:function () {
        var val=$("#multiplePopCalendar").psel();
        multiplePopData.queryData.startTime=new Date(val.startTime).format("yMd000000");
        multiplePopData.queryData.endTime=new Date(val.endTime).format("yMd232359");

    },
    selectObject:function (item) {
        var value=$("#selectObject").psel().text;
        
        multiplePopData.queryData.objectSelected=value;
    },
    selectProjectCount:function (event) {
        
    },
    checkAll:function (event) {
        var $target=$(event.target);
        var $parents=$target.parents(".projectSelect");
        var $targetProjects=$parents.find("li");
       $targetProjects.addClass("active");
    },
    clearAll:function (event) {
        var $target=$(event.target);
        var $parents=$target.parents(".projectSelect");
        var $targetProjects=$parents.find("li");
        $targetProjects.each(function () {
            $(this).hasClass("active")? $(this).removeClass("active"):void 0;
        })
    },
    reverseSelect:function (event) {
        var $target=$(event.target);
        var $parents=$target.parents(".projectSelect");
        var $targetProjects=$parents.find("li");
        $targetProjects.each(function () {
            $(this).hasClass("active")? $(this).removeClass("active"):$(this).addClass("active");
        })
    }
};