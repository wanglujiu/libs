/**
 * @Author: wangliang
 * @Date:   2017/3/31
 * @Last Modified by:   wangliang
 * @Last Modified time: 2019/8/21
 * @description {根字体基数如 1rem = 10px，devicePixelRatio兼容性有问题IE，Firefox不支持所以dpr=1}
 */
; (function (Factory) {
  Factory()
})(function () {
  this.options = {
    baseFont: 10, // 字体基数
    design: 750 / 2, // 设计稿宽度
    dpr: 1,
    scale: 1 // 缩放比例为
  }

  this.init = function () {
    this.doc = document
    this.docEl = this.doc.documentElement
    this.meta = this.doc.querySelector('meta[name="viewport"]')
    if (this.meta) {
      this.meta.setAttribute('content', 'initial-scale=' + this.options.scale + ', maximum-scale=' + this.options.scale + ', minimum-scale=' + this.options.scale + ', user-scalable=no')
    } else {
      this.meta = this.doc.createElement('meta')
      this.meta.setAttribute('name', 'viewport')
      this.meta.setAttribute('content', 'initial-scale=' + this.options.scale + ', maximum-scale=' + this.options.scale + ', minimum-scale=' + this.options.scale + ', user-scalable=no')
      if (this.docEl.firstElementChild) {
        this.docEl.firstElementChild.appendChild(this.meta)
      } else {
        var wrap = this.doc.createElement('div')
        wrap.appendChild(this.meta)
        this.doc.write(wrap.innerHTML)
      }
    }
  }

  this.initRem = function () {
    this.width = this.docEl.getBoundingClientRect().width
    this.scale = this.width / this.options.design
    this.baseFont = (this.scale * this.options.baseFont).toFixed(2)
    this.docEl.style.fontSize = this.baseFont + 'px'
    this.docEl.setAttribute('data-dpr', this.options.dpr)
  }

  this.initEvent = function () {
    var _self = this
    window.addEventListener('resize', function () {
      _self.initRem()
    })
  }

  this.init()
  this.initRem()
  this.initEvent()
})
