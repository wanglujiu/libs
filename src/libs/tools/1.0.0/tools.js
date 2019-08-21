/**
 * @Author: 鑫木
 * @Date:   2017/3/31
 * @Last Modified by:   鑫木
 * @Last Modified time: 2017/3/31
 * @description 工具方法
 */
;
(function(global) {
    function Tools() {
        this._initParams();
    }

    /**
     * @description {初始化参数}
     */
    Tools.prototype._initParams = function() {
        var self = this;
    };

    /**
     * @description{获取url参数}
     * @param {url:[],type[String]}
     * @param {name:[],type[String]}
     * @example {当前url：getUrlParams(name);指定url：getUrlParams(url,name)}
     */
    Tools.prototype.getUrlParams = function() {
        switch (arguments.length) {
            case 1:
                var url = window.location.href,
                    name = arguments[0];
                return _factory(url, name);
                break;
            case 2:
                var url = arguments[0],
                    name = arguments[1];
                return _factory(url, name);
                break;
        }

        function _factory(a, b) {
            var reg = new RegExp("(^|&)" + b + "=([^&]*)(&|$)");
            a = a.indexOf('?') === -1 ? '' : a.split('?')[1];
            var r = a.match(reg);
            return r != null ? decodeURI(r[2]) : null;
        }
    };

    /**
     * @description{处理url后面的参数，返回obj 适用于app内页的通用跳转}
     * @param {url:[],type[String]}
     * @example {当前url：transUrlParamsToObj();指定url：transUrlParamsToObj(url)}
     */
    Tools.prototype.transUrlParamsToObj = function() {
        switch (arguments.length) {
            case 0:
                var url = window.location.href;
                return _factory(url);
                break;
            case 1:
                var url = arguments[0];
                return _factory(url);
                break;
        }

        function _factory(a) {
            var obj = {};
            try {
                if (a.indexOf('?') !== -1) { // 判断是否有参数
                    var paramsSting = a.split('?')[1];
                    if (paramsSting.indexOf('&') !== -1) { // 判断参数格式是否正确
                        var paramsArray = paramsSting.split('&');
                        for (var i = 0; i < paramsArray.length; i++) {
                            if(paramsArray[i].indexOf('=') !== -1){
                                var paramArray = paramsArray[i].split('=');
                                obj[paramArray[0]] = paramArray[1];
                            }
                        }
                    }
                }
            } catch (e) {
                console.log('转换失败：' + e);
            }
            return obj;
        }
    };

    /**
     * @description H5获取当前地理位置
     * @param 函数参数
     * @return [lon,lat]
     * @example 函数使用示例
     */
    Tools.prototype.getLocation = function(callback) {
        var res = {};
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                    var lat = pos.coords.latitude;
                    var lon = pos.coords.longitude;
                    res.lat = lat;
                    res.lon = lon;
                    callback(res);
                }, function(error) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("用户拒绝对获取地理位置的请求。");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("位置信息是不可用的。");
                            break;
                        case error.TIMEOUT:
                            alert("请求用户地理位置超时。");
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("未知错误。");
                            break;
                    }
                }, {
                    enableHightAccuracy: true, //获取高精度位置
                    maximumAge: 30000, //过期时间
                    timeout: 15000 //15s的等待时间
                });
            } else {
                alert('你的浏览器不支持获取地理位置信息');
            }
        } catch (e) {
            alert('获取地理位置信息失败');
        }
    };

    /* 普通数组的增删改查 */
    Tools.prototype.addArray = function() { // 数组中添加一个元素,返回添加后的数组

    }

    Tools.prototype.deleteArray = function() { // 数组中删除一个元素,返回删除后的数组

    }

    Tools.prototype.updateArray = function() { // 数组中更新一个元素,返回更新后的数组

    }

    /* 对象数组的增删改查 */
    Tools.prototype.addObjArray = function() { // 数组中添加一个对象,返回添加后的数组

    }

    Tools.prototype.deleteObjArray = function() { // 数组中删除一个对象,返回删除后的数组

    }

    Tools.prototype.updateObjArray = function() { // 数组中更新一个对象,返回更新后的数组

    }

    /* 把本地图片路径转换成base64展示  注：需要在apiready中调用才能生效 */
    Tools.prototype.decodeImgToBase64 = function(path) {
        alert(path);
        var trans = api.require('trans');
        trans.decodeImgToBase64({
            imgPath: path
        }, function(ret, err) {
            if (ret.status) {
                alert(JSON.stringify(ret));
            } else {
                alert(JSON.stringify(err));
            }
        });
    }

    Tools.prototype.replaceHideCharacter = function(string,start,end) { // 替换隐藏字符
        var res = '';
        try {
            if(typeof string === 'string'){
                if(string.length > 2){
                    // console.log(string[start-1] + string[string.length - end]);
                    for (var i = 0; i < string.length; i++) {
                        if(i > start-1 && i < string.length - end){
                            res += '*';
                        }else {
                            res += string[i];
                        }
                    }
                }else {
                    res = string;
                }
            }
        } catch (e) {
            console.log(e);
        }
        return res;
    }

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = new Tools();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(new Tools());
    } else {
        global.Tools = new Tools();
    }
})(typeof window !== 'undefined' ? window : global);
