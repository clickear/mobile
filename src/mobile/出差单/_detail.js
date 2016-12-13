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
                titleArr : ['出差申请单', '同意', '拒绝', '编辑抄送人', '催审'],
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

                price : receiptData.price || 0,                                     // 预算金额
                startPlace : receiptData.startPlace || 0,                           // 出发地点
                endPlace : receiptData.endPlace || 0,                               // 到达地点
                dStartDate : moment(receiptData.dStartDate).format("YYYY-MM-DD") || '',// 出差单开始时间
                dEndDate : moment(receiptData.dEndDate).format("YYYY-MM-DD") || '',// 出差单结束时间
                lAllDay : receiptData.lAllDay || 0,                               // 出差总时长
                reason : receiptData.reason || '',                       // 出差原因
                uploadSoundArr : receiptData.uploadSoundArr || [],                        // 录音上传地址
                uploadPicArr : receiptData.uploadPicArr || [],                          // 图片上传地址
                approvalRecord : receiptData.approvalRecord || [],                        // 审批记录
                fixSendPersonArr : receiptData.fixSendPersonArr || [],                      // 申请时抄送人
                delSendPersonArr : [],     // 删除时抄送人
                fixNextPersonArr : receiptData.fixNextPersonArr || [],                      // 申请时下一个审批人
                approverSendPerson : receiptData.approverSendPerson || [],                    // 审批时，抄送人
                approverNextPerson : receiptData.approverNextPerson || [],                    // 审批时，加审的审批人
                approverUploadSound : receiptData.approverUploadSound || [],                    // 审批时，上传录音
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
                staticList : function(){
                    var arr = {};
                    var data= this.FormAuxiliaryStatisticalList;
                    var len = data.length;
                    var total = 0;
                    var total1 = 0;
                    var total2 = 0;
                    arr.title = "出差统计";
                    arr.content = [{"nameY": "报销", "data": []},{"nameY": "预算", "data": []},{"nameY": "省/超", "data": []}];
                    arr.nameX = [];
                    arr.column = [];
                    for(var i = 0; i < len; i ++){
                        arr.nameX[i] = data[i].Month;
                        if(data[i].ReimbursedAmount == 0){
                            arr.content[0].data[i] = "未报销";
                        }else{
                            arr.content[0].data[i] = data[i].ReimbursedAmount + "元";
                        }
                        if(data[i].BudgetAmount == 0){
                            arr.content[1].data[i] = "无预算";
                        }else{
                            arr.content[1].data[i] = data[i].BudgetAmount + "元";
                        }
                        if(data[i].ReimbursedAmount == data[i].BudgetAmount){
                            arr.content[2].data[i] = 0;
                        }else{
                            arr.content[2].data[i] = data[i].ReimbursedAmount - data[i].BudgetAmount + "元";
                        }
                        total1 += data[i].ReimbursedAmount;
                        total2 += data[i].BudgetAmount;
                    }
                    if(total1 > total2){
                        total = total1;
                    }else{
                        total = total2;
                    }
                    for(var i = 0; i < len; i ++){
                        var arry = [];
                        arry[0] = parseInt(data[i].ReimbursedAmount * 100 / total) + "%";
                        arry[1] = parseInt(data[i].BudgetAmount * 100 / total) + "%";
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

// 获取表单数据
function getKqItemData(){
    var data = getViewModelData(cloundOfficeApp);
    return {
        price : data.price,
        dStartDate : data.dStartDate,
        dEndDate : data.dEndDate,
        startPlace : data.startPlace,
        endPlace : data.endPlace,
        lAllDay : data.lAllDay,
        reason : data.reason,
        uploadSoundArr : data.uploadSoundArr,
        uploadPicArr : data.uploadPicArr,
        fixSendPersonArr : data.fixSendPersonArr,
        fixNextPersonArr : data.fixNextPersonArr
        // approvalRecord : data.approvalRecord,
        // approverSendPerson : data.approverSendPerson,
        // approverNextPerson : data.approverNextPerson,
        // approverUploadSound : data.approverUploadSound
    };
};

APP.init({
    data : initData
})