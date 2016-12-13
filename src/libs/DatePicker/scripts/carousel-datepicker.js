"use strict";

/*
 * @description 默认配置
 */
var defaultConfig = {
    id: "",                               // 初始化容器
    currDate: '',                         // 默认日期(时间戳，字符串，Date对象)
    beginDate: '1970/01/01 00:00',        // 开始日期
    endDate: '2100/01/01 00:00',          // 结束日期
    format: 'yyyy/MM/dd HH:mm:ss',        // 日期格式
    onValueChange: false
};

/**
 * @description 基础数据
 */
var WEEK_CN = ['一','二','三','四','五','六','日'];
var NUMBER_CN = ['一','二','三','四','五','六','七', '八', '九', '十', '十一', '十二'];

var LEEP_MONTH = {
    1: true,
    2: false,
    3: true,
    4: false,
    5: true,
    6: false,
    7: true,
    8: true,
    9: false,
    10: true,
    11: false,
    12: true
};

var NATURE_LIMITS = {
    yyyy: [false, false],
    MM: [1, 12],
    dd: [1, 12],
    HH: [0, 23],
    mm: [0, 59],
    ss: [0, 59]   
};

/**
 * @description 滚动日期组件
 * @constructor
 */
var CarouselDatepicker = function(config) {
    this.config = $.extend({}, defaultConfig, config);
    this.ele = document.getElementById(this.config.id);

    this.curr = {
        yyyy: false,
        MM: false,
        dd: false,
        week: false,
        HH: false,
        mm: false,
        ss: false        
    };

    this.currDate = null;

    this.wrappers = {};
    this.containers = {};
    this.items = {};
    this.units = {};
    this.scrollers = {};

    this.units = {
        yyyy: '年',
        MM: '月',
        dd: '日',
        week: '星期',
        HH: '时',
        mm: '分',
        ss: '秒'
    };

    this.currValue = {};

    this.activeItemNum = {
        yyyy: 5,
        MM: 5,
        dd: 5,
        week: 7,
        HH: 5,
        mm: 5,
        ss: 5
    }

    this.onValueChange = config.onValueChange;

    this.dateMark = null;
    this.init();
};

/**
 * @description 初始化
 * @return none
 */
CarouselDatepicker.prototype.init = function() {
    this.$basicData();

    this.$createElements();
    this.$initScrolls();

    this.$synLimits();
    this.$apply(false);
};

/**
 * @description 初始化基础数据
 * @return none
 */
CarouselDatepicker.prototype.$basicData = function() {
    var columnNumber = 0;

    if(this.config.format.indexOf('yyyy') !== -1) {
        this.wrappers.yyyy = true;
        columnNumber ++;
    }

    if(this.config.format.indexOf('MM') !== -1) { 
        this.wrappers.MM = true;
        columnNumber ++;
    }

    if(this.config.format.indexOf('dd') !== -1) { 
        this.wrappers.dd = true;     
        columnNumber ++; 
    }

    if(this.wrappers.yyyy && this.config.format.indexOf('MM') && this.config.format.indexOf('dd')) { 
        this.wrappers.week = true;
        columnNumber ++;
    }

    if(this.config.format.indexOf('HH') !== -1) { 
        this.wrappers.HH = true;      
        columnNumber ++;
    }

    if(this.config.format.indexOf('mm') !== -1) { 
        this.wrappers.mm = true;      
        columnNumber ++; 
    }

    if(this.config.format.indexOf('ss') !== -1) { 
        this.wrappers.ss = true;
        columnNumber ++;
    }

    this.columnWidth = parseInt(100 / columnNumber);
    this.columnYearWidth = 100 % columnNumber;

    this.limits = {
        yyyy: [false, false],
        MM: [1, 12],
        dd: [1, 31],
        HH: [0, 23],
        mm: [0, 59],
        ss: [0, 59]
    };

    if(!this.config.currDate) {
        this.currDate = new Date();
    } else if(this.config.currDate instanceof Date) {
        this.currDate = this.config.currDate;
    } else {
        this.currDate = new Date(this.config.currDate);
    }

    if(!this.config.beginDate) {
        this.beginDate = new Date(defaultConfig.beginDate);
    } else if(this.config.beginDate instanceof Date) {
        this.beginDate = this.config.beginDate;
    } else {
        this.beginDate = new Date(this.config.beginDate);
    }

    if(!this.config.endDate) {
        this.endDate = new Date(defaultConfig.endDate);
    } else if(this.config.endDate instanceof Date) {
        this.endDate = this.config.endDate;
    } else {
        this.endDate = new Date(this.config.endDate);
    }

    if( this.currDate < this.beginDate){
        this.currDate = this.beginDate;
    }else if(this.currDate > this.endDate){
        this.currDate = this.endDate;
    }

    if(this.beginDate) {
        var minYear = this.beginDate.getFullYear();
        this.limits.yyyy[0] = minYear;
    }

    if(this.endDate) {
        var maxYear = this.endDate.getFullYear();
        this.limits.yyyy[1] = maxYear;
    }
};

/**
 * @description 创建节点
 * @return none
 */
CarouselDatepicker.prototype.$createElements = function() {

    // 创建外层容器
    this.main = document.createElement('div');
    this.main.className = 'datepicker';

    this.dateMark = document.createElement('div');
    this.dateMark.className = 'date-mark'; 

    this.main.appendChild(this.dateMark);

    // 创建节点
    var units = this.units;

    var wrappers = this.wrappers;
    var containers = this.containers;

    var items = this.items;

    var _main = this.main;     // 容器

    for(var name in wrappers) {
        var _wrapper = wrappers[name] = document.createElement('div');
        _wrapper.className = 'wrapper ' + name;

        if(name ==='yyyy') {
            _wrapper.style.width = this.columnWidth + this.columnYearWidth + '%';
        } else {
            _wrapper.style.width = this.columnWidth + '%';
        }
        

        var _container = containers[name] = document.createElement('ul');
        _container.className = 'container';

        var ic = items[name];
        var len = name === 'week' ? 7 : 5;

        for(var i = 0; i < len; i ++ ) {
            var snap = document.createElement('li');
            snap.className = 'item item-' + (i + 1);

            var val = document.createElement('span');
            val.className = "val"; 

            var beginYear = this.beginDate.getFullYear();

            switch(name) {
                case 'week':
                    val.innerHTML = WEEK_CN[i];
                    snap.setAttribute('data-value', i + 1);

                    break;
                case 'dd':
                    val.innerHTML = i + 1;
                    snap.setAttribute('data-value', i + 1);

                    break;                    
                case 'MM':
                    val.innerHTML = i + 1;
                    snap.setAttribute('data-value', i + 1);

                    break;
                case 'yyyy':
                    val.innerHTML = beginYear + i;
                    snap.setAttribute('data-value', beginYear + i);

                    break;
                case 'HH':
                    val.innerHTML = i + 1;
                    snap.setAttribute('data-value', i + 1);

                    break;                    
                default:
                    val.innerHTML = '0' + i;
                    snap.setAttribute('data-value', i);

                    break;                                                        
            }

            var _unit = units[name];

            var unit = document.createTextNode(_unit);

            // 显示顺序不同
            if(name !== 'week') {
                snap.appendChild(val);
                snap.appendChild(unit);
            } else {
                snap.appendChild(unit);
                snap.appendChild(val);
            }

            _container.appendChild(snap);

            if(!this.items[name]) {
                this.items[name] = [];
            }
        }

        _wrapper.appendChild(_container);
        _main.appendChild(_wrapper);
    }

    this.ele.appendChild(_main);
};

/**
 * @description 初始化滚动
 * @return none
 */
CarouselDatepicker.prototype.$initScrolls = function() {
    if(this.config.format.indexOf('yyyy') !== -1) {
        this.$initYear();
    }

    if(this.config.format.indexOf('MM') !== -1) {
        this.$initMonth();
    }

    if(this.config.format.indexOf('dd') !== -1) {
        this.$initDay();
    }

    if(this.config.format.indexOf('HH') !== -1) {
        this.$initHour();
    }

    if(this.config.format.indexOf('mm') !== -1) {
        this.$initMinute();
    }

    if(this.config.format.indexOf('ss') !== -1) {
        this.$initSecond();
    }
};

/**
 * @description 初始化年滚动
 * @return none
 */
CarouselDatepicker.prototype.$initYear = function() {
    var _this = this;

    var endYear = this.endDate.getFullYear();
    var beginYear = this.beginDate.getFullYear();
    
    var realitySnapNumber = endYear - beginYear;

    var snapHeight = this.containers['yyyy'].children[0].offsetHeight;

    var options = {
        realitySnapNumber: realitySnapNumber,
        snap: ".item",
        wrapper: this.wrappers.yyyy,
        container: this.containers.yyyy,
        infinite: true,
        currMove: - snapHeight,
        onScrollEnd: function (idx) {
            _this.curr.yyyy = idx;
            _this.$apply(true);
        },
        onSnapChange: function(idx, direction) {
            var items = _this.containers.yyyy.children;
            var first;
            var last;

            if(direction > 0) {
                first = parseInt(items[0].getAttribute('data-value')) - 1;
                last = parseInt(items[4].getAttribute('data-value')) - 1;
            }  else {
                first = parseInt(items[0].getAttribute('data-value')) + 1;
                last = parseInt(items[4].getAttribute('data-value')) + 1;
            }

            var min = _this.limits.yyyy[0];
            var max = _this.limits.yyyy[1];

            var middleIndex = _this.$getMiddleIndex('yyyy');
            var _direction = idx - middleIndex;

            if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                for(var i = 0, len = _this.activeItemNum.yyyy; i < len; i ++) {
                    var item = items[i];
                    var val = item.getAttribute('data-value');

                    if(direction < 0) {
                        val ++;
                    } else {
                        val --;
                    }

                    item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                    item.setAttribute('data-value', val);                     
                }

                _this.curr.yyyy = middleIndex;

                return true;
            } else {
                items[_this.curr.yyyy].className = items[_this.curr.yyyy].className.replace(' active', '');
                items[idx].className += ' active';

                _this.curr.yyyy = idx;
                return false;
            }
        },
        onBeforeScroll: function() {
            var snaps = _this.containers.yyyy.children;
            var len = snaps.length;

            for(var i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }
        }
    };

    this.scrollers.yyyy = new Carousel(options);
};

/**
 * @description 初始化月份滚动
 * @return none
 */
CarouselDatepicker.prototype.$initMonth = function() {
    var _this = this;
    var snapHeight = this.containers.MM.children[0].offsetHeight;

    var options = {
        realitySnapNumber: 12,
        snap: ".item",
        wrapper: this.wrappers.MM,
        container: this.containers.MM,
        infinite: true,
        currMove: - snapHeight,
        onScrollEnd: function (idx) {
            _this.curr.MM = idx;
            _this.$apply(true);
        },
        onSnapChange: function(idx, direction) {
            var items = _this.containers.MM.children;
            var first;
            var last;

            if(direction > 0) {
                first = parseInt(items[0].getAttribute('data-value')) - 1;
                last = parseInt(items[4].getAttribute('data-value')) - 1;
            }  else {
                first = parseInt(items[0].getAttribute('data-value')) + 1;
                last = parseInt(items[4].getAttribute('data-value')) + 1;
            }

            var min = _this.limits.MM[0];
            var max = _this.limits.MM[1];

            var middleIndex = _this.$getMiddleIndex('MM');
            var _direction = idx - middleIndex;

            if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                for(var i = 0, len = _this.activeItemNum.MM; i < len; i ++) {
                    var item = items[i];
                    var val = item.getAttribute('data-value');

                    if(direction < 0) {
                        val ++;
                    } else {
                        val --;
                    }

                    item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                    item.setAttribute('data-value', val);                     
                }

                _this.curr.MM = middleIndex;

                return true;
            } else {
                items[_this.curr.MM].className = items[_this.curr.MM].className.replace(' active', '');
                items[idx].className += ' active';

                _this.curr.MM = idx;
                return false;
            }
        },
        onBeforeScroll: function() {
            var snaps = _this.containers.MM.children;
            var len = snaps.length;

            for(var i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }
        }
    };

    this.scrollers.MM = new Carousel(options);
};

/**
 * @description 初始化日期滚动
 * @return none
 */
CarouselDatepicker.prototype.$initDay = function() {
    var _this = this;
    var snapHeight = this.containers['dd'].children[0].offsetHeight;

    var options = {
        realitySnapNumber: 31,
        snap: ".item",
        wrapper: this.wrappers.dd,
        container: this.containers.dd,
        infinite: true,
        currMove: - snapHeight,
        onScrollEnd: function (idx) {
            _this.curr.dd = idx;
            _this.$apply(true);
        },
        onSnapChange: function (idx, direction) {
            var items = _this.containers.dd.children;
            var first;
            var last;

            if(direction > 0) {
                first = parseInt(items[0].getAttribute('data-value')) - 1;
                last = parseInt(items[4].getAttribute('data-value')) - 1;
            }  else {
                first = parseInt(items[0].getAttribute('data-value')) + 1;
                last = parseInt(items[4].getAttribute('data-value')) + 1;
            }

            var min = _this.limits.dd[0];
            var max = _this.limits.dd[1];

            var middleIndex = _this.$getMiddleIndex('dd');
            var _direction = idx - middleIndex;

            if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                for(var i = 0, len = _this.activeItemNum.dd; i < len; i ++) {
                    var item = items[i];
                    var val = item.getAttribute('data-value');

                    if(direction < 0) {
                        val ++;
                    } else {
                        val --;
                    }

                    item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                    item.setAttribute('data-value', val);                     
                }

                _this.curr.dd = middleIndex;

                return true;
            } else {
                items[_this.curr.dd].className = items[_this.curr.dd].className.replace(' active', '');
                items[idx].className += ' active';

                _this.curr.dd = idx;
                return false;
            }
        },
        onBeforeScroll: function() {
            var snaps = _this.containers.dd.children;
            var len = snaps.length;

            for(var i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }
        }
    };

    this.scrollers.dd = new Carousel(options);
};

/**
 * @description 初始化小时滚动
 * @return none
 */
CarouselDatepicker.prototype.$initHour = function() {
    var _this = this;
    var snapHeight = this.containers['HH'].children[0].offsetHeight;

    var options = {
        realitySnapNumber: 24,
        snap: ".item",
        wrapper: this.wrappers.HH,
        container: this.containers.HH,
        infinite: true,
        currMove: - snapHeight,
        onScrollEnd: function (idx) {
            _this.curr.HH = idx;
            _this.$apply(true);
        },
        onSnapChange: function(idx, direction) {
            var items = _this.containers.HH.children;
            var first;
            var last;

            if(direction > 0) {
                first = parseInt(items[0].getAttribute('data-value')) - 1;
                last = parseInt(items[4].getAttribute('data-value')) - 1;
            }  else {
                first = parseInt(items[0].getAttribute('data-value')) + 1;
                last = parseInt(items[4].getAttribute('data-value')) + 1;
            }

            var min = _this.limits.HH[0];
            var max = _this.limits.HH[1];

            var middleIndex = _this.$getMiddleIndex('HH');
            var _direction = idx - middleIndex;

            if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                for(var i = 0, len = _this.activeItemNum.HH; i < len; i ++) {
                    var item = items[i];
                    var val = item.getAttribute('data-value');

                    if(direction < 0) {
                        val ++;
                    } else {
                        val --;
                    }

                    item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                    item.setAttribute('data-value', val);                     
                }

                _this.curr.HH = middleIndex;

                return true;
            } else {
                items[_this.curr.HH].className = items[_this.curr.HH].className.replace(' active', '');
                items[idx].className += ' active';

                _this.curr.HH = idx;
                return false;
            }      
        },
        onBeforeScroll: function() {
            var snaps = _this.containers.HH.children;
            var len = snaps.length;

            for(var i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }
        }
    };

    this.scrollers.HH = new Carousel(options);
};

/**
 * @description 初始化分钟滚动
 * @return none
 */
CarouselDatepicker.prototype.$initMinute = function() {
    var _this = this;
    var snapHeight = this.containers['mm'].children[0].offsetHeight;

    var options = {
        realitySnapNumber: 60,
        snap: ".item",
        wrapper: this.wrappers.mm,
        container: this.containers.mm,
        infinite: true,
        currMove: - snapHeight,
        onScrollEnd: function (idx) {
            _this.curr.mm = idx;
            _this.$apply(true);
        },
        onSnapChange: function(idx, direction) {
            var items = _this.containers.mm.children;
            var first;
            var last;

            if(direction > 0) {
                first = parseInt(items[0].getAttribute('data-value')) - 1;
                last = parseInt(items[4].getAttribute('data-value')) - 1;
            }  else {
                first = parseInt(items[0].getAttribute('data-value')) + 1;
                last = parseInt(items[4].getAttribute('data-value')) + 1;
            }

            var min = _this.limits.mm[0];
            var max = _this.limits.mm[1];

            var middleIndex = _this.$getMiddleIndex('mm');
            var _direction = idx - middleIndex;

            if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                for(var i = 0, len = _this.activeItemNum.mm; i < len; i ++) {
                    var item = items[i];
                    var val = item.getAttribute('data-value');

                    if(direction < 0) {
                        val ++;
                    } else {
                        val --;
                    }

                    item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                    item.setAttribute('data-value', val);                     
                }

                _this.curr.mm = middleIndex;
                return true;
            } else {
                items[_this.curr.mm].className = items[_this.curr.mm].className.replace(' active', '');
                items[idx].className += ' active';

                _this.curr.mm = idx;
                return false;
            }         
        },
        onBeforeScroll: function() {
            var snaps = _this.containers.mm.children;
            var len = snaps.length;

            for(var i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }
        }
    };

    this.scrollers.mm = new Carousel(options);
};

/**
 * @description 初始化秒滚动
 * @return none
 */
CarouselDatepicker.prototype.$initSecond = function() {
    var _this = this;
    var snapHeight = this.containers['ss'].children[0].offsetHeight;

    var options = {
        realitySnapNumber: 60,
        snap: ".item",
        wrapper: this.wrappers.ss,
        container: this.containers.ss,
        infinite: true,
        currMove: - snapHeight,
        onScrollEnd: function (idx) {
            _this.curr.ss = idx;
            _this.$apply(true);
        },
        onSnapChange: function (idx, direction) {
            var items = _this.containers.ss.children;
            var first;
            var last;

            if(direction > 0) {
                first = parseInt(items[0].getAttribute('data-value')) - 1;
                last = parseInt(items[4].getAttribute('data-value')) - 1;
            }  else {
                first = parseInt(items[0].getAttribute('data-value')) + 1;
                last = parseInt(items[4].getAttribute('data-value')) + 1;
            }

            var min = _this.limits.ss[0];
            var max = _this.limits.ss[1];

            var middleIndex = _this.$getMiddleIndex('ss');
            var _direction = idx - middleIndex;

            if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                for(var i = 0, len = _this.activeItemNum.ss; i < len; i ++) {
                    var item = items[i];
                    var val = item.getAttribute('data-value');

                    if(direction < 0) {
                        val ++;
                    } else {
                        val --;
                    }

                    item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                    item.setAttribute('data-value', val);                     
                }

                _this.curr.ss = middleIndex;

                return true;
            } else {
                items[_this.curr.ss].className = items[_this.curr.ss].className.replace(' active', '');
                items[idx].className += ' active';

                _this.curr.ss = idx;
                return false;
            }
        },
        onBeforeScroll: function () {
            var snaps = _this.containers.ss.children;
            var len = snaps.length;

            for(var i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }
        }
    };

    this.scrollers.ss = new Carousel(options);
};

/**
 * @description 让所有数据同步
 * @params { Boolean } 是否需要同步数据 
 * @return none
 */
CarouselDatepicker.prototype.$apply = function (syn) {
    if(syn) {
        this.$synData();
    } else {        
        this.$synView();
    }

    if(this.onValueChange && typeof this.onValueChange === 'function') {
        this.onValueChange(this.currDate.getTime());
    }    
};

/*
 * @description 激活的节点脏检查
 * @params {String} {yyyy || MM ..}
 * @params {String || Number} 当前值
 * @return none
 */
CarouselDatepicker.prototype.$dirty = function() { 
    var limits = this.limits;

    for(var type in limits) {
        if(this.config.format.indexOf(type) === -1) {
            continue;
        }

        var len = this.containers[type].children.length;

        var max = limits[type][1];
        var min = limits[type][0];

        var val = this.currValue[type];
        var _activeItemNum = 0;

        var min_distance = val - min;
        var max_distance = max - val;

        _activeItemNum = min_distance + max_distance + 1;
        _activeItemNum = _activeItemNum > len ? len : _activeItemNum;

        this.$setActiveItemNum(type, _activeItemNum);
    }

    return true;
};

/**
 * @description 时间变化，其余系统变化
 * @return none
 */
CarouselDatepicker.prototype.$synData = function () {
    var year = this.$getValue('yyyy');
    var month = this.$getValue('MM') - 1;
    var day = this.$getValue('dd');
    var hour = this.$getValue('HH');
    var minute = this.$getValue('mm');
    var second = this.$getValue('ss');

    this.currDate = new Date(year, month, day, hour, minute, second);

    var week = this.currDate.getDay();
    var _week = week === 0 ? 7 : week;

    if(this.$synLimits()) {
        this.$synData();
    } else {
        this.$synView(year, month + 1, day, _week, hour, minute, second);
    }
};


/**
 * @description 设置当前选择下标
 * @params {String} {yyyy || MM ..}
 * @params {Number || String} 当前值
 * @return none
 */
CarouselDatepicker.prototype.$setValue = function(type, val) {
    if(this.config.format.indexOf(type) === -1 && type !== 'week') {
        return false;
    }

    var idx = val || middleIndex;

    var snaps = this.containers[type].children;
    var len = snaps.length;

    if(type === 'week') {
        for(var i = 0; i < len; i ++) {
            snaps[i].className = snaps[i].className.replace(' active', '');
        }

        var snapHeight = this.containers[type].children[0].offsetHeight;

        this.containers[type].style['marginTop'] = (idx - 2) * - snapHeight + 'px';
        this.containers[type].children[idx - 1].className += ' active';
        this.curr[type] = idx - 1;

    } else if(this.wrappers[type]){
        var min = this.limits[type][0];
        var max = this.limits[type][1];

        var firstItemOffset = this.$getFirstItemOffset(type);
        var lastItemOffset = this.$getLastItemOffset(type);
        var middleIndex = this.$getMiddleIndex(type);

        if(val - firstItemOffset < min) {
            idx = middleIndex - (min - (val - firstItemOffset));
        } else if(val + lastItemOffset > max) {
            idx = middleIndex + ((val + lastItemOffset) - max);
        } else {
            idx = middleIndex;
        }

        this.curr[type] = idx;

        this.$snapChange(type, val, idx);
        this.$activate(type, idx);           
    } 
};

/**
 * @description 获取当前选中值
 * @params {String} {yyyy || MM ..}
 * @return none
 */
CarouselDatepicker.prototype.$getValue = function(type) {
    var val;

    if(this.config.format.indexOf(type) !== -1) {
        var currIdx = this.curr[type];

        var snaps = this.containers[type] ? this.containers[type].children : [];

        val = snaps[currIdx].getAttribute('data-value');
    } else {
        val = 0;
    }

    var limits = this.limits[type];

    if(val < limits[0]) {
        val = limits[0];
    } else if (val > limits[1]) {
        val = limits[1];
    }

    return parseInt(val);
};

/*
 * @description 获取当前选择下标
 * @params {String} {yyyy || MM ..}
 * @params {String || Number} 当前值
 * @params {String || Number} 当前下标
 * @return none
 */
CarouselDatepicker.prototype.$snapChange = function(type, val, idx) {
    var snaps = this.containers[type] ? this.containers[type].children : [];
    var len = snaps.length;

    for(var i = 0; i < len; i ++) {
        var snap = snaps[i];
        var _val = val + (i - idx);

        snaps[i].className = snaps[i].className.replace(' disabled', '');
        snaps[i].setAttribute('data-value', _val);

        if(i >= this.activeItemNum[type]) {
            snaps[i].className += ' disabled';
        }

        if(_val < 10 && type !== 'yyyy')
            _val = '0' + _val;

        snaps[i].children[0].innerHTML = _val;
    }    
};

/*
 * @description 获取当前选择下标
 * @params { String } { yyyy || MM .. }
 * @params { String || Number } 当前值
 * @return none
 */
CarouselDatepicker.prototype.$activate = function(type, idx) {
    var snaps = this.containers[type].children;
    var len = snaps.length;
    
    for(var i = 0; i < len; i ++) {
        snaps[i].className = snaps[i].className.replace(' active', '');
    }

    snaps[idx].className += ' active';
    this.scrollers[type].scrollTo(idx, type);
};

/**
 * @description 设置可用节点数量
 * @params { String } 节点类型 
 * @params { Number } 可用节点数量  
 * @return none
 */
CarouselDatepicker.prototype.$setActiveItemNum = function (type, value) { 
    this.activeItemNum[type] = value;
    this.scrollers[type].activeItemNum = value;
};

/**
 * @description 获取第一个节点的偏移量
 * @params { String } 节点类型 
 * @return { Number } 第一个节点的偏移量
 */
CarouselDatepicker.prototype.$getFirstItemOffset = function (type) { 
    var snapsNum = this.activeItemNum[type];
    return snapsNum % 2 ? parseInt(snapsNum / 2): parseInt(snapsNum / 2) - 1;
};

/**
 * @description 获取最后一个节点的偏移量
 * @params { String } 节点类型 
 * @return { Number } 最后一个节点的偏移量
 */
CarouselDatepicker.prototype.$getLastItemOffset = function (type) { 
    var snapsNum = this.activeItemNum[type];
    return parseInt(snapsNum / 2);
};

/**
 * @description 获取最后一个节点的偏移量
 * @params { String } 节点类型 
 * @return { Number } 最后一个节点的偏移量
 */
CarouselDatepicker.prototype.$getMiddleIndex = function (type) { 
    var snapsNum = this.activeItemNum[type];
    var ceil = Math.ceil(snapsNum / 2) - 1;

    return ceil;
};

/**
 * @description 时间值区间变化
 * @return none
 */
CarouselDatepicker.prototype.$synLimits = function() { 
    var year = this.currDate.getFullYear();
    var month = this.currDate.getMonth() + 1;
    var day = this.currDate.getDate();
    var hour = this.currDate.getHours();
    var minute = this.currDate.getMinutes();
    var second = this.currDate.getSeconds();

    if(month === 2) {
        this.limits.day = [1, (year % 4) ? 28 : 29];
    } else {
        this.limits.day = [1, LEEP_MONTH[month] ? 31 : 30];
    }

    var b_year = this.beginDate.getFullYear();
    var b_month = this.beginDate.getMonth() + 1;
    var b_day = this.beginDate.getDate();
    var b_hour = this.beginDate.getHours();
    var b_minute = this.beginDate.getMinutes();
    var b_second = this.beginDate.getSeconds();

    var e_year = this.endDate.getFullYear();
    var e_month = this.endDate.getMonth() + 1;
    var e_day = this.endDate.getDate();
    var e_hour = this.endDate.getHours();
    var e_minute = this.endDate.getMinutes();
    var e_second = this.endDate.getSeconds();

    var limits = {
        yyyy: [b_year, e_year],
        MM: [1, 12],
        dd: [1, 31],
        HH: [0, 23],
        mm: [0, 59],
        ss: [0, 59]        
    };        

    if(year <= b_year) {
        limits.MM[0] = b_month;
    } else {
        limits.MM[0] = 1;
    }

    if(year >= e_year) {
        limits.MM[1] = e_month;
    } else {
        limits.MM[1] = 12;
    }    

    if(year <= b_year && month <= b_month) {
        limits.dd[0] = b_day;
    } else {
        limits.dd[0] = 1;
    }

    if(year >= e_year && month >= e_month) {
        limits.dd[1] = e_day;
    } else {
        if(month === 2) {
            limits.dd[1] = (year % 4) ? 28 : 29;
        } else {
            limits.dd[1] = LEEP_MONTH[month] ? 31 : 30;
        }
    }

    if(year <= b_year && month <= b_month && day <= b_day) {
        limits.HH[0] = b_hour;
    } else {
        limits.HH[0] = 0;
    }

    if(year >= e_year && month >= e_month && day >= e_day) {
        limits.HH[1] = e_hour;
    } else {
        limits.HH[1] = 23;
    }    

    if(year <= b_year && month <= b_month && day <= b_day && hour <= b_hour) {
        limits.mm[0] = b_minute;
    } else {
        limits.mm[0] = 0;
    }

    if(year >= e_year && month >= e_month && day >= e_day && hour >= e_hour) {
        limits.mm[1] = e_minute;
    } else {
        limits.mm[1] = 59;
    }    

    if(year <= b_year && month <= b_month && day <= b_day && hour <= b_hour && minute <= b_minute) {
        limits.ss[0] = b_second;
    } else {
        limits.ss[0] = 0;
    }

    if(year >= e_year && month >= e_month && day >= e_day && hour >= e_hour && minute >= e_minute) {
        limits.ss[1] = e_second;
    } else {
        limits.ss[1] = 59;
    }      

    var limitsChanged = false;

    for(var item in limits) {
        if(item !== 'yyyy') {
            var newLimits = limits[item];
            var oldLimits = this.limits[item];

            if(newLimits[0] !== oldLimits[0] || newLimits[1] !== oldLimits[1]) {
                limitsChanged = true;
            }
        }
    }

    this.limits = limits;

    return limitsChanged;   
};

/**
 * @description 值反馈至view
 * @params { Number(7)} 年，月，日，星期几，时，分，秒 
 * @return none
 */
CarouselDatepicker.prototype.$synView = function() {
    var _arguments = arguments;

    if(_arguments[0] === undefined) {
        _arguments = [];

        _arguments[0] = this.currDate.getFullYear();
        _arguments[1] = this.currDate.getMonth() + 1;
        _arguments[2] = this.currDate.getDate();

        var week = this.currDate.getDay();
        _arguments[3] = week === 0 ? 7 : week;

        _arguments[4] = this.currDate.getHours();
        _arguments[5] = this.currDate.getMinutes();
        _arguments[6] = this.currDate.getSeconds();        
    }

    this.currValue['yyyy'] = _arguments[0];
    this.currValue['MM'] = _arguments[1];
    this.currValue['dd'] = _arguments[2];
    this.currValue['week'] = _arguments[3];
    this.currValue['HH'] = _arguments[4];
    this.currValue['mm'] = _arguments[5];
    this.currValue['ss'] = _arguments[6];

    this.$dirty();

    this.$setValue('yyyy', _arguments[0]);
    this.$setValue('MM', _arguments[1]);
    this.$setValue('dd', _arguments[2]);
    this.$setValue('week', _arguments[3]);
    this.$setValue('HH', _arguments[4]);
    this.$setValue('mm', _arguments[5]);
    this.$setValue('ss', _arguments[6]);
};

/**
 * @description 设置限制开始值
 * @params { Number | String } 时间戳 | 符合格式的字符串
 * @return none
 */
CarouselDatepicker.prototype.setBeginDate = function(beginDate) {
    if(!beginDate) {
        return false;
    } else if(beginDate instanceof Date) {
        this.beginDate = beginDate;
    } else {
        this.beginDate = new Date(beginDate);
    }

    this.$synLimits()
    this.$apply(true);

    return true;
};

/**
 * @description 设置限制结束值
 * @params { Number | String } 时间戳 | 符合格式的字符串
 * @return none
 */
CarouselDatepicker.prototype.setEndDate = function(endDate) {
    if(!endDate) {
        return false;
    } else if(endDate instanceof Date) {
        this.endDate = endDate;
    } else {
        this.endDate = new Date(endDate);
    }

    this.$synLimits()
    this.$apply(true);

    return true;
};

/**
 * @description 获取或者设置值
 * @params { Number | String } 时间戳 | 符合格式的字符串
 * @return { Number | CarouselDatepicker } 时间戳 | 日期控件
 */
CarouselDatepicker.prototype.value = function(value) {
    if(value) {
        this.currDate = new Date(value);

        if(this.currDate < this.beginDate) {
            this.currDate = this.beginDate;
        } else if(this.currDate > this.endDate) {
            this.currDate = this.endDate;
        }

        this.$apply(false);

        return this;
    } else {
        return this.currDate.getTime();
    }
};

/**
 * @description 添加控件值变更监听
 * @params { Function } 值变更回调
 * @return none
 */
CarouselDatepicker.prototype.addValueChangeListener = function(func) {
    this.onValueChange = func;
};