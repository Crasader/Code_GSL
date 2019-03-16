
dt.ToolUilts = {};

dt.ToolUilts.dumpObject = function(obj, inherit){
    if( cc.game.config["enableDump"] && !cc.sys.isMobile){
        cc.log("--------------------------------------");
        inherit = inherit || true;
        for(var key in obj){
            if(inherit && obj.hasOwnProperty(key)){
                cc.log("property ", key , obj[key]);
            }else{
                cc.log("property ", key , obj[key]);
            }
        }
        cc.log("--------------------------------------");
    }
}


dt.ToolUilts.dumpTexture = function(){
    if(cc.sys.isNative){
        cc.log("-----------------------------dumpTexture start--------------------------------------");
        cc.log("cc.textureCache.getCachedTextureInfo()",cc.textureCache.getCachedTextureInfo());
        cc.log("-----------------------------dumpTexture end--------------------------------------");
    }else{
        cc.log("-----------------------------dumpTexture start--------------------------------------");
        cc.log("cc.textureCache.getCachedTextureInfo()",cc.textureCache.dumpCachedTextureInfo());
        cc.log("-----------------------------dumpTexture end--------------------------------------");
    }
}

dt.ToolUilts.getArrayIndex = function(array,value){
    for(var index = 0; index < array.length; ++index){
        if(array[index] == value){
            return index;
        }
    }

    return -1;
};

dt.ToolUilts.isMobileEvn = function(){
    return (cc.sys.isNative && cc.sys.isMobile)
};

dt.ToolUilts.seekWidgetByName = function(root, name) {
    if(!root)
        return null;
    if(root.getName() === name)
        return root;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for(var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var res = dt.ToolUilts.seekWidgetByName(child, name);
        if(res !== null)
            return res;
    }
    return null;
};

dt.ToolUilts.getChildCountByName = function (root,namePartern) {
    if(!root)
        return null;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    var count = 0;
    var partern = new RegExp(namePartern);
    for(var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        if(partern.test(child.getName())){
            count++;
        }
    }
    return count;
};

dt.ToolUilts.getModulePath = function(csbName){
    var resPath =  (!cc.sys.isNative) ? "res/" : "";
    var moduleType = null;
    for(var value in dt.DirectoryConf.Path){
        if(csbName.indexOf(dt.DirectoryConf.Path[value]) > -1 ){
            moduleType = value;
            break;
        }
    }

    if(moduleType){
        if(moduleType == dt.DirectoryConf.EnumType.Game){
            var gameId = G_RoomCfg.GameLoader.getGameId();
            var basePath = dt.DirectoryConf.getGameResPathByID(gameId);
            resPath = basePath +resPath;
        }else{
            var basePath = dt.DirectoryConf.getDirResByType(moduleType);
            resPath = basePath + resPath
        }
    }

    return resPath;
}

dt.ToolUilts.loadCsbEx = function(fileName, filePath){
    if(cc.sys.isNative){
        var index = fileName.lastIndexOf(".");
        if(index < 0){
            cc.log("ERROR ! file name =" +  fileName);
            return null;
        }

        fileName = fileName.substr(0, index) + ".csb";
        var _node = UtilsEx.loadCsb(fileName);
        var _action = UtilsEx.createTimeline(fileName);

        return {node : _node, action : _action }
    }else{
        return ccs.load(fileName, filePath);
    }
};


dt.ToolUilts.adapteUI = function(rootNode){
    var visibleSize = cc.director.getVisibleSize();
    rootNode.setContentSize(visibleSize);

    var designSize = dt.Config.design_size;
    var childList = rootNode.getChildren();
    for(var index = 0; index < childList.length; ++index){
        var pos = childList[index].getPosition();
        childList[index].setNormalizedPosition(pos.x /designSize.width , pos.y / designSize.height);
    }
},


dt.ToolUilts.openURL            = function(url){
    try{
        if(url){
            cc.sys.openURL(url);
        }
    }catch(e){
        cc.log("EXCEPTION: open url exception"+ e);
    }

};

dt.ToolUilts.getLargeTextSprite = function(diyParam) {
    /**
     * @type {{words: Array, size: (cc.Size|*), color1: number, color2: number, labelSize1: number, labelSize2: number, margin1: number, margin2: number}}
     */
    var _param = {
        words:[],   //文本
        size:cc.size(100),  //文本容器的大小
        color1:0xffffff,    //第一级文本的颜色
        color2:0x80ad64,    //第二级文本的颜色
        labelSize1:22,      //第一级文本的大小
        labelSize2:20,      //第二级文本的大小
        margin1:15,         //第一级文本的间距
        margin2:8           //第二级文本的间距
    };
    dt.ArrayUtils.copyPropertyUseObj(_param, diyParam);
    var words = _param.words;
    var size = _param.size;
    var container = new cc.Node();
    var len = words.length;
    var preLabel;
    var label;
    var flag = 0;
    var preFlag = -1;
    var margin = 0;
    var node = new cc.Node();
    var tempSize;
    for(var i=0; i<len; i++) {
        flag = words[i][0];
        if(flag == 0) {
            label = dt.UIUtils.getSimpleLabel(words[i][1], _param.labelSize1, _param.font, _param.color1);
            node.addChild(label);
        } else if (flag == 1) {
            label = dt.UIUtils.getSimpleLabel(words[i][1], _param.labelSize2, _param.font, _param.color2);
            node.addChild(label);
        }
        label.setDimensions(size.width, 0);

        if(preFlag == -1) {
            margin = 0;
        }else if(preFlag == 0) {
            margin = _param.margin1;
        }else if(preFlag == 1) {
            if(flag == 0) {
                margin = _param.margin1;
            }else {
                margin = _param.margin2;
            }
        }
        if(preLabel) {
            dt.UIUtils.alignBelowBottomL(preLabel, label, margin);
        }else {
            tempSize = label.getContentSize();
            label.x = tempSize.width/2;
            label.y = -tempSize.height/2;
        }
        preLabel = label;
        preFlag = flag;
    }
    tempSize = label.getContentSize();
    node.y = -label.y + tempSize.height/2;
    container.setContentSize(cc.size(size.width, node.y));
    container.addChild(node);
    return container;
};

/**
 * 获取帧动画
 * @param frameNameArr 帧资源名数组
 * @param delayPerUnit 帧之间的间隔事件
 * @param restoreOriginal 动画执行后是否还原初始状态
 */
dt.ToolUilts.getAnimation = function(name, sindex, eindex, delayPerUnit) {
    var frameNameArr = [];
    for(var i = sindex; i < eindex; i++) {
        frameNameArr.push(name + i + '.png');
    }
    var animation = new cc.Animation();
    var len = frameNameArr.length;
    for(var i=0; i<len; i++) {
        var sf = cc.spriteFrameCache.getSpriteFrame(frameNameArr[i]);
        animation.addSpriteFrame(sf);
    }
    animation.setDelayPerUnit(delayPerUnit);
    return animation;
};

dt.ToolUilts.formatNick     = function(nick, maxlen) {
    if (!nick || 0 >= nick.length) return "";

    var newNick = nick;
    var len = (maxlen) ? maxlen : 5;
    if (len < nick.length){
        newNick = nick.substring(0, len);
        newNick = newNick + ".."
    }

    return newNick;
};


dt.ToolUilts.formatTime = function(timeStamp){
    var date = new Date();
    date.setTime(timeStamp * 1000);

    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '/' + m + '/' + d + '  ' + h + ':' + minute+ ':' + second;
};

dt.ToolUilts.formatDate = function(time){
        var date = new Date(time * 1000);

        var year = date.getFullYear(),
            month = date.getMonth() + 1,//月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var newTime = year + '-' +
            month + '-' +
            day + ' ' +
            hour + ':' +
            min + ':' +
            sec;

        return newTime;
}

dt.ToolUilts.getCCColor     = function(colorValue) {
    return cc.color(colorValue>>16 & 0xff, colorValue>>8 & 0xff, colorValue & 0xff)
};

/*
 截屏
 */
dt.ToolUilts.screenshot     =function(callBack) {
    var size = cc.director.getWinSize();

    //var currentDate = new Date();
    var texture = new cc.RenderTexture(parseInt(size.width), parseInt(size.height),
        cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
    texture.setPosition(cc.p(size.width/2, size.height/2));
    texture.begin();
    cc.director.getRunningScene().visit();
    texture.end();

    var fileName = "share.png";
    var filePath = jsb.fileUtils.getWritablePath() + fileName;

    if (cc.sys.isNative) {
        if(jsb.fileUtils.isFileExist( filePath)){
            jsb.fileUtils.removeFile(filePath);
        }

        texture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);

        cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_DRAW,function(){
            cc.eventManager.removeCustomListeners(cc.Director.EVENT_AFTER_DRAW);
            callBack(filePath);
        });
    }

    return filePath;
};

dt.ToolUilts.saveRenderTxture = function (rt,callBack) {
    var fileName = "share.png";
    var filePath = jsb.fileUtils.getWritablePath() + fileName;
    if (cc.sys.isNative) {
        if(jsb.fileUtils.isFileExist( filePath)){
            jsb.fileUtils.removeFile(filePath);
        }

        rt.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);
        cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_DRAW,function(){
            cc.eventManager.removeCustomListeners(cc.Director.EVENT_AFTER_DRAW);
            callBack(filePath);
        });
    }
    return filePath;
};

dt.ToolUilts.getLocalData = function(key) {
    var data = cc.sys.localStorage.getItem(key); //从本地读取数据
    if ( !data ) return null;

    data = JSON.parse(data); //将string转换成json
    return data;
};

dt.ToolUilts.setLocalData = function(key, data) {
    if (!key) {
        cc.log("------[ToolKit]setLocalData data is null");
        return;
    }
    var jsondata = JSON.stringify(data);
    cc.sys.localStorage.setItem(key, jsondata);
};

dt.ToolUilts.getCascadeBoundingBox=function(root){
    var child = null;
    var merge = false;
    var cbb = cc.rect(0, 0, 0, 0);

    var contentSize = root.getContentSize();
    var children =root.getChildren();
    var length = children.length;
    for(var index = 0; index < length; ++index){
        child = children[index];
        if(!child.isVisible()){continue;}

        var box = dt.ToolUilts.getCascadeBoundingBox(child);
        if(box.width < 0 || box.height < 0) {continue;}

        if(!merge){
            cbb = cc.rect(box.x, box.y, box.width, box.height);
            merge = true;
        }else{
            var unionRect = cc.rectUnion(cbb, box);
            cbb = cc.rect(unionRect.x, unionRect.y, unionRect.width, unionRect.height);
        }
    }

    if(contentSize.width > 0 && contentSize.height > 0){
        var tran =  root.getNodeToParentAffineTransform(root);
        //var box = cc.rectApplyAffineTransform(cc.rect(0, 0, contentSize.width, contentSize.height), root.getNodeToParentAffineTransform());
        //var position = root.getPosition();
        //var anthor = root.getAnchorPoint();
        ////var worldPoint = root.convertToWorldSpaceAR(position);
        ////var box = cc.rect(worldPoint.x, worldPoint.y, (1 - anthor.x) * rect.width, (1 - anthor.y) * rect.height);
        //
        ////var box = root.getBoundingBoxToWorld();
        //if(!merge){
        //    cbb = box;
        //}else{
        //    var unionRect = cc.rectUnion(cbb, box);
        //    cbb = cc.rect(unionRect.x, unionRect.y, unionRect.width, unionRect.height);
        //}
        // root.setPosition(position);
    }
    return cbb;
};

dt.ToolUilts.getDayString = function(){
    var systemDate = new Date();
    var year = systemDate.getFullYear();
    var month = systemDate.getMonth() + 1;
    var day = systemDate.getDate();
    return "" + year + month + day;
};

dt.ToolUilts.getTimeString = function(){
    var time = new Date();
    var hour = time.getHours();       //获取当前小时数(0-23)
    if(hour<10){
        hour = "0"+hour;
    };
    var mini = time.getMinutes();     //获取当前分钟数(0-59)
    if(mini<10){
        mini = "0"+mini;
    };
    var seco = time.getSeconds();     //获取当前秒数(0-59)
    if(seco<10){
        seco = "0"+seco;
    };
    var timeValue = hour + ":"+mini +":"+ seco;
    return timeValue;
}

/*
 * 获得val在arrar的位置
 * @param arrar val
 */
dt.ToolUilts.indexOf = function(arrar, val) {
    for (var i = 0; i < arrar.length; i++) {
        if (arrar[i] == val) return i;
    }
    return -1;
};

dt.ToolUilts.setSize = function(node, w, h) {
    var oldW = node.width;
    var oldH = node.height;
    var scaleX = w/oldW;
    var scaleY = h/oldH;
    node.setScaleX(scaleX);
    node.setScaleY(scaleY);
    return node;
};

/*
 * 获得头像自适应缩放
 * @param pic大小  framsize框大小 scale 指定缩放大小
 */
dt.ToolUilts.getHandScale = function(picSize, framSize, scale){
    var wid = picSize.width;
    var hei = picSize.height;
    if(wid>hei){
        return (picSize.width/framSize.width)*scale;
    }else{
        return (picSize.height/framSize.height)*scale;
    };
}

/**
 *获得一个范围的随机值
 * @param min：最小值 max:最大值
 * @return 随机值
 *
 */
dt.ToolUilts.getRandValueFromLimit = function(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
};

/*
计算距离
 */
dt.ToolUilts.distanceCaculate = function(locationA, locationB) {
    if (!locationA || !locationB || locationA.length === 1 || locationB.length === 1) {
        return 0;
    }
    var earthR = 6378.137;
    var radLat1 = locationA[0] * Math.PI / 180.0;
    var radLat2 = locationB[0] * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = locationA[1] * Math.PI / 180.0 - locationB[1] * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * earthR;
    s = Math.round(s * 10000) / 10000;
    return Math.ceil(s * 100) / 100;
}

/**
 * http请求
 * @param url 请求地址
 * @param data 请求数据
 * @param callback 回调
 */
dt.ToolUilts.httpRequest = function(url, data, callback, way) {
    var req = cc.loader.getXMLHttpRequest();
    if(way == null || way == ""){
        way = "GET";
    };
    req.open(way, url);
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    req.onreadystatechange = function (){
        if (req.readyState == 4 && req.status == 200) {
            if ( callback ){
                callback(req.responseText);
            }
        }
    };
    req.send(data);
};

dt.ToolUilts.clone = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        var len = obj.length;
        for (var i = 0;i < len; ++i) {
            copy[i] = dt.ToolUilts.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = dt.ToolUilts.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

// 检测字符，中英文数字下划线 返回true 否则返回false
dt.ToolUilts.checkLegalChar = function(text){
    var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$");
    return regex.test(text);
};


// 非零正整数
dt.ToolUilts.isUnsignNum = function(val){
    var regPos = /^\+?[1-9][0-9]*$/;
    if(regPos.test(val) && parseInt(val) < 10000000000){
        return true;
    }else{
        return false;
    }
}

//非负数
dt.ToolUilts.isPositiveNum = function(val){
    var regPos = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if(regPos.test(val) && parseInt(val) < 10000000000){
        return true;
    }else{
        return false;
    }
}

dt.ToolUilts.convertNumber = function(value, pow){
    var num = Math.pow(10,pow)
    return Math.floor(value * num) / 10;
}

// 是否是表情字符
dt.ToolUilts.isEmojiCharacter = function(substring){
    for ( var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                || hs == 0x2b50) {
                return true;
            }
        }
    }
};

// 判断字符串长度（中文和全角算2个字符）
dt.ToolUilts.getStringLen = function(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) // || a.match(/[\uff00-\uffff]/g)
            len += 2;
        else
            len += 1;
    }
    return len;
};

////2个集合的差集
dt.ToolUilts.minus = function (arr1, arr2) {
   var result = new Array();
   var obj = {};
   for (var i = 0; i < arr2.length; i++) {
       obj[arr2[i]] = 1;
   }
   for (var j = 0; j < arr1.length; j++) {
       if (!obj[arr1[j]])
       {
           obj[arr1[j]] = 1;
           result.push(arr1[j]);
       }
   }
   return result;
}
dt.ToolUilts.generateKey = function (k,n) {
    Math.seedrandom(k);
    var g = "";
    for(var i = 0 ; i < n; i++){
        var j = dt.ToolUilts.rand(1,3);
        switch (j){
            case 1:
                var c = dt.ToolUilts.rand(48,58);
                g += (c + "");
                break;
            case 2:
                var d = dt.ToolUilts.rand(65,90);
                g += String.fromCharCode(d);
                break;
            case 3:
                var e= dt.ToolUilts.rand(97,122);
                g += String.fromCharCode(e);
                break;
        }
    }
    return g;
};

dt.ToolUilts.rand = function(a,b){
    return parseInt(Math.random()*(b-a+1) + a);
};

dt.ToolUilts.encrypt = function (content,key) {
    var encryptStr = "";
    for(var i = 0; i < content.length; i++){
        var encyptChar = 0;
        for(var j = 0; j < key.length;j++){
            var keyChar = key.charCodeAt(j);
            encyptChar = content.charCodeAt(i)^ keyChar;
        }
        encryptStr += String.fromCharCode(encyptChar);
    }
    return encryptStr;
};

dt.ToolUilts.decrypt = function(content,key){
    var decryptStr = "";
    for(var i = 0; i < content.length; i++){
        var decryptChar = 0;
        for(var j = 0; j < key.length;j++){
            var keyChar = key.charCodeAt(j);
            decryptChar = content.charCodeAt(i)^ keyChar;
        }
        decryptStr += String.fromCharCode(decryptChar);
    }
    return decryptStr;
};


dt.ToolUilts.isIphoneX = function () {
    if(cc.sys.OS_IOS == cc.sys.os){
        if(cc.winSize.width == 1624 && cc.winSize.height == 750){
            return true;
        }
        return false;
    }else{
        return false;
    }
};

dt.ToolUilts.createHeadIcon = function(rootNode, url, handler){
    var myFace = new dt.MaskImage(dt.RoomCommonRes.common_iconSp, null);
    rootNode.addChild(myFace);
    myFace.load(url);
    myFace.setAnchorPoint(0.5, 0.5);
    var size = myFace.getContentSize();
    myFace.x = rootNode.width/2;
    myFace.y = rootNode.height/2;
    myFace.setScale(rootNode.width / size.width);

    if(handler){
        myFace.addTouchEvent(handler);
    }
};

dt.ToolUilts.observerProperty = function(obj , property, callBack) {
    Object.defineProperty(obj, property,{
        configurable: true,
        set: function (newValue) {
            property = newValue;
            if(callBack){
                callBack(property);
            }
        },
        get:function () {
            return property;
        }
    });
};

dt.ToolUilts.matMultiply = function (mat1, mat2) {
    // Cache the matrix values (makes for huge speed increases!)
    var outArray = [];
    var a00 = mat1[0], a01 = mat1[1], a02 = mat1[2], a03 = mat1[3];
    var a10 = mat1[4], a11 = mat1[5], a12 = mat1[6], a13 = mat1[7];
    var a20 = mat1[8], a21 = mat1[9], a22 = mat1[10], a23 = mat1[11];
    var a30 = mat1[12], a31 = mat1[13], a32 = mat1[14], a33 = mat1[15];

    var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
    var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
    var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
    var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];

    outArray[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    outArray[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    outArray[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    outArray[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    outArray[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    outArray[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    outArray[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    outArray[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    outArray[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    outArray[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    outArray[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    outArray[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    outArray[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    outArray[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    outArray[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    outArray[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return outArray;
};

dt.ToolUilts.matDecompose = function (m) {
    var translation = cc.math.vec3(m[12] , m[13], m[14]);
    translation.x = m[12];
    translation.y = m[13];
    translation.z = m[14];

    var xaxis = cc.math.vec3(m[0], m[1], m[2]);
    var yaxis = cc.math.vec3(m[4], m[5], m[6]);
    var zaxis = cc.math.vec3(m[8], m[9], m[10]);
    var scaleX = cc.math.vec3Length(xaxis);
    var scaleY = cc.math.vec3Length(yaxis);
    var scaleZ = cc.math.vec3Length(zaxis);

    var det = dt.ToolUilts.determinant(m);
    if(det < 0 ){
        scaleZ = -scaleZ;
    }
    var scale = cc.math.vec3(scaleX, scaleX, scaleZ);

    var rn = 1.0 / scaleX;
    xaxis.x *= rn;
    xaxis.y *= rn;
    xaxis.z *= rn;

    rn = 1.0 / scaleY;
    yaxis.x *= rn;
    yaxis.y *= rn;
    yaxis.z *= rn;

    rn = 1.0 / scaleZ;
    zaxis.x *= rn;
    yaxis.y *= rn;
    zaxis.z *= rn;

    var quaternion = cc.math.quaternion(0 , 0, 0);
    var trace = xaxis.x + yaxis.y + zaxis.z + 1.0;
    if(trace > 0){
        var s = 0.5 / Math.sqrt(trace);
        quaternion.w = 0.25 / s;
        quaternion.x = (yaxis.z - zaxis.y) * s;
        quaternion.y = (zaxis.x - xaxis.z) * s;
        quaternion.z = (xaxis.y - yaxis.x) * s;
    }else{
        if(xaxis.x > yaxis.y && xaxis.x > zaxis.z){
            var s = 0.5 / Math.sqrt(1.0 + xaxis.x - yaxis.y - zaxis.z);
            quaternion.w = (zaxis.x - xaxis.z) * s;
            quaternion.x = (yaxis.x + xaxis.y) * s;
            quaternion.y = 0.25 / s;
            quaternion.z = (zaxis.y +yaxis.z) *s;
        }else if(yaxis.y > zaxis.z){
            var s = 0.5 / Math.sqrt(1.0 + yaxis.y - xaxis.x - zaxis.z);
            quaternion.w = (zaxis.x - xaxis.z) * s;
            quaternion.x = (yaxis.x + xaxis.y) * s;
            quaternion.y = 0.25 / s;
            quaternion.z = (zaxis.y +yaxis.z) * s;
        }else{
            var s = 0.5 / Math.sqrt(1.0 + zaxis.z - xaxis.x - yaxis.y);
            quaternion.w = (xaxis.y - yaxis.x) * s;
            quaternion.x = (zaxis.x + xaxis.z) * s;
            quaternion.y = (zaxis.y + yaxis.z) * s;
            quaternion.z = 0.25 / s;
        }
    }

    return {
        translation : translation,
        scale : scale,
        quaternion :quaternion
    }

};

dt.ToolUilts.determinant = function (m) {
    var a0 = m[0] * m[5] - m[1] * m[4];
    var a1 = m[0] * m[6] - m[2] * m[4];
    var a2 = m[0] * m[7] - m[3] * m[4];
    var a3 = m[1] * m[6] - m[2] * m[5];
    var a4 = m[1] * m[7] - m[3] * m[5];
    var a5 = m[2] * m[7] - m[3] * m[6];
    var b0 = m[8] * m[13] - m[9] * m[12];
    var b1 = m[8] * m[14] - m[10] * m[12];
    var b2 = m[8] * m[15] - m[11] * m[12];
    var b3 = m[9] * m[14] - m[10] * m[13];
    var b4 = m[9] * m[15] - m[11] * m[13];
    var b5 = m[10] * m[15] - m[11] * m[14];

    return (a0 *b5 - a1* b4 + a2 * b3 + a3 * b2 - a4* b1 + a5 * b0);
};

/**
 * 按顺序缩放显示
 * @param {Array.<cc.Node>} elmArr 元素
 * @param spaceTime 间隔实践
 * @param offsetScale
 * @param motionTime 动画执行时间
 */
dt.ToolUilts.inSequenceScaleAppear = function(elmArr, spaceTime, offsetScale, motionTime) {
    var len = elmArr.length;
    var delay = 0;
    for(var i=0; i<len; i++) {
        app.effect.inScaleAppear(elmArr[i], offsetScale, delay, motionTime);
        delay += spaceTime;
    }
};

dt.ToolUilts.inScaleAppear = function(elm, offsetScale, delay, motionTime) {
    elm.setScale(1-offsetScale);
    elm.runAction(
        cc.sequence(
            cc.delayTime(delay),
            cc.callFunc(
                function(){
                    elm.setOpacity(30);
                    elm.setVisible(true);
                }
            ),
            cc.spawn(
                cc.fadeIn(motionTime),
                cc.scaleTo(motionTime, 1.1, 1.1)
            ),
            cc.scaleTo(motionTime, 1, 1)
        )
    );
};

/**
 * 文本改变动画
 * @param label
 * @param labelStr
 * @param fadeOutTime
 * @param fadeOutScale
 * @param fadeInTime
 */
dt.ToolUilts.labelChange = function(label, labelStr, fadeOutTime, fadeOutScale, fadeInTime) {
    label.runAction(
        cc.sequence(
            cc.spawn(
                cc.fadeOut(fadeOutTime),
                cc.scaleTo(fadeOutTime, fadeOutScale, fadeOutScale)
            ),
            cc.callFunc(function(){label.setString(labelStr)}),
            //cc.delayTime(0.1),
            cc.spawn(
                cc.fadeIn(fadeInTime),
                cc.scaleTo(fadeInTime, 1, 1)
            )
        )
    );
};

/**
 * 缩放 fadeIn显示
 * @param node
 * @param initScale
 * @param fadeInTime
 */
dt.ToolUilts.scaleFadeIn = function(node, initScale, fadeInTime) {
    node.setOpacity(0);
    node.setScale(initScale);
    node.setVisible(true);
    node.runAction(
        cc.spawn(
            cc.fadeIn(fadeInTime),
            cc.scaleTo(fadeInTime, 1, 1)
        )
    );
};

dt.ToolUilts.equalsVec3 = function(vec1, vec2){    // = cc.kmVec3AreEqual
    var EPSILON = cc.math.EPSILON;
    return (vec1.x < (vec2.x + EPSILON) && vec1.x > (vec2.x - EPSILON)) &&
        (vec1.y < (vec2.y + EPSILON) && vec1.y > (vec2.y - EPSILON)) &&
        (vec1.z < (vec2.z + EPSILON) && vec1.z > (vec2.z - EPSILON));
};

dt.ToolUilts.getRandomIntInclusive = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};


/**
 *  创建滚动字幕
 * @param txt
 * @param fontsize
 * @param {cc.Color|null} color
 * @param width
 * @param height
 * @returns {cc.Node|*}
 */
dt.ToolUilts.createClipRoundText = function(txt,fontsize,color,width,height){
    var text = new cc.LabelTTF(txt,"Arial",fontsize);
    cc.log('text width:'+text.width);
    text.setColor(color?color:cc.color.BLUE);
    text.anchorX = 0;
    if(text.width<=width){
        text.anchorY = 0;
        return text;
    }
    var cliper = new cc.ClippingNode();
    var drawNode = new cc.DrawNode();
    drawNode.drawRect(cc.p(0,0),cc.p(width,height),cc.color.WHITE);
    cliper.setStencil(drawNode);
    cliper.anchorX = 0.5;
    cliper.anchorY = 0.5;
    text.y = height/2;
    cliper.addChild(text);
    text.x = width+fontsize;
    text.runAction(cc.repeatForever(cc.sequence(
        cc.moveTo(text.width/width*5,cc.p(-text.width,text.y)),
        cc.callFunc(function(){
            text.x = width+fontsize;
        }))));
    return cliper;
};

dt.ToolUilts.createClipRoundTextVertical = function(txt,fontsize,color,width,height){
    var text = new cc.LabelTTF(txt,"Arial",fontsize);
    cc.log('text width:'+text.width);
    text.setColor(color?color:cc.color.BLUE);
    text.anchorX = 0;
    text.anchorY = 1;
    if(text.height<=height){
        text.anchorY = 0;
        return text;
    }
    var cliper = new cc.ClippingNode();
    var drawNode = new cc.DrawNode();
    drawNode.drawRect(cc.p(0,0),cc.p(width,height),cc.color.WHITE);
    cliper.setStencil(drawNode);
    cliper.anchorX = 1;
    cliper.anchorY = 1;
    text.y = 0;
    text.x = 0;
    cliper.addChild(text);
    text.x = 0;//width+fontsize;
    //text.setDimensions(cc.size(width,text.height));
    text.height = text.height + height;
    text.runAction(cc.repeatForever(cc.sequence(
        cc.delayTime(Math.random()),
        cc.moveTo(text.height/height*3,cc.p(text.y,text.height)),
        //cc.moveTo(text.height/height*2,cc.p(text.y,-text.height)),
        cc.callFunc(function(){
            text.y = 0;
        }))));
    return cliper;
};

//截取IP
dt.ToolUilts.ensureIPv4Address = function(ip){
    var index = ip.lastIndexOf(":");
    if (index >= 0) {
        return ip.substr(index + 1);
    }else{
        return ip;
    }
};

//保留一位小数
dt.ToolUilts.toDecimal = function(num){
    return Math.floor(num * 10) / 10;
};

