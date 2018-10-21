var biTool = {
    /**
     * @method getHelpDataUnit 获取辅助数据的单位
     * @param {String} type 对应辅助信息的单位
     */
    getHelpDataUnit: function (type) {
        // 
        var enums = {
            0: 'g/kg干空气',    //焓值
            1: '℃',     //温度
            2: '%',     //湿度
            3: 'μg/m3', //CO2
            4: 'ppm'//PM2.5
        };

        if (!enums.hasOwnProperty(type)) return '';
        return enums[type];
    },
    /**
     * @method setChartSize 显示报表后，需要重新设置chart的大小
     * @param {object} chart highcharts对象
    */
    setChartSize: function (chart) {
        chart.setSize(null, null, false);
    },
    /**
     * @method getChartUnit 计量方式、能耗类型改变后，需重设单位
     * @param {string | int} kindcode 计量方式编码  1 总量  2 单平米能耗
     * @param {string | int} energyCode 能耗类型编码    1 能耗    2 费用    3 碳排放量    4 标煤
    */
    getChartUnit: function (kindcode, energyCode) {
        kindcode = parseInt(kindcode);
        energyCode = parseInt(energyCode);
        var unitFix = '';
        switch (energyCode) {
            case 1:     //能耗
                unitFix = 'kWh';
                break;
            case 2:     //费用
                unitFix = '元';
                break;
            case 3:     //碳排放量
                unitFix = 'kgCO₂';
                break;
            case 4:     //标煤
                unitFix = 'kgce';
                break;
        }
        var unitSuffix = '';
        switch (kindcode) {
            case 1:     //总量
                unitSuffix = '';
                break;
            case 2:     //单平米
                unitSuffix = '/㎡';
                break;
        }
        return unitFix + unitSuffix;
    },
    /**
     * @method downReportImg 下载图表
     * @param {object} _objParam 示例：{container:'容器，需要是chart的父元素',downName:'下载下来的文件名称，不带后缀'}
    */
    downReportImg: function (_objParam) {
        var html = $(_objParam.container).html();
        var links = $("link");
        var linksStr = '';
        if (links && links.length > 0) {
            for (var j = 0, maxI = links.length; j < maxI; j += 1) {
                linksStr += "<link href='" + links[j].href + "' rel='stylesheet' type='text/css'>";
            }
        }

        var reportName = _objParam.downName;
        var downLoadType = 'image';

        $("#fmTempToDown").remove();
        var form = $("<form id='fmTempToDown' target='_blank'>"); //定义一个form表单
        form.attr('action', "./downloadReport");
        form.attr('method', 'post');
        var input1 = $('<input>').attr('type', 'hidden').attr('name', 'html').attr('value', html);
        var input2 = $('<input>').attr('type', 'hidden').attr('name', 'reportName').attr('value', reportName);
        var input3 = $('<input>').attr('type', 'hidden').attr('name', 'downLoadType').attr('value', downLoadType);
        var input4 = $('<input>').attr('type', 'hidden').attr('name', 'links').attr('value', linksStr);
        $('body').append(form);
        form.append(input1).append(input2).append(input3).append(input4).submit();
    },

    /**
     * @method downReportExcel 下载报表,被跨的列，需要在data里对应的地方赋空值
     * @param {object} _objParam 示例：{downName:'下载下来的文件名称，不带后缀',
     *                                  data:[[第一行列值1，第一行列值2，第一行列值3],[第二行列值1，第二行列值2，第二行列值3],
     *                                  rangeArr:[{rowIndex:从零开始的行号,colIndex:从零开始的列号,colSpan:跨的列数,rowSpan:跨的行数}]}
    */
    downReportExcel: function (_objParam) {
        var reportName = _objParam.downName;
        var downLoadType = 'excel';

        $("#fmTempToDown").remove();
        var form = $("<form id='fmTempToDown' target='_blank'>"); //定义一个form表单
        form.attr('action', "./downloadReport");
        form.attr('method', 'post');
        var input1 = $('<input>').attr('type', 'hidden').attr('name', 'data').attr('value', JSON.stringify(_objParam.data || []));
        var input2 = $('<input>').attr('type', 'hidden').attr('name', 'reportName').attr('value', reportName);
        var input3 = $('<input>').attr('type', 'hidden').attr('name', 'downLoadType').attr('value', downLoadType);
        var input4 = $('<input>').attr('type', 'hidden').attr('name', 'range').attr('value', JSON.stringify(_objParam.rangeArr || []));
        $('body').append(form);
        form.append(input1).append(input2).append(input3).append(input4).submit();
    },
    /**
     * @method validTimeStep 多个时间时，每个时间步长的验证
     * @param {object} _objParam 示例：{oldTime:{startTime:符合时间格式的字符串或毫秒数,endTime:符合时间格式的字符串或毫秒数},
     *                                   currTime:{startTime:符合时间格式的字符串或毫秒数,endTime:符合时间格式的字符串或毫秒数}}
     * @return {Boolean} 验证通过返回 true  否则返回false
    */
    validTimeStep: function (_objParam) {
        var oldStartDate = new Date(_objParam.oldTime.startTime);
        var oldEndDate = new Date(_objParam.oldTime.endTime);
        var oldMiddleTime = oldEndDate.getTime() - oldStartDate.getTime();

        var currStartDate = new Date(_objParam.currTime.startTime);
        var currEndDate = new Date(_objParam.currTime.endTime);
        var currMiddleTime = currEndDate.getTime() - currStartDate.getTime();

        return oldMiddleTime === currMiddleTime;
    },
    dateStr2IE: function (o) {

        if (_.isString(o)) return o.replace(/-/g, '/');
        if (_.isNumber(o)) return new Date(o).format('yyyy/MM/dd hh:mm:ss');
        if (_.isDate(o)) return o.format('yyyy/MM/dd hh:mm:ss');
        return o;
    },
    /**
    * 全局报错方法
    * @param {String} text  错误信息 
    */
    fail: function (text) {
        window.parent.document.querySelector("#globalnotice").pshow({ text: text, state: "failure" });
    },
    /**
    * @author niuheng
    * @method slideTimeBeforeSel 滑动平均的时间控件选择前事件
    */
    slideTimeBeforeSel: function (event) {
        var timeObj = event.pEventAttr;
        var step = 0;
        var _startTime = timeObj.startTime;
        var _endTime = timeObj.endTime;
        while (_startTime < _endTime) {
            ++step;
            var _date = new Date(_startTime);
            _date.setDate(_date.getDate() + 1);
            _startTime = _date.getTime();
        }
        if (step < 365) return biTool.fail('所选时间段必须大于365天'), false;
        return true;
    }
};
