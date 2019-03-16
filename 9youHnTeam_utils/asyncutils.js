/**
 * created by maidai on 2019/1/22
 **/

dt.AsyncPool = function(srcObj, limit, iterator, onEnd, target){
    var self = this;
    self._srcObj = srcObj;
    self._limit = limit;
    self._pool = [];
    self._iterator = iterator;
    self._iteratorTarget = target;
    self._onEnd = onEnd;
    self._onEndTarget = target;
    self._results = srcObj instanceof Array ? [] : {};
    self._isErr = false;
    self._schedule = null;

    cc.each(srcObj, function(value, index){
        self._pool.push({index : index, value : value});
    });

    self.size = self._pool.length;
    self.finishedSize = 0;
    self._workingSize = 0;

    self._limit = self._limit || self.size;

    self.onIterator = function(iterator, target){
        self._iterator = iterator;
        self._iteratorTarget = target;
    };

    self.onEnd = function(endCb, endCbTarget){
        self._onEnd = endCb;
        self._onEndTarget = endCbTarget;
    };

    self._handleItem = function(){
        var self = this;
        if(self._pool.length == 0 || self._workingSize >= self._limit){
            dt.GameScheduler.unSchedule("AynscScheduler");
            return;
        }

        //return directly if the working size great equal limit number
        var item = self._pool.shift();
        var value = item.value, index = item.index;
        self._workingSize++;
        self._iterator.call(self._iteratorTarget, value, index, function(err){
            if(self._isErr){
                dt.GameScheduler.unSchedule("AynscScheduler");
                return;
            }

            self.finishedSize++;
            self._workingSize--;
            if(err) {
                self._isErr = true;
                if(self._onEnd){
                    self._onEnd.call(self._onEndTarget, err);
                }

                dt.GameScheduler.unSchedule("AynscScheduler");
                return
            }

            var arr = Array.prototype.slice.call(arguments, 1);
            self._results[this.index] = arr[0];
            if (self.finishedSize === self.size) {
                if (self._onEnd){
                    self._onEnd.call(self._onEndTarget, null, self._results);
                }

                dt.GameScheduler.unSchedule("AynscScheduler");
                return;
            }
        }.bind(item), self);
    };

    self.flow = function(){
        var self = this;
        if(self._pool.length === 0) {
            if(self._onEnd)
                self._onEnd.call(self._onEndTarget, null, []);
            return;
        }

        dt.GameScheduler.schedule(self._handleItem.bind(self), self, 0 ,
            cc.REPEAT_FOREVER, false, false, "AynscScheduler");
    }
};

dt.async = {
    series : function(tasks, cb, target){
        var asyncPool = new dt.AsyncPool(tasks, 1, function(func, index, cb1){
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    parallel : function(tasks, cb, target){
        var asyncPool = new dataTransfer.AsyncPool(tasks, 0, function(func, index, cb1){
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    waterfall : function(tasks, cb, target){
        var args = [];
        var lastResults = [null];//the array to store the last results
        var asyncPool = new dt.AsyncPool(tasks, 1,
            function (func, index, cb1) {
                args.push(function (err) {
                    args = Array.prototype.slice.call(arguments, 1);
                    if(tasks.length - 1 === index) lastResults = lastResults.concat(args);//while the last task
                    cb1.apply(null, arguments);
                });
                func.apply(target, args);
            }, function (err) {
                if (!cb)
                    return;
                if (err)
                    return cb.call(target, err);
                cb.apply(target, lastResults);
            });
        asyncPool.flow();
        return asyncPool;
    },

    map : function(tasks, iterator, callback, target){
        var locIterator = iterator;
        if(typeof(iterator) === "object"){
            callback = iterator.cb;
            target = iterator.iteratorTarget;
            locIterator = iterator.iterator;
        }
        var asyncPool = new dt.AsyncPool(tasks, 0, locIterator, callback, target);
        asyncPool.flow();
        return asyncPool;
    },

    mapLimit : function(tasks, limit, iterator, cb, target){
        var asyncPool = new dt.AsyncPool(tasks, limit, iterator, cb, target);
        asyncPool.flow();
        return asyncPool;
    },
    
    finish:function () {
        dt.GameScheduler.unSchedule("AynscScheduler")
    }
};