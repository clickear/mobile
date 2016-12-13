<!--2.0 请假单 Mobile  -->
<style>
.layout-bd{
    POSITION: relative;
    z-INDEX:0;
}
.layout-fd{
    POSITION: relative;
    z-INDEX:0;
}
</style>
<div id="cloundOfficeApp">
    <!-- step1 -->
    <div class="ly-header" v-show="step == 1">
        <a @click="closePage" class="l" href="javascript:;">取消</a>
        <h2>请假申请单</h2>
    </div>
    <div class="receipt-home receipt-home-fix" v-show="step == 1">
        <div class="receipt-menu-box">
            <ul class="receipt-menu clx title_show">
                <li v-for="row in kqItemArr"><a @click="selectType($index)" href="javascript:;"><ins :class="'i'+$index" ></ins>{{row}}</a></li>
            </ul>
        </div>
    </div>
    <!-- /step1 -->

    <div class="ly-header" v-show="step > 1">
        <a class="l" @click="closePage" href="javascript:;" >取消</a>
        <h2>
            <a class="slt" href="javascript:;" @click='openKqItemArr' id="title_name">{{kqItemName}}</a>
            <ul class="leave-type clx title_show" v-if="showKqItemArr">
                <li v-for="row in kqItemArr" :class="{ 'active': $index == kqItemId}"><a @click="selectType($index, 1)" href="javascript:;">{{row}}</a></li>
            </ul>
        </h2>
    </div>

    <div class="scroll-bd" v-show="step > 1">
        <div class="layout-bd">
            <!-- step2 -->
            <div v-show="step == 2">
                <div class="slt-time">
                    <p class="tit">开始时间</p>
                    <div id="dStartTime" class="datePlugin"></div>
                    <p class="tit b">结束时间</p>
                    <div id="dEndTime" class="datePlugin"></div>
                </div>
                <div class="slt-time-hours clx">
                    <span class="s1">请假时长</span>
                    <div class="slt-h">
                        <a href="javascript:;" @click="lAllTime>0.5 && (lAllTime-=0.5)">-</a>
                        <span class="s2"><i><input type="text" v-model="lAllTime" v-input-timeformat intSize="4" floatSize="1" isFormat=true  ></i>小时</span>
                        <a href="javascript:;" @click="lAllTime=lAllTime*1+0.5">+</a>
                    </div>
                </div>
            </div>
            <!-- /step2 -->

            <!-- step3 -->
            <div class="receipt receipt-create" v-show="step == 3" v-cloak>
                <div class="receipt-time-pane" id="sys_header3">
                    <div class="time-slt clx">
                        <span class="s1" v-html="getFormatStr(dStartDate)"></span>
                        <span class="s2" v-html="getFormatStr(dEndDate)"></span>
                    </div>
                    <div class="hours" v-html="getAllTime(lAllTime)"><!-- <span class="num">{{ lAllTime }}</span>小时 --></div>
                    <a class="btn-edit" @click="gotoStep(2)" href="javascript:;" ></a>
                </div>

                <div class="edit-content">
                    <div class="txt-con">
                        <span class="r">*</span>
                        <textarea class="text-area" placeholder="请假原因" v-model="reason" v-calc-input length="200"></textarea>
                        <span class="num"><i>{{reason.length}}</i>/200</span>
                    </div>

                    <input-keyword
                        :items='keywordsArr'
                        :current.sync='reason'>
                    </input-keyword>

                    <div class="add-media">
                        <a class="pic-btn" v-show="uploadPicArr.length < 20" @click="showPhotoPicker = true" href="javascript:;"></a>
                        <a class="voice-btn" v-show="uploadSoundArr.length == 0" @click="uploadSound" href="javascript:;"></a>
                    </div>
                    <div class="receipt-reason">
                        <audio-player
                            :allowedit="true"
                            :status = "stop"
                            :items='uploadSoundArr'>
                        </audio-player>

                        <photo-slide
                            :allowedit="true"
                            :items="uploadPicArr">
                        </photo-slide>
                    </div>
                </div>

                <div class="receipt-add">
                    <h3>抄送:</h3>
                    <fix-memberpicker
                        :allowedit="true"
                        :items="fixSendPersonArr"
                        @add="addFixSendPerson">
                    </fix-memberpicker>
                </div>

                <div class="receipt-add audit">
                    <h3>审批人员：</h3>
                    <fix-memberpicker
                        :apply = 'true'
                        :allowedit="IsAutoFLow"
                        :items="fixNextPersonArr"
                        @add="addApplyPerson">
                    </fix-memberpicker>
                </div>
            </div>
            <!-- /step3 -->
        </div>

        <div class="layout-fd">
            <!-- step2 -->
            <div v-show="step == 2">
                <a class="fn-btn" href="javascript:;" @click="allowStep && gotoStep(3)" :data-action="allowStep?'':'disable'">下一步</a>
                <input type="hidden" value="时间" id="dStart">
                <input type="hidden" value="结束时间" id="dEnd">
            </div>
            <!-- /step2 -->


            <!-- step3 -->
            <div v-show="step == 3">
                <a class="fn-btn" href="javascript:;" @click="submit" :data-action="allowSubmit? '':'disable' ">提交</a>
            </div>
            <!-- /step3 -->
        </div>
    </div>
    
    <!-- 图片上传组件 -->
    <upload-images
        :show.sync="showPhotoPicker"
        @camera = "pickPhotoByCamera"
        @album = "pickPhotoByAlbum">
    </upload-images>
    <!-- /图片上传组件 -->

    <!-- 图片组件 -->
    <photoswipe-gallery></photoswipe-gallery>
    <!-- /图片组件 -->

    <!-- 消息提示 -->
    <pop-massege
        :msg = "massegeText"
        :type = "massegeType"
        v-ref:showmsg>
    </pop-massege>
    <!-- /消息提示 -->

    <!-- 消息确认弹框 -->
    <pop-checked
        :content = "checkContent"
        :confirmtxt = "checkConfirmTxt"
        :title = "checkTitle"
        v-ref:showcheck
        @confirm = "checkConfirm">
    </pop-checked>
    <!-- /消息确认弹框 -->
</div>

<script>
$(document).ready(function() {
    moment.locale('zh-cn');
});

var originData = {
    dStartDate : {type:'date', value:''},
    dEndDate : {type:'date', value:''},
    lAllTime : 8,
    reason : '',
    uploadSoundArr : [],
    uploadPicArr : [],
    fixSendPersonArr : [],
    kqItemId : 0
};

var confirmPop = {};
function initConfirmPop(callback){
    confirmPop.callback = callback;
}

var cloundOfficeApp;

var APP = {
    init : function(obj){
        var receiptData = {
            IsAutoFLow : 0,
            kqItemId : 0,
            dStartDate : '',
            dEndDate : '',
            lAllTime : 8,
            reason : '',
            uploadSoundArr : [],
            uploadPicArr : [],
            fixSendPersonArr : [],
            fixNextPersonArr : []
        };

        if(obj && obj.data){
            for(var i in receiptData){
                if(obj.data[i] != undefined){
                    receiptData[i] = obj.data[i];
                }
            }
        }
        for(var i in originData){
            if(originData[i].type){
                originData[i].value = receiptData[i];
            }else{
                if(toString.apply(receiptData[i]) === '[object Array]'){
                    originData[i] = JSON.parse(JSON.stringify(receiptData[i]));
                }else{
                    originData[i] = receiptData[i];
                }
            }
        }
        cloundOfficeApp = new Vue({
            el: '#cloundOfficeApp',
            data : {
                step: 1,
                IsAutoFLow :  receiptData.IsAutoFLow, // 是否自由流程， 1是
                showKqItemArr : false,
                kqItemArr : ['年假', '事假', '病假', '婚假', '产假', '调休', '丧假', '其他'],
                keywordsArr : ['陪产', '医院待产', '生病', '家中有事', '结婚筹备', '手术'],
                kqItemName : '年假',
                sAbstract : (receiptData.lAllTime || 8 )+ "小时",
                kqItemId : receiptData.kqItemId,                               // 请假单类型id
                dStartDate : receiptData.dStartDate,                            // 请假单开始时间
                dEndDate : receiptData.dEndDate,                               // 请假单结束时间
                lAllTime : receiptData.lAllTime,                               // 请假总时长
                reason : receiptData.reason,                       // 请假原因
                uploadSoundArr : receiptData.uploadSoundArr,       // 录音上传地址
                uploadPicArr : receiptData.uploadPicArr,         // 图片上传地址
                fixSendPersonArr : receiptData.fixSendPersonArr,     // 申请时抄送人
                fixNextPersonArr : receiptData.fixNextPersonArr,     // 申请时下一个审批人
                // approvalRecord : [],       // 审批记录
                // approverSendPerson : [],   // 审批时，抄送人
                // approverNextPerson : [],   // 审批时，加审的审批人
                // approverUploadSound : []  // 审批时，上传录音
                showPhotoPicker : false,
                massegeType : 'warn',                                   //消息提示类型
                massegeText : '警告内容警告内容',                       //消息提示内容
                checkContent : '<p class="mb10 tc">确认退出当前页面</p>',       //消息确认内容
                checkTitle : '',                                                //消息确认标题
                checkConfirmTxt : '确定'                                         //消息确认右下按钮名称
            },
            watch : {
                kqItemId : function(val){
                    this.kqItemName = this.kqItemArr[val];
                },
                lAllTime : function(t){
                    this.sAbstract = t + " 小时";
                }
            },
            computed : {
                allowStep : function(){
                    return ( this.lAllTime > 0 && parseInt( moment(this.dEndDate).format("X")) >= parseInt(moment(this.dStartDate).format("X") ) + 1800);
                },
                allowSubmit : function(){
                    if(this.reason.trim().length < 1){
                        return false;
                    }
                    /*if(this.IsAutoFLow){
                        // 自由流程
                        return (this.fixNextPersonArr.length > 0);
                    }*/
                    return true;
                }
            },
            mixins : [editVueMixin],
            methods : {
                prevStep : function(){
                    var step = this.step;
                    if(step > 0){
                        this.gotoStep(step-1);
                    }
                },
                gotoStep : function(i){
                    this.step = i;
                    if(i == 2){
                        setTimeout(InitDatepicker, 20)
                    }
                },
                selectType :function(i, eventFrom){
                    this.kqItemId = i;
                    if( eventFrom == 1 ){
                        this.showKqItemArr = false;
                    }else{
                        this.gotoStep(2);
                    }
                },
                openKqItemArr : function(){
                    this.showKqItemArr = true;
                },
                checkConfirm : function(){
                    confirmPop.callback && confirmPop.callback();
                },
                closePage : function(){
                    if(!hadDataChange(cloundOfficeApp.$data)){
                        setCheckPop({
                            content: '<p class="mb10 tc">已经输入数据，取消后将无法保存，确认关闭？</p>',
                            confirm: function(){
                                sys_closeActivity();
                            }
                        });
                    }else{
                        sys_closeActivity();
                    }
                },
                getFormatStr : function(date){
                    return moment(date).format('ddd MM-DD <br> HH:mm');
                },
                getAllTime : function(parama){
                    if(parama >= 8){
                        var day = Math.floor(parama / 8);
                        var h = parama % 8;
                        if(h == 0){
                            return '<span class="num">'+ day +'</span>天';
                        }else{
                            return '<span class="num">'+ day +'</span>天<span class="num">'+ h +'</span>小时';
                        }
                    }else{
                        return '<span class="num">'+ parama +'</span>小时'
                    }
                }
            },
            ready : function(){

            }
        });

        if(obj && obj.step){
            cloundOfficeApp.gotoStep(obj.step);
        }
    }
}


var isDatePickerInit = false;
function InitDatepicker(){
    if(isDatePickerInit) return ;
     //  scrollerDatepicker.GetDateTime();
     var defStartTime, defEndTime;
     if(cloundOfficeApp.dStartDate.length){
         // 已有数据
         defStartTime = new Date(moment(cloundOfficeApp.dStartDate).format("YYYY/MM/DD HH:mm"));
         defEndTime = new Date(moment(cloundOfficeApp.dEndDate).format("YYYY/MM/DD HH:mm"));
     }else{
         // 如果是新建表单
         var curTime = new Date();
         defStartTime = new Date(curTime.getFullYear(),curTime.getMonth(),curTime.getDate()+1,'09','00')
         defEndTime = new Date(curTime.getFullYear(),curTime.getMonth(),curTime.getDate()+1,'18','00')
     }
 
     var config = {
         container: "#dStartTime",
         defaultDate: defStartTime ,        //默认日期
         theme: 63,                       //控件样式（1：日期，2：日期+时间）
         ResultTag:"#dStart",
         onChangeFun:getTimeDiff
     };
     var config2 = {
         container: "#dEndTime",
         defaultDate: defEndTime,        //默认日期
         theme: 63,                       //控件样式（1：日期，2：日期+时间）
         ResultTag:"#dEnd",
         onChangeFun:getTimeDiff
     };
 
    if(typeof(CarouselDatepicker) == 'function'){
        var carouselDatepicker = new CarouselDatepicker({
            id: "dStartTime",
            currDate: defStartTime,
            beginDate: new Date('2010/12/12 10:00'),
            endDate: new Date('2050/12/12 10:00'),
            format: 'yyyy/MM/dd HH:mm',
            onValueChange: function(value) {
             cloundOfficeApp.dStartDate = moment(new Date(value)).format("YYYY/MM/DD HH:mm");
            }           
        });
 
 
        var carouselDatepicker = new CarouselDatepicker({
             id: "dEndTime",
             currDate:defEndTime,
             beginDate: '1990/12/12 10:00',
             endDate: '2050/12/12 10:00',
             format: 'yyyy/MM/dd HH:mm',
             onValueChange: function(value) {
                    cloundOfficeApp.dEndDate = moment(new Date(value)).format("YYYY/MM/DD HH:mm");
             }               
         });
 
        cloundOfficeApp.dStartDate = moment(defStartTime).format("YYYY/MM/DD HH:mm");
        cloundOfficeApp.dEndDate = moment(defEndTime).format("YYYY/MM/DD HH:mm");
     }else{
 
         var scrollerDatepicker = new ScrollerDatepicker();
         scrollerDatepicker.Init(config);
         new ScrollerDatepicker().Init(config2);
         getTimeDiff();
     }
 

    isDatePickerInit = true;
}


function DateDiff(strInterval, dtStart, dtEnd) {
    if(isNaN(dtStart)) dStart = new Date();
    if(isNaN(dtEnd)) dtEnd = new Date();
    switch (strInterval) {
        case "s":return parseInt((dtEnd - dtStart) / 1000);
        case "n":return parseInt((dtEnd - dtStart) / 60000);
        case "h":return parseInt((dtEnd - dtStart) / 3600000);
        case "d":return parseInt((dtEnd - dtStart) / 86400000);
        case "w":return parseInt((dtEnd - dtStart) / (86400000 * 7));
        case "m":return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
        case "y":return dtEnd.getFullYear() - dtStart.getFullYear();
    }
}

function HourDiff(dtStart, dtEnd){
    return dtEnd.getHours() - dtStart.getHours();
}

function getTimeDiff(){
    var curTime = new Date();
    var start = new Date(moment(jQuery('#dStart').val()).format("YYYY/MM/DD HH:mm"));
    var end = new Date(moment(jQuery('#dEnd').val()).format("YYYY/MM/DD HH:mm"));

    var diffDay = DateDiff('d',start,end);
    var diffHour = HourDiff(start,end);

    var result = diffDay * 8 + diffHour;
    // cloundOfficeApp.$set('lAllTime', result)
    // jQuery('#lAllTime').val(result);
    // jQuery('#lAllTimeshow').text(result);
    cloundOfficeApp.dStartDate = moment(start).format("YYYY/MM/DD HH:mm");
    cloundOfficeApp.dEndDate = moment(end).format("YYYY/MM/DD HH:mm");
    // jQuery('#dEndShow').html(getFormatStr(end));
    // jQuery('#dStartShow').html(getFormatStr(start));
}


// function getFormatStr(date){
//     return moment(date).format('ddd MM-DD <br> HH:mm');
// }

initStepBack = 3;

// debug
if(false){
    // 创建
    APP.init()
}else{
    // 编辑
    var initStep = 1;
    if(initData.HasData){
        initStep = 3;
    }
    APP.init({
        step : initStep,
        data : initData
    })
}
</script>