/*
 * 公共控件
 */

dt.utilWidget = {};

// 多选view添加事件
dt.utilWidget.addCheckBoxEvent = function(boxnum, root, definedList, callback, boxtype){
    var defList = definedList.concat();
    for (var i=1; i<=boxnum; i++){
        var select = dt.ToolUilts.seekWidgetByName(root, "select_" + i);
        var selectText = dt.ToolUilts.seekWidgetByName(root, "selectText_" + i);
        selectText.setTouchEnabled(true);
        selectText.setTag(i);
        select.setTag(i);
        select.setUserData({boxNum:boxnum, boxType:boxtype, callback:callback});
        selectText.setUserData({boxNum:boxnum,boxType:boxtype, callback:callback});
        select.addTouchEventListener(this.onCheckBoxEvent.bind(this), this);
        selectText.addTouchEventListener(this.onCheckBoxEvent.bind(this), this);
        if (-1 < defList.indexOf(i)){
            select.setBright(false);
            this.onCheckBoxEvent(select, ccui.Widget.TOUCH_ENDED)
        }else{
            select.setBright(false);
            selectText.setColor(cc.color(255,255,255,255));
        }
    }
};

// 单选回调
dt.utilWidget.onCheckBoxEvent = function(sender, type){
    if (type == ccui.Widget.TOUCH_ENDED) {
        var tag = sender.getTag();
        var data = sender.getUserData();
        var root = sender.getParent().getParent();
        var boxType = data.boxType;
        var select = dt.ToolUilts.seekWidgetByName(root, "select_" + tag);
        var selectText = dt.ToolUilts.seekWidgetByName(root, "selectText_" + tag);
        if (1 == boxType){
            if (select.isBright()){
                select.setBright(false);
                selectText.setColor(cc.color(255,255,255,255));
                data.callback(tag);
            }else{
                select.setBright(true);
                selectText.setColor(cc.color(255,0,0,255));
                data.callback(tag);
            }
        }
        else{
            for (var i=1; i<=data.boxNum; i++){
                var select = dt.ToolUilts.seekWidgetByName(root, "select_" + i);
                var selectText = dt.ToolUilts.seekWidgetByName(root, "selectText_" + i);
                if (sender == select || sender == selectText ){
                    if (select.isBright()){
                        select.setBright(false);
                        selectText.setColor(cc.color(255,255,255,255));
                        data.callback(i, false, root.getName());
                    }else{
                        select.setBright(true);
                        selectText.setColor(cc.color(255,0,0,255));
                        data.callback(i, true, root.getName());
                    }
                }else{
                    if (select.isBright()){
                        selectText.setColor(cc.color(255,0,0,255));
                        data.callback(i, true, root.getName());
                    }else{
                        selectText.setColor(cc.color(255,255,255,255));
                        data.callback(i, false, root.getName());
                    }                       
                }
            }
        }
    }
};

// 单选view添加事件
dt.utilWidget.addRadioEvent = function(radioNum, root, defined, callback){
    for (var i=1; i<=radioNum; i++){
        var select = dt.ToolUilts.seekWidgetByName(root, "select_" + i);
        var selectText = dt.ToolUilts.seekWidgetByName(root, "selectText_" + i);
        select.setTouchEnabled(true);
        selectText.setTouchEnabled(true);
        select.setUserData({radioNum:radioNum, callback:callback});
        selectText.setUserData({radioNum:radioNum, callback:callback});
        select.addTouchEventListener(this.onRadioCallback.bind(this), this);
        selectText.addTouchEventListener(this.onRadioCallback.bind(this), this);
        if (i == defined){
            select.setBright(true);
            selectText.setColor(cc.color(255,0,0,255));
        }else{
            select.setBright(false);
            selectText.setColor(cc.color(255,255,255,255));
        }
    }
};

// 多选回调
dt.utilWidget.onRadioCallback = function(sender, type){
    if (type == ccui.Widget.TOUCH_ENDED) {
        var radioData = sender.getUserData();
        var root = sender.getParent().getParent();
        for (var i=1; i<=radioData.radioNum; i++){
            var select = dt.ToolUilts.seekWidgetByName(root, "select_" + i);
            var selectText = dt.ToolUilts.seekWidgetByName(root, "selectText_" + i);
            if (sender == select || sender == selectText ){
                if (radioData.callback) radioData.callback(i,root.getName(), root);
                select.setBright(true);
                selectText.setColor(cc.color(255,0,0,255));
            }else{
                select.setBright(false);
                selectText.setColor(cc.color(255,255,255,255));
            }
        }
    }
};

// 下拉view添加事件
dt.utilWidget.addPulldownEvent = function(itemnum, root, defined, callback, btncb){
    var btn_pullDown = dt.ToolUilts.seekWidgetByName(root, "btn_pulldown");
    btn_pullDown.setUserData(false);
    btn_pullDown.setTouchEnabled(false);
    if (btncb) {
        btn_pullDown.addClickEventListener(btncb);
    }else{
        btn_pullDown.addClickEventListener(this.onBtnPullDown.bind(this));
    }
    btn_pullDown.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function(node) {node.setTouchEnabled(true)})));

    var text_select = dt.ToolUilts.seekWidgetByName(root, "text_select");
    var defSelectText = dt.ToolUilts.seekWidgetByName(root, "itemText_" + defined);
    text_select.setString(defSelectText.getString());

    for (var i=1; i<=itemnum; i++){
        var select = dt.ToolUilts.seekWidgetByName(root, "item_" + i);
        var selectText = dt.ToolUilts.seekWidgetByName(root, "itemText_" + i);
        select.setTouchEnabled(true);
        selectText.setTouchEnabled(true);
        select.setUserData({radioNum:itemnum, callback:this.onSelectCallback.bind(this), callback2:callback});
        selectText.setUserData({radioNum:itemnum, callback:this.onSelectCallback.bind(this), callback2:callback});
        select.addTouchEventListener(this.onPullDownCallback.bind(this), this);
        selectText.addTouchEventListener(this.onPullDownCallback.bind(this), this);
        if (i == defined){
            select.setBright(true);
            selectText.setColor(cc.color(255,0,0,255));
        }else{
            select.setBright(false);
            selectText.setColor(cc.color(255,255,255,255));
        }
    }
};

// 下拉选择回调
dt.utilWidget.onSelectCallback = function(index, tagname, root){
    var text_select = dt.ToolUilts.seekWidgetByName(root.getParent().getParent(), "text_select");
    var selectText = dt.ToolUilts.seekWidgetByName(root, "itemText_" + index);
    text_select.setString(selectText.getString());

    var btn_pullDown = dt.ToolUilts.seekWidgetByName(root.getParent().getParent(), "btn_pulldown");
    this.onBtnPullDown(btn_pullDown);

    var radioData = selectText.getUserData();
    if (radioData.callback2) radioData.callback2(index, tagname);
};

// 下拉按钮回调
dt.utilWidget.onBtnPullDown = function(node) {
    var rotate = node.getRotation();
    node.runAction(cc.rotateTo(0.01, rotate-180));

    var pulldown_list = dt.ToolUilts.seekWidgetByName(node.getParent(), "item_list");
    var flag = node.getUserData();
    if (flag) {
        node.setUserData(false);
        pulldown_list.runAction(cc.moveTo(0.1, cc.p(0, 400)));
    }else{
        node.setUserData(true);
        pulldown_list.runAction(cc.moveTo(0.1, cc.p(0, 200)));
    }
};

dt.utilWidget.onPullDownCallback = function(sender, type){
    if (type == ccui.Widget.TOUCH_ENDED) {
        var radioData = sender.getUserData();
        var root = sender.getParent().getParent();
        for (var i=1; i<=radioData.radioNum; i++){
            var select = dt.ToolUilts.seekWidgetByName(root, "item_" + i);
            var selectText = dt.ToolUilts.seekWidgetByName(root, "itemText_" + i);
            if (sender == select || sender == selectText ){
                if (radioData.callback) radioData.callback(i,root.getParent().getParent().getParent().getName(), root);
                select.setBright(true);
                selectText.setColor(cc.color(255,0,0,255));
            }else{
                select.setBright(false);
                selectText.setColor(cc.color(255,255,255,255));
            }
        }
    }
};