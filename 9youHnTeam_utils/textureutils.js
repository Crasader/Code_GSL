
dt.TextureUtils = {};

dt.TextureUtils.addTexture     = function(ownerScene, fileName){
    if('#' == fileName.charAt(0)){return;}

    var ext = cc.path.extname(fileName).toLowerCase();
    var loader = dt.TextureUtils._register[ext];
    if(!loader){
        return;
    }
    loader(fileName);
    //cc.log("add texture ", fileName);
    dt.TextureUtils._resList[ownerScene] = dt.TextureUtils._resList[ownerScene] || {};
    dt.TextureUtils._resList[ownerScene][fileName] = true;
};

dt.TextureUtils.removeTexture   = function(ownerScene, fileName){
    var ext = cc.path.extname(fileName).toLowerCase();
    var unLoader = dt.TextureUtils._unregister[ext];
    if(!unLoader){
        cc.log("ERROR! unSupport texture file ext = ", ext);
        return;
    }

    unLoader(fileName);
    cc.log("remvoe texture ", fileName);
    if(dt.TextureUtils._resList[ownerScene]){
        dt.TextureUtils._resList[ownerScene][fileName] = null;
    }

    if(Object.getOwnPropertyNames(dt.TextureUtils._resList).length == 0){
        dt.TextureUtils._resList[ownerScene] = null;
    }
};

dt.TextureUtils.removeTexturesByOwner   = function(owner){
    if(dt.TextureUtils._resList[owner]){
        var fileList = dt.TextureUtils._resList[owner];
        for(var fileName in fileList){
            if('#' == fileName.charAt(0)){
                continue;
            }

            var ext = cc.path.extname(fileName).toLowerCase();
            var unLoader = dt.TextureUtils._unregister[ext];
            if(!unLoader){
                cc.log("ERROR! unSupport texture file ext = ", ext);
                return;
            }

            unLoader(fileName);
            cc.log("remvoe texture ", fileName);
        }

        dt.TextureUtils._resList[owner] = null;
    }
};


dt.TextureUtils.isOperateExt    = function(ext){
    return dt.TextureUtils._exts [ext];
};

(function(){
    dt.TextureUtils._resList    = {};
    dt.TextureUtils._register   = {};
    dt.TextureUtils._unregister = {};
    dt.TextureUtils._exts        = {".plist" : true, ".png": true, ".jpg":true};

    dt.TextureUtils._register[".png"]               = cc.textureCache.addImage.bind(cc.textureCache);
    dt.TextureUtils._register[".jpg"]               = cc.textureCache.addImage.bind(cc.textureCache);
    dt.TextureUtils._register['.plist']             = cc.spriteFrameCache.addSpriteFrames.bind(cc.spriteFrameCache);

    dt.TextureUtils._unregister[".png"]             = cc.textureCache.removeTextureForKey.bind(cc.textureCache);
    dt.TextureUtils._unregister[".jpg"]             = cc.textureCache.removeTextureForKey.bind(cc.textureCache);
    dt.TextureUtils._unregister[".plist"]           = cc.spriteFrameCache.removeSpriteFramesFromFile.bind(cc.spriteFrameCache);

}());