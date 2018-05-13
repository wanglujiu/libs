/**
 * @Author: 鑫木
 * @Date:   2017/3/31
 * @Last Modified by:   鑫木
 * @Last Modified time: 2017/3/31
 * @description {日期处理}
 */
;
(function(global) {
    function DatePro() {
        this._initParams();
    }

    /**
     * @description {初始化参数}
     */
    DatePro.prototype._initParams = function() {
        var self = this;
        self.now = new Date();
    };

    /**
     * @description {{日期格式转换:月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)可以用 1-2 个占位符、周(E)可以用 1-3 个占位符
     *                          年(y)、季度(q)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)}
     * @param date[String][可选,默认返回当前时间] 要处理的日期
     * @param format[String][可选,默认"yyyy-MM-dd"] 格式
     * @return resultDate[String]
     */
    DatePro.prototype.format = function(date, format) {
        var self = this,
            resultDate;
        switch (arguments.length) {
            case 0:
                resultDate = _getDate(self.now, "yyyy-MM-dd");
                break;
            case 1:
                if (/(y+)|(M+)|(d+)|(h+)|(H+)|(m+)|(s+)|(S+)|(E+)|(q+)/.test(arguments[0]) && !/GMT/.test(arguments[0])) {
                    resultDate = _getDate(self.now, arguments[0]);
                } else {
                    resultDate = _getDate(new Date(self._getCorrectDate(arguments[0])), "yyyy-MM-dd");
                }
                break;
            case 2:
                resultDate = _getDate(new Date(self._getCorrectDate(arguments[0])), arguments[1]);
                break;
        }

        function _getDate(date, format) {
            try {
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours() % 12 == 0 ? '上午' + date.getHours() : '下午' + date.getHours() % 12, //小时
                    "H+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                var week = {
                    "0": "日",
                    "1": "一",
                    "2": "二",
                    "3": "三",
                    "4": "四",
                    "5": "五",
                    "6": "六"
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(format)) {
                    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
                }
                if (/(q+)/.test(format)) {
                    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? (RegExp.$1.length > 3 ? "第" : "") : "") : "") + o["q+"] + ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? (RegExp.$1.length > 3 ? "季度" : "季度") : "季") : ""));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (o[k].length > 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return format;
            } catch (e) {
                console.log(e);
            }
        }

        return resultDate;
    };

    /**
     * @description {获取过期时间}
     * @param date[String][必填] 需要处理的时间
     * @param time[Number][必填] 时间跨度 如2天过期
     * @param unit[String][可选 默认'd'] y(年) M(月) d(日) H(24时) m(分) s(秒)
     * @param format[String][可选 默认'yyyy-MM-dd HH:mm:ss'] 参考上面的format
     */
    DatePro.prototype.deadline = function(date, time, unit, format) {
        var self = this,
            result;
        switch (arguments.length) {
            case 2:
                var arg1 = new Date(self._getCorrectDate(arguments[0]));
                result = _factory(arg1, arguments[1], 'd', 'yyyy-MM-dd HH:mm:ss');
                break;
            case 3:
                var arg1 = new Date(self._getCorrectDate(arguments[0]));
                var arg3 = new Date(self._getCorrectDate(arguments[2]));
                if (arg3.length == 1) {
                    result = _factory(arg1, arguments[1], arg3, 'yyyy-MM-dd HH:mm:ss');
                } else {
                    result = _factory(arg1, arguments[1], 'd', arg3);
                }
                break;
            case 4:
                var arg1 = new Date(self._getCorrectDate(arguments[0]));
                result = _factory(arg1, arguments[1], arguments[2], arguments[3]);
                break;
            default:
                console.log('请输入正确的参数!');
        }

        function _factory(date, time, unit, format) {
            var Time = date.getTime(),
                S;
            switch (unit) {
                case 'y':
                    date.setFullYear(date.getFullYear() + time);
                    S = date;
                    break;
                case 'M':
                    date.setMonth(date.getMonth() + time);
                    S = date;
                    break;
                case 'd':
                    S = parseFloat(time) * 24 * 60 * 60 * 1000 + Time;
                    break;
                case 'H':
                    S = parseFloat(time) * 60 * 60 * 1000 + Time;
                    break;
                case 'm':
                    S = parseFloat(time) * 60 * 1000 + Time;
                    break;
                case 's':
                    S = parseFloat(time) * 1000 + Time;
                    break;
            }

            var final = S;
            // alert(final);
            return self.format(final, format);
        }
        return result;
    }

    /**
     * @description {获取时间跨度}
     * @param startDate[String][可选,默认当前时间] 开始时间
     * @param endDate[String][必填 不能为当前时间] 结束时间
     * @param type[String][可选 默认'year'] 返回形式 'year'由秒-年 'day'由秒-时 天显示日期   y年 M月 d日 H时 m分 s秒
     */
    DatePro.prototype.span = function(startDate, endDate, type) {
        var self = this,
            result;
        switch (arguments.length) {
            case 1:
                if (arguments[0] === 'year' || arguments[0] === 'day') {
                    console.log('请输入时间!');
                } else {
                    var arg = new Date(self._getCorrectDate(arguments[0]));
                    if (arg.getTime() == self.now.getTime()) {
                        console.log('不能输入当前时间!');
                    } else {
                        result = _factory(self.now, arg, 'year');
                    }
                }
                break;
            case 2:
                if (arguments[0].match(/year|y|M|d|H|m|s/g)) {
                    console.log('请输入正确的参数!');
                } else {
                    if (arguments[1].match(/year|y|M|d|H|m|s/g)) {
                        var arg = new Date(self._getCorrectDate(arguments[0]));
                        if (arg.getTime() == self.now.getTime()) {
                            console.log('不能输入当前时间!');
                        } else {
                            result = _factory(self.now, arg, arguments[1]);
                        }
                    } else {
                        var arg1 = new Date(self._getCorrectDate(arguments[0]));
                        var arg2 = new Date(self._getCorrectDate(arguments[1]));
                        result = _factory(arg1, arg2, 's');
                    }
                }
                break;
            case 3:
                var arg1 = new Date(self._getCorrectDate(arguments[0]));
                var arg2 = new Date(self._getCorrectDate(arguments[1]));
                result = _factory(arg1, arg2, arguments[2]);
                break;
            default:
                console.log('请输入正确的参数!');
        }

        function _factory(startDate, endDate, type) {
            var hisTime = endDate.getTime();
            var nowTime = startDate.getTime();
            var dif = nowTime - hisTime;

            var y, M, d, H, m, s, res;
            if (type === 'year' || type === 'day') {
                s = Math.round(Math.abs(dif) / 1000);
                if (s >= 60) {
                    m = Math.round(s / 60);
                    if (m >= 60) {
                        H = Math.round(m / 60);
                        if (H > 24) {
                            switch (type) {
                                case 'year':
                                    d = Math.round(H / 24);
                                    if (d > 30) { // 以标准月为基数
                                        M = Math.round(d / 30);
                                        if (M > 12) {
                                            y = Math.round(M / 12);
                                            res = y + '年';
                                        } else {
                                            res = M + '月';
                                        }
                                    } else {
                                        res = d + '天';
                                    }
                                    break;
                                case 'day':
                                    res = self.format(endDate);
                                    break;
                            }
                        } else {
                            res = H + '时';
                        }
                    } else {
                        res = m + '分';
                    }
                } else {
                    res = s + '秒';
                }
            } else {
                s = (Math.abs(dif) / 1000).toFixed(0);
                m = (s / 60).toFixed(0);
                H = (m / 60).toFixed(0);
                d = (H / 24).toFixed(0);
                M = (d / 30).toFixed(0);
                y = (M / 12).toFixed(0);
                switch (type) {
                    case 'y':
                        res = y;
                        break;
                    case 'M':
                        res = M;
                        break;
                    case 'd':
                        res = d;
                        break;
                    case 'H':
                        res = H;
                        break;
                    case 'm':
                        res = m;
                        break;
                    case 's':
                        res = s;
                        break;
                    default:
                        res = dif;
                }
            }

            return res;
        }
        return result;
    };

    /**
     * @description {获取时段}凌晨:3:00--6:00 早晨:6:00---8:00 上午:8:00--11:00 中午:11:00--13:00
     *                下午:13:00--17:00 傍晚:17:00--19:00 晚上:19:00--0:00 深夜:0:00--3:00
     * @return period[String]
     */
    DatePro.prototype.periods = function() {
        var self = this,
            period,
            hours = self.now.getHours(),
            minutes = self.now.getMinutes(),
            time = parseFloat(hours + '.' + minutes);
        if (time > 3.00 && time <= 6.00) {
            period = '凌晨';
        } else if (time > 6.00 && time <= 8.00) {
            period = '早晨';
        } else if (time > 8.00 && time <= 11.00) {
            period = '上午';
        } else if (time > 11.00 && time <= 13.00) {
            period = '中午';
        } else if (time > 13.00 && time <= 17.00) {
            period = '下午';
        } else if (time > 17.00 && time <= 19.00) {
            period = '傍晚';
        } else if (time > 19.00 && time < 24.00) {
            period = '晚上';
        } else if (time >= 0 && time <= 3.00) {
            period = '深夜';
        }
        return period;
    };

    /**
     * @description 获取某月的最后一天   不传返回当年当月的最后一天 传年返回该年当月 传月返回当年该月 都传该年该月
     * @return lastDay[Number]
     */
    DatePro.prototype.getMonthLastDay = function(year, month) {
        var self = this,
            lastDay;
        switch (arguments.length) {
            case 0:
                var y = self.now.getFullYear();
                var m = self.now.getMonth() + 1;
                lastDay = _factory(y, m);
                break;
            case 1:
                var arg = parseInt(arguments[0]);
                if (arg > 12) { // 年
                    var y = arg;
                    var m = self.now.getMonth() + 1;
                    lastDay = _factory(y, m);
                } else { // 月
                    var y = self.now.getFullYear();
                    var m = arg;
                    lastDay = _factory(y, m);
                }
                break;
            case 2:
                var y = parseInt(arguments[0]);
                var m = parseInt(arguments[1]);
                lastDay = _factory(y, m);
                break;
        }

        function _factory(y,m) {
            var d;
            if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
                d = 31;
            }else if (m == 4 || m == 6 || m == 9 || m == 11) {
                d = 30;
            }else {
                var cond1 = y % 4 == 0; //条件1：年份必须要能被4整除
                var cond2 = y % 100 != 0; //条件2：年份不能是整百数
                var cond3 = y % 400 == 0; //条件3：年份是400的倍数
                var cond = cond1 && cond2 || cond3;
                if (cond) { // 是闰年
                    d = 29;
                } else { // 不是闰年
                    d = 28;
                }
            }
            return d;
        }

        return lastDay;
    };

    /**
     * @description {获取正确格式的日期}
     * @param date[String] 要处理的日期
     */
    DatePro.prototype._getCorrectDate = function(date) {
        var d = date;
        if (typeof d === 'string' && d.indexOf('-') != -1) {
            d = date.replace(/-/g, '/');
        }
        return d;
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = new DatePro();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(new DatePro());
    } else {
        global.DatePro = new DatePro();
    }
})(typeof window !== 'undefined' ? window : global);
