/**
 * Created by yangyi on 2018/10/24.
 */

dt.ShareUtils = {};

/**
 * 处理程序拉起携带的参数处理
 * @param queryStr
 */
dt.ShareUtils.processLaunchUrlStr = function(queryStr) {
    if(queryStr && dt.SceneController.getCurSceneType() == dt.SceneType.Lobby){
        var queryParam = dt.StringUtils.urlQueryStrToObj(queryStr);
        if(queryParam.hasOwnProperty("type")) {
            //联盟俱乐部分享拉起
            var shareType = parseInt(queryParam["type"]);
            if(shareType == proto.jiuyou.ClubType.CLUBTYPE_NORMAL || shareType == proto.jiuyou.ClubType.CLUBTYPE_UNION ) {
                var groupId = queryParam["groupId"];
                var inviteUid = queryParam["inviteUid"];
                dt.SocketMgr.sendMsg(
                    dt.SocketCmd.ClubShareJoin,
                    {
                        Type:shareType,
                        Clubid:groupId,
                        Inviteuserid:inviteUid
                    }
                );
                return true;
            }
        }else{
            //邀请进入房间拉起
            var roomId = queryParam["roomId"];
            if(roomId) {
                dt.SocketMgr.sendMsg(dt.SocketCmd.RoomEnter, {Roomid: roomId});
                return true;
            }
        }
    }
    return false;
};

/**
 * 分享房间号
 * @param title
 * @param message
 * @param roomId
 */
dt.ShareUtils.shareRoomCode = function(title, message, roomId) {
    var data = {
        title   : title,
        message : message,
        urlParam: null
    };
    data.urlParam = {roomId:roomId};
    dt.extension.shareCode(data);
};

/**
 * 分享(联盟|俱乐部)分享信息
 * @param {proto.jiuyou.ClubType} type 类型
 * @param groupName 组织名字
 * @param groupId 组织id
 * @returns {ret|*}
 */
dt.ShareUtils.shareGroup = function(type , groupName, groupId) {
    if(type == proto.jiuyou.ClubType.CLUBTYPE_NORMAL || type == proto.jiuyou.ClubType.CLUBTYPE_UNION) {
        var data = {
            title   : "点击即可加入{0}—{1}:{2} 就等你来！！！",
            message : "{0} 我是[{1}] [ID:{2}] 点击链接直接进入{3}，就等你了！",
            urlParam: null
        };
        var groupTypeName = "";
        if(type == proto.jiuyou.ClubType.CLUBTYPE_NORMAL) {
            groupTypeName = "俱乐部";
        }else if(type == proto.jiuyou.ClubType.CLUBTYPE_UNION) {
            groupTypeName = "大联盟";
        }
        data.title = dt.StringUtils.substitute(data.title, [dt.Config.appName,groupTypeName, groupName]);
        data.message = dt.StringUtils.substitute(data.message, [groupTypeName, groupName, groupId, groupTypeName]);
        data.urlParam = {type:type, groupId:groupId, inviteUid:dt.ModelCenter.userInf.uid};
        dt.extension.shareCode(data);
    }
};

/**
 * 分享房间文字
 * @param data
 */
dt.ShareUtils.shareRoomIdText = function(data) {
    var shareData = data;
    var gameName = G_RoomCfg.GameLoader.getName();
    var shareString = shareData.title + "(" + gameName +")" + shareData.message;
    shareString += "(复制此消息打开即可快速进房)";
    dt.extension.shareText(shareString);
};

dt.ShareUtils.getClipBoardRoomId = function(str) {
    if(!str || str == ""){
        return "";
    }
    var regEx = /\u3010\u623f\u95f4\u53f7\uff1a(\d{6,8})\u3011/gi;
    var ret = regEx.exec(str);
    if(ret) {
        return ret[1];
    }
    return "";
};
