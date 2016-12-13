

///滚轮日期选择器对象集合
;(function ($) {     
    var pluginName = "ScrollerDatepicker",
        defaults = {
            container: "#divContainer",
            beginDate: "2000/01/01 00:00:00",                 //开始时间
            endDate: "2100/01/01 00:00:00",                   //结束时间
            defaultDate: new Date(),        //默认日期
            theme: 1,                       //控件样式（1：日期，2：日期+时间）
            ResultTag:"",                   //结果标签
            height:150,
            lineHeight:50,
            onChangeFun:function(){}
        };


    function ScrollerDatepicker(element,options) {
        this.$that =  $(element);
        this.yearScroll = null;
        this.monthScroll = null;
        this.dayScroll = null;
        this.weekScroll = null;
        this.hourScroll = null;
        this.minuteScroll = null;
        this.secondScroll = null;

        //为了IScroll创建一个ID
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

        this.lineHeight = 50;
        this.version = 'v1.0.1';

        this.indexY = 0;
        this.indexX = 0;

        this.config = jQuery.extend(true, {}, defaults, options);
        var strt = new Date();
        $this =this;
        this.Init();
       
    }

    ScrollerDatepicker.prototype = {
        Init:function(){
                       var starTime= new Date();
            this.BasicData();
            var starTime2 = new Date();
            this.CreateUI();
            var starTime3= new Date();
            //  SetTheme(this.config.container);
            var starTime4 = new Date();
            this.SetScrll();
            var starTime5 = new Date();
            this.RefreshScroll();
            var starTime6 = new Date();
            this.ToCurDate();

            var starTime7 = new Date();
           //  alert('s1:'+(starTime2- starTime)); 
           //  alert('s2:'+(starTime3- starTime2));    
           //  alert('s3:'+(starTime4- starTime3));
           // alert('s4:'+(starTime5- starTime4));
           //  alert('s5:'+(starTime6- starTime5));
           //  alert('s6:'+(starTime7- starTime6));
           // alert('s7:'+(starTime7- starTime));

            this.$this = this;
        },
        BasicData:function(){
            this.yearId = "yearId" + Math.ceil(Math.random() * 1000000000);
            this.monthId = "monthId" + Math.ceil(Math.random() * 1000000000);
            this.dayId = "dayId" + Math.ceil(Math.random() * 1000000000);
            this.weekId = "weekId " + Math.ceil(Math.random() * 1000000000);
            this.hourId = "hourId" + Math.ceil(Math.random() * 1000000000);
            this.minuteId = "minuteId" + Math.ceil(Math.random() * 1000000000);
            this.secondId = "secondId" + Math.ceil(Math.random() * 1000000000);

            //设置值
            this.year = this.config.defaultDate.getFullYear();
            this.month = this.config.defaultDate.getMonth() + 1;//+1
            this.day = this.config.defaultDate.getDate();
            this.hour = this.config.defaultDate.getHours();
            this.minute = this.config.defaultDate.getMinutes();
            this.second = this.config.defaultDate.getSeconds();
            //week = config.defaultDate.getDay();

            if (typeof this.config.beginDate == "string") {
                this.config.beginDate = new Date(this.config.beginDate.replace(/-/g, "/"));
            }
            if (!(this.config.beginDate instanceof Date)) {//不是字符串类型，又不是时间类型的全部用当前时间
                this.config.beginDate = new Date("2000/01/01 00:00:00")
            }

            if (typeof this.config.endDate == "string") {
                this.config.endDate = new Date(this.config.endDate.replace(/-/g, "/"));
            }
            if (!(this.config.endDate instanceof Date)) {//不是字符串类型，又不是时间类型的全部用当前时间
                this.config.endDate = new Date("2100/01/01 00:00:00")
            }
            if (this.config.endDate < this.config.beginDate) {
                this.config.endDate = new Date(this.config.beginDate).setFullYear(this.config.beginDate.getFullYear() + 1);
                //
            }
        },
        CreateUI:function(){
            var statusBit = 0;
                var startGetDate = new Date();
            if (!isNaN(this.config.theme)) {
                statusBit = parseInt(this.config.theme);
            }
            if (statusBit == 0 || statusBit.toString(2).length > 7) {
                statusBit = Math.pow(2, 7) - 1;//1111111
            }
            //校验参数设置，并把校验后的值设置回去
            this.config.theme = statusBit;
            this.lineHeight = 50;
            var number = statusBit.toString(2).replace(/0/g, "").length;
            var widthPercent = 100 / number;
            var index = 0;
            var height = this.config.height;
            var html = '' +
                '<div name="datePage" style="display:block" class="datePage">' +
                    '<section>' +
                        '<div class="dateScroll">' +
                        '<div name="dateMark" class="dateMark" style="width: 100%;"></div>' +
                            '<div name="yearWrapper" id="' + this.yearId + '" class="Wrapper" '+(((statusBit&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul>'+
                                '</ul>' +
                            '</div>' +
                            '<div name="monthWrapper" id="'+this.monthId+'" class="Wrapper" '+((((statusBit>>1)&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul>'+
                                '</ul>' +
                            '</div>' +
                            '<div name="dayWrapper" id="' + this.dayId + '" class="Wrapper" '+((((statusBit>>2)&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul>'+
                                    //this.GetDayUIHtml()+
                                '</ul>' +
                            '</div>' +
                            '<div name="weekWrapper" id="' + this.weekId + '" class="Wrapper weekWrapper" '+((((statusBit>>3)&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul> '+
                                    '<li>&nbsp;</li>'+
                                    '<li><span>星期一</span><span name="recent"></span></li>'+
                                    '<li><span>星期二</span><span name="recent"></span></li>'+
                                    '<li><span>星期三</span><span name="recent"></span></li>'+
                                    '<li><span>星期四</span><span name="recent"></span></li>'+
                                    '<li><span>星期五</span><span name="recent"></span></li>'+
                                    '<li><span>星期六</span><span name="recent"></span></li>'+
                                    '<li><span>星期日</span><span name="recent"></span></li>'+
                                    '<li>&nbsp;</li>'+
                                '</ul>' +
                            '</div>' +
                        
                            '<div name="hourWrapper" id="' + this.hourId + '" class="Wrapper" '+((((statusBit>>4)&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul>'+
                                    //this.GetHourUIHtml()+
                                '</ul>' +
                            '</div>' +
                            '<div name="minuteWrapper" id="' + this.minuteId + '" class="Wrapper" '+((((statusBit>>5)&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul>'+
                                   //this.GetMinuteUIHtml()+
                                '</ul>' +
                            '</div>' +
                            '<div name="secondWrapper" id="' + this.secondId + '" class="Wrapper" '+((((statusBit>>6)&1)==0)?'style="display:none"':'style="width:'+widthPercent+'%;height:'+height+'px;"')+'>' +
                                '<ul>'+
                                   // this.GetSecondUIHtml()+
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</section>' +
                '</div>';
                        
            this.$that.html(html);
            alert('GetDate:'+(new Date()-startGetDate));
            var start1 = new Date();
                   jQuery('#'+this.monthId+' ul').html(this.GetMOnthUIHtml());
             var start2 = new Date();
     
            jQuery('#'+this.yearId+' ul').html(this.GetYearUIHtml());
             var start3 = new Date();
            jQuery('#'+this.dayId+' ul').html(this.GetDayUIHtml());
             var start4 = new Date();
           // CreateWeekUI();
             var start5 = new Date();
            jQuery('#'+this.hourId+' ul').html(this.GetHourUIHtml());
             var start6 = new Date();
            jQuery('#'+this.minuteId+' ul').html(this.GetMinuteUIHtml());
             var start7 = new Date();
            jQuery('#'+this.secondId+' ul').html(this.GetSecondUIHtml());
             var start8 = new Date();

            alert('start1:'+(start2-start1))
            alert('start2:'+(start3-start2))
            alert('start3:'+(start4-start3))
            alert('start4:'+(start5-start4))
            alert('start5:'+(start6-start5))
            alert('start6:'+(start7-start6))
            alert('start7:'+(start8-start7))
           alert('start7:'+(start8-start1))

        },
        GetYearUIHtml:function(){
            var endDateYear = this.config.endDate.getFullYear();
            var html = '<li>&nbsp;</li>';
            for (var i = this.config.beginDate.getFullYear() ; i <= endDateYear ; i++) {
                html += '<li>' + i + '<span>年</span></li>'
            }
            html += '<li>&nbsp;</li>';
            return html;
        },
        GetMOnthUIHtml: function (){
            var str="<li>&nbsp;</li>";
            for(var i=1;i<=12;i++){
                if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'月</li>'
            }
            return str+"<li>&nbsp;</li>";;
        },
        GetDayUIHtml:function(){
            var day = new Date(this.year, this.month, 0).getDate();
            var html = "<li>&nbsp;</li>";
            for (var i = 1; i <= day; i++) {
                html += '<li>' + i + '<span>日</span></li>'
            }
            html += "<li>&nbsp;</li>";
            return html;
        },
        CreateDayUI:function () {
            var day = new Date(this.year, this.month, 0).getDate();
            var html = "<li>&nbsp;</li>";
            for (var i = 1; i <= day; i++) {
                html += '<li>' + i + '<span>日</span></li>'
            }
            html += "<li>&nbsp;</li>";
            //this.$that.find('[name="dayWrapper"]').find('ul').html(html);
            jQuery('#'+this.dayId).find('ul').html(html);
        },
        GetHourUIHtml:function(){
            var html = "<li>&nbsp;</li>";
            for (var i = 0; i <= 23; i++) {
                html += '<li>' + i + '<span>时</span></li>'
            }
            html += "<li>&nbsp;</li>";
            return html;    
        },
        GetMinuteUIHtml:function(){
            var html = '<li>&nbsp;</li>';
            for (var i = 0; i <= 59; i++) {
                var str = i;
                if (i < 10) {
                    str = '0' + i
                }
                html += '<li>' + str + '<span>分</span></li>'
            }
            html += '<li>&nbsp;</li>';
            return html;
        },
        GetSecondUIHtml:function(){
            var html = '<li>&nbsp;</li>';
            for (var i = 0; i < 60; i++) {
                var str = i;
                if (i < 10) {
                    str = '0' + i;
                }
                html += '<li>' + str + '<span>秒</span></li>'
            }
            html += "<li>&nbsp;</li>";;
            return html;
        },
        GetDate:function() {   

                var datetime = this.year + "/" + this.month + "/" + this.day + " " + this.hour + ":" + this.minute + ":" + this.second;
                this.$that.attr("value", datetime);
                var result = "";

                if (this.config.theme & 1 != 0) {
                    result = this.year;
                }
                if ((this.config.theme >> 1) & 1 != 0) {
                    result += (this.config.theme & 1 != 0) ? "/" : (result == "" ? "" : " ");
                    result += this.month;
                }
                if ((this.config.theme >> 2) & 1 != 0) {
                    result += ((this.config.theme >> 1) & 1 != 0) ? "/" : (result == "" ? "" : " ");
                    result += this.day;
                }
                if ((this.config.theme >> 4) & 1 != 0) {
                    result += ((this.config.theme >> 3) & 1 != 0) ? " " : (result == "" ? "" : " ");
                    result += this.hour;
                }
                if ((this.config.theme >> 5) & 1 != 0) {
                    result += ((this.config.theme >> 4) & 1 != 0) ? ":" : (result == "" ? "" : " ");
                    result += this.minute;
                }
                if ((this.config.theme >> 6) & 1 != 0) {
                    result += ((this.config.theme >> 5) & 1 != 0) ? ":" : (result == "" ? "" : " ");
                    result += this.second;
                }

                if (typeof this.config.ResultTag == "string")
                    jQuery(this.config.ResultTag).attr("value", result);

                if(typeof this.config.onChangeFun == "function")
                    this.config.onChangeFun();


                return result;
        },
        SetScrll:function(){
            var starTime = new Date();
            this.SetYearScroll();

            var starTime2 = new Date();
            this.SetMonthScroll();

            var starTime3 = new Date();
            this.SetDayScroll();

            var starTime4 = new Date();
            //SetWeekScroll();
            this.SetHourScroll();

            var starTime5 = new Date();
            this.SetMinuteScroll();

            var starTime6 = new Date();
            this.SetSecondScroll();
        },
        SetYearScroll:function(){
            var options = {
            snap: "li",
            hScroll :false,
            vScrollbar:false,
            Wrapper:this,
            onScrollEnd: function () {
                    var $this = this.options.Wrapper;
                    $this.indexY = (this.y / $this.lineHeight) * (-1) + 1;
                    $this.indexY = parseInt($this.indexY);
                    var $SDEContainerYear = jQuery('#'+$this.yearId).find("ul");
                    var strY =  $SDEContainerYear.find("li:eq(" + $this.indexY + ")").html();
                    strY = strY.substr(0, strY.length - 1);
                    strY = parseInt(strY);
                    var oldYear = $this.year;
                    $this.year = strY;
                    $SDEContainerYear.find("li").removeClass("WrapperSelectLi");
                    $SDEContainerYear.find("li:eq(" + $this.indexY + ")").addClass("WrapperSelectLi");
                    $this.GetDate();
                    if ($this.year != oldYear) {
                        try {
                            $this.CreateDayUI();
                            $this.dayScroll.refresh();
                            var day = $this.day - $this.config.beginDate.getDate();
                            $this.dayScroll.scrollToElement('li:nth-child(' + (day + 1) + ')', 100);
                        } catch (e) {

                        }
                    }
                }
            };
            this.yearScroll = new iScroll(this.yearId, options);
        },
        SetMonthScroll:function(){
            var options = {
            snap: "li",
            hScroll :false,
            vScrollbar:false,
            Wrapper:this,
            onScrollEnd: function () {
                        var $this = this.options.Wrapper;
                        $this.indexY = (this.y / $this.lineHeight) * (-1) + 1;
                        $this.indexY = parseInt($this.indexY);
                        var $SDEContainerMonth =  $this.$that.find("[name=monthWrapper] ul");
                        var strY = $SDEContainerMonth.find("li:eq(" + $this.indexY + ")").html();
                        strY = strY.substr(0, strY.length - 1);
                        strY = parseInt(strY);
                        var oldMonth = $this.month;
                        $this.month = strY;
                        $SDEContainerMonth.find("li").removeClass("WrapperSelectLi");
                        $SDEContainerMonth.find("li:eq(" + $this.indexY + ")").addClass("WrapperSelectLi");

                        $this.GetDate();
                        if ($this.month != oldMonth) {
                            try {
                                $this.CreateDayUI();
                                $this.dayScroll.refresh();
                                var day = $this.day - $this.config.beginDate.getDate();
                                $this.dayScroll.scrollToElement('li:nth-child(' + (day + 1) + ')', 100);
                            } catch (e) {

                            }
                        }

                    }
            };   
             this.monthScroll = new iScroll(this.monthId, options);              
        } ,
        SetDayScroll:function(){
            var options = {
                    snap: "li",
                    hScroll :false,
                    vScrollbar:false,
                     Wrapper:this,
                    onScrollEnd: function () {
                        var $this = this.options.Wrapper;
                        $this.indexY = (this.y / $this.lineHeight) * (-1) + 1;
                        $this.indexY = parseInt($this.indexY);
                        var $SDEContainerDay = $this.$that.find("[name=dayWrapper] ul ");
                        //jQuery(SDE.config.container).find("[name=dayWrapper] ul").css("transform", "translate(0px, " + ((indexY - 1) * -1 * SDE.lineHeight) + "px) scale(1)") //google下不平滑
                        var strY = $SDEContainerDay.find("li:eq(" + $this.indexY + ")").html();
                        strY = strY.substr(0, strY.length - 1);
                        strY = parseInt(strY);
                        $this.day = strY;
                        $SDEContainerDay.find("li").removeClass("WrapperSelectLi");
                        $SDEContainerDay.find("li:eq(" + $this.indexY + ")").addClass("WrapperSelectLi");
                        $this.GetDate();

                        //////////星期显示
                        var week = new Date($this.year, $this.month - 1, $this.day).getDay();
                        week = week == 0 ? 7 : week;//星期天放到最后
                        week -= 1;     
                        var $SDEContainerWeek = $this.$that.find("[name=weekWrapper] ul ");
                        //SDE.weekScroll.scrollToElement('li:nth-child(' + (week + 1) + ')', 100);
                        $SDEContainerWeek.css("transform", "translate(0px, " + (week * -1 * $this.lineHeight) + "px) scale(1)")
                        $SDEContainerWeek.find("li").removeClass("WrapperSelectLi");
                        $SDEContainerWeek.find("li:eq(" + (week + 1) + ")").addClass("WrapperSelectLi");


                        //////////今天
                        $SDEContainerWeek.find("li span").show();
                        $SDEContainerWeek.find("li [name=recent]").hide();
                        var d = new Date();
                        if (($this.year + "/" + $this.month + "/" + $this.day) == (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
                            //jQuery(SDE.config.container).find("[name=weekWrapper] ul li [name=recent]").html("");
                            //alert(1);
                            $SDEContainerWeek.find("li:eq(" + (week + 1) + ") [name=recent]").html("今天");
                            $SDEContainerWeek.find("li:eq(" + (week + 1) + ") span").hide()
                            $SDEContainerWeek.find("li:eq(" + (week + 1) + ") [name=recent]").show();
                        }
                        //////////今天 End

                        ////////星期显示 End
                    }
            };
            this.dayScroll = new iScroll(this.dayId, options);
        },
        SetHourScroll:function(){
            var options = {
            snap: "li",
            hScroll :false,
            vScrollbar:false,
             Wrapper:this,
            onScrollEnd: function () {      
                    var $this = this.options.Wrapper;           
                    $this.indexY = (this.y / $this.lineHeight) * (-1) + 1;
                    $this.indexY = parseInt($this.indexY);
                    var $SDEContainerHour = $this.$that.find("[name=hourWrapper] ul");
                    var strY = $SDEContainerHour.find("li:eq(" + $this.indexY + ")").html();
                    strY = strY.substr(0, strY.length - 1);
                    strY = parseInt(strY);
                    $this.hour = strY;
                    $SDEContainerHour.find("li").removeClass("WrapperSelectLi");
                    $SDEContainerHour.find("li:eq(" + $this.indexY + ")").addClass("WrapperSelectLi");
                    $this.GetDate();
                }
            };
            this.hourScroll = new iScroll(this.hourId, options);
        },
        SetMinuteScroll:function(){
           var options = {
                snap: "li",
                hScroll :false,
                vScrollbar:false,
                container: this.config.container,
                 Wrapper:this,
                onScrollEnd: function () {
                    var $this = this.options.Wrapper;
                    $this.indexY = (this.y / $this.lineHeight) * (-1) + 1;
                    $this.indexY = parseInt($this.indexY);
                    var $SDEContainerMin = $this.$that.find("[name=minuteWrapper] ul ");
                    var strY = $SDEContainerMin.find("li:eq(" + $this.indexY + ")").html();
                    strY = strY.substr(0, strY.length - 1);
                    strY = parseInt(strY);
                    $this.minute = strY;
                    $SDEContainerMin.find("li").removeClass("WrapperSelectLi");
                    $SDEContainerMin.find("li:eq(" + $this.indexY + ")").addClass("WrapperSelectLi");
                    $this.GetDate();

                }
            };
            this.minuteScroll = new iScroll(this.minuteId, options);
        },
        SetSecondScroll:function(){
            var options = {
            snap: "li",
            hScroll :false,
            vScrollbar:false,
             Wrapper:this,
            onScrollEnd: function () {
                var $this = this.options.Wrapper;
                $this.indexY = (this.y / $this.lineHeight) * (-1) + 1;
                $this.indexY = parseInt($this.indexY);
                var $SDEContainerSec = $this.$that.find("[name=secondWrapper] ul ");
                var strY =  $SDEContainerSec.find("li:eq(" + $this.indexY + ")").html();
                strY = strY.substr(0, strY.length - 1);
                strY = parseInt(strY);
                $this.second = strY;
                $SDEContainerSec.find("li").removeClass("WrapperSelectLi");
                $SDEContainerSec.find("li:eq(" + $this.indexY + ")").addClass("WrapperSelectLi");
                $this.GetDate();
            }
            };
            this.secondScroll = new iScroll(this.secondId, options);
        },
        RefreshScroll:function(){
            this.yearScroll.refresh();
            this.monthScroll.refresh();
            this.dayScroll.refresh();
            this.hourScroll.refresh();
            this.minuteScroll.refresh();
            this.secondScroll.refresh();
        },
        ToCurDate:function(){
            var year = this.year - this.config.beginDate.getFullYear();
            var month = this.month - this.config.beginDate.getMonth();
            var day = this.day - this.config.beginDate.getDate();
            var hour = this.hour - this.config.beginDate.getHours();
            var minute = this.minute - this.config.beginDate.getMinutes();
            var second = this.second - this.config.beginDate.getSeconds();
            var week = new Date(this.year, this.month - 1, this.day).getDay();
            week = week == 0 ? 7 : week;//星期天放到最后
            week -= 1;
            // this.yearScroll.scrollTo(0, this.lineHeight * year, 100, true);
            // this.monthScroll.scrollTo(0, this.lineHeight * month, 100, true);
            // this.dayScroll.scrollTo(0, this.lineHeight * day, 100, true);
            // this.hourScroll.scrollTo(0, this.lineHeight * hour, 100, true);
            // this.minuteScroll.scrollTo(0, this.lineHeight * minute, 100, true);
            // this.secondScroll.scrollTo(0, this.lineHeight * second, 100, true);
          //  this.weekScroll.scrollTo(0, this.lineHeight * this.week, 100, true);
            //alert(hour);
            this.yearScroll.scrollToElement('li:nth-child(' + (year + 1) + ')', 100);
            this.monthScroll.scrollToElement('li:nth-child(' + month + ')', 100);
            this.dayScroll.scrollToElement('li:nth-child(' + (day + 1) + ')', 100);
            this.hourScroll.scrollToElement('li:nth-child(' + (hour + 1) + ')', 100);
            this.minuteScroll.scrollToElement('li:nth-child(' + (minute + 1) + ')', 100);
            this.secondScroll.scrollToElement('li:nth-child(' + (second + 1) + ')', 100);
            //weekScroll.scrollToElement('li:nth-child(' + (week + 1) + ')', 100);
        }
    }
     

  
     $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new ScrollerDatepicker(this,options));
            }
        });

        // chain jQuery functions
        return this;
    };

})(jQuery);  