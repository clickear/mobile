/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*				                 Panel组件
*                                
*			     创建时间：2013.09.09
*                作者：lpx
*                说明：手机面板侧滑组件
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var NdMobile = {};

var $topWindow = function () {
    var parentWin = window;
    while (parentWin != parentWin.parent) {
        parentWin = parentWin.parent;
    }
    return parentWin;
};
var topWin = $topWindow();

NdMobile.Browser = {
    isAndroid: window.navigator.userAgent.toLowerCase().indexOf("android") > 0,
    androidVer: window.navigator.userAgent.toLowerCase().substr(window.navigator.userAgent.toLowerCase().indexOf("android") + 8, 1)
}

NdMobile.Panel = function () {
    this.id = "";
    this.isCreatePanel = true;
    this.isHeader = true;
    this.isButtonRow = true;
    this.title = "";
    this.contentWrap = "";
    this.contentPanel = null;
    this.innerHtml = null;
    this.url = null;
    this.onLoad = null;
    this.closeEvent = null; //点击取消后调用的方法
    this.okEvent = null; //点击确定后调用的方法
}

NdMobile.Panel.getInstance = function (id) {
    var panelDiv = topWin.document.getElementById("panel_" + id);
    if (!panelDiv) alert("没有取到对应ID的Panel对象");
    try {
        return panelDiv.panelInstance;
    } finally {
        panelDiv = null;
    }
};

NdMobile.Panel.getDivInstance = function (id) {
    var panelDiv = topWin.document.getElementById("panel_main_" + id);
    if (!panelDiv) alert("没有取到对应ID的Panel对象");
    try {
        return panelDiv;
    } finally {
        panelDiv = null;
    }
};

NdMobile.Panel.prototype = {
    _create: function () {
        var $wrapEl = jQuery(this.contentWrap),
            width = (NdMobile.Browser.isAndroid && NdMobile.Browser.androidVer == "2") ? 0 : $wrapEl.width();

        if (!document.getElementById('panel_' + this.id)) {
            $wrapEl.addClass('panel-animate');
            var html = '<div id="panel_' + this.id + '" class="container panel-animate" style="position:position;left:' + width + 'px;">';
            if (this.isHeader) {
                html += '<div class="ly-header">';
                html += '<a class="l" href="javascript:;" onclick="NdMobile.Panel.getInstance(\'' + this.id + '\').close();">取消</a>';
                html += '<h2>'+this.title+'</h2>';
                html += '</div>';
            }
            html += '<div id="panel_main_' + this.id + '"' + (this.isButtonRow ? '' : ' style="bottom:0px"') + ' class="panel main">';
            html += '<input id="btnFixbug" style="position:fixed;left:-10000px;" type="button" />'
            if (this.innerHtml) {
                html += this.innerHtml;
            } else if (this.url) {
                html += '<iframe width="100%" height="98%" frameborder="0" allowtransparency="true" id="panelframe_' + this.id + '" src="' + this.url + '"></iframe>';
            } else if (this.contentPanel) {
                html += jQuery(this.contentPanel).html();
            }
            html += '</div>';
            if (this.isButtonRow) {
                html += '<div class="btm">';
                if (typeof (this.okEvent) == "function") {
                    html += '<input type="button" data-action="disable" class="fn-btn" value="确定" onclick="javascript:NdMobile.Panel.getInstance(\'' + this.id + '\').close(1);">';
                    html += '</div>';
                }
            }

            html += '</div>';
            jQuery('body').append(html);

            if (this.url) {
                Dialog.showWaiting();
            }
            document.getElementById('panel_' + this.id).panelInstance = this;
        }
        $panelEl = jQuery('#panel_' + this.id);
        if (this.url) {
            jQuery("#panelframe_" + this.id).load(function () {
                Dialog.closeWaiting();
                if (NdMobile.Browser.isAndroid && NdMobile.Browser.androidVer == "2") {
                    $wrapEl.addClass("hiddenfield");
                    $panelEl.removeClass("hiddenfield");
                } else {
                    $wrapEl.addClass("panel-animate");
                    $wrapEl.css("-webkit-transform", "translateX(" + (-width) + "px)");
           //         $panelEl.css("-webkit-transform", "translateX(" + (-width) + "px)");
                }
            });
        }
        else {
            if (NdMobile.Browser.isAndroid && NdMobile.Browser.androidVer == "2") {
                $wrapEl.addClass("hiddenfield");
                $panelEl.removeClass("hiddenfield");
            } else {
                setTimeout(function () {
                    $wrapEl.addClass("panel-animate");
                    $wrapEl.css("-webkit-transform", "translateX(" + (-width) + "px)");
                    $wrapEl.hide();
                  //  $panelEl.css("-webkit-transform", "translateX(" + (-width) + "px)");
                }, 1);
                setTimeout(function () {
                    var _touch = document.getElementById("btnFixbug");
                    _touch.style.display = "none";
                }, 800)
            }
        }
    },

    open: function () {
        this._create();

        if (typeof (this.onLoad) == "function") {
            this.onLoad();
        }
    },

    close: function (flag) {
        if (flag == 1) {
            var okreturn = this.okEvent();
            if (typeof okreturn == "boolean" && !okreturn)
                return;
        } else{
            if (typeof (this.closeEvent) == "function") {
                this.closeEvent();
            }
        }
        if (NdMobile.Browser.isAndroid && NdMobile.Browser.androidVer == "2") {
            jQuery(this.contentWrap).removeClass("hiddenfield");
            jQuery('#panel_' + this.id).addClass("hiddenfield");
        } else {

            jQuery(this.contentWrap).css("-webkit-transform", "translateX(0px)");
            jQuery(this.contentWrap).show();
            jQuery('#panel_' + this.id).css("-webkit-transform", "translateX(0px)");
        }
        var self = this;
        setTimeout(function () {
            jQuery('#panel_' + self.id).remove();
        }, 350);
    },

    innerWin: function () {
        return document.getElementById('panelframe_' + this.id).contentWindow;
    }
}

function BindScroll(vid, ontouchstartcall) {
    if ("ontouchstart" in document.documentElement) {
        var elem = document.getElementById(vid);
        elem.ontouchstart = ts;
        elem.ontouchmove = tm;
        elem.ontouchend = te;
        var disc = [[], []];
        var endPos;
        var mtimeout;
        var _this;
        var tx, ty;
        function ts(e) {
            var tch;
            if (mtimeout)
                clearTimeout(mtimeout);
            if (ontouchstartcall)
                ontouchstartcall();
            if (e.touches.length == 1) {
                tch = e.touches[0];
                tx = tch.pageX;
                ty = tch.pageY;
                endPos = { x: tch.pageX, y: tch.pageY };
                disc = [[new Date()], [{ x: tch.pageX, y: tch.pageY}]];
            }
        }

        function tm(e) {
            var tch;
            if (e.touches.length == 1) {
                tch = e.touches[0];
                this.scrollTop += ty - tch.pageY;
                ty = tch.pageY;
                tx = tch.pageX;
                endPos = { x: tch.pageX, y: tch.pageY };
                disc[0].push(new Date());
                disc[1].push({ x: tch.pageX, y: tch.pageY });
                e.preventDefault();
            }
        }

        function te(e) {
            var now = new Date();
            var distance;
            while (disc[0].length && now - disc[0][0] > 200) {
                disc[0].shift();
                disc[1].shift();
            }
            if (disc[0].length) {
                _this = this;
                time = now - disc[0][0]; //时间
                rect = [endPos.x - disc[1][0].x, endPos.y - disc[1][0].y];
                dist = rect[1]; //距离
                if (Math.abs(dist) > 20) {//极短时间内移动距离大于20
                    distance = (2 - time / 200) * dist; //计算出缓动需要移动的距离
                    slide(-distance);
                }
            }

        }

        function slide(_distance) {
            var _change = _distance, //变化量
			            _stime = 0, //初始时间
			            _during = 300; //动画时间
            function animate(t, c, d) { //缓动效果计算公式
                var re;
                re = -c * ((t = t / d - 1) * t * t * t - 1);
                return re;
            }

            function run() {
                if (_distance && _stime < _during) {
                    _stime += 15;
                    _this.scrollTop += animate(_stime, _change, _during);
                    mtimeout = setTimeout(run, 10);
                }
            }
            if (mtimeout) {
                clearTimeout(mtimeout);
            }
            run();
        }

    }
}