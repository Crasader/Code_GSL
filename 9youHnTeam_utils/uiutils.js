

dt.UIUtils = {};
dt.UIUtils.VERTICAL = 1;
dt.UIUtils.HORIZONTAL = 2;

/**
 * 获取9宫格图片
 * @param n 图片名称
 * @param w
 * @param h
 * @returns {cc.Scale9Sprite}
 */
dt.UIUtils.getScale9Sprite = function(name, w, h, rect) {
    var sp = new cc.Scale9Sprite(name, rect);
    sp.width = w;
    sp.height = h;
    return sp;
};

/**
 * 获取一个简单按钮
 * @param name
 * @param str
 * @param handler
 */
dt.UIUtils.getSimpleButton = function(name, str, handler, txtSize, txtColorValue, textureType) {
    var btn = new ccui.Button();
    if(textureType == ccui.Widget.PLIST_TEXTURE) {
        btn.loadTextures(name, '', '', ccui.Widget.PLIST_TEXTURE);
    }else{
        btn.loadTextures(name, '', '', ccui.Widget.LOCAL_TEXTURE);
    }

    if(str){
        btn.setTitleText(str);
    }
    if(txtSize) {
        btn.setTitleFontSize(txtSize);
    }
    if(txtColorValue || txtColorValue === 0) {
        btn.setTitleColor(txtColorValue);
    }
    if(handler) {
        btn.addClickEventListener(handler);
    }

    btn.setTitleFontName("Marker Felt");

    return btn;
};

/**
 * 获得一个cc.LabelTTF
 * @param str
 * @param size
 * @param fontName
 * @param txtColorValue
 * @returns {cc.LabelTTF}
 */
dt.UIUtils.getSimpleLabel = function(str, size, fontName, txtColorValue) {
    var node = new cc.LabelTTF(str);
    if(fontName) {
        node.fontName = fontName;
    }
    if(size) {
        node.fontSize = size;
    }
    if(txtColorValue || txtColorValue === 0) {
        node.color = dt.ToolUilts.getCCColor(txtColorValue);
    }
    return node;
};

dt.UIUtils.getRichText = function(elementArray, pos, size, horizonAlig, verticalAlig){
    var richText = new ccui.RichText()

    if (!horizonAlig) horizonAlig = cc.TEXT_ALIGNMENT_LEFT;
    if (!verticalAlig) verticalAlig = cc.VERTICAL_TEXT_ALIGNMENT_TOP
    //richText.setTextHorizontalAlignment(horizonAlig)
    //richText.setTextVerticalAlignment(verticalAlig)
    richText._textHorizontalAlignment = horizonAlig
    richText._textVerticalAlignment = verticalAlig

    if (pos) richText.setPosition(pos);
    if (size) richText.setContentSize(size);
    richText.setAnchorPoint(0.5, 0.5)

    for (var i = 0; i < elementArray.length; ++i){
        var element = null;
        var tag = i + 1;
        var color = cc.color("#ffffff");
        var opacity = 255;
        var name = "请输入内容";
        var fontName =  dt.FontConfig.SOURCEHANSANSCN_REGULAR;
        var fontSize = 20;

        if (elementArray[i].tag) tag = elementArray[i].tag;
        if (elementArray[i].color) color = elementArray[i].color;
        if (elementArray[i].opacity) opacity = elementArray[i].opacity;
        if (elementArray[i].name) name = elementArray[i].name;
        if (elementArray[i].fontName) fontName = elementArray[i].fontName;
        if (elementArray[i].fontSize) fontSize = elementArray[i].fontSize;
        element  = new ccui.RichElementText(tag, color, opacity, name, fontName, fontSize);
        richText.pushBackElement(element);
    }

    return richText;
};

/**
 * 获得一个editbox
 * @param ccSize
 * @param fontSize
 * @param bg
 * @param maxLen
 * @param colorValue
 * @param placeHolderStr
 * @param placeHolderColor
 * @returns {cc.EditBox}
 */
dt.UIUtils.getEditBox = function(ccSize, fontSize, bg, maxLen, colorValue, placeHolderStr, placeHolderColor) {
    var ebx = new cc.EditBox(ccSize, new cc.Scale9Sprite(bg));
    if(fontSize) {
        ebx.setFontSize(fontSize);
    }
    if(maxLen) {
        ebx.setMaxLength(maxLen);
    }
    if(colorValue) {
        ebx.setFontColor(dt.ToolUilts.getCCColor(colorValue));
    }else {
        ebx.setFontColor(dt.ToolUilts.getCCColor(0x000000));
    }
    if(placeHolderStr) {
        ebx.setPlaceHolder(placeHolderStr);
    }
    if(placeHolderColor) {
        ebx.setPlaceholderFontColor(dt.ToolUilts.getCCColor(placeHolderColor));
    }
    return ebx;
};

/**
 * 获取 动画帧名字
 * @param sIndex 开始下标
 * @param eIndex 结束下标
 * @param isFlashExport 是否是flash导出的序列图(flash导出的序列图有000前导字符)
 */
dt.UIUtils.getFrameNames = function(name, sIndex, eIndex, isFlashExport) {
    var ret = [];
    for(var i=sIndex; i<eIndex; i++) {
        if(isFlashExport) {
            if(i < 10) {
                ret.push(name + '000' + i + '.png');
            } else if(i >= 10 && i < 100) {
                ret.push(name + '00' + i + '.png');
            }else {
                ret.push(name + '0' + i + '.png');
            }
        }else {
            ret.push(name + i + '.png');
        }
    }
    return ret;
};

/**
 * 获取帧动画
 * @param frameNameArr 帧资源名数组
 * @param delayPerUnit 帧之间的间隔事件
 * @param restoreOriginal 动画执行后是否还原初始状态
 */
dt.UIUtils.getAnimation = function(frameNameArr, delayPerUnit, restoreOriginal) {
    var animation = new cc.Animation();
    var len = frameNameArr.length;
    for(var i=0; i<len; i++) {
        var sf = cc.spriteFrameCache.getSpriteFrame(frameNameArr[i]);
        animation.addSpriteFrame(sf);
    }
    animation.setDelayPerUnit(delayPerUnit);
    //animation.setRestoreOriginalFrame(true);
    return animation;
};

    /**
     * 设置 节点的长宽（解决直接设置节点长宽无效问题）
     * @param node
     * @param w
     * @param h
     */
dt.UIUtils.setSize = function(node, w, h) {
    var oldW = node.width;
    var oldH = node.height;
    var scaleX = w/oldW;
    var scaleY = h/oldH;
    node.setScaleX(scaleX);
    node.setScaleY(scaleY);
    return node;
};


/**
 * 水平居中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignHCenter = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var x = refNode.x;
    var size = refNode.getContentSize();
    var anchorX = refNode.anchorX;
    var refNodeBoundL = x - size.width * anchorX;

    var node;
    var s;
    var nAnchorX;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorX = node.anchorX;
            node.x = refNodeBoundL + (size.width - s.width)/2 + s.width * nAnchorX + offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorX = node.anchorX;
        node.x = refNodeBoundL + (size.width - s.width)/2 + s.width * nAnchorX + offset;
    }
};

/**
 * 垂直居中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignVCenter = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var y = refNode.y;
    var size = refNode.getContentSize();
    var anchorY = refNode.anchorY;
    var refNodeBoundB = y - size.height * anchorY;

    var node;
    var s;
    var nAnchorY;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorY = node.anchorY;
            node.y = refNodeBoundB + (size.height - s.height)/2 + s.height * nAnchorY + offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorY = node.anchorY;
        node.y = refNodeBoundB + (size.height - s.height)/2 + s.height * nAnchorY + offset;
    }
};
/**
 * 居中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignCenter = function(refNode, nodes, offsetH, offsetV) {
    dt.UIUtils.alignHCenter(refNode, nodes, offsetH);
    dt.UIUtils.alignVCenter(refNode, nodes, offsetV);
};

/**
 * 左对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignLeft = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var x = refNode.x;
    var size = refNode.getContentSize();
    var anchorX = refNode.anchorX;
    var refNodeBoundL = x - size.width * anchorX;

    var node;
    var s;
    var nAnchorX;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorX = node.anchorX;
            node.x = refNodeBoundL + s.width * nAnchorX + offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorX = node.anchorX;
        node.x = refNodeBoundL + s.width * nAnchorX + offset;
    }
};

/**
 * 右对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignRight = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var x = refNode.x;
    var size = refNode.getContentSize();
    var anchorX = refNode.anchorX;
    var refNodeBoundR = x + size.width * (1-anchorX);

    var node;
    var s;
    var nAnchorX;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorX = node.anchorX;
            node.x = refNodeBoundR - s.width * (1-nAnchorX) - offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorX = node.anchorX;
        node.x = refNodeBoundR - s.width * (1-nAnchorX) - offset;
    }
};
/**
 * 顶对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignTop = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var y = refNode.y;
    var size = refNode.getContentSize();
    var anchorY = refNode.anchorY;
    var refNodeBoundT = y + size.height * (1-anchorY);

    var node;
    var s;
    var nAnchorY;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorY = node.anchorY;
            node.y = refNodeBoundT - s.height * (1-nAnchorY) - offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorY = node.anchorY;
        node.y = refNodeBoundT - s.height * (1-nAnchorY) - offset;
    }
};

/**
 * 顶对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignBottom = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var y = refNode.y;
    var size = refNode.getContentSize();
    var anchorY = refNode.anchorY;
    var refNodeBoundB = y - size.height * anchorY;

    var node;
    var s;
    var nAnchorY;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorY = node.anchorY;
            node.y = refNodeBoundB + s.height * nAnchorY + offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorY = node.anchorY;
        node.y = refNodeBoundB + s.height * nAnchorY + offset;
    }
};

/**
 * 左上对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignTL = function(refNode, nodes, offsetT, offsetL) {
    dt.UIUtils.alignTop(refNode, nodes, offsetT);
    dt.UIUtils.alignLeft(refNode, nodes, offsetL);
};

/**
 * 右上对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignTR = function(refNode, nodes, offsetT, offsetR) {
    dt.UIUtils.alignTop(refNode, nodes, offsetT);
    dt.UIUtils.alignRight(refNode, nodes, offsetR);
};

/**
 * 左下对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignBL = function(refNode, nodes, offsetB, offsetL) {
    dt.UIUtils.alignBottom(refNode, nodes, offsetB);
    dt.UIUtils.alignLeft(refNode, nodes, offsetL);
};

/**
 * 右下对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignBR = function(refNode, nodes, offsetB, offsetR) {
    dt.UIUtils.alignBottom(refNode, nodes, offsetB);
    dt.UIUtils.alignRight(refNode, nodes, offsetR);
};

/**
 * 上中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignTC = function(refNode, nodes, offsetT, offsetC) {
    dt.UIUtils.alignTop(refNode, nodes, offsetT);
    dt.UIUtils.alignHCenter(refNode, nodes, offsetC);
};

/**
 * 下中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignBC = function(refNode, nodes, offsetB, offsetC) {
    dt.UIUtils.alignBottom(refNode, nodes, offsetB);
    dt.UIUtils.alignHCenter(refNode, nodes, offsetC);
};

/**
 * 左中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignLC = function(refNode, nodes, offsetL, offsetC) {
    dt.UIUtils.alignLeft(refNode, nodes, offsetL);
    dt.UIUtils.alignVCenter(refNode, nodes, offsetC);
};

/**
 * 右中对齐
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignRC = function(refNode, nodes, offsetR,  offsetC) {
    dt.UIUtils.alignRight(refNode, nodes, offsetR);
    dt.UIUtils.alignVCenter(refNode, nodes, offsetC);
};

/**
 * 在refNode之上
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignAboveTop = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var y = refNode.y;
    var size = refNode.getContentSize();
    var anchorY = refNode.anchorY;
    var refNodeBoundT = y + size.height * (1-anchorY);

    var node;
    var s;
    var nAnchorY;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorY = node.anchorY;
            node.y = refNodeBoundT + s.height * nAnchorY + offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorY = node.anchorY;
        node.y = refNodeBoundT + s.height * nAnchorY + offset;
    }
};

/**
 * 在refNode之下
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignBelowBottom = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var y = refNode.y;
    var size = refNode.getContentSize();
    var anchorY = refNode.anchorY;
    var refNodeBoundB = y - size.height * anchorY;

    var node;
    var s;
    var nAnchorY;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorY = node.anchorY;
            node.y = refNodeBoundB - s.height * (1-nAnchorY) - offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorY = node.anchorY;
        node.y = refNodeBoundB - s.height * (1-nAnchorY) - offset;
    }
};

/**
 * 在refNode左边
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignLeftSide = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var x = refNode.x;
    var size = refNode.getContentSize();
    var anchorX = refNode.anchorX;
    var refNodeBoundL = x - size.width * anchorX;

    var node;
    var s;
    var nAnchorX;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorX = node.anchorX;
            node.x = refNodeBoundL - s.width * (1-nAnchorX) - offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorX = node.anchorX;
        node.x = refNodeBoundL - s.width * (1-nAnchorX) - offset;
    }
};
/**
 * 在refNode右边
 * @param refNode
 * @param nodes
 */
dt.UIUtils.alignRightSide = function(refNode, nodes, offset) {
    if(!offset) offset = 0;
    var x = refNode.x;
    var size = refNode.getContentSize();
    var anchorX = refNode.anchorX;
    var refNodeBoundR = x + size.width * (1-anchorX);

    var node;
    var s;
    var nAnchorX;
    if(cc.isArray(nodes)) {
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            node = nodes[i];
            s = node.getContentSize();
            nAnchorX = node.anchorX;
            node.x = refNodeBoundR + s.width * nAnchorX + offset;
        }
    }else {
        node = nodes;
        s = node.getContentSize();
        nAnchorX = node.anchorX;
        node.x = refNodeBoundR + s.width * nAnchorX + offset;
    }
};

dt.UIUtils.alignAboveTopL = function(refNode, nodes, offsetT, offsetL) {
    dt.UIUtils.alignAboveTop(refNode, nodes, offsetT);
    dt.UIUtils.alignLeft(refNode, nodes, offsetL);
};
dt.UIUtils.alignAboveTopC = function(refNode, nodes, offsetT, offsetC) {
    dt.UIUtils.alignAboveTop(refNode, nodes, offsetT);
    dt.UIUtils.alignHCenter(refNode, nodes, offsetC);
};
dt.UIUtils.alignAboveTopR = function(refNode, nodes, offsetT, offsetR) {
    dt.UIUtils.alignAboveTop(refNode, nodes, offsetT);
    dt.UIUtils.alignRight(refNode, nodes, offsetR);
};

dt.UIUtils.alignRightSideT = function(refNode, nodes, offsetR, offsetT) {
    dt.UIUtils.alignRightSide(refNode, nodes, offsetR);
    dt.UIUtils.alignTop(refNode, nodes, offsetT);
};
dt.UIUtils.alignRightSideC = function(refNode, nodes, offsetR, offsetC) {
    dt.UIUtils.alignRightSide(refNode, nodes, offsetR);
    dt.UIUtils.alignVCenter(refNode, nodes, offsetC);
};
dt.UIUtils.alignRightSideB = function(refNode, nodes, offsetR, offsetB) {
    dt.UIUtils.alignRightSide(refNode, nodes, offsetR);
    dt.UIUtils.alignBottom(refNode, nodes, offsetB);
};

dt.UIUtils.alignBelowBottomL = function(refNode, nodes, offsetB, offsetL) {
    dt.UIUtils.alignBelowBottom(refNode, nodes, offsetB);
    dt.UIUtils.alignLeft(refNode, nodes, offsetL);
};
dt.UIUtils.alignBelowBottomC = function(refNode, nodes, offsetB, offsetC) {
    dt.UIUtils.alignBelowBottom(refNode, nodes, offsetB);
    dt.UIUtils.alignHCenter(refNode, nodes, offsetC);
};
dt.UIUtils.alignBelowBottomR = function(refNode, nodes, offsetB, offsetR) {
    dt.UIUtils.alignBelowBottom(refNode, nodes, offsetB);
    dt.UIUtils.alignRight(refNode, nodes, offsetR);
};

dt.UIUtils.alignLeftSideT = function(refNode, nodes, offsetL, offsetT) {
    dt.UIUtils.alignLeftSide(refNode, nodes, offsetL);
    dt.UIUtils.alignTop(refNode, nodes, offsetT);
};
dt.UIUtils.alignLeftSideC = function(refNode, nodes, offsetL, offsetC) {
    dt.UIUtils.alignLeftSide(refNode, nodes, offsetL);
    dt.UIUtils.alignVCenter(refNode, nodes, offsetC);
};
dt.UIUtils.alignLeftSideB = function(refNode, nodes, offsetL, offsetB) {
    dt.UIUtils.alignLeftSide(refNode, nodes, offsetL);
    dt.UIUtils.alignBottom(refNode, nodes, offsetB);
};