

///滚轮日期选择器对象集合
var ScrollerDatepickerObjectCollection = {};
function ScrollerDatepicker() {
    /// <summary>滚轮日期选择器</summary>
    //配置
    this.config = {
        container: "#divContainer",
        beginDate: "1900/01/01 00:00:00",                 //开始时间
        endDate: "2100/01/01 00:00:00",                   //结束时间
        defaultDate: new Date(),        //默认日期
        theme: 1,                       //控件样式（1：日期，2：日期+时间）
        ResultTag:"",                   //结果标签
        onChangeFun:function(){}
    };

    //滚动对象
    this.yearScroll = null;
    this.monthScroll = null;
    this.dayScroll = null;
    this.weekScroll = null;
    this.hourScroll = null;
    this.minuteScroll = null;
    this.secondScroll = null;

    //为了iScroll创建一个ID
    this.yearId = "";
    this.monthId = "";
    this.dayId = "";
    this.weekId = "";
    this.hourId = "";
    this.minuteId = "";
    this.secondId = "";

    //记录各阶段值
    this.year = 0;
    this.month = 0;
    this.day = 1;
    //this.week = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;

    this.lineHeight = 0;

    this.Init = function (config) {
        /// <summary>初始化</summary>
        /// <param name="str" type="Json">基础配置，可为空</param>

        //用户选项覆盖插件默认选项
        this.config = jQuery.extend(true, {}, this.config, config);
        ScrollerDatepickerObjectCollection[this.config.container] = this;

        BasicData(this.config.container);
        CreateUI(this.config.container);
        SetTheme(this.config.container);
        SetScrll(this.config.container);
        RefreshScroll(this.config.container);
        ToCurDate(this.config.container);
    };

    this.GetDateTime = function () {
        /// <summary>获取结果</summary>
        return GetDate(this.config.container)
    };

    function GetDate(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var datetime = SD.year + "/" + SD.month + "/" + SD.day + " " + SD.hour + ":" + SD.minute + ":" + SD.second;
        jQuery(SD.config.container).attr("value", datetime);
        var result = "";

        if (SD.config.theme & 1 != 0) {
            result = SD.year;
        }
        if ((SD.config.theme >> 1) & 1 != 0) {
            result += (SD.config.theme & 1 != 0) ? "/" : (result == "" ? "" : " ");
            result += SD.month;
        }
        if ((SD.config.theme >> 2) & 1 != 0) {
            result += ((SD.config.theme >> 1) & 1 != 0) ? "/" : (result == "" ? "" : " ");
            result += SD.day;
        }
        if ((SD.config.theme >> 4) & 1 != 0) {
            result += ((SD.config.theme >> 3) & 1 != 0) ? " " : (result == "" ? "" : " ");
            result += SD.hour;
        }
        if ((SD.config.theme >> 5) & 1 != 0) {
            result += ((SD.config.theme >> 4) & 1 != 0) ? ":" : (result == "" ? "" : " ");
            result += SD.minute;
        }
        if ((SD.config.theme >> 6) & 1 != 0) {
            result += ((SD.config.theme >> 5) & 1 != 0) ? ":" : (result == "" ? "" : " ");
            result += SD.second;
        }

        if (typeof SD.config.ResultTag == "string")
            jQuery(SD.config.ResultTag).attr("value", result);

        if(typeof SD.config.onChangeFun == "function")
            SD.config.onChangeFun();
        return result;
    };

    function BasicData(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        //为了iScroll创建ID
        SD.yearId = "yearId" + Math.ceil(Math.random() * 1000000000);
        SD.monthId = "monthId" + Math.ceil(Math.random() * 1000000000);
        SD.dayId = "dayId" + Math.ceil(Math.random() * 1000000000);
        SD.weekId = "weekId " + Math.ceil(Math.random() * 1000000000);
        SD.hourId = "hourId" + Math.ceil(Math.random() * 1000000000);
        SD.minuteId = "minuteId" + Math.ceil(Math.random() * 1000000000);
        SD.secondId = "secondId" + Math.ceil(Math.random() * 1000000000);

        //设置值
        SD.year = SD.config.defaultDate.getFullYear();
        SD.month = SD.config.defaultDate.getMonth() + 1;//+1
        SD.day = SD.config.defaultDate.getDate();
        SD.hour = SD.config.defaultDate.getHours();
        SD.minute = SD.config.defaultDate.getMinutes();
        SD.second = SD.config.defaultDate.getSeconds();
        //SD.week = SD.config.defaultDate.getDay();

        if (typeof SD.config.beginDate == "string") {
            SD.config.beginDate = new Date(SD.config.beginDate.replace(/-/g, "/"));
        }
        if (!(SD.config.beginDate instanceof Date)) {//不是字符串类型，又不是时间类型的全部用当前时间
            SD.config.beginDate = new Date("2000/01/01 00:00:00")
        }

        if (typeof SD.config.endDate == "string") {
            SD.config.endDate = new Date(SD.config.endDate.replace(/-/g, "/"));
        }
        if (!(SD.config.endDate instanceof Date)) {//不是字符串类型，又不是时间类型的全部用当前时间
            SD.config.endDate = new Date("2100/01/01 00:00:00")
        }
        if (SD.config.endDate < SD.config.beginDate) {
            SD.config.endDate = new Date(SD.config.beginDate).setFullYear(SD.config.beginDate.getFullYear() + 1);
            //
        }
    }

    function SetTheme(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        /// <summary>设置主题（显示内容）</summary>
        var statusBit = 0;
        if (!isNaN(SD.config.theme)) {
            statusBit = parseInt(SD.config.theme);
        }
        if (statusBit == 0 || statusBit.toString(2).length > 7) {
            statusBit = Math.pow(2, 7) - 1;//1111111
        }
        //校验参数设置，并把校验后的值设置回去
        SD.config.theme = statusBit;

        SD.lineHeight = jQuery(SD.config.container).find('[name="yearWrapper"]').find('li').height();

        var number = statusBit.toString(2).replace(/0/g, "").length;
        var widthPercent = 100 / number;
        var index = 0;
        index += SetThemeItem(Key, statusBit, 'yearWrapper', widthPercent, index);
        index += SetThemeItem(Key, statusBit >> 1, 'monthWrapper', widthPercent, index);
        index += SetThemeItem(Key, statusBit >> 2, 'dayWrapper', widthPercent, index);
        index += SetThemeItem(Key, statusBit >> 3, 'weekWrapper', widthPercent, index);
        index += SetThemeItem(Key, statusBit >> 4, 'hourWrapper', widthPercent, index);
        index += SetThemeItem(Key, statusBit >> 5, 'minuteWrapper', widthPercent, index);
        index += SetThemeItem(Key, statusBit >> 6, 'secondWrapper', widthPercent, index);

        var height = jQuery(SD.config.container).find('[name="datePage"]').height();
        var width = jQuery(SD.config.container).find('[name="datePage"]').width();
        jQuery(SD.config.container).find('[name="datePage"]').addClass("showNum" + number);
        jQuery(SD.config.container).find('[name="yearWrapper"]').css("height", height);
        jQuery(SD.config.container).find('[name="monthWrapper"]').css("height", height);
        jQuery(SD.config.container).find('[name="dayWrapper"]').css("height", height);
        jQuery(SD.config.container).find('[name="weekWrapper"]').css("height", height);
        jQuery(SD.config.container).find('[name="hourWrapper"]').css("height", height);
        jQuery(SD.config.container).find('[name="minuteWrapper"]').css("height", height);
        jQuery(SD.config.container).find('[name="secondWrapper"]').css("height", height);

        //if (SD.config.lineHeight > 0) {

        //}
        var markHeight = (height - jQuery(SD.config.container).find('[name="dateMark"]').height()) / 2;
        jQuery(SD.config.container).find('[name="dateMark"]').css("top", markHeight + "px");
        jQuery(SD.config.container).find('[name="dateMark"]').css("width", width + "px");

    };
    function SetThemeItem(Key, statusBit, name, width, index) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var wrapper = jQuery(SD.config.container).find('[name="' + name + '"]');
        if ((statusBit & 1) == 0) {
            wrapper.hide();
            return 0;
        }
        else {
            wrapper.show();
            wrapper.css("width", width + "%");
            var left = width == 100 ? 0 : width * index;
            //wrapper.css("left", left + "%");
            return 1;
        }
    };
    function CreateUI(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        /// <summary>创建UI</summary>
        var html = '' +
            '<div name="datePage" class="datePage">' +
                '<section>' +
                    '<div class="dateScroll">' +
                    '<div name="dateMark" class="dateMark"></div>' +
                        '<div name="yearWrapper" id="' + SD.yearId + '" class="Wrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                        '<div name="monthWrapper" id="' + SD.monthId + '" class="Wrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                        '<div name="dayWrapper" id="' + SD.dayId + '" class="Wrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                        '<div name="weekWrapper" id="' + SD.weekId + '" class="Wrapper weekWrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                        '<div name="hourWrapper" id="' + SD.hourId + '" class="Wrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                        '<div name="minuteWrapper" id="' + SD.minuteId + '" class="Wrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                        '<div name="secondWrapper" id="' + SD.secondId + '" class="Wrapper">' +
                            '<ul></ul>' +
                        '</div>' +
                    '</div>' +
                '</section>' +
            '</div>'
        jQuery(SD.config.container).html(html);
        CreateYearUI(Key);
        CreateMonthUI(Key);
        CreateDayUI(Key);
        CreateWeekUI(Key);
        CreateHourUI(Key);
        CreateMinuteUI(Key);
        CreateSecondUI(Key);
    };
    function CreateYearUI(Key) {
        /// <summary>创建年UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var html = '<li>&nbsp;</li>';
        for (var i = SD.config.beginDate.getFullYear() ; i <= SD.config.endDate.getFullYear() ; i++) {
            html += '<li>' + i + '<span>年</span></li>'
        }
        html += '<li>&nbsp;</li>';
        jQuery(SD.config.container).find('[name="yearWrapper"]').find('ul').html(html);
    };
    function CreateMonthUI(Key) {
        /// <summary>创建月UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var html = '<li>&nbsp;</li>';
        for (var i = 1; i <= 12; i++) {
            if (i < 10) {
                i = "0" + i
            }
            html += '<li>' + i + '<span>月</span></li>'
        }
        html += '<li>&nbsp;</li>';
        jQuery(SD.config.container).find('[name="monthWrapper"]').find('ul').html(html);
    };
    function CreateDayUI(Key) {
        /// <summary>创建日UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var day = new Date(SD.year, SD.month, 0).getDate();
        var html = "<li>&nbsp;</li>";
        for (var i = 1; i <= day; i++) {
            html += '<li>' + i + '<span>日</span></li>'
        }
        html += "<li>&nbsp;</li>";
        jQuery(SD.config.container).find('[name="dayWrapper"]').find('ul').html(html);
    };
    function CreateWeekUI(Key) {
        /// <summary>创建星期UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var html = '<li>&nbsp;</li>';
        html += '<li><span>星期一</span><span name="recent"></span></li>';
        html += '<li><span>星期二</span><span name="recent"></span></li>';
        html += '<li><span>星期三</span><span name="recent"></span></li>';
        html += '<li><span>星期四</span><span name="recent"></span></li>';
        html += '<li><span>星期五</span><span name="recent"></span></li>';
        html += '<li><span>星期六</span><span name="recent"></span></li>';
        html += '<li><span>星期日</span><span name="recent"></span></li>';
        html += '<li>&nbsp;</li>';
        jQuery(SD.config.container).find('[name="weekWrapper"]').find('ul').html(html);
    }
    function CreateHourUI(Key) {
        /// <summary>创建时UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var html = "<li>&nbsp;</li>";
        for (var i = 0; i <= 23; i++) {
            html += '<li>' + i + '<span>时</span></li>'
        }
        html += "<li>&nbsp;</li>";
        jQuery(SD.config.container).find('[name="hourWrapper"]').find('ul').html(html);
    };
    function CreateMinuteUI(Key) {
        /// <summary>创建分UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var html = '<li>&nbsp;</li>';
        for (var i = 0; i <= 59; i++) {
            var str = i;
            if (i < 10) {
                str = '0' + i
            }
            html += '<li>' + str + '<span>分</span></li>'
        }
        html += '<li>&nbsp;</li>';
        jQuery(SD.config.container).find('[name="minuteWrapper"]').find('ul').html(html);
    };
    function CreateSecondUI(Key) {
        /// <summary>创建秒UI</summary>
        var SD = ScrollerDatepickerObjectCollection[Key];
        var html = '<li>&nbsp;</li>';
        for (var i = 0; i < 60; i++) {
            var str = i;
            if (i < 10) {
                str = '0' + i;
            }
            html += '<li>' + str + '<span>秒</span></li>'
        }
        html += "<li>&nbsp;</li>";;
        jQuery(SD.config.container).find('[name="secondWrapper"]').find('ul').html(html);
    };

    function SetScrll(Key) {
        /// <summary>设置滚动</summary>
        SetYearScroll(Key);
        SetMonthScroll(Key);
        SetDayScroll(Key);
        SetWeekScroll(Key);
        SetHourScroll(Key);
        SetMinuteScroll(Key);
        SetSecondScroll(Key);
    };
    function SetYearScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var options = {
            snap: "li",
            vScrollbar: false,
            container: SD.config.container,
            onScrollEnd: function () {
                var SDE = ScrollerDatepickerObjectCollection[this.options.container];
                indexY = (this.y / SDE.lineHeight) * (-1) + 1;
                indexY = parseInt(indexY);
                var strY = jQuery(SDE.config.container).find("[name=yearWrapper] ul li:eq(" + indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                var oldYear = SDE.year;
                SDE.year = strY;
                jQuery(SDE.config.container).find("[name=yearWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=yearWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
                GetDate(SDE.config.container);
                if (SDE.year != oldYear) {
                    try {
                        CreateDayUI(this.options.container);
                        SDE.dayScroll.refresh();
                        var day = SD.day - SD.config.beginDate.getDate();
                        SD.dayScroll.scrollToElement('li:nth-child(' + (day + 1) + ')', 100);
                    } catch (e) {

                    }
                }
            }
        };
        SD.yearScroll = new iScroll(SD.yearId, options);
    };
    function SetMonthScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var options = {
            snap: "li",
            vScrollbar: false,
            container: SD.config.container,
            onScrollEnd: function () {
                var SDE = ScrollerDatepickerObjectCollection[this.options.container];
                indexY = (this.y / SDE.lineHeight) * (-1) + 1;
                indexY = parseInt(indexY);
                var strY = jQuery(SDE.config.container).find("[name=monthWrapper] ul li:eq(" + indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                var oldMonth = SDE.month;
                SDE.month = strY;
                jQuery(SDE.config.container).find("[name=monthWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=monthWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
                GetDate(SDE.config.container);
                if (SDE.month != oldMonth) {
                    try {
                        CreateDayUI(this.options.container);
                        SDE.dayScroll.refresh();
                        var day = SD.day - SD.config.beginDate.getDate();
                        SD.dayScroll.scrollToElement('li:nth-child(' + (day + 1) + ')', 100);
                    } catch (e) {

                    }
                }

            }
        };
        SD.monthScroll = new iScroll(SD.monthId, options);
    };
    function SetDayScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var options = {
            snap: "li",
            vScrollbar: false,
            container: SD.config.container,
            onScrollEnd: function () {
                var SDE = ScrollerDatepickerObjectCollection[this.options.container];
                indexY = (this.y / SDE.lineHeight) * (-1) + 1;
                indexY = parseInt(indexY);
                //jQuery(SDE.config.container).find("[name=dayWrapper] ul").css("transform", "translate(0px, " + ((indexY - 1) * -1 * SDE.lineHeight) + "px) scale(1)") //google下不平滑
                var strY = jQuery(SDE.config.container).find("[name=dayWrapper] ul li:eq(" + indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                SDE.day = strY;
                jQuery(SDE.config.container).find("[name=dayWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=dayWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
                GetDate(SDE.config.container);

                //////////星期显示
                var week = new Date(SD.year, SD.month - 1, SD.day).getDay();
                week = week == 0 ? 7 : week;//星期天放到最后
                week -= 1;
                //SDE.weekScroll.scrollToElement('li:nth-child(' + (week + 1) + ')', 100);
                jQuery(SD.config.container).find("[name=weekWrapper] ul").css("transform", "translate(0px, " + (week * -1 * SDE.lineHeight) + "px) scale(1)")
                jQuery(SDE.config.container).find("[name=weekWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=weekWrapper] ul li:eq(" + (week + 1) + ")").addClass("WrapperSelectLi");


                //////////今天
                jQuery(SDE.config.container).find("[name=weekWrapper] ul li span").show();
                jQuery(SDE.config.container).find("[name=weekWrapper] ul li [name=recent]").hide();
                var d = new Date();
                if ((SDE.year + "/" + SDE.month + "/" + SDE.day) == (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
                    //jQuery(SDE.config.container).find("[name=weekWrapper] ul li [name=recent]").html("");
                    //alert(1);
                    jQuery(SDE.config.container).find("[name=weekWrapper] ul li:eq(" + (week + 1) + ") [name=recent]").html("今天");
                    jQuery(SDE.config.container).find("[name=weekWrapper] ul li:eq(" + (week + 1) + ") span").hide()
                    jQuery(SDE.config.container).find("[name=weekWrapper] ul li:eq(" + (week + 1) + ") [name=recent]").show();
                }
                //////////今天 End

                //////////星期显示 End
            }
        };
        SD.dayScroll = new iScroll(SD.dayId, options);
    };
    function SetWeekScroll(Key) {
        //var SD = ScrollerDatepickerObjectCollection[Key];
        //jQuery(SD.config.container).find("[name=weekWrapper] ul").css""


        //var options = {
        //    snap: "li",
        //    vScrollbar: false,
        //    container: SD.config.container,
        //    //vScroll: false,
        //    onScrollEnd: function () {
        //        var SDE = ScrollerDatepickerObjectCollection[this.options.container];
        //        indexY = (this.y / SDE.lineHeight) * (-1) + 1;
        //        indexY = parseInt(indexY);
        //        jQuery(SDE.config.container).find("[name=weekWrapper] ul li").removeClass("WrapperSelectLi");
        //        jQuery(SDE.config.container).find("[name=weekWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
        //    }
        //};
        //SD.weekScroll = new iScroll(SD.weekId, options);
    };
    function SetHourScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var options = {
            snap: "li",
            vScrollbar: false,
            container: SD.config.container,
            onScrollEnd: function () {
                var SDE = ScrollerDatepickerObjectCollection[this.options.container];
                indexY = (this.y / SDE.lineHeight) * (-1) + 1;
                indexY = parseInt(indexY);
                var strY = jQuery(SDE.config.container).find("[name=hourWrapper] ul li:eq(" + indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                SDE.hour = strY;
                jQuery(SDE.config.container).find("[name=hourWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=hourWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
                GetDate(SDE.config.container);

            }
        };
        SD.hourScroll = new iScroll(SD.hourId, options);
    };
    function SetMinuteScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var options = {
            snap: "li",
            vScrollbar: false,
            container: SD.config.container,
            onScrollEnd: function () {
                var SDE = ScrollerDatepickerObjectCollection[this.options.container];
                indexY = (this.y / SDE.lineHeight) * (-1) + 1;
                indexY = parseInt(indexY);
                var strY = jQuery(SDE.config.container).find("[name=minuteWrapper] ul li:eq(" + indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                SDE.minute = strY;
                jQuery(SDE.config.container).find("[name=minuteWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=minuteWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
                GetDate(SDE.config.container);

            }
        };
        SD.minuteScroll = new iScroll(SD.minuteId, options);
    };
    function SetSecondScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var options = {
            snap: "li",
            vScrollbar: false,
            container: SD.config.container,
            onScrollEnd: function () {
                var SDE = ScrollerDatepickerObjectCollection[this.options.container];
                indexY = (this.y / SDE.lineHeight) * (-1) + 1;
                indexY = parseInt(indexY);
                var strY = jQuery(SDE.config.container).find("[name=secondWrapper] ul li:eq(" + indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                SDE.second = strY;
                jQuery(SDE.config.container).find("[name=secondWrapper] ul li").removeClass("WrapperSelectLi");
                jQuery(SDE.config.container).find("[name=secondWrapper] ul li:eq(" + indexY + ")").addClass("WrapperSelectLi");
                GetDate(SDE.config.container);
            }
        };
        SD.secondScroll = new iScroll(SD.secondId, options);
    };

    function RefreshScroll(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        SD.yearScroll.refresh();
        SD.monthScroll.refresh();
        SD.dayScroll.refresh();
        SD.hourScroll.refresh();
        SD.minuteScroll.refresh();
        SD.secondScroll.refresh();

    };

    function ToCurDate(Key) {
        var SD = ScrollerDatepickerObjectCollection[Key];
        var year = SD.year - SD.config.beginDate.getFullYear();
        var month = SD.month - SD.config.beginDate.getMonth();
        var day = SD.day - SD.config.beginDate.getDate();
        var hour = SD.hour - SD.config.beginDate.getHours();
        var minute = SD.minute - SD.config.beginDate.getMinutes();
        var second = SD.second - SD.config.beginDate.getSeconds();
        var week = new Date(SD.year, SD.month - 1, SD.day).getDay();
        week = week == 0 ? 7 : week;//星期天放到最后
        week -= 1;

        //SD.yearScroll.scrollTo(0, SD.lineHeight * year, 100, true);
        //SD.monthScroll.scrollTo(0, SD.lineHeight * month, 100, true);
        //SD.dayScroll.scrollTo(0, SD.lineHeight * day, 100, true);
        //SD.hourScroll.scrollTo(0, SD.lineHeight * hour, 100, true);
        //SD.minuteScroll.scrollTo(0, SD.lineHeight * minute, 100, true);
        //SD.secondScroll.scrollTo(0, SD.lineHeight * second, 100, true);
        //SD.weekScroll.scrollTo(0, SD.lineHeight * week, 100, true);
        //alert(hour);
        SD.yearScroll.scrollToElement('li:nth-child(' + (year + 1) + ')', 100);
        SD.monthScroll.scrollToElement('li:nth-child(' + month + ')', 100);
        SD.dayScroll.scrollToElement('li:nth-child(' + (day + 1) + ')', 100);
        SD.hourScroll.scrollToElement('li:nth-child(' + (hour + 1) + ')', 100);
        SD.minuteScroll.scrollToElement('li:nth-child(' + (minute + 1) + ')', 100);
        SD.secondScroll.scrollToElement('li:nth-child(' + (second + 1) + ')', 100);
        //SD.weekScroll.scrollToElement('li:nth-child(' + (week + 1) + ')', 100);
    };
}
