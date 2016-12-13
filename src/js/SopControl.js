var sys_Control = {
  record:function(){},
  recordPlay:{},
  getSelectPerson:function(){},
  getImage:function(){},
  choosePhoto:function(){},
  takePhoto:function(){},
  selectMultiplePerson:function(){},
  urge:function(){},
  getHostUrl:function(){}
};


//upLoadStateCallback            
//进度回调函数
//返回参数：

function upLoadStateCallback(data){
  var upLoadState = JSON.parse(data);
//fileType "jpg" "mp3"
// state "uploading" "uploadSuccess" "uploadFail" "startUpload"
  if(upLoadState.state == "startUpload"){
    //判断imgProgressAry 是否有值 如果没有值，则进行填充
    if((!imgProgressAry[upLoadState.key])){
       sys_Control["choosePhoto"](upLoadState);
    }else if(imgProgressAry[upLoadState.key].status !='uploadSuccess'){

    }
  }else if(upLoadState.state == 1){
     // alert('uploading:'+JSON.stringify(imgProgressAry))
     // try{ imgProgressAry[upLoadState.key].setBar(upLoadState.process)
     // }
     // catch(e){
     //  alert('err'+e)
     // }
    
  }

}
//录音
function sys_record(funCallBack)
{
  sys_Control["record"] = funCallBack;
  sendRequestGlobal("SOPMethod", "record", "", "recordCallBack");
}

function recordCallBack(data)
{
  if(data)
  {
    var recordValue = JSON.parse(data);
    var returnValue = [];
    if(recordValue)
    {
      // recordValue.formatterStr = sys_recordFormaterStr(recordValue);
      returnValue.push(recordValue);
    }
    if(typeof sys_Control["record"] =='function')
    {
      sys_Control["record"](returnValue);
    }
  }
}
//语音长度（分秒）+上传日期（MM-DD）”，例：“2m50s 08-12”
/*function sys_recordFormaterStr(recordValue){
  if(recordValue){
    var formatterStr = '';
      if(recordValue.time)
      {
        var minu = Math.floor(recordValue.time/60) ;
        var secon = recordValue.time%60;

        if(minu>0)
        {
          formatterStr += minu +'m';
        }
        formatterStr += secon+'s ';
      }
      try{
        var recordDate = new Date(recordValue.date);
        formatterStr += moment(recordDate).format("MM-DD");
      }
      catch(e){
        var recordDate = new Date();
        formatterStr += moment(recordDate).format("MM-DD");
      }
      return formatterStr;
  }else{
    return moment(new Date()).format("MM-DD");
  }
}*/

//语音播放
function sys_recordPlay(src,funCallBack)
{
  sys_Control["recordPlay"].src = funCallBack;
  sendRequestGlobal("SOPMethod", "recordPlay", src, "recordPlayCallBack");
}

//{src:'',status:'play'}
function recordPlayCallBack(data)
{

  var recordStatus = JSON.parse(data);
  if(typeof sys_Control["recordPlay"].src =='function')
  {
    sys_Control["recordPlay"].src(recordStatus);
  }

}

//选择人员
function sys_getSelectPerson(funCallBack)
{
  sys_Control["selectPerson"] = funCallBack;
  sendRequestGlobal("SOPMethod", "selectPerson", "", "selectPersonCallBack");
}

function selectPersonCallBack(src)
{
  var personCallBack = JSON.parse(src);
  if(personCallBack)
  {
    var returnValue = [];
    for(var i =0;i<personCallBack.length;i++){
      var tempValue = {};
      tempValue.name = personCallBack[i].SPersonName;
      tempValue.code = personCallBack[i].PersonId;
      returnValue.push(tempValue);
    }
     if(typeof sys_Control["selectPerson"] =='function')
        {
          sys_Control["selectPerson"](returnValue);
        }
 /*   var firstPerson = personCallBa釦ck[0];
    if(firstPerson)
    {
        var returnValue = {};
        returnValue.code = firstPerson.PersonId;
        returnValue.name = firstPerson.SPersonName;
        if(typeof sys_Control["selectPerson"] =='function')
        {
          sys_Control["selectPerson"](returnValue);
        }
    }
    */
  }
   
}

//多选人员
//参数： exclude_org_people_id:不可选中的人员 ,include_org_people_id:已选中的人员id
function sys_getSelectMultiplePerson(include_org_people_id,exclude_org_people_id,funCallBack)
{
  var m_selectPerson = {};
  var m_temp_exclue = [];
  var m_temp_inclue = [];
  if(exclude_org_people_id){
    for(var i = 0;i<exclude_org_people_id.length;i++){
      m_temp_exclue.push(exclude_org_people_id[i].code);
    } 
  }

  if(include_org_people_id){
    for (var i = 0; i < include_org_people_id.length; i++) {
      m_temp_inclue.push(include_org_people_id[i].code);
    }
  }

  m_selectPerson.include_org_people_id = m_temp_inclue.join(',');
  m_selectPerson.exclude_org_people_id = m_temp_exclue.join(',');

  sys_Control["selectMultiplePerson"] = funCallBack;
  m_selectPerson = JSON.stringify(m_selectPerson);
  sendRequestGlobal("SOPMethod", "selectMultiplePerson", m_selectPerson, "selectMultiplePersonCallBack");
}

function selectMultiplePersonCallBack(data)
{
  var personCallBack = JSON.parse(data);
  if(personCallBack)
  {
      var returnValue = [];
      for(var i = 0;i<personCallBack.length;i++)
      {
        var tempValue = {};
        tempValue.code = personCallBack[i].PersonId;
        tempValue.name = personCallBack[i].SPersonName;
        returnValue.push(tempValue);
      }
      if(typeof sys_Control["selectMultiplePerson"] =='function')
      {
        sys_Control["selectMultiplePerson"](returnValue);
      }
  }
   
}

function sys_getImage(funCallBack)
{  
  sys_Control["getImage"] = funCallBack;
  sendRequestGlobal("SOPMethod", "getImage", "", "getImageCallBack");
}

function getImageCallBack(src)
{
    if(typeof sys_Control["getImage"] =='function')
    {
      sys_Control["getImage"](src);
    }

}

function sys_choosePhoto(funCallBack,endCallBack)
{
  sys_Control["choosePhoto"] = funCallBack;
  sys_Control["choosePhotoEndCallBack"] =endCallBack;
  sendRequestGlobal("SOPMethod", "choosePhoto", "", "choosePhotoCallBack");
}

function choosePhotoCallBack(data)
{
  var photoValue = JSON.parse(data);
  if(photoValue)
  {
    var returnValue = [];
    returnValue.push(photoValue);
    sys_Control["choosePhotoEndCallBack"](returnValue);
  }
}

function sys_takePhoto(funCallBack,endCallBack)
{
  sys_Control["takePhoto"] = funCallBack;
  sys_Control["takePhotoEndCallBack"] = endCallBack;
  sendRequestGlobal("SOPMethod", "takePhoto", "", "takePhotoCallBack");
}

function takePhotoCallBack(data)
{
    var returnValue = [];
    var photoValue = JSON.parse(data);
    if(photoValue)
    {
      returnValue.push(photoValue);
      sys_Control["takePhotoEndCallBack"](returnValue);
    }
}

function sys_closeActivity(){
  sendRequestGlobal("SOPMethod", "closeActivity", "", "");
}


function sys_urge(personId,personName,funCallBack){
  var urgePerson = {};
  var tempStr = '';
  sys_Control["urge"] = funCallBack;
  if(personId){
    urgePerson.LPerson = personId;
    urgePerson.LPersonName = personName;
    urgePerson.LFormInstanceId = Global.FormInstanceId;
    tempStr = JSON.stringify(urgePerson);
  }
  if(tempStr){
    sendRequestGlobal("SOPMethod", "urge", tempStr, "urgeCallBack");  
  }
}

function urgeCallBack(){
  if(typeof sys_Control["urge"] =='function'){
    sys_Control["urge"]();
  }
}

function sys_getHostUrl(funCallBack){
  sys_Control["getHostUrl"] = funCallBack;
  sendRequestGlobal("SOPMethod", "getHostUrl", "", "getHostUrlCallBack");
}

function getHostUrlCallBack(HostUrl){
   if(typeof sys_Control["getHostUrl"] =='function'){
      sys_Control["getHostUrl"](HostUrl);
    }
}

//·µ»Ø¼üÀ¹½Ø
function sys_backCallBack(){


}

function sys_setConfirmPop(content,callback){
  try{
    setCheckPop({
                  content: '<p class="mb10 tc">'+content+'</p>',
                  confirm: function(){
                      callback();
                  }
              });
  }catch(e){
   // alert(e)
  }
}

function returnBack(){
  try{
    setCheckPop({
                  content: '<p class="mb10 tc">已经输入数据，取消后将无法保存，确认关闭？</p>',
                  confirm: function(){
                      sys_closeActivity();
                  }
              });
  }catch(e){
    sys_closeActivity();
  }
}

//查看人员
function sys_lookPerson(personId){
  sendRequestGlobal("SOPMethod", "lookPerson", personId, "lookPersonCallBack");
}

function sys_setMsgkPop(content,type)
{
  try{
      var typeAttr = type || '';
      setMsgkPop({"content": content, "type" : typeAttr})
  }catch(e){
     alert(content);
     sys_closeActivity();
  }

}


function sys_formNoPermission(formNoPermission)
{
  var tempStr = JSON.stringify(formNoPermission);
  sendRequestGlobal("SOPMethod", "formNoPermission", tempStr, "formNoPermissionCallBack");
}

JSBridge = {};
//iOS or Android
JSBridge.platform = "Android"

var testSrc = 0;

//·¢ËÍÇëÇó
JSBridge.sendRequest = function (module, method, para, callback) {
  if (this.platform == "iOS") {
      window.location.href = "objc:" + module + ":" + method + ":" + para + ":" + callback ;
  }
  else if (this.platform == "Android") {
      window[module][method](para, callback);
  }
  else if (this.platform == "win32" || this.platform == "win64") {
      console.log("Ä£Äâ");
      if("selectPersonCallBack" == callback)
      {
        var person = '[{"DAddTime":"/Date(1451040536000+0800)/","DByDate":"/Date(959788800000+0800)/","LCharge":"0","LDepCode":0,"LFlag":1,"LState":1,"LUcPeocode":0,"LUserRight":0,"PersonId":900183,"SByDate":"2000-06-01","SFirstSpell":"w","SPersonName":"Íõ·¼","SSpell1":"wf","SSpell2":"wf","SYgMobile":"18986096035"},{"DAddTime":"/Date(1451040536000+0800)/","DByDate":"/Date(959788800000+0800)/","LCharge":"0","LDepCode":0,"LFlag":1,"LState":1,"LUcPeocode":0,"LUserRight":0,"PersonId":900240,"SByDate":"2000-06-01","SFirstSpell":"w","SPersonName":"Íõ·¼","SSpell1":"wf","SSpell2":"wf","SYgMobile":"18986096035"}]';
        selectPersonCallBack(person);
      }else if("takePhotoCallBack" == callback)
      {
        testSrc ++;
        var src = "ssssss"+testSrc;
             
          var src = "ssssss"+testSrc;

          var obj = {};
          obj.src = 'http://localhost:100/Areas/Theme/default/images/1.png';
          obj.fileName = 'ÎÄ¼þÃû'
          obj.time = '100';
          obj.date = "/Date(959788800000+0800)/";
        takePhotoCallBack(obj);
      }else if("choosePhotoCallBack" == callback)
      {
         testSrc ++;
          
          var src = "ssssss"+testSrc;

          var obj = {};
          obj.src = 'http://localhost:100/Areas/Theme/default/images/1.png';
          obj.fileName = 'ÎÄ¼þÃû'
          obj.time = '100';
          obj.date = "/Date(959788800000+0800)/";

          choosePhotoCallBack(obj);
      }else if("recordCallBack" == callback)
      {
          testSrc ++;
          var src = "ssssss"+testSrc;
           var obj = {};
          obj.src = src;
          obj.fileName = 'ÎÄ¼þÃû'
          obj.time = '100';
          obj.date = "2016/1/14 9:0";

          recordCallBack(JSON.stringify(obj));
      }else if("getHostUrlCallBack" == callback)
      {
         getHostUrlCallBack();
      }
  }
}


//·â×°QZ½Ó¿Úµ÷ÓÃ
function sendRequestGlobal(module, method, para, callback) {
  JSBridge.platform = getDevices();

  JSBridge.sendRequest(module, method, para, callback);
};

function getDevices() {
  var browser = navigator.platform.toLowerCase();
  if (browser.indexOf("mac") >= 0) {
      return "iOS";
  }
  else if (browser.indexOf("ipad") >= 0) {
      return "iOS";
  }
  else if (browser.indexOf("iphone") >= 0) {
      return "iOS";
  }
  else if (browser.indexOf("itouch") >= 0) {
      return "iOS";
  }
  else if (browser.indexOf("ipod") >= 0) {
      return "iOS";
  }
  else if (browser.indexOf("win32") >= 0) {
      return "win32";
  }
  else if (browser.indexOf("win64") >= 0) {
      return "win64";
  }
  else{
      return "Android";
  }
  return "";
};






