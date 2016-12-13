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
                titleArr : ['工作请示单', '同意', '拒绝', '编辑抄送人', '催审'],
                step : 0,
                Enable : receiptData.Enable, // 是否可编辑
                ViewType : receiptData.ViewType || 0,
                FlowState : receiptData.FlowState,
                IsAutoFLow :  receiptData.IsAutoFLow || 0, // 是否自由流程， 1是
                ApprovalState : receiptData.ApprovalState,

                sPersonCode : receiptData.sPersonCode || 0,
                sPersonName : receiptData.sPersonName || '',
                sRemark : '',

                SAddress : "" ,   //     语音文件地址
                sReminderId : 0, // 催审人员ID
                sReminderName : '', // 催审人员名字
                LSendType : 0, // 催审类别 0 短信 1 IM
                SContent : '', // 催审内容

                urgent : receiptData.urgent || 0,                               // 是否紧急
                title : receiptData.title || "",                                    // 主题
                content : receiptData.content || [],                                  // 内容
                uploadSoundArr : receiptData.uploadSoundArr || [],                        // 录音上传地址
                uploadPicArr : receiptData.uploadPicArr || [],                          // 图片上传地址
                approvalRecord : receiptData.approvalRecord || [],                        // 审批记录
                fixSendPersonArr : receiptData.fixSendPersonArr || [],                      // 申请时抄送人
                fixNextPersonArr : receiptData.fixNextPersonArr || [],                      // 申请时下一个审批人
                delSendPersonArr : [],     // 删除时抄送人
                approverSendPerson : receiptData.approverSendPerson || [],                    // 审批时，抄送人
                approverNextPerson : receiptData.approverNextPerson || [],                    // 审批时，加审的审批人
                approverUploadSound : receiptData.approverUploadSound || [],                    // 审批时，上传录音
                showStatic : false, //显示统计列表
                massegeType : 'warn',                                   //消息提示类型
                massegeText : '警告内容警告内容',                       //消息提示内容
                checkContent : '<p class="mb10 tc">确认退出当前页面</p>',       //消息确认内容
                checkTitle : '',                                                //消息确认标题
                checkConfirmTxt : '确定'                                           //消息确认右下按钮名称
            },

            computed : {
                titleLabel : function(){
                    return this.titleArr[this.step];
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