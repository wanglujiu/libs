/**
 * @Author: wangliang
 * @Date:   2017/3/31
 * @Last Modified by:   wangliang
 * @Last Modified time: 2017/3/31
 * @description {根字体基数如 1rem = 20px，devicePixelRatio兼容性有问题IE，Firefox不支持所以dpr=1}
 */
;(function (global) {
    function Rem() {
        this.options = {
            baseFont: 20, //字体基数
            design: 750/2, //设计稿宽度
            dpr:1,
            scale:1 //缩放比例为
        };
        this.initParams();
        this.initUI();
        this.refreshRem();
        this.initEvent();
    };

    Rem.prototype.initParams = function () {
        var self = this;
        self.doc = document;
        self.docEl = self.doc.documentElement;
        self.meta = self.doc.querySelector('meta[name="viewport"]');
    };

    Rem.prototype.initUI = function () {
        var self = this;
        if (self.meta) {
            self.meta.setAttribute('content', 'initial-scale=' + self.options.scale + ', maximum-scale=' + self.options.scale + ', minimum-scale=' + self.options.scale + ', user-scalable=no');
        } else {
            self.meta = self.doc.createElement('meta');
            self.meta.setAttribute('name', 'viewport');
            self.meta.setAttribute('content', 'initial-scale=' + self.options.scale + ', maximum-scale=' + self.options.scale + ', minimum-scale=' + self.options.scale + ', user-scalable=no');
            if (self.docEl.firstElementChild) {
                self.docEl.firstElementChild.appendChild(self.meta);
            } else {
                var wrap = self.doc.createElement('div');
                wrap.appendChild(self.meta);
                self.doc.write(wrap.innerHTML);
            }
        }
    };

    Rem.prototype.refreshRem = function () {
        var self = this;
        self.width = self.docEl.getBoundingClientRect().width;
        // self.width = window.screen.width/self.options.scale;
        self.scale = self.width / self.options.design;
        self.baseFont = self.scale * self.options.baseFont;
        self.docEl.style.fontSize = self.baseFont + 'px';
        self.docEl.setAttribute('data-dpr',self.options.dpr);
    };

    Rem.prototype.initEvent = function () {
        var self = this;
        global.addEventListener('resize', function () {
            self.initParams();
            self.initUI();
            self.refreshRem();
        });
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = new Rem();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(new Rem());
    } else {
        global.Rem = new Rem();
    }
})(typeof window !== 'undefined' ? window : global);
