String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};


dt.StringUtils = {};

(function() {
    var StringUtils = dt.StringUtils;

    /**
     *判断是否是空白字符
     * @param character
     * @return
     *
     */
    StringUtils.isWhitespace = function(character) {
        switch (character)
        {
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                return true;
            default:
                return false;
        }
    };
    /**
     * 去首尾空白字符
     * @param str
     */
    StringUtils.trim = function(str) {
        if (!str) return '';
        var startIndex = 0;
        while (StringUtils.isWhitespace(str.charAt(startIndex)))
            ++startIndex;

        var endIndex = str.length - 1;
        while (StringUtils.isWhitespace(str.charAt(endIndex)))
            --endIndex;

        if (endIndex >= startIndex)
            return str.slice(startIndex, endIndex + 1);
        else
            return "";
    };

    /**
     *替换字符串
     * substitute("111{0}2222{1}333", "a", "b");
     * //输出 111{a}2222{b}333
     * substitute("111{0}2222{1}333", ["a", "b"]);
     * //输出 111{a}2222{b}333
     */
    /**
     * 替换字符串- 111{a}2222{b}333
     * @param {String} srcStr 原始字符串
     * @param {Array} replaceArr 用于替换的元素
     * @returns {String}
     */
    StringUtils.substitute = function(srcStr, replaceArr) {
        var len = replaceArr.length;
        var regE=null;
        for(var i=0; i<len; i++) {
            regE = new RegExp('\\\{' + i + '\\\}', 'g');
            srcStr = srcStr.replace(regE, replaceArr[i], 'g');
        }
        return srcStr;
    };

    /**
     *将数字转换成美元 输入格式
     *  eg  cc.log(getDollarFormat(12345, $))
     * 输出 $12,345
     */
    StringUtils.getDollarFormat = function(numb, preStr) {
        //if(!numb) return 0;
        var str;
        var mod;
        var temp;
        str = numb.toString();
        mod = (str.length % 3);
        temp = str.substr(0, mod);
        if ((str.length > 3 && (str.length % 3) != 0)){
            temp = (temp + ",");
        };
        str = str.substr(mod);
        //加入字分隔符号
        str = str.replace(/\d{3}/g, "$&,");
        if (preStr){
            str = ((preStr + temp) + str.substr(0, (str.length - 1)));
        } else {
            str = (temp + str.substr(0, (str.length - 1)));
        };
        return str;
    };
    /**
     * 将大数字转换成 有单位的数字表示
     * @param {Number} numb 要转换的数字
     * @param {Number} accuracy 保留小数点
     * @return {String}
     * cc.log( getWorldMoneyFormat(123456))
     * //输出 123k
     */
    StringUtils.getWorldMoneyFormat = function(numb, accuracy) {
        var returnStr;
        var boo;
        var arr;
        var arr2;
        var len;
        returnStr = "";
        boo = false;
        arr = [1000, 10000, 10000000, 100000000];
        arr2 = ["K", "W", "KW", "B"];
        len = (arr.length - 1);
        while (len >= 0) {
            if (numb < arr[len]){
            } else {
                boo = true;
                break;
            };
            len--;
        };
        if (boo){
            var tempValue = numb / arr[len];
            if(accuracy && Math.floor(tempValue*10)%10 > 0) {
                returnStr = tempValue.toFixed(accuracy) + arr2[len];
            }else {
                returnStr = tempValue.toFixed(0) + arr2[len];
            }
        } else {
            returnStr = numb.toString();
        };
        return (returnStr);
    };

    /**
     * 将一个数字转成需要位数数字, 如5转两位为"05"
     * @param	num				需要转换的数字
     * @param	len				填充至目标长度
     * @param	fillChar        用于填充的字符
     */
    StringUtils.getBitNumberString = function(num, len, fillChar){
        var str = num.toString();
        if(!fillChar) {
            fillChar = '0';
        }
        for (var i = str.length ; i < len; i++)
        {
            str = fillChar + str;
        }
        return str;
    };

    /**
     * 获取子字符串 中文长度2 英文长度1
     * @param str
     * @param characterLen
     */
    StringUtils.subCharacter = function(str, characterLen){
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i].match(/[^x00-xff]/ig) != null) {
                len += 2;
            }else {
                len += 1;
            }
            if(len >= characterLen) {
                return str.substr(0, i+1);
            }
        }
        return str;
    };

    StringUtils.checkID = function(ID) {
        if(typeof ID !== 'string') return false;
        var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
        var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
        var d = new Date(birthday);
        var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
        var currentTime = new Date().getTime();
        var time = d.getTime();
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var sum = 0, i, residue;

        if(!/^\d{17}(\d|x)$/i.test(ID)) return false;
        if(city[ID.substr(0,2)] === undefined) return false;
        if(time >= currentTime || birthday !== newBirthday) return false;
        for(i=0; i<17; i++) {
            sum += ID.substr(i, 1) * arrInt[i];
        }
        residue = arrCh[sum % 11];
        if (residue !== ID.substr(17, 1)) return false;

        return true;
    };

    StringUtils.characterLen = function(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i].match(/[^x00-xff]/ig) != null) {
                len += 2;
            }else {
                len += 1;
            }
        }
        return len;
    };

    /**
     * 数字对象转为中文汉字
     * @param num
     */
    StringUtils.numToStringNum = function(num){
        var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
        var chnUnitSection = ["","万","亿","万亿","亿亿"];
        var chnUnitChar = ["","十","百","千"];
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(num){
            var v = num % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            num = Math.floor(num / 10);
        }
        return chnStr;
    };

    /**
     * obj对象转url查询字符串
     * eg: {param1:p1, param2:p2, param3:p3} --> param1=p1&param1=p2&param3=p3
     * @param queryStr
     */
    StringUtils.objToUrlQueryStr = function(obj) {
        var queryStr = "";
        if(!obj) {
            return queryStr;
        }
        //生成url参数
        var pairArr = [];
        for(var k in obj) {
            pairArr.push(k + "=" + obj[k]);
        }
        queryStr = pairArr.join("&");
        return queryStr;
    },

    /**
     * url查询字符串转obj对象
     * eg: param1=p1&param1=p2&param3=p3 ---> {param1:p1, param2:p2, param3:p3}
     * @param queryStr
     */
    StringUtils.urlQueryStrToObj = function(queryStr) {
        var ret = {};
        if(!queryStr) {
            return ret;
        }
        var pairArr = queryStr.split("&");
        for(var i=0; i<pairArr.length; i++) {
            var pair = pairArr[i].split("=");
            ret[pair[0]] = pair[1];
        }
        return ret;
    }
})();


