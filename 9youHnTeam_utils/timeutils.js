/**
 * Created by yangyi on 6/29/15.
 */

/** 时间相关工具方法 **/
dt.TimeUtils = {};

dt.TimeUtils.A_DAY_TIME =  24*60*60*1000;

dt.TimeUtils.getCurrMonthLastDate = function (date) {
    if(!date) {
        date = new Date();
    }
    var year = date.getFullYear();
    var month = date.getMonth();
    if(month + 1 > 11) {
        month = 0;
        year = year + 1;
    }else {
        month = month + 1;
    }
    var tempD = new Date(year, month, 1);
    tempD = new Date(tempD.getTime() - dt.TimeUtils.A_DAY_TIME);
    return tempD;
};

/*获取当前月份第一天date*/
dt.TimeUtils.getCurrMonthFirstDate = function(date) {
    if(!date) {
        date = new Date();
    }
    var year = date.getFullYear();
    var month = date.getMonth();
    var tempD = new Date(year, month, 1);
    return tempD;
};


/**
 * 获取当前的秒数
 * @returns {number}
 */
dt.TimeUtils.getCurrentSecond = function() {
    return Math.floor(new Date().getTime()/1000);
};

dt.TimeUtils.getDateStringFromTimestamp = function (timestamp,format) {
    var date = new Date();
    date.setTime(timestamp * 1000);
    return date.format(format);
};

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}