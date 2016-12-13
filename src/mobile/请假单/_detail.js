$(document).ready(function() {
    moment.locale('zh-cn');
    Global.isDetail = true;
});

var cloundOfficeApp;
var confirmPop = {};
function initConfirmPop(callback){
    confirmPop.callback = callback;
}
var APP = {
    init : function(obj){
        var receiptData = {};
        if(obj.data){
            receiptData = obj.data;
        }
        cloundOfficeApp = new Vue({
            el:"#cloundOfficeApp",
            data:{
                titleArr : ['请假申请单', '同意', '拒绝', '编辑抄送人', '催审'],
                step : 0, // 0基础详情; 1审批同意; 2审批拒绝; 3删除抄送; 4催审
                Enable : receiptData.Enable, // 是否可编辑
                ViewType : receiptData.ViewType || 0,
                FlowState : receiptData.FlowState,
                IsAutoFLow :  receiptData.IsAutoFLow || 0, // 是否自由流程， 1是
                ApprovalState : receiptData.ApprovalState, // 审批状态

                sPersonCode : receiptData.sPersonCode || 0,
                sPersonName : receiptData.sPersonName || '',
                sRemark : '',

                SAddress : "" ,   //     语音文件地址
                sReminderId : 0, // 催审人员ID
                sReminderName : '', // 催审人员名字
                LSendType : 0, // 催审类别 0 短信 1 IM
                SContent : '', // 催审内容

                kqItemName : receiptData.kqItemName || '',
                kqItemId : receiptData.kqItemId || 0,                               // 请假单类型id
                dStartDate : moment(receiptData.dStartDate).format("YYYY-MM-DD HH:mm") || '',// 请假单开始时间
                dEndDate : moment(receiptData.dEndDate).format("YYYY-MM-DD HH:mm") || '',// 请假单结束时间
                lAllTime : receiptData.lAllTime || 0,                               // 请假总时长
                reason : receiptData.reason || '',                       // 请假原因
                submitApprovalState : 1,    // 提交审批的类型，1通过 2拒绝
                uploadSoundArr : receiptData.uploadSoundArr || [],                        // 录音上传地址
                uploadPicArr : receiptData.uploadPicArr || [],                          // 图片上传地址
                approvalRecord : receiptData.approvalRecord || [],                        // 审批记录
                fixSendPersonArr : receiptData.fixSendPersonArr || [],                      // 申请时抄送人
                fixNextPersonArr : receiptData.fixNextPersonArr || [],                      // 申请时下一个审批人
                approverSendPerson : receiptData.approverSendPerson || [],                    // 审批时，抄送人
                approverNextPerson : receiptData.approverNextPerson || [],                    // 审批时，加审的审批人
                approverUploadSound : receiptData.approverUploadSound || [],                    // 审批时，上传录音
                delSendPersonArr : [],     // 删除时抄送人
                FormAuxiliaryStatisticalList : receiptData.FormAuxiliaryStatisticalList || [], //统计列表原始数据
                staticList : receiptData.staticList || {}, //统计列表对象
                showStatic : true, //显示统计列表
                closeStatic : false, //收起统计列表
                massegeType : 'warn',                                   //消息提示类型
                massegeText : '警告内容警告内容',                       //消息提示内容
                checkContent : '<p class="mb10 tc">确认退出当前页面</p>',       //消息确认内容
                checkTitle : '',                                                //消息确认标题
                checkConfirmTxt : '确定'                                           //消息确认右下按钮名称
            },

            computed : {
                titleLabel : function(){
                    return this.titleArr[this.step];
                },
                LPerson : function(){
                    // 催审人员列表
                    return [this.sReminderId]
                },
                staticList : function(){
                    var arr = {};
                    var data= this.FormAuxiliaryStatisticalList;
                    var len = data.length;
                    var total = 0;
                    arr.title = "请假统计";
                    arr.content = [{"nameY": "次数", "data": []},{"nameY": "总计时数", "data": []}];
                    arr.nameX = [];
                    arr.column = [];
                    for(var i = 0; i < len; i ++){
                        arr.nameX[i] = data[i].Month + "月";
                        if(data[i].Times == 0){
                            arr.content[0].data[i] = "无";
                        }else{
                            arr.content[0].data[i] = data[i].Times + "次";
                        }
                        if(data[i].Days == 0){
                            arr.content[1].data[i] = "无";
                        }else{
                            arr.content[1].data[i] = data[i].Days + "天";
                        }
                        total += data[i].Days;
                    }
                    for(var i = 0; i < len; i ++){
                        var arry = [];
                        arry[0] = parseInt(data[i].Days * 100 / total) + "%";
                        arry[1] = '';
                        arr.column[i] = arry;
                    }
                    return arr;
                }
            },
            ready : function(){
                if(this.FlowState == 1){
                    this.closeStatic = true;
                }else{
                    this.closeStatic = false;
                }
            },
            methods : { checkConfirm : function(){
                    confirmPop.callback && confirmPop.callback();
            }},
            mixins : [detailVueMixin]
        });
    }
}

APP.init({
    data : initData
})