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

__inline('vue.addons/_vue.mixins.js');

__inline('vue.addons/_vue.filters.js');

__inline('vue.addons/_vue.components.js');