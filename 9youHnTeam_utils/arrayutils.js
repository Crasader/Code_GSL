/**
 * 处理数组相关工具类
 */

dt.ArrayUtils = {

    /**
     * 合并两个ArrayBuffer 返回一个新的ArrayBuffer
     * @param buff1
     * @param buff2
     * @returns {ArrayBuffer}
     */
    mergeArrayBuffer : function(buff1, buff2){
        var len1 = buff1.byteLength;
        var len2 = buff2.byteLength;
        var ret = new ArrayBuffer(len1 + len2);
        var retI8a = new Int8Array(ret);
        var i8a = new Int8Array(buff1);
        var i=0;
        for(i=0; i<len1; i++) {
            retI8a[i] = i8a[i];
        }
        i8a = new Int8Array(buff2);
        for(i=0; i<len2; i++) {
            retI8a[len1+i] = i8a[i];
        }
        return ret;
    },

    /**
     * 拷贝ArrayBuffer的数据返回一个新的ArrayBuffer
     * @param buff  原数据
     * @param offset 偏移下标
     * @param len   拷贝长度
     * @returns {ArrayBuffer}
     */
    copyArrayBuffer : function(buff, offset, len) {
        var buffLen = buff.byteLength;
        var retArrayBuff = null;
        var retLen = len;
        if(!len) {
            len = buffLen - offset;
        }
        if(len == 0) {
            return null;
        }
        retArrayBuff = new ArrayBuffer(len);
        var reti8a = new Int8Array(retArrayBuff);
        var i8a = new Int8Array(buff, offset);
        for(var i=0; i<len; i++) {
            reti8a[i] = i8a[i];
        }
        return retArrayBuff;
    },

    /**
     * 批量处理数组中的每个元素
     * @param arr
     * @param filter
     * @param processor
     */
    executeElmArr:function(arr, filter, processor) {
        var len = arr.length;
        for(var i=0; i<len; i++) {
            if(filter) {
                if(filter(arr[i])) {
                    processor(arr[i]);
                }
            }else{
                processor(arr[i]);
            }
        }
        return arr;
    },

    /**
     * arr中的每个元素传入processor处理然后替换掉arr中的元素
     * @param arr
     * @param processor
     */
    execRepArrElm:function(arr, processor) {
        var len = arr.length;
        for(var i=0; i<len; i++) {
            arr[i] = processor(arr[i]);
        }
        return arr;
    },

    /**
     * 搜索数组元素
     * @param arr
     * @param filter
     * @param getAll
     * @returns {*}
     */
    searchElm:function(arr, filter, getAll) {
        if(!arr || !filter) return null;
        var len = arr.length;
        var ret = [];
        var elm;
        for(var i=0; i<len; i++) {
            if(filter(arr[i])) {
                if(getAll) {
                    ret.push(arr[i]);
                } else {
                    return arr[i];
                }
            }
        }
        return ret
    },

    /**
     * 随机获取数组元素
     * @param arr
     */
    getRandomElm:function(arr) {
        if(arr) {
            var len = arr.length;
            if(len > 0) {
                return arr[parseInt(Math.random()*len)];
            }
        }
        return null;
    },

    /**
     * 数字转成拆分成对应的数字数组
     * @param value
     * @param refArr 参考的数组
     * @returns {Array}
     */
    numberToArry:function(value, refArr) {
        var ret = [];
        var arr = refArr;
        for(var i=arr.length-1; i>=0; i--) {
            while(value >= arr[i]) {
                value -= arr[i];
                ret.push(arr[i]);
            }
        }
        return ret;
    },

    /**
     * 用obj的属性给originObj赋值
     * @param originObj 被赋值的obj
     * @param obj   用来赋值的obj
     */
    copyPropertyUseObj:function(originObj, obj) {
        for(var property in obj) {
            if(originObj.hasOwnProperty(property)) {
                originObj[property] = obj[property];
            }
        }
    },

    findValueInArr:function (arr,value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return i;
            }
        }
        return -1;
    },

    hasMember:function(members, m) {
        for(var i=0; i<members.length; i++) {
            if(members[i] == m) {
                return true;
            }
        }
        return false;
    }
}