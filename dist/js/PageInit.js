/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*				                    页面初始化操作
*                                
*			     创建时间：2013.08.27 
*                作者：xjx  
*                说明：
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

if(navigator.platform.toLowerCase()=="win32")
isDebug = true;
else
isDebug = false;

/*
获取表单内容及流程信息并解析整个表单
author xjx
Modify Date 2013.09.01
*/
function SetFormAndNodeStateHtml() {
	Global.startTime7= new Date();
	if(getCurrentPageCode()!="")
	{
        document.getElementById("txtFormINSCode").value = getCurrentPkey();
        document.getElementById("txtFormCode").value = getCurrentPageCode();
        document.getElementById("txtCurrUserId").value = getCurrentUserID();
        document.getElementById('txtCurrCompanyId').value = getCurrentCompanyid();
        //NDMobile_A0_frmMobileGet.Passport=getCurrentUserID()+","+"password"+",&test=true";
		document.getElementById('txtRequireType').value = getRequireType();

        Global = Global || {};
        Global.PageCode =  getCurrentPageCode();
        Global.Pkey = getCurrentPkey();

        try{
			sys_getHostUrl(function(hostUrl){
	        	if(!hostUrl) alert('返回host地址有误，默认使用work');
				hostUrl = hostUrl || 'http://testyunoa.99.com';
	    	 	Global.HostUrl = hostUrl;
	 	        document.getElementById('HostUrl').value = Global.HostUrl;
	 	        DoSetFormAndNodeStateHtml(document.getElementById("txtFormCode").value, document.getElementById("txtFormINSCode").value,"",document.getElementById('txtRequireType').value);
       		 });
        }catch(e)
        {
            alert('返回host地址有误，默认使用work');
        	Global.HostUrl =   'http://testyunoa.99.com';
      		document.getElementById('HostUrl').value = 'http://testyunoa.99.com';
	 	    DoSetFormAndNodeStateHtml(document.getElementById("txtFormCode").value, document.getElementById("txtFormINSCode").value,"",document.getElementById('txtRequireType').value);
        }
	}
	else
	{
		alert('传入参数不合理');
		sendRequestGlobal("SOPMethod", "getInitData", "", "getInitDataCallBack");
	}

}

var initData ={};
initStep = 1;



function DoSetFormAndNodeStateHtml(pageCode, pKey,callfunction,change){	
	resetPage();
	document.getElementById("txtFormINSCode").value = pKey;
	document.getElementById("txtFormCode").value = pageCode;
	var FormObj = {};
	FormObj.PageCode = pageCode;
	FormObj.Pkey = pKey;
	FormObj.RequireType = change?change:0;
	document.getElementById('txtRequireType').value = FormObj.RequireType;

	//申请表单时
	if(FormObj.Pkey == "" || FormObj.Pkey == "0")
	{
		var test = "pageCode="+FormObj.PageCode;
		try{
			Global.startTime = new Date();

			NDMobile_Ajax.GetFormHtmlVersion(test,function(result){
				try{
					Global.startTime2 = new Date();
					if(result && result.PageCode == FormObj.PageCode && result.UseLocalStorage == "1" ){ //返回正确的值 
						Global.Version = result.Version;
						localforage.getItem("getHtml_"+result.PageCode+"_"+result.Version,function(err, value){
							Global.startTime3 = new Date();
							 	if(!err && value && value.IsSucess){
									SetFormAndNodeStateHtmlCall(value,"success","",true); 
								}else{
									NDMobile_Ajax.GetFormAndNodeStateHtml(FormObj,SetFormAndNodeStateHtmlCall);
								}
							});
					}else{
						NDMobile_Ajax.GetFormAndNodeStateHtml(FormObj,SetFormAndNodeStateHtmlCall);
					}
				}catch(e){
					NDMobile_Ajax.GetFormAndNodeStateHtml(FormObj,SetFormAndNodeStateHtmlCall);
				}
				
			});
		}catch(e){
			NDMobile_Ajax.GetFormAndNodeStateHtml(FormObj,SetFormAndNodeStateHtmlCall);
		}

	}else{
		NDMobile_Ajax.GetFormAndNodeStateHtml(FormObj,SetFormAndNodeStateHtmlCall);
	}

    function SetFormAndNodeStateHtmlCall(result,textStatus,jqXHR,initLocalHtml){
 		if(result && result.IsSucess) {
 			Global.startTime4 = new Date();
        	//是否保存在本来当中,默认是重新进行保存
            if(!initLocalHtml){
            	if(FormObj.PageCode != "" && (FormObj.Pkey=="" || FormObj.Pkey == 0)){
	            		localforage.setItem('getHtml_'+FormObj.PageCode+"_"+Global.Version, result, function(err, result1) { 
	            	//	alert('setItem:'+JSON.stringify(result1)) 
            		});	
            	}        
            }
         	

            //无权限查看
            if(result.ViewType == "4"){
            	var m_NoPermission = {};
            	m_NoPermission.formInstanceId = result.FormInstanceId;
            	m_NoPermission.LflowState = result.FlowState;
            	sys_formNoPermission(m_NoPermission);
            }

            //返回值进行设置。
            document.getElementById("txtbFlow").value = result.IsFlow?"1":"0";
            document.getElementById("txtbNode").value = result.IsNode?"1":"0";
            document.getElementById("txtsTabCode").value = result.TabCode;
            document.getElementById("txtViewType").value = result.ViewType;
            document.getElementById("txtFormDataCode").value = result.FormDataCode;
	        document.getElementById("txtFormINSCode").value = result.Pkey;
	        document.getElementById("txtFormCode").value = result.PageCode;

            jQuery.extend(Global,result);
            Global.ViewType = result.ViewType ? result.ViewType:0;

			initData = initData || {};
			
            var m_FormDataJson = result.FormDataJson;


            if(m_FormDataJson)
            {
              //JSON.parse(result.FormDataJson)[0]
                try{
                  initData = JSON.parse(result.FormDataJson)[0]
                }catch(e){
                	initData = {};
                }
            }

            if(result.ApproverState){
            	initData.ApproverState = result.ApproverState;
            }

            if(result.UploadSoundArr){
        		initData.uploadSoundArr = result.UploadSoundArr;
            }

            if(result.UploadPicArr){
            	initData.uploadPicArr = result.UploadPicArr;
            }
            if(result.ApproverList){
              initData.approvalRecord = result.ApproverList;
            }

            if(result.FixSendPersonArr){
            	initData.fixSendPersonArr = result.FixSendPersonArr;
            }

            if(result.FixNextPersonArr){
            	initData.fixNextPersonArr = result.FixNextPersonArr;
            }
            
            if(result.FormAuxiliaryStatisticalList){
            	initData.FormAuxiliaryStatisticalList = result.FormAuxiliaryStatisticalList;
            }

            if(result.ApproverState){
            	initData.ApprovalState = result.ApproverState;
            }
            initData.ViewType = result.ViewType;

            initData.IsAutoFLow = result.IsAutoFlow?1:0;
            
            initData.Enable = result.Enable?1:0;
            initData.FlowState = result.FlowState;
            try{
            	if(document.getElementById('txtRequireType')&&(document.getElementById('txtRequireType').value == "2" || document.getElementById('txtRequireType').value == "3")){
				    initData.HasData = true;
				}
            }
            catch(e){
				initData.HasData = false;
            }
			Global.startTime5 = new Date();

		    // jQuery('#loading').fadeOut();
            setInnerHTML(document.getElementById("divTaskFormHtml"), result.FormHtml); 
        }else{
            //alert(result.Msg);
        }
    }
}

/*
跨浏览器的设置 innerHTML 方法 允许插入的 HTML 代码中包含 script 和 style
author xjx
Modify Date 2013.08.27
*/
function setInnerHTML(el, htmlCode) {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
        htmlCode = '<div style="display:none">for IE</div>' + htmlCode;
        htmlCode = htmlCode.replace(/<script([^>]*)>/gi, '<script$1 defer>');
        el.innerHTML = htmlCode;
        el.removeChild(el.firstChild);
    }
    else {
        var el_next = el.nextSibling;
        var el_parent = el.parentNode;
        el_parent.removeChild(el);
        el.innerHTML = htmlCode;
        if (el_next) {
            el_parent.insertBefore(el, el_next)
        }
        else {
            el_parent.appendChild(el);
        }
        var scripts = el.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var script = document.createElement("script");
            script.innerHTML = scripts[i].innerHTML;
            el_parent.appendChild(script);
        }
    }
}


/*
执行<script></script>中的脚本块
author xjx
Modify Date 2013.08.27
*/
function runScript(str) {
    str = str.replace(/\\/g, "\\");
    var regExp = /<script.*>(.*)<\/script>/gi;
    while ((matchArray = regExp.exec(str)) != null) {
        eval(RegExp.$1);
    }
}

/*
重绘fixtable
author llz
Modify Date 2013.10.10
*/
function doResize(paret) {
    if (typeof paret == "undefined")
        paret = document;
    jQuery(".fixtable", paret).width(100);
    setTimeout(function () {
        var cTdwidth = jQuery(".fixtable", paret).parents("td:first").width();
        //var cTdwidth = Tdwidth - DocWidth + cDocWidth;
        //                alert("Tdwidth:" + Tdwidth + ",DocWidth:" + DocWidth + ",cDocWidth:" + cDocWidth + ",cTdwidth:" + cTdwidth);
        if (jQuery(".fixtable", paret).length > 0) {
            jQuery(".fixtable", paret).each(function () {
                jQuery(this).width(cTdwidth);
                var nextEle = jQuery(this).children(".fixbody").next();
                jQuery(this).children(".fixbody").width(cTdwidth - (nextEle.css("display") == "none" || nextEle.width() < 5 ? 0 : 50) - 50);
                if (jQuery(this).children(".fixbody").children("table").width() != 0 && jQuery(this).children(".fixbody").children("table").width() < jQuery(this).children(".fixbody").width())
                    jQuery(this).children(".fixbody").width(jQuery(this).children(".fixbody").children("table").width());
                noBarsOnTouchScreen(jQuery(this).children(".fixbody").get(0));
            });
        }
    }, 1);
    return true;
}


/*
初始化时间控件
author llz
Modify Date 2013.09.03
*/
function InitializeMobileControl() {

    var dateOpt = { display: 'modal', dateFormat: 'yyyy-mm-dd', setText: '确定', cancelText: '取消', dateOrder: 'yyyymmdd', endYear: 2020, lang: 'zh' };
    jQuery('.jqdatebox').mobiscroll().date(dateOpt);
    jQuery('.jqdatetimebox').mobiscroll().datetime(dateOpt);
    /*if ('ontouchend' in document.documentElement) {
        jQuery(".button[ontouchend!='']").click(function (e) { stopBubble(e) });
    }
    else {
        jQuery(".button[ontouchend!='']").each(function (i, item) {
        	//var s=eval(jQuery(item).attr("ontouchend"));
            jQuery(item).click(function (e) {
                stopBubble(e);
                eval(jQuery(item).attr("ontouchend"));
            });
        });
    }*/
    var winnav = window.navigator.userAgent.toLowerCase().indexOf("android");
    if (winnav > 0) {
        //判断如果是android 2.*就使用手动的scroll
        if (window.navigator.userAgent.toLowerCase().substr(winnav + 8, 1) == "2") {
            BindScroll("divsection", hideApprovelist);
        }
        else if (window.navigator.userAgent.toLowerCase().substr(winnav + 8, 3) == "4.0") {
            var elem;   //, tx, ty;
            elem = document.getElementById("divsection");
            elem.ontouchstart = hideApprovelist;
            /*if ('ontouchstart' in document.documentElement) {
                if (elem = document.getElementById("divsection")) {
                    //elem.ontouchmove = function () { jQuery("#focus_fix").focus(); };
                    elem.ontouchstart = hideApprovelist;
                }
            }*/
        } else {
            var elem;   //, tx, ty;
            elem = document.getElementById("divsection");
            elem.ontouchstart = hideApprovelist;
            /*if ('ontouchstart' in document.documentElement) {
                if (elem = document.getElementById("divsection")) {
                    elem.ontouchstart = hideApprovelist;
                }
            }*/
        }
    } else if (window.navigator.userAgent.indexOf("Mac OS")>0) {
        var elem, tx, ty;
        elem = document.getElementById("divsection");
        elem.ontouchstart = function (e) {
            var tch;
            if (e.touches.length == 1) {
                tch = e.touches[0];
                ty = tch.pageY;
            }
            hideApprovelist();
        };
        elem.ontouchmove = function (e) {
            var tch;
            if (e.touches.length == 1) {
                tch = e.touches[0];
                this.scrollTop += ty - tch.pageY;
                ty = tch.pageY;
            }
        };
    }
    else {
        var elem;   //, tx, ty;
        elem = document.getElementById("divsection");
        elem.ontouchstart = hideApprovelist;
        elem.onclick = hideApprovelist;
        /*if ('ontouchstart' in document.documentElement) {
        if (elem = document.getElementById("divsection")) {
        elem.ontouchstart = hideApprovelist;
        }
        }*/
    }
}

function hideApprovelist() {
    jQuery("#NdFlowNode_0 .form").addClass("hiddenfield overflowcontrol");
    jQuery("#footer-head").removeClass("down");
    jQuery("#footer-head").addClass("up");
    if (jQuery("#txtIsScoll").val() == "true") {
        jQuery("#approvelist").height(128);
    }
}

function noBarsOnTouchScreen(elem) {
    var tx, ty;
    var bodywidth = jQuery(elem).width();
    var tablewidth = jQuery(elem).children("table:first").outerWidth();
    if (Math.abs(bodywidth - tablewidth) < 5) {
        jQuery(elem).find(".fixbodyscrolldiv").remove();
        return;
    }
    if(jQuery(elem).find(".fixbodyscrolldiv").length==0)
    {
        jqMod(elem).append('<div class="fixbodyscrolldiv" style="position:relative;height: 7px; bottom: 8px;overflow: hidden;"><div class="fixbodyscroll" style="position:relative;background-color: #B9C9DE; border: 1px solid rgba(255, 255, 255, 0.901961); -webkit-background-clip: padding-box; box-sizing: border-box; height: 100%; border-top-left-radius: 3px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; pointer-events: none; -webkit-transition: -webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1); transition: -webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1); width: 168px;"></div></div>');
    }

    jQuery(elem).find(".fixbodyscrolldiv").width(tablewidth);
    var bodyscroll = jQuery(elem).find(".fixbodyscroll");
    var scrollwidth = bodywidth - (tablewidth - bodywidth);
    var maxscroll = tablewidth - bodywidth;

    var scrolldiff = 0;
    if (scrollwidth < 0) {
        scrolldiff = 1;
        scrollwidth = 28;
    }
    else if (scrollwidth < 28) {
        scrolldiff = 1;
        scrollwidth = 28;
    }
    bodyscroll.width(scrollwidth);

    var scrollSupressionThreshold = 10; //指定当水平位置大于该值时阻止默认的事件
    if ('ontouchstart' in document.documentElement) {
        elem.ontouchstart = ts;
        elem.ontouchmove = tm;
    }

    function ts(e) {
        var tch;
        if (e.touches.length == 1) {
            tch = e.touches[0];
            tx = tch.pageX;
            ty = tch.pageY;
        }
    }

    function tm(e) {
        var tch;
        if (e.touches.length == 1) {
            tch = e.touches[0];

            this.scrollLeft += tx - tch.pageX;
            ty = tch.pageY;
            tx = tch.pageX;
            if (scrolldiff == 0)
                bodyscroll.css("left", this.scrollLeft + this.scrollLeft);
            else {
                bodyscroll.css("left", this.scrollLeft + ((bodywidth - 28) * this.scrollLeft / maxscroll));
            }
        }
    }
};

/*
获取待审批用户信息
author xjx
Modify Date 2013.10.17
*/
function getUserInfo(userID,userName,userDept)
{
	var m_sPicPath="http://erpfile.91.com";
	var m_sUserInfo="";
	m_sUserInfo="<dl class=\"clearfix\"><dt>";
	m_sUserInfo+="<img onerror=\"this.src='../images/mobile/login_nophoto.jpg\'\" src=\"";
	m_sUserInfo+=m_sPicPath;
	m_sUserInfo+="/peo/" +userID+"_2.jpg\">";
	m_sUserInfo+="</dt><dd><span>"+userName+"</span> ("+userID+")</dd>";
	m_sUserInfo+="<dd>"+userDept+"</dd></dl>";
	return m_sUserInfo;
}

/*
获取当前用户ID
author xjx
Modify Date 2013.10.17
*/
function getCurrentUserID()
{
    return getQueryValue(window.location.href, "userid");
}

function getCurrentUserID_Callback(result)
{
	var results = result.split()
}

/*
获取当前单据号
author xjx
Modify Date 2013.10.17
*/
function getCurrentPageCode()
{
  return getQueryValue(window.location.href, "pagecode");
}

/*
获取当前实例号
author xjx
Modify Date 2013.10.17
*/
function getCurrentPkey()
{
    return getQueryValue(window.location.href, "pkey");
}

function getCurrentCompanyid()
{
    return getQueryValue(window.location.href, "companyid");
}

function getRequireType()
{
	return getQueryValue(window.location.href, "RequireType");
}

/*
重置页面
author xjx
Modify Date 2013.10.17
*/
function resetPage() {
    document.getElementById("TxtHide").value = "1";
    document.getElementById("txtDefaultXMCode").value = "";
    document.getElementById("txtSubTableXML").value = "";
    document.getElementById("txtUploadTableXML").value = "";
    document.getElementById("txtSendPersonXML").value = "";
    document.getElementById("txtsTabCode").value = "";
    document.getElementById("txtbFlow").value = "";
    document.getElementById("txtbNode").value = "";
    document.getElementById("txtbSendMsg").value = "";
    document.getElementById("txtsErrorMsg").value = "";
    document.getElementById("txtbFormResult").value = "";
    document.getElementById("txtbCanView").value = "";
    document.getElementById("txtCurrNodeModelCode").value = "";
    document.getElementById("txtCurrNodeCode").value = "";
    document.getElementById("txtsAppPersonCode").value = "";
    document.getElementById("txtCurrEnableNodeCode").value = "";

    document.getElementById("divTaskFormHtml").innerHTML = "";
//    document.getElementById("divTaskFormOperate").innerHTML = "";
//    document.getElementById("divTaskFormHistory").innerHTML = "";

//    document.getElementById("NdFlowNode_0").innerHTML = "";
    document.getElementById("formOperator").innerHTML = "";

    if(document.getElementById("panel_NDApprovelog"))
    {
       document.getElementById("panel_NDApprovelog").innerHTML = "";
    }
//    document.getElementById("approvelog").innerHTML = '<div class="approve-main"><h3 style="float: left;">暂无记录</h3><div class="quick-button"></div><hr /></div>';
}


