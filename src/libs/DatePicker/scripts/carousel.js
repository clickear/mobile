"use strict";

/**
 * @description 旋转木马
 * @constructor
 */
var Carousel = function (options) {
    this.snap = options.snap;

    this.wrapper = options.wrapper;
    this.container = options.container;

    this.onScrollEnd = options.onScrollEnd;
    this.onSnapChange = options.onSnapChange;

    this.snapHeight = this.container.children[0].offsetHeight;

    this.currMove = options.currMove || 0;
    this.currSnapIdx = (this.snapHeight - this.currMove) / this.snapHeight;

    this.realitySnapNumber = options.realitySnapNumber;
    this.onBeforeScroll = options.onBeforeScroll;

    this.activeItemNum = 5;

    this.$init();
};

/**
 * @description 初始化
 * @return none
 */
Carousel.prototype.$init = function () {

    var _this = this;

    var lastY = null;
    var moveY = null;

    var speed = null;

    var boundary = {
        top: this.wrapper.offsetTop,
        right: this.wrapper.offsetLeft + this.wrapper.offsetWidth,
        bottom: this.wrapper.offsetTop + this.wrapper.offsetHeight,
        left: this.wrapper.offsetLeft
    };

    var touchmove = function (e) {
        var touch = e.touches[0];

        var clientY = touch.clientY;

        if(lastY !== null) {
            moveY = clientY - lastY;
            var _speed = moveY / _this.wrapper.offsetHeight;

            speed = _speed ? _speed : speed;

            _this.$scroll(moveY, false);   
        }

        lastY = clientY;
    };

    var touchend = function () {
        _this.wrapper.removeEventListener('touchmove', touchmove);
        _this.wrapper.removeEventListener('touchend', touchend);

        lastY = null;

        if(speed && Math.abs(speed) > 0.1) {
            var snapHeight = _this.container.children[0].offsetHeight;
            var move = speed * snapHeight * _this.realitySnapNumber;

            _this.$scroll(move, true, speed);
        } else {
            if(_this.onScrollEnd && typeof _this.onScrollEnd === 'function') {
                _this.$keepSnap();
                var idx = (_this.snapHeight - _this.currMove) / _this.snapHeight;
                _this.onScrollEnd(idx);
            }                  
        }

        speed = 0;
    };

    this.wrapper.addEventListener('touchstart', function (e) {
        e.preventDefault();

        var touch = e.touches[0];

        lastY = touch.clientY;

        _this.wrapper.addEventListener('touchmove', touchmove);
        _this.wrapper.addEventListener('touchend', touchend);  
    });
};

/**
 * @description 滚动位移
 * @params {Number} 位移
 * @params {Boolean} 是否过渡 
 * @params {Number} 过渡的速度  
 * @return none
 */
Carousel.prototype.$scroll = function (offset, transition, speed) {
    var container_height = this.container.offsetHeight;
    var currMove = this.currMove + offset;

    var snap_height = this.container.children[0].offsetHeight;
    var snap_num = this.container.children.length;

    if(!transition) {
        this.move(currMove, true);
    } else {        
        var _this = this;
        var percentage = 0, 
            _offset = 0,
            _move;

        var activeItemNum = this.activeItemNum;
        var firstItemOffset = this.getFirstItemOffset();

        var _currMove = this.getSnapValue(currMove, false);
        var duration = Math.abs(_currMove * speed) * activeItemNum;

        var min = snap_height;
        var max = - (activeItemNum - firstItemOffset ) * snap_height;

        var $container = $(this.container);

        if(this.animateFlag) {
            $container.stop(false, true).animate();
        }

        // 移除节点激活状态
        this.onBeforeScroll();

        $container.animate({
            opacity: 100
        }, {
            step: function (now, fx) {
                _offset = _currMove * ( now - percentage ) / 100;
                _move = _this.currMove + _offset;
                
                if(_move < max) {
                    _move = max;
                    _this.animateFlag = false;

                    $container.stop(false, true);
                } else if(_move > min){
                    _move = min;
                    _this.animateFlag = false;

                    $container.stop(false, true);
                }

                percentage = now;

                if(_this.animateFlag)
                    _this.move(_move, true);
            },            
            duration: duration, 
            easing: 'easeOutQuad',
            queue: false, 
            complete: function() {
                if(_this.onScrollEnd && typeof _this.onScrollEnd === 'function') {
                    _this.$keepSnap();
                    _this.currSnapIdx = (_this.snapHeight - _this.currMove) / _this.snapHeight;
                    _this.onScrollEnd(_this.currSnapIdx);
                }
            }
        });

        this.animateFlag = true;
    }
};

/**
 * @description move: nothing to description
 * @param { Number || undefined } 位移值
 * @param { Boolean } 是否处理栅格变化 
 * @return none
 */
Carousel.prototype.move = function (move, snapChange) {
    var distence = true;
    var currMove = this.currMove;

    if(move !== undefined) {
        distence = Math.abs(this.currMove - move);
    }

    this.currMove = move !== undefined ?  move : this.currMove;
    this.container.style['marginTop'] = this.currMove + 'px';

    if(snapChange && distence) {
        this.$snapChange(currMove);
    }
};

/**
 * @description 栅格变化
 * @params { Number } 移动之前的值 
 * @return none
 */
Carousel.prototype.$snapChange = function (currMove) {
    var idx = this.$calculateSnap(currMove);

    if(idx !== false) {
        var sanpChange = this.onSnapChange(idx, this.currMove - currMove);

        if(sanpChange) {
            this.container.style['marginTop'] = - this.snapHeight + 'px';
            this.currMove = - this.snapHeight;
            this.currSnapIdx = (this.snapHeight + this.snapHeight) / this.snapHeight;
        }
    }
};

/**
 * @description 检查栅格变化
 * @params { Number } 移动之前的值 
 * @return { Number } 当前栅格所在位置
 */
Carousel.prototype.$calculateSnap = function (_currMove) { 
    var currSnapIdx = (this.snapHeight - this.currMove) / this.snapHeight;

    var offset = this.currMove - _currMove;
    var _offset = Math.abs(offset);

    var remainder = _currMove % this.snapHeight;
    var _remainder = Math.abs(remainder);

    var distance;

    if(currSnapIdx < 0) {
        return 0;
    } else {
        _currMove = this.currMove;

        if(offset < 0) {
            if(remainder <= 0) {
                distance = this.snapHeight - _remainder;
            } else {
                distance = _remainder;
            }

            if(distance > _offset) {
                return false;
            } else {
                _currMove += _offset - distance;
                currSnapIdx = (this.snapHeight - _currMove) / this.snapHeight;
            }            
        } else if(offset > 0){
            if(remainder >= 0) {
                distance = this.snapHeight - _remainder;
            } else {
                distance = _remainder;
            }     
            
            if(distance <= _offset) {
                _currMove -= _offset - distance;
                currSnapIdx = (this.snapHeight - _currMove) / this.snapHeight;
            } else {
                return false;
            }              
        } else {
            currSnapIdx = false;
        }

        var min = 0;
        var max = this.activeItemNum - 1;

        if(min > currSnapIdx || max < currSnapIdx ) {
            currSnapIdx = false;
        }

        if(currSnapIdx !== false) {
            if(this.currSnapIdx !== currSnapIdx) {
                this.currSnapIdx = currSnapIdx;
            } else {
                return false;
            }
        }

        return currSnapIdx;
    }
};

/**
 * @description 捕捉栅格
 * @return none
 */
Carousel.prototype.$keepSnap = function () {
    this.currMove = this.getSnapValue(this.currMove, true);
    this.move(undefined, false);
};

/**
 * @description 栅格化位移
 * @param { Number } 原始位移
 * @param { Boolean } 是否有边界过滤 
 * @return { Number } 栅格化的位移
 */
Carousel.prototype.getSnapValue = function (offset, boundary) {
    var _offset = offset;
    var isNegative = offset < 0;

    _offset = Math.abs(offset);
    _offset = parseInt(_offset / this.snapHeight) + (_offset % this.snapHeight >= this.snapHeight / 2 ? 1 : 0); 
    _offset = _offset * this.snapHeight;

    if(isNegative) {
        _offset = - _offset;
    }

    var activeItemNum = this.activeItemNum;
    var firstItemOffset = this.getFirstItemOffset();
    var lastItemOffset = this.getLastItemOffset();
    var middleIndex = this.getMiddleIndex();

    if(boundary) {
        var min = this.snapHeight;
        var max = (this.snapHeight - (activeItemNum - 1) * this.snapHeight);

        if(_offset > min) {
            _offset = min;
        } else if(_offset < max) {
            _offset = max;  
        }
    }

    return _offset;
};

/**
 * @description 获取第一个节点的偏移量
 * @return { Number } 第一个节点的偏移量
 */
Carousel.prototype.getFirstItemOffset = function () { 
    var snapsNum = this.activeItemNum;
    return snapsNum % 2 ? parseInt(snapsNum / 2): parseInt(snapsNum / 2) - 1;
};

/**
 * @description 获取最后一个节点的偏移量
 * @return { Number } 最后一个节点的偏移量
 */
Carousel.prototype.getLastItemOffset = function () { 
    var snapsNum = this.activeItemNum;
    return parseInt(snapsNum / 2);
};

/**
 * @description 获取最后一个节点的偏移量
 * @return { Number } 最后一个节点的偏移量
 */
Carousel.prototype.getMiddleIndex = function () { 
    var snapsNum = this.activeItemNum;
    var ceil = Math.ceil(snapsNum / 2) - 1;

    return ceil;
};


/**
 * @description 滚动至一个节点(snap)
 * @params {Number} 节点下标
 * @return none
 */
Carousel.prototype.scrollTo = function (idx, type) {
    this.move(( idx - 1 ) * -50, false);
};
