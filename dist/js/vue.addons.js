if(location.host.indexOf('127.0.0.1') != -1){
    var ggg = function(i){
        var tmp = ['请假单', '外出单', '出差单', '报销单', '工作请示单', '物品申请单']
        location.href = '/mobile/'+tmp[i]+'/shell_edit.html';
    }
    var Global = {}
    Global.HostUrl = 'http://de.bug'
}

function getViewModelData( vm ){
    console.log(vm)
    return JSON.parse(JSON.stringify(vm.$data));
}

/* 表单状态 */
var receiptStatusCfg = {
    1:{
        action:'progress',
        name: '正在审批中'
    },
    2:{
        action:'success',
        name: '通过'
    },
    3:{
        action:'reject',
        name: '拒绝'
    },
    4:{
        action:'progress',
        name: '未开始'
    },
    5:{
        action:'revoke',
        name: '已撤销'
    },
    6:{
        action:'no-exist',
        name: '不存在'
    },
    7:{
        action: 'done',
        name: '已审'
    },
    8:{
        action: 'waiting',
        name: '待审'
    }
}

var setCheckPop = function(obj){
    var vn = cloundOfficeApp;
    var txt;
    if(!obj.content){
        obj.content = '';
    }
    if(!obj.title){
        obj.title = '';
    }
    if(!obj.confirmTxt){
        txt = "确定";
    }else{
        txt = obj.confirmTxt;
    }
    vn.checkContent = obj.content;
    vn.checkTitle = obj.title;
    vn.checkConfirmTxt = txt;
    initConfirmPop(function(){
        obj.confirm();
    });
    vn.showCheckPop();
}

var setMsgkPop = function(obj){
    var vn = cloundOfficeApp;
    if(!obj.content){
        obj.content = '';
    }
    if(!obj.type){
        obj.type = '';
    }
    vn.massegeText = obj.content;
    vn.massegeType = obj.type;
    vn.showMassegePop();
}


function hadDataChange(app){
    console.log(JSON.stringify(app))
    console.log(JSON.stringify(originData))
    for(var i in originData){
        if(originData[i] && originData[i].type){
            var s = moment(app[i]).format('X');
            var t = moment(originData[i].value).format('X');
            if(s !== t){
                return false
            }
        }else{
            var s = deepDif(originData[i], app[i]);
            if(!s){
                return false;
            }
        }
    }
    return true;
}

function deepDif(x, y){
    if(Object.prototype.toString.call(x) == "[object Object]" || Object.prototype.toString.call(x) == "[object Array]"){
        for(var i in x){
            var s = deepDif(x[i], y[i]);
            if(!s){
                return false
            }
        }
    }else{
        if(JSON.stringify(x) !== JSON.stringify(y)){
            return false
        }
    }
    return true;
}



function becomeAvatarSrc(code){
    return ( (Global.HostUrl||'') + '/officephoto/' + code + '/80');
}

function lookPersonInfo(code){
    return sys_lookPerson(code);
}

//图片上传进度模拟数据
configStep = [
    {
        stage : 20,//进度分段
        speed : 0.2//进度所有时间比重
    },
    {
        stage : 40,
        speed : 0.4
    },
    {
        stage : 50,
        speed : 0.1
    },
    {
        stage : 80,
        speed : 0.2
    },
    {
        stage : 98,
        speed : 0.1
    }
]
//图片上传模拟实例{domObj:进度条ID,imgSize:图片大小,imgURl:图片地址}
function PrgressBar(domObj,imgSize,imgUrl){
    if(!imgSize){
        imgSize = 500;
    }
    var self = this;
    self.level = 0; /* 进度百分比 */
    self.levelSpeed = []; /* 每加1%进度所要时间 */
    self.levelStep = []; /* 模拟进度改变分段 */
    self.fileSize = imgSize; /* 图片大小 */
    self.netSpeed = 100; /* 模拟网速 */
    self.mockSpeed = self.fileSize / self.netSpeed * 1000; /* 进度所要总时间 */
    self.refreshBar = function(){
        setTimeout(function(){
            domObj.style.display = 'block';
            domObj.nextSibling.innerHTML = '<em class="progress-txt">图片上传中</em><em class="progress-num">'+ self.level +'%</em>';
            domObj.nextSibling.style.display = 'block';
            domObj.style.width = self.level + "%";
            if(self.level >= self.levelStep[0]){
                self.levelSpeed.shift();
                self.levelStep.shift();
            }
            self.level++;
            if(self.levelSpeed.length){
                self.refreshBar();
            }
        }, self.levelSpeed[0])

    }
    self.removeBar = function(){
        domObj.style.display = 'none';
        domObj.nextSibling.style.display = 'none';
    }
    self.setBar = function(num){
        self.refreshBar = function(){};
        domObj.style.display = 'block';
        domObj.nextSibling.style.display = 'block';
        domObj.style.width = num + "%";
        domObj.nextSibling.innerHTML = '<em class="progress-txt">图片上传中</em><em class="progress-num">'+ num+'%</em>';
    }
    self.turnError = function(){
        domObj.nextSibling.innerHTML = '<em class="progress-txt">失败</em><em class="progress-num">点击重试</em>';
        domObj.nextSibling.style.display = 'block';
    }
    for(var i =0 , len = configStep.length; i < len; i++){
        var dStage = 0;
        if(i == 0){
            dStage = configStep[i].stage;
        }else{
            dStage = configStep[i].stage - configStep[i - 1].stage;
        }
        self.levelSpeed[i] = configStep[i].speed * self.mockSpeed / dStage;
        self.levelStep[i] = configStep[i].stage;
    }
    self.refreshBar();
}

var imgProgressAry = {};

/* 编辑基础 */
var editVueMixin = {
    methods : {
        addFixSendPerson : function(){
            //抄送
            var self = this;
            var canotChoose = [];
            canotChoose.push(Global.CurrentPerson)
            sys_getSelectMultiplePerson(self.fixSendPersonArr,canotChoose,function(per){   
                self.fixSendPersonArr = per
            });
            console.log("增加抄送人");
        },

        addApplyPerson : function(){
            //审批
            var self = this;
            sys_getSelectPerson(function(per){
                if(self.fixNextPersonArr.length>=20)
                {
                    return;
                }

                if(per){
                    var l = self.fixNextPersonArr.length;
                    if(l == 0){
                        if(per[0].code == Global.CurrentPerson.code){
                            return;
                        }
                        self.fixNextPersonArr = per;
                    }else{
                        var temp = [];
                        self.fixNextPersonArr.forEach(function(row){
                            temp.push(row.code || '')
                        });

                        if(temp[l - 1] == per[0].code){
                            per.shift();
                        }
                        self.fixNextPersonArr = self.fixNextPersonArr.concat(per);
                    }

                }
            });
            console.log("增加审批人");
        },

        pickPhoto : function(){
            if(this.uploadPicArr.length >= 5){
                return
            }
            this.showPhotoPicker = true;
        },

         pickPhotoByAlbum : function(){
            var self = this;
            //第一个参数：开始 第2个参数：结束
            sys_choosePhoto(function(src){  
                if(self.uploadPicArr.length>20){
                    return;
                }
                if(src.key){
                    self.uploadPicArr.push({key:src.key});
                }
                setTimeout(function(){
                        var name = src.key;
                        var domObj = document.getElementById(src.key);
                        var pro = new PrgressBar(domObj, '1024');
                        imgProgressAry[name] = {};
                        imgProgressAry[name].status = 'start';
                        imgProgressAry[name].data = pro;

                },1);
                self.showPhotoPicker = false;
            },function(src){
                var returnValue = src[0];
                var len1 = self.uploadPicArr.length,len2;
                try{
                    if(imgProgressAry && imgProgressAry[returnValue.key] &&imgProgressAry[returnValue.key].status){
                        //change
                        imgProgressAry[returnValue.key].status = 'uploadSuccess';
                        if(imgProgressAry[returnValue.key].data){
                            imgProgressAry[returnValue.key].data.removeBar();
                        }
                            for(var i=0 ; i<len1; i++){
                                if(self.uploadPicArr[i].key == src[0].key){
                                    self.uploadPicArr.$set(i, src[0]);
                                    break;
                                }
                            }
                    }else{
                        //push 之前，张数验证
                        if(self.uploadPicArr.length>20){
                            return;
                        }
                        self.uploadPicArr.push(src[0]);
                        if(!imgProgressAry[returnValue.key]){
                            imgProgressAry[returnValue.key] = {status:'uploadSuccess'};
                        }else{
                            imgProgressAry[returnValue.key].status = 'uploadSuccess'; 
                        }
                    }
                }catch(e){

                }
            });
            this.showPhotoPicker = false
            console.log("调用相册");
        },

        pickPhotoByCamera : function(){
            var self = this;
            sys_takePhoto(function(src){
                if(self.uploadPicArr.length>20){
                    return;
                }
               if(src.key){
                    self.uploadPicArr.push({key:src.key});
                }
                setTimeout(function(){
                        var name = src.key;
                        var domObj = document.getElementById(src.key);
                        var pro = new PrgressBar(domObj, '1024');
                        imgProgressAry[name] = {};
                        imgProgressAry[name].status = 'start';
                        imgProgressAry[name].data = pro;
                },1);
            },function(src){
                var returnValue = src[0];
                var len1 = self.uploadPicArr.length,len2;
                try{
                    if(imgProgressAry && imgProgressAry[returnValue.key] &&imgProgressAry[returnValue.key].status){
                        //change
                        imgProgressAry[returnValue.key].status = 'uploadSuccess';
                        if(imgProgressAry[returnValue.key].data){
                            imgProgressAry[returnValue.key].data.removeBar();
                        }
                        for(var i=0 ; i<len1; i++){
                            if(self.uploadPicArr[i].key == src[0].key){
                                self.uploadPicArr.$set(i, src[0]);
                                break;
                            }
                        }
                    }else{
                        //push 之前，张数验证
                        if(self.uploadPicArr.length>20){
                            return;
                        }
                        self.uploadPicArr.push(src[0]);
                        if(!imgProgressAry[returnValue.key]){
                            imgProgressAry[returnValue.key] = {status:'uploadSuccess'};
                        }else{
                            imgProgressAry[returnValue.key].status = 'uploadSuccess'; 
                        }
                    }
                 
                }catch(e){

                }


            });
            console.log("调用相机");
            this.showPhotoPicker = false;
        },

        // 上传语音
        uploadSound : function(){
            var self = this;
            if(this.uploadSoundArr.length < 2){
                console.log('调用录音');
                sys_record(function(data){
                    // self.uploadSoundArr.push(src);
                    self.uploadSoundArr = data;
                });
            }else{
                console.log('最多只能上传1个语音')
            }
        },

        submit : function(){
            if(!this.allowSubmit){
                return;
            }
            console.log('提交数据')
            if(this.hasLinkBill){
                sys_formfirstcommit(this.hasLinkBill);
            }else{
                 sys_formfirstcommit();
            }
        },

        //显示提示弹框
        showMassegePop : function(){
            this.$refs.showmsg.shows();
        },
        showCheckPop : function(){
            this.$refs.showcheck.popShow();
        },
        getAvatarSrc : function(code){
            return becomeAvatarSrc(code);
        }
    }
}

/* 详情基础 */
var detailVueMixin = {
    methods : {
        lookPerson : function(code){
            lookPersonInfo(code)
        },
        cancelStep : function(){
            if(this.step > 0){
                try{
                    sys_recycle();
                }catch(e){

                }
                return this.step = 0;
            }
            sys_closeActivity();
        },
        // 提交人操作表单
        receiptModify : function(){
            if(this.FlowState == 5){
                // 已被拒绝，修改表单
                console.log('提交人修改表单')
                sys_formChangeSubmit();
            }else{
                // 撤销表单
                console.log('提交人撤销表单')
                sys_formFlowRemove();
            }
        },
        // 跳转审批
        gotoApproval : function(type){
            if(this.Enable == 0){
                return;
            }
            this.sRemark = '';
            if(type == 'agree'){
                this.submitApprovalState = 1;
                return this.step = 1;
            }
            if(type == 'reject'){
                this.submitApprovalState = 2;
                return this.step = 2;
            }
        },
        // 提交审批
        doApproval : function(){
            console.log(this.sRemark)
            // 审批提交的ApprovalState字段 通过 submitApprovalState获取
            console.log('提交确认')
            sys_approval();
        },
        // 上传语音
        uploadSound : function(){
            var self = this;
            sys_record(function(data){
                self.approverUploadSound = data;
            });
           /* if(this.uploadSoundArr.length < 3){
                console.log('调用录音')
                sys_record(function(src){
                    self.uploadSoundArr.push(src);
                });
            }else{
                console.log('最多只能上传2个语音')
            }*/
        },

        // 添加抄送
        addFixSendPerson:function(){
            var self = this;
            var canotChoose = [];
            canotChoose.push(Global.CurrentPerson)
            sys_getSelectMultiplePerson(self.fixSendPersonArr,canotChoose,function(per){   
                sys_setConfirmPop("确认要抄送此单据？",function(){
                    self.fixSendPersonArr = per;
                    sys_AddSendPersons(self.fixSendPersonArr);
                })

            });
            console.log("增加抄送人");
        },

        //跳转到删除抄送页面
        gotoDelSendPerson : function(){
            this.delSendPersonArr = this.fixSendPersonArr.concat([]);
            this.step = 3;
        },

        //确定删除抄送人
        setFixSendPerson : function(){
            var self = this;
            sys_setConfirmPop("删除后这些人将无法查阅此条单据，确认删除？",function(){
                var arr = self.fixSendPersonArr.concat([]);
                var del = self.delSendPersonArr.concat([]);
                var len = arr.length;
                for(var i = 0; i < len; i ++){
                    for(var j = 0, n = del.length; j < n; j ++){
                        if(arr[i] == del[j]){
                            arr.splice(i, 1);
                        }
                    }
                }
                self.fixSendPersonArr = self.delSendPersonArr.concat([]);
                self.delSendPersonArr = arr.concat([]);
                sys_DeleteSendPersons(self.delSendPersonArr);
                self.step = 0;
            })
        },

        // 审批添加抄送
        addApproverSend:function(){
            console.log('添加审批抄送')
             var self = this;
            var canotChoose = [];
            canotChoose.push(Global.CurrentPerson)
            sys_getSelectMultiplePerson(self.approverSendPerson,canotChoose,function(per){   
                self.approverSendPerson = per
            });   
        },
        // 审批添加加审
        addApproverNext : function(){
            console.log('添加审批加审')
            var self = this;
            sys_getSelectPerson(function(per){
                if(self.approverNextPerson.length>=20){
                    return;
                }
                if(per){
                    if(self.approverNextPerson.length == 0){
                        if(per[0].code == Global.CurrentPerson.code){
                            return;
                        }
                        self.approverNextPerson = per;
                    }else{
                        var temp = [];
                        self.approverNextPerson.forEach(function(row){
                            temp.push(row.code || '')
                        });
                        for(var i=0, len=per.length; i<len; i++){
                            if(per[i].code){
                                if(temp.indexOf(per[i].code) == -1){
                                    self.approverNextPerson.push(per[i]);
                                }
                            }else{
                                self.approverNextPerson.push(per[i]);
                            }
                        }
                    }

                }
            });
        },
        // 跳转催审
        /*gotoReminder : function(data){
            this.step = 4;
            this.sReminderId  = data.approverId;
            this.sReminderName = data.approverName;
        },*/
        // 提交催审
        submitReminder : function(){
            console.log('点击提交催审');
            console.log(this.LPerson, this.LSendType, this.SContent )
        },
        getAvatarSrc : function(code){
            return becomeAvatarSrc(code);
        },
        //toggle 统计列表
        toggleStatic : function(){
            if(this.closeStatic){
                this.closeStatic = false;
            }else{
                this.closeStatic = true;
            }
        },
        //显示提示弹框
        showMassegePop : function(){
            this.$refs.showmsg.shows();
        },
        showCheckPop : function(){
            this.$refs.showcheck.popShow();
        }
    }
};;

var FE_Util = {
    formatNumber : function (opts){
        var temp = opts.val.replace(/[^\d.]/g, '');
        var hasdot = new RegExp("\\.", "").test(temp);
        var strArr = temp.split('.'),
            intStr = strArr[0],
            floatStr = strArr[1]||''
            returnStr = '';
        if(strArr.length > 2){
            strArr.shift()
            floatStr = strArr.join('')
        }
        if(intStr.length > opts.intSize){
            intStr = parseInt(intStr.toString().substr(0, opts.intSize))
        }
        if(floatStr.length > opts.floatSize){
            floatStr = floatStr.toString().substr(0, opts.floatSize);
        }

        if(opts.isFormat){
            if(floatStr.length>0){
                if(floatStr == "0"){
                    floatStr = 0;
                }else{
                    floatStr = 5
                }
            }
        }
        if(floatStr === "" && hasdot){
            returnStr = intStr + '.' ;
        }else if(floatStr !== ""){
            returnStr = intStr + '.' + floatStr;;
        }else{
            returnStr = intStr;
        }

        return returnStr
    }
}
/* filter */
Vue.filter('onlyNumber', {
    // model -> view
    // 在更新 `<input>` 元素之前格式化值
    read: function(val, t) {
        var s = 1;
        if(t){
            s = parseInt(t)
        }
        return parseFloat(val.toFixed(s))
    },
    // view -> model
    // 在写回数据之前格式化值
    write: function(val, oldVal, t) {
        var number = +val.replace(/[^\d.]/g, '');
        var len = 1;
        if(t){
            len = t;
        }
        return isNaN(number) ? 0 : parseFloat(number.toFixed(len));
    }
});

Vue.filter('timeStepFilter', {
    // model -> view
    // 在更新 `<input>` 元素之前格式化值
    read: function(val) {
        var s = Math.floor(val);
        if(val*10 == s*10){
            return val
        }
        return (s*10+5)/10;
    },

    // view -> model
    // 在写回数据之前格式化值
    write: function(val, oldVal) {
        var number = +val.replace(/[^\d.]/g, '')
        return isNaN(number) ? 0 : parseFloat(number.toFixed(1))
    }
});;

/* components */





/* 图片组件 */
var avatarMsgVueCom = Vue.extend({
    props: ['xsrc', 'dsrc'],
    template:  '<img :src="defaultsrc">',
    data:function(){
        return{
            defaultsrc: this.dsrc || '../img/mobile/ava120.png'
        }
    },
    created:function(){

        var that = this;
        var img = new Image();

        img.onload = function(){
            that.$el.src = that.xsrc;
        }
        img.src = that.xsrc;
    },watch:{
        'xsrc':function(val,oldVal){
            var that = this;
            var img = new Image();

            img.onload = function(){
                that.defaultsrc = that.xsrc;
            }
            img.src = that.xsrc;
        }
    }
})
Vue.component('ximg', avatarMsgVueCom);

/* 表单快捷输入 */
var inputkeywordVueCom = Vue.extend({
    props : ['items', 'current'],
    template :  '<div class="usual-txt">'
                +    '<a :class="{\'fn-btn-gray\':true, \'active\': current == row}" v-for="row in items" href="javascript:;" @click="select(row)">{{ row }}</a>'
                +'</div>',
    methods : {
        select : function(row){
            if(this.current.length + row.length > 200){
                return;
            }
            this.current += row;
        }
    }
});
Vue.component('input-keyword', inputkeywordVueCom)


/* 创建表单编辑抄送人 */
var fixMemberPickerVueCom = Vue.extend({
    props : ['items', 'allowedit', 'apply'],
    template :  '<div :id="apply? \'fixMembers\' : \'\'">'
                +   '<div class="avatar" v-for="row in items" name="{{row.code}}" :class="getIgnores($index)">'
                +      '<ximg :xsrc="getSrc(row.code)"></ximg>'
                +      '<span class="name">{{ row.name }}</span>'
                +      '<ins v-if="allowedit" class="icon-del" @click="del($index)"></ins>'
                +   '</div>'
                +   '<a v-if="allowedit" class="fn-btn-add" href="javascript:;" @click="add"></a>'
                +'</div>',

    data:function(){
        return{
                defaultSortable: {}
            }
    },
    watch:{
        'allowedit':function(val,oldVal){
            this.defaultSortable && this.defaultSortable.option && this.defaultSortable.option("disabled", !val);
        }
    },
    ready:function(){
        var that = this;
        if(this.apply){
            //这里注意，只能初始化一次。如果初始化多次。会出错。
            var drags = document.getElementById('fixMembers');
            this.defaultSortable = Sortable.create(drags, {
            animation: 150,
            forceFallback: false,
            disabled:!this.allowedit,
            ghostClass : 'ghost',
            filter: ".ignore",
            draggable : '.avatar',
            onEnd : function(evt){
                var copy = cloundOfficeApp.fixNextPersonArr.concat([]);
                if(evt.newIndex != undefined) {
                        //首节点
                        if(evt.newIndex == 0){
                            if(Global.CurrentPerson.code == $("#fixMembers .avatar").eq(evt.newIndex).attr("name")){
                                cloundOfficeApp.fixNextPersonArr = [];
                                cloundOfficeApp.fixNextPersonArr = copy.concat([]);
                                return false;
                            }
                        }

                        if(evt.newIndex > 0){
                            if($("#fixMembers .avatar").eq(evt.newIndex).attr("name") == $("#fixMembers .avatar").eq(evt.newIndex - 1).attr("name")){
                                cloundOfficeApp.fixNextPersonArr = [];
                                cloundOfficeApp.fixNextPersonArr = copy.concat([]);
                                return false;
                            }
                        }
                        if(evt.newIndex < copy.length){
                            if($("#fixMembers .avatar").eq(evt.newIndex).attr("name") == $("#fixMembers .avatar").eq(evt.newIndex + 1).attr("name")){
                                cloundOfficeApp.fixNextPersonArr = [];
                                cloundOfficeApp.fixNextPersonArr = copy.concat([]);
                                return false;
                            }
                        }
                        var old = copy[evt.oldIndex];
                        copy.splice(evt.oldIndex, 1);
                        copy.splice(evt.newIndex, 0, old);
                        cloundOfficeApp.fixNextPersonArr = [];
                        cloundOfficeApp.fixNextPersonArr = copy.concat([]);     
                    }
                }
            });
        }
    },
    methods : {
        add : function(){
            this.$dispatch('add');
        },
        del : function(i){
            if(this.allowedit){
                this.items.splice(i, 1);
                this.$dispatch('del', i, 'edit');
            }
        },
        getSrc : function(code){
            return becomeAvatarSrc(code);
        },
        getIgnores : function(i){
            // console.log(i)
            if(i > 0 && i < this.items.length){
                if(this.items[i - 1].code == this.items[i + 1].code){
                    return 'ignore';
                }else{
                    return '';
                }
            }else{
                return '';
            }
        }
    }
});
Vue.component('fix-memberpicker', fixMemberPickerVueCom);

/* 音频播放 */
var audioPlayerVueCom = Vue.extend({
    // uploadSoundArr
    props : ['items', 'allowedit', 'status'],
    template :  '<div class="voice" v-for="row in items" @click="gotoPlay(row)" :class="status? status : \'stop\'" :status="row.status">'
                +   '<span class="v1" v-html="getTime(row.time)"></span>'
                +   '<span class="v2" v-html="getDate(row.date)"></span>'
                +   '<ins v-if="allowedit" class="icon-del" @click="del"></ins>'
                +'</div>',
    methods : {
        gotoPlay : function(row){
            var selft = this;
            sys_recordPlay(row.src,function(recordStatus){
                if(recordStatus){
                    if(recordStatus.status == 'play'){
                        selft.status = 'play'
                    }else
                    {
                        selft.status = 'stop';
                    }
                }
            });
        },
        getTime : function(t){
            var time = "";
            var minu = Math.floor(t/60) ;
            var secon = t%60;
            if(minu > 0){
                time = minu +'m'
            }
            time += (secon + 's');
            return time;
        },
        getDate : function(d){
            var date = "";
            var recordDate;
            if(d){
                recordDate = new Date(d);
            }else{
                recordDate = new Date();
            }
            date = moment(recordDate).format("MM-DD");
            return date;
        },
        del : function(i){
            if(!this.allowedit){
                return
            }
            this.items.splice(i, 1);
        }
    }
});
Vue.component('audio-player', audioPlayerVueCom)

/* 图片查看 */
var photoSlideVueCom = Vue.extend({
    props : ['items', 'allowedit', 'resize'],
    template :  '<div class="pic" :class="(items.length == 4 || items.length <= 2) && resize? \'fix\' : \'\'">'
                +   '<span v-for="row in items"><em class="img-box" v-bind:style="{ backgroundImage: getBackground(row.src)}" @click="gotoPlay($index)"  track-by="src"></em>'
                +   '<ins id="{{row.key}}" class="progress"></ins>'
                +   '<em class="progress-box"><em class="progress-txt">图片上传中</em><em class="progress-num"></em></em>'
                +   '<ins v-if="allowedit" @click="del($index)" class="icon-del"></ins></span>'
                +'</div>',
    methods : {
        gotoPlay : function(i){
            var items = this.items;
            initPhotoSwipe({
                index : i,
                items : items
            });
        },
        del:function(i){
            if(!this.allowedit){
                return
            }
            try{
                if(this.items[i] && this.items[i].key){
                    imgProgressAry[this.items[i].key] = {};
                }
            }
            catch(e){              
            }
            this.items.splice(i, 1);
            // this.$dispatch('del', i);
        },
        getBackground : function(src){
            src = src.replace('(','\\(');
            src = src.replace(')','\\)');
            return "url("+src+"&size=80)";
        }
    }
});
Vue.component('photo-slide', photoSlideVueCom);

/* 图片控件DOM */
var photoSwipeVueCom = Vue.extend({
    template :  '<div id="gallery" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">'
                +    '<div class="pswp__bg"></div>'
                +    '<div class="pswp__scroll-wrap">'
                +        '<div class="pswp__container">'
                +            '<div class="pswp__item"></div>'
                +            '<div class="pswp__item"></div>'
                +            '<div class="pswp__item"></div>'
                +        '</div>'
                +        '<div class="pswp__ui pswp__ui--hidden">'
                +            '<div class="pswp__top-bar">'
                +                '<div class="pswp__counter"></div>'
                +                '<button class="pswp__button pswp__button--close" title="Close (Esc)" value="asdf"></button>'
                +                '<button class="pswp__button pswp__button--share" title="Share"></button>'
                +                '<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>'
                +                '<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>'
                +                '<div class="pswp__preloader">'
                +                    '<div class="pswp__preloader__icn">'
                +                        '<div class="pswp__preloader__cut">'
                +                            '<div class="pswp__preloader__donut"></div>'
                +                        '</div>'
                +                    '</div>'
                +                '</div>'
                +            '</div>'
                +            '<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">'
                +                '<div class="pswp__share-tooltip">'
                +                '</div>'
                +            '</div>'
                +            '<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>'
                +            '<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>'
                +            '<div class="pswp__caption">'
                +                '<div class="pswp__caption__center">'
                +                '</div>'
                +            '</div>'
                +        '</div>'
                +    '</div>'
                +'</div>'
});
Vue.component('photoswipe-gallery', photoSwipeVueCom);
function initPhotoSwipe(opt) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var items = opt.items;

    var options = {
        index: opt.index,
        galleryUID: 1
    };
    gallery2 = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery2.listen('gettingData', function(index, item) {
    if(!item.w  || item.w == 0){
        item.w = 1600;
    }
    if(!item.h || item.h == 0 ){
          item.h = 1600;
    }

    });
    gallery2.init();
}

/** 单据详情 a[data-action=@]
 *  @success 通过
 *  @progress 审核中
 *  @reject 拒绝
 *  @revoke 撤销
 */
var receiptStatusVueCom = Vue.extend({
    props : ["enable", "viewtype", "flowstate", "approvalstate"],
    template :  '<a class="receipt-btn" data-action="{{status}}" href="javascript:;"></a>',
    computed : {
        status : function(){
            /* flowstate 0 为申请  1 审批中，2通过归档 3 拒绝归档 4（流程错误归档） 5 作废 */
            if(this.viewtype != 2){
                // 提交人和抄送人 根据flowstate
                return receiptStatusCfg[this.flowstate].action;
            }

            // 审批人查看状态下
            if(this.enable == 1){
                // 可编辑表示待审批
                return receiptStatusCfg[8].action;
            }

            // 不可编辑下 根据approvalstate
            if(this.approvalstate == 1){
                // 通过
                return receiptStatusCfg[7].action;
            }
            return receiptStatusCfg[3].action;
        }
    }
});
Vue.component('receipt-status', receiptStatusVueCom);

/* 审批记录 */
var recordItemsVueCom = Vue.extend({
    props : ['items', 'viewtype', 'flowstate','donotremind','donotlookperson'],
    template:   '<ul class="receipt-list">'
                +   '<li v-for="item in items" :data-action="getAction(item.nodeState)">'
                +       '<h4>{{item.option}}</h4>'
                +       '<p class="t">{{getCompleTiemFormatStr(item.nodeState,item.completeTime)}}</p>'
                +       '<div class="avatar">'
                +           '<ximg @click="look(item.approverId)" :xsrc="getSrc(item.approverId)"></ximg>'
                +           '<span class="name">{{item.approverName}}</span>'
                +       '</div>'
                +       '<div class="opts" v-if="!donotremind">'
                +           '<a v-show="viewtype == 1 && item.nodeState == 1 && flowstate != 5" @click="gotoReminder(item)" href="javascript:;">催审</a>'/*+'<a href="javascript:;">沟通</a>'*/
                +       '</div>'

                +       '<div class="opinion" v-if=" item.contentStr.length">'
                +           '<p class="p1">审批意见：</p>'
                +           '<p class="p2">{{ item.contentStr }} </p>'
                // +           '<a href="javascript:;">显示更多</a>'
                +       '</div>'

                +       '<audio-player :items="item.approverUploadSound" :allowedit="false"></audio-player>'

                +       '<div class="addition" v-if="item.approverSendPerson.length">'
                +          '<p class="s1">新增抄送人：<span class="s2" v-for="index in item.approverSendPerson">{{index.name}}</span></p>'
                +       '</div>'
                +   '</li>'
                +'</ul>',
    methods : {
        getSrc : function(code){
            return becomeAvatarSrc(code);
        },
        gotoReminder : function(data){
            // return this.$dispatch('gotoreminder', data)
            sys_urge(data.approverId, data.approverName)
        },
        getAction : function(row){
            return receiptStatusCfg[row].action
        },
        look : function(code){
            if(!!!this.donotlookperson){
                lookPersonInfo(code);
            
            }
        },
        getCompleTiemFormatStr:function(nodeState,completeTime){
            if(nodeState == 1){
                var result = completeTime;
                try {
                    var dt = moment(completeTime, "HH:mm:ss YYYY-MM-DD");
                    if (moment().add(-5, "m").isBefore(dt)) {
                        result = "刚刚";
                    } else if (moment().add(-5, "m").isAfter(dt) && moment().add(-1, "h").isBefore(dt)) {
                        result = moment().diff(dt, "minutes") + "分钟前";
                    } else if (moment().add(-1, "h").isAfter(dt) && moment().add(-1, "d").isBefore(dt)) {
                        result = moment().diff(dt, "hours") + "小时前";
                    } else if (moment().add(-1, "d").isAfter(dt)) {
                        result = moment().diff(dt, "days") + "天前";
                    }
                } catch (e) { }

                return result;

            }else{
                return completeTime;
            }
        }
    }
});
Vue.component('record-items', recordItemsVueCom);

/* 详情页操作 */
var detailOperateVueCom = Vue.extend({
    props: ['enable', 'viewtype', 'flowstate'],
    template:   '<div class="ly-footer" v-if="enable">'
                +   '<a class="fn-btn" href="javascript:;" @click="modify" v-if="viewtype == 1" v-text="flowstate == 1?\'撤销\':\'修改\'"></a>'
                +   '<div style="height: 40px;" class="receipt-btns clx" v-if="viewtype == 2">'
                +       '<a class="btn-reject fixed" data-view="left" href="javascript:;" @click="approval(\'reject\')">拒绝</a>'
                +       '<a class="btn-primary fixed" data-view="right" href="javascript:;" @click="approval(\'agree\')">同意</a>'
                +   '</div>'
                +'</div>',
    methods : {
        approval : function(type){
            this.$dispatch('approval', type);
        },
        modify : function(){
            this.$dispatch('modify');
        }
    }
});
Vue.component('detail-operation', detailOperateVueCom);

// 审批 isdontneedsend 是否需要抄送人  
var approvalVueCom = Vue.extend({
    props : ['step', 'sremark', 'approversendperson', 'approvernextperson', 'approveruploadsound', 'isautoflow', 'isdontneedsend'],
    template:   '<div class="receipt receipt-edit" v-if="step == 1|| step == 2">'
                +   '<div class="edit-content">'
                +       '<div class="txt-con">'
                +           '<textarea class="text-area" :placeholder="step == 1? \'备注\':\'拒绝原因\'" v-calc-input length="100" v-model="sremark"></textarea>'
                +           '<span class="num"><i>{{sremark.length}}</i>/100</span>'
                +           '<a class="voice-btn" href="javascript:;" @click="dispatch(\'uploadsound\')"></a>'
                +       '</div>'
                +       '<div class="receipt-reason">'
                +           '<audio-player :allowedit="true" :items="approveruploadsound"></audio-player>'
                +       '</div>'
                +   '</div>'
                +   '<div class="receipt-add" v-if="!isdontneedsend">'
                +       '<h3>抄送:</h3>'
                +       '<fix-memberpicker @add="dispatch(\'addapproversend\')" :allowedit="true" :items="approversendperson"></fix-memberpicker>'
                +   '</div>'
                +   '<div class="receipt-add audit" v-if="step == 1 && isautoflow == 1">'
                +       '<h3>加审：</h3>'
                +       '<fix-memberpicker @add="dispatch(\'addapprovernext\')" :allowedit="true" :items="approvernextperson"></fix-memberpicker>'
                +   '</div>'
                +   '<div class="btm">'
                +       '<a href="javascript:;" class="fn-btn" @click="submit" :data-action="step == 2 && sremark.trim().length == 0?\'disable\':\'\'">确认</a>'
                +   '</div>'
                +'</div>',
    methods : {
        dispatch : function(type){
            this.$dispatch(type);
        },
        submit : function(){
            if(this.step == 2 && this.sremark.trim().length == 0){
                return;
            }
            this.$dispatch('submit');
        }
    }
});
Vue.component('approval-component', approvalVueCom);

/* 催审 */
var reminderVueCom = Vue.extend({
    props : ['step', 'personid', 'personname', 'remindertype', 'remindercontent'],
    template:   '<div class="reminder" v-if="step == 4">'
                +   '<div class="receipt-add">'
                +      '<span class="s1">接收人</span>'
                +      '<div class="avatar">'
                +          '<ximg :xsrc="getSrc(personid)"></ximg>'
                +          '<span class="name">{{personname}}</span>'
                +      '</div>'
                // +      '<a class="fn-btn-add" href="javascript:;"></a>'
                +   '</div>'
                +   '<div class="reminder-content ui-tab">'
                +      '<ul class="ui-tab-nav tab-nav-2 clx">'
                +          '<li :class="{\'active\':remindertype == 0}"><a @click="remindertype=0" href="javascript:;">短信</a></li>'
                +          '<li :class="{\'active\':remindertype == 1}"><a @click="remindertype=1" href="javascript:;">IM</a></li>'
                +      '</ul>'
                +      '<div class="ui-tab-content">'
                +          '<div class="tab-pane active">'
                +              '<div class="txt-con">'
                +                  '<textarea class="text-area" v-model="remindercontent" maxlength="100" placeholder="（点击编辑内容）"></textarea>'
                +                  '<span class="num"><i>{{remindercontent.length}}</i>/100</span>'
                +              '</div>'
                +          '</div>'
                +      '</div>'
                +   '</div>'
                +'</div>',
    methods : {
        getSrc : function(code){
            return becomeAvatarSrc(code);
        }
    }
});
Vue.component('reminder-component', reminderVueCom);

/* 图片上传 */
var uploadImagesVueCom = Vue.extend({
    props:['show'],
    template:  '<div class="ui-btm-modal" :class="{\'hide\':!show}">'
               +   '<div class="btm-modal-content">'
               +      '<a @click="pick(\'album\')" href="javascript:;" style="border-bottom:#e5e5e5 1px solid;">添加照片</a>'
               +      '<a @click="pick(\'camera\')" href="javascript:;">拍照</a>'
               +   '</div>'
               +   '<a href="javascript:;" class="btm-modal-btn" @click="this.show = false">返回</a>'
               +'</div>',
    methods:{
        pick : function( type){
            this.$dispatch(type);
        }
    }
})
Vue.component('upload-images', uploadImagesVueCom);

/* 详情 删除抄送人 */
var delFixSendVueCom = Vue.extend({
    props: ['step', 'delsendpersonarr'],
    data : function(){
        return {
            path : Global.HostUrl || ""
        }
    },
    template:   '<div v-show="step == 3" style="padding-top: 70px;">'
                +   '<div class="receipt-add">'
                +       '<div class="avatar" v-for="row in delsendpersonarr" @click="delsendpersonarr.splice($index, 1)">'
                +           '<ximg :xsrc="path+\'/officephoto/\' + row.code + \'/80\'"></ximg>'
                +           '<span class="name">{{ row.name }}</span>'
                +       '</div>'
                +   '</div>'
                +'</div>'
});
Vue.component('delfixsend-component', delFixSendVueCom);


/*消息提示*/
var massegePop = Vue.extend({
    props: ['msg', 'type'],
    data : function(){
        return {
            isShow : false
        };
    },
    template:    '<div class="fn-tip2-modal" data-status="{{type}}" v-show="isShow">'
                +    '<p class="txt">'
                +        '<ins v-if="type" class="tip-icon"></ins>'
                +        '<span>{{msg}}</span>'
                +    '</p>'
                +'</div>',
    methods:{
        shows : function(){
            var sel = this;
            sel.isShow = true;
            setTimeout(function(){
                sel.isShow = false;
            }, 2000);
        }
    }
});
Vue.component('pop-massege', massegePop);

/*消息确认弹框*/
var checkPop = Vue.extend({
    props: ["content", "title", "confirmtxt"],
    data : function(){
        return {
            isShow : false
        };
    },
    template :   '<div class="ui-modal" :class="{\'hide\':!isShow}">'
                +    '<div class="modal-header">'
                +        '<h3>{{title}}</h3>'
                +    '</div>'
                +    '<div class="modal-con2" v-html="content">'
                +    '</div>'
                +    '<div class="modal-btn">'
                +        '<a class="btn-cancel2" href="javascript:;" @click="close">取消</a>'
                +        '<a class="btn-confirm2" href="javascript:;" @click="confirm">{{confirmtxt}}</a>'
                +    '</div>'
                +'</div>',
    methods : {
        close : function(){
            this.isShow = false;
        },
        confirm : function(){
            this.isShow = false;
            this.$dispatch("confirm");
        },
        popShow : function(){
            this.isShow = true;
        }
    }
});
Vue.component('pop-checked', checkPop);

/*关联单据组件*/
var billLink = Vue.extend({
    props: ["edite", "show", "data"],
    template :   '<div class="account" v-show="show">'
                +    '<div class="item" v-for="row in data">'
                +           '<span class="s2">出差单</span>'
                +        '<span class="s1"><i>{{row.price}}</i>元</span> <br>'
                // +        '<div class="clx">'
                +            '<span class="s3" v-html="getTime(row.dDate)"></span>'
                // +        '</div>'
                +        '<ins v-show="edite" @click="del($index)" class="icon-del"></ins>'
                +    '</div>'
                +'</div>',
    methods : {
        del : function(i){
            this.data.splice(i, 1);
        },
        getTime : function(date){
            return moment(date).format("MM-DD HH:mm");
        }
    }
});
Vue.component('bill-link', billLink);


/*自定义命令*/
Vue.directive('calc-input',{
  bind: function(){
    var me = this;
    me.evt = function(e) {
      var val = me.el.value;
      var maxlengt = me.el.getAttribute('length')
      if(val.length>maxlengt){
        val = val.substr(0,maxlengt)
      }
       me.el.value = val;
      // Prevent falling in undefined value 
      return val;
    };

    // Add a Event listener
    me.el.addEventListener('input',me.evt, false);
  },

  unbind: function() {
    var me = this;
    // Remove The listener
    me.el.removeEventListener('input',me.evt, false);
  }
});


Vue.directive('input-timeformat',{
  bind: function(){
    var me = this;
    me.evt = function(e) {
        var val = me.el.value;
        var returnStr = "";
        var intSize = me.el.getAttribute('intSize')
        var floatSize = me.el.getAttribute('floatSize')
        var isFormat = me.el.getAttribute('isFormat') == "true";
        returnStr = FE_Util.formatNumber({
                        val : val,
                        intSize : intSize,
                        floatSize: floatSize,
                        isFormat:isFormat
                    });

        me.el.value = returnStr;
        // Prevent falling in undefined value
        return returnStr;
    };


    me.blurEvt = function(e){
        var val = me.el.value;
        var floatSize = me.el.getAttribute('floatSize')
        floatSize = floatSize || 1;
        me.el.value = val*Math.pow(10,floatSize)/Math.pow(10,floatSize);
        return val*1;
    };

    me.focusEvt = function(e){
        var val = me.el.value;
        if(val == "0"){
             me.el.value ='';
        }
        return me.el.value;
    }

    // Add a Event listener
    me.el.addEventListener('input',me.evt, false);
    me.el.addEventListener('blur',me.blurEvt, false);
    me.el.addEventListener('focus',me.focusEvt, false);
  },

  unbind: function() {
    var me = this;
    // Remove The listener
    me.el.removeEventListener('input',me.evt, false);
    me.el.removeEventListener('blur',me.blurEvt, false);
    me.el.removeEventListener('focus',me.focusEvt, false);
  }
});
;