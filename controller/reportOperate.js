/**
* 报告生成，包括生成pdf、生成图片、生成excel
* @author niuheng 2018-10-10
*/

function reportOperate() {
    this.process = require('child_process');
    this.fs = require('fs');
    this.responseTool = require('common/responseTool');
    this.path = require('path');
    this.exlsOper = require('../lib/node-xlsx');
}

/**
 * 生成PDF或者图片
 * @param  {Object} options 配置选项 {res:响应流,reportName:下载下来的文件名称(不带后缀),downLoadType:'pdf || image',htmlStr:'html字符串'}
 */
reportOperate.prototype.createReport = function (options) {
    var _this = this;
    var id = ptool.produceId();
    var createFilePath = _this.path.resolve(__dirname, '../', 'lib/wkhtmltopdf/bin/');;
    var tempHtmlPath = _this.path.resolve(_uploadPath, './' + id + '.html');

    _this.fs.writeFile(tempHtmlPath, options.htmlStr, { encoding: 'utf8' }, function (writeFileErr) {
        if (writeFileErr) {
            console.error('createReport时，写入文件错误：' + (writeFileErr.stack || JSON.stringify(writeFileErr)));
            return _this.responseTool.sendServerException(options.res);
        }

        var baseCmd = 'cd ' + createFilePath + ' && ';
        var suffix = options.downLoadType == 'pdf' ? '.pdf' : '.jpg';
        var tempFileName = id + suffix;
        var tempFilePath = _this.path.resolve(_uploadPath, './' + tempFileName);

        var pdfCmd = baseCmd + 'wkhtmltopdf --footer-center "[page]"' + ' ' + tempHtmlPath + ' ' + tempFilePath;
        var imgCmd = baseCmd + 'wkhtmltoimage ' + tempHtmlPath + ' ' + tempFilePath;
        var cmd = options.downLoadType == 'pdf' ? pdfCmd : imgCmd;

        _this.process.exec(cmd,
            function (cmdError, stdout, stderr) {
                if (cmdError) {
                    console.error('执行生成命令时错误：' + (cmdError.stack || JSON.stringify(cmdError)));
                    return _this.responseTool.sendServerException(options.res);
                }
                options.res.download(tempFilePath, encodeURI(options.reportName) + suffix);
            });
    });
};

/**
 * 生成excel
 * @param  {Object} options 配置选项 {res:响应流,reportName:下载下来的文件名称(不带后缀),data:[[1,2,3],[4,5,6]],
 *                                      rangeArr:[{rowIndex:从零开始的行号,colIndex:从零开始的列号,colSpan:跨的列数,rowSpan:跨的行数}]}
 */
reportOperate.prototype.createExcel = function (options) {
    var _this = this;
    var id = ptool.produceId();
    var suffix = '.xlsx';
    var filePath = _this.path.resolve(_uploadPath, './' + id + suffix);
    var datas = options.data || [];
    var rangeArr = options.rangeArr || [];

    var exlRange = [];
    rangeArr.forEach(function (curr) {
        exlRange.push({
            s: {
                c: curr.colIndex,
                r: curr.rowIndex
            }, e: {
                c: curr.colIndex + (curr.colSpan || 1) - 1,
                r: curr.rowIndex + (curr.rowSpan || 1) - 1
            }
        });
    });
    var option = { '!merges': exlRange };
    var buffer = _this.exlsOper.build([{
        name: 'sheet1', data: datas
    }], option);
    _this.fs.writeFile(filePath, buffer, function (writeFileErr) {
        if (writeFileErr) {
            console.error('createReport时，写入文件错误：' + (writeFileErr.stack || JSON.stringify(writeFileErr)));
            return _this.responseTool.sendServerException(options.res);
        }
        options.res.download(filePath, encodeURI(options.reportName) + suffix);
    });
};

// const range = {s: {c: 0, r:0 }, e: {c:0, r:3}}; // A1:A4
// const option = {'!merges': [ range ]};

// var buffer = xlsx.build([{name: "mySheetName", data: data}], option);

module.exports = new reportOperate();