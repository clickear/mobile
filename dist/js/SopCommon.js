/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*				                    通用方法
*                                
*			     创建时间：2013.08.27 
*                作者：xjx  
*                说明：
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var jqMod ,$= jQuery.noConflict();

/*
设置对象值
author xjx
Modify Date 2013.08.27
*/
function setValueById(id, value) {
    var obj = document.getElementById(id);
    if (obj) {
        obj.value = value;
    }
}

/*
获取对象值
author xjx
Modify Date 2013.08.27
*/
function getValueById(id, defaultValue) {
    var value = "";
    if (defaultValue) {
        value = defaultValue;
    }
    var obj = document.getElementById(id);
    if (obj) {
        value = obj.value;
    }
    return value;
}



/*
是否包含字符串的值
author xjx
Modify Date 2013.08.27
*/
function isContain(pString, sString) {
    pString = "," + pString + ",";
    sString = "," + sString + ",";
    if (pString.indexOf(sString) != -1)
        return true;
    else
        return false;
};


/*
取得QueryString中的各个参数
author xjx
Modify Date 2013.08.27
*/
function getQueryValue(p_sQueryString, p_sParam) {
    p_sQueryString = p_sQueryString.toLocaleLowerCase();
    p_sParam = p_sParam.toLocaleLowerCase();
    if (p_sQueryString == "")
        return "";
    p_sQueryString = p_sQueryString.replace(/&amp;/g, "&");
    var m_sQueryString = p_sQueryString + "&";
    m_sQueryString = m_sQueryString.replace("?", "&");
    if (m_sQueryString.indexOf(p_sParam) > -1) {
        var m_lStar = m_sQueryString.indexOf("=", m_sQueryString.indexOf("&" + p_sParam)) + 1;
        var m_lEnd = m_sQueryString.indexOf("&", m_lStar);
        var m_sValue = m_sQueryString.substring(m_lStar, parseInt(m_lEnd));
        return m_sValue;
    }
    else
        return "";
}

/*
获取url参数
author lpx
Modify Date 2013.09.18
*/
function QueryString(fieldName) {
    var urlString = document.location.search;
    if (urlString != null) {
        var typeQu = fieldName + "=";
        var urlEnd = urlString.indexOf(typeQu);
        if (urlEnd != -1) {
            var paramsUrl = urlString.substring(urlEnd + typeQu.length);
            var isEnd = paramsUrl.indexOf('&');
            if (isEnd != -1) {
                return paramsUrl.substring(0, isEnd);
            }
            else {
                return paramsUrl;
            }
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

/*
获取当前表单编号
author xjx
Modify Date 2013.08.27
*/
function getCurVoucherCode() {
    var m_str = "";
    if (document.getElementById("txtFormCode")) {
        m_str = document.getElementById("txtFormCode").value;
    }
    return m_str;
}


/*
获取当前表单实例编号
author xjx
Modify Date 2013.08.27
*/
function getCurFormCode() {
    var m_str = "";
    if (document.getElementById("txtFormINSCode")) {
        m_str = document.getElementById("txtFormINSCode").value;
    }
    return m_str;
}


/*
获取当前职员编号
author xjx
Modify Date 2013.08.27
*/
function getCurPersonCode() {
    var m_str = "";
    if (document.getElementById("txtCurrUserId")) {
        m_str = document.getElementById("txtCurrUserId").value;
    }
    return m_str;
}


/*
获取当前部门编号
author xjx
Modify Date 2013.08.27
*/
function getCurDepCode() {
    var m_str = "";
    if (document.getElementById("txtCurrDeptCode")) {
        m_str = document.getElementById("txtCurrDeptCode").value;
    }
    return m_str;
}


/*
获取当前表单表格信息
author xjx
Modify Date 2013.08.27
*/
function getTabCode() {
    var m_str = "";
    if (document.getElementById("txtsTabCode")) {
        m_str = document.getElementById("txtsTabCode").value;
    }
    return m_str;
}




/*
获取当前流程模型节点编号
author xjx
Modify Date 2013.08.27
*/
function getCurNodeModelCode() {
    var m_str = "";
    if (document.getElementById("txtCurrNodeModelCode")) {
        m_str = document.getElementById("txtCurrNodeModelCode").value;
    }
    return m_str;
}



/*
获取特殊审批人工号
author xjx
Modify Date 2013.08.27
*/
function getAppPersonCode() {
    var obj = document.getElementById("txtsAppPersonCode");
    if (obj) {
        return obj.value;
    }
    else {
        return "";
    }
}


/*
设置特殊审批人工号
author xjx
Modify Date 2013.08.27
*/
function setAppPersonCode(code) {
    var obj = document.getElementById("txtsAppPersonCode");
    if (obj) {
        obj.value = code;
    }
}


/*
获取当前日期
author xjx
Modify Date 2013.08.27
*/
function getCurDate() {
    var m_str = NDMobile_A0_frmMobileGet.getNowDateTime("yyyy-MM-dd").value;
    if (m_str) {
        return m_str;
    }
    else {
        return "";
    }
}


/*
获取当前日期时间
author xjx
Modify Date 2013.08.27
*/
function getCurDateTime() {
    var m_str = NDMobile_A0_frmMobileGet.getNowDateTime("yyyy-MM-dd hh:mm:ss").value;
    if (m_str) {
        return m_str;
    }
    else {
        return "";
    }
}


/*
设置字表的XML值
author xjx
Modify Date 2013.08.27
*/
function setSubTableXml(xml) {
    var obj = document.getElementById("txtSubTableXML");
    if (obj) {
        obj.value = xml;
    }
}



/*
构造文件链接地址
author xjx
Modify Date 2013.08.27
*/
function downUploadFileSp(p_sFileNameUrl) {
    window.open(p_sFileNameUrl + "?file");
}



/*
构造文件链接地址
author xjx
Modify Date 2013.08.27
*/
function downUploadFile(p_lServerCode, p_sMenuCode, p_sFileName, p_sOldFileName) {
    var m_Value = NDMobile_A0_frmMobileGet.getDownUploadFile(p_lServerCode, p_sMenuCode, p_sFileName, p_sOldFileName).value;
    if (m_Value) {
        window.open(m_Value);
    }
    else {
        Dialog.alert('获取文件地址错误！');
    }
}


/*
获取部门审批人角色人员
author xjx
Modify Date 2013.08.27
*/
function getPersonCodeByRole(sPersonCode, sDepCode, sRoleCode) {
    var m_str = NDMobile_A0_frmMobileGet.getPersonCodeByRole(sPersonCode, sDepCode, sRoleCode).value;
    if (m_str) {
        return m_str;
    }
    else {
        return "";
    }
}


/*
复制到剪贴板
author xjx
Modify Date 2013.08.27
*/
function copyToClipBoard() {
    var clipBoardContent = window.location.href;
    window.clipboardData.setData("Text", clipBoardContent);
    alert("链接复制成功！");
}


/*
弹出页面或HTML代码的窗口
author xjx
Modify Date 2013.08.27
*/
function openPupWindowByHtml(_sHtml, _sWidth, _sHeight, _sTitle, _sScroll) {
    openPupWindow(2, _sTitle, _sHtml, _sWidth, _sHeight, null, null);
}
function openPupWindow(type, title, url, w, h, callback, parameter) {
    pop = new Popup({ contentType: type, isReloadOnClose: false, width: w, height: h, isCloseButtonView: true, scrollType: "auto" });
    pop.setContent("title", title);
    if (type == 1)
        pop.setContent("contentUrl", url);
    else if (type == 2)
        pop.setContent("contentHtml", url);
    if (callback && callback != undefined) pop.setContent("callBack", callback);
    if (parameter && parameter != undefined) pop.setContent("parameter", parameter);
    pop.build();
    pop.show();
}


/*
弹出页面模式
author xjx
Modify Date 2013.08.27
*/
function OpenSelectWin(input, url, nu_width, nu_height) {
    if (input.disabled == false) {
        var nu_left = (window.screen.width - nu_width) / 2 - 5;
        var nu_top = (window.screen.height - nu_height) / 2 - 40;
        openwin(url, "toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=yes,top=" + nu_top + ",left=" + nu_left + ",width=" + nu_width + ",height=" + nu_height);
    }
    else {
        document.body.focus();
    }
}



/*
获取url中"?"符后的字串
author xjx
Modify Date 2013.08.27
*/
function Request(sName) {
    var sURL = new String(window.location);
    var sURL = document.location.href.toLowerCase();
    var iQMark = sURL.lastIndexOf('?');
    var iLensName = sName.length;
    sName = sName.toLowerCase();

    var iStart = sURL.indexOf('?' + sName + '=')
    if (iStart == -1) {
        iStart = sURL.indexOf('&' + sName + '=')
        if (iStart == -1) {
            return null;
        }
    }
    iStart = iStart + +iLensName + 2;
    var iTemp = sURL.indexOf('&', iStart);
    if (iTemp == -1) {
        iTemp = sURL.length;
    }
    return sURL.slice(iStart, iTemp);
    sURL = null;
}

/*
导入数据 提示函数
author xjx
Modify Date 2013.08.27
*/
function parentAlert(m_error) {
    if (Dialog && Dialog.alert) {
        Dialog.alert(m_error);
    } else {
        alert(m_error);
    }
}

/*
获取某个元素的值
author xjx
Modify Date 2013.08.27
*/
function elementValue(id) {
    var obj = document.getElementById(id);
    if (obj == null || obj == "undefined") {
        return "";
    }
    return obj.value;
}

/*
页面上注册Ajax
author xjx
Modify Date 2013.09.24
*/
function RegAjaxStr() {
    var bvirtualDirectory = 1;  //1表示有虚拟目录，0表示站点
    var m_virtualDirectory = "";
    if (bvirtualDirectory == 1) {
        var m_arr = window.location.pathname.split('/');
        if (m_arr && m_arr.length > 1 && m_arr[1])
            m_virtualDirectory = "/" + m_arr[1];
    }
    document.write("<scr" + "ipt type=\"text/javascript\" src=\"" + m_virtualDirectory + "/ajaxpro/prototype.ashx\"></scr" + "ipt> \n");
    document.write("<scr" + "ipt type=\"text/javascript\" src=\"" + m_virtualDirectory + "/ajaxpro/core.ashx\"></scr" + "ipt> \n");
    document.write("<scr" + "ipt type=\"text/javascript' src=\"" + m_virtualDirectory + "/ajaxpro/converter.ashx\"></scr" + "ipt> \n");
    if (arguments.length != 0) {
        for (var i = 0; i < arguments.length; i++)
            document.write("<scr" + "ipt type=\"text/javascript\" src=\"" + m_virtualDirectory + "/ajaxpro/Nd.Hr.Webs.Ajax." + arguments[i] + ",Nd.Hr.Webs.ashx\"></scr" + "ipt> \n");
    }
    else {
        document.write("<scr" + "ipt type=\"text/javascript\" src=\"" + m_virtualDirectory + "/ajaxpro/Nd.Hr.Webs.Ajax.A0_frmAjaxGet,Nd.Hr.Webs.ashx\"></scr" + "ipt> \n");
    }
}

function GetByID(obj) {
    return document.getElementById(obj);
}

/*
HTML过滤
author xjx
Modify Date 2013.09.29
*/
function getHTMLReplace(str){
    str = str.trim();
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/\\/g, "&quot;");
    str = str.replace(/'/g, "''");
    str = str.replace(/\r\n/g, "<br>");
    str = str.replace(/<br>/g, "∮br∮");
    return str;
}

/*
显示对话框
author xjx
Modify Date 2013.10.21
*/
function showTalkDialog(userID){
    window.location="http://nderp.91.com/Report/sop.htm?action=openDialog&uid="+userID;
}

/*
获取单据的名称
author xjx
Modify Date 2013.10.22
*/
function getVoucherName(){
    return document.getElementById("hTitle").innerHTML;
}


/*
Chrome，Safri用于替代IE propertychange事件
author xjx
Modify Date 2013.09.30
*/
function BindChangeEvent(arg1, arg2, arg3) {
    var objId = arg1;
    var event, para;
    if (arg3 == undefined) {
        event = arg2;
    }
    else {
        para = arg2;
        event = arg3;
    }
    var oldValue = "";
    var intervalName; //定时器句柄
    if (jQuery("#" + objId + "").get(0)) {
        //jQuery("#" + objId + "").get(0).addEventListener("input", handle);
        jQuery("#" + objId + "").focus(function () {
            intervalName = setInterval(handle, 1000);
        });
        // 失去焦点时，清除定时器
        jQuery("#" + objId + "").blur(function () {
            clearInterval(intervalName);
        });
    }
    // input的值改变时执行的函数
    function handle() {
        if (jQuery("#"+objId+"").val() != oldValue) {
            oldValue = jQuery("#" + objId).val();
            event(para);
        }
    }
}

//---------------------------------时间调整-----------------------------------------------------------------
function formatEndDate(dateObj)
{
       	 	var length=dateObj.length;
       		var imonth=dateObj.substring((dateObj.indexOf("-"))+1,dateObj.lastIndexOf("-"));
                var day=dateObj.substring(dateObj.lastIndexOf("-")+1,length - 9);
                var hours= dateObj.substr(length-9,4);

       		//var others = $(dateId).innerText.substr($(dateId).innerText.lastIndexOf("-"),7);
        	if(parseInt(dateObj.substr(length-5,2)) < 30)
        	{
                   if(imonth.length == 2)
                   {
                       if(day.length == 2)
                       { 
                          return dateObj.substring(0,length-5) + "00";
                       }
                       else
                       {
                          return dateObj.substring(0,8) + "0" + day + hours + "00"
                       }
                   }
                   else
                   {
                       if(day.length == 2)
                       { 
                           return  dateObj.substring(0,5) + "0" + imonth + "-" + day + hours + "00"
                       }
                       else
                       {
                            return  dateObj.substring(0,5) + "0" + imonth + "-0" + day + hours + "00"

                       } 
                   }
        	}

        	else
        	{
        	    if(imonth.length == 2)
                   {
                       if(day.length == 2)
                       { 
                          return dateObj.substring(0,length-5) + "30";
                       }
                       else
                       {
                          return dateObj.substring(0,8) + "0" + day + hours + "30"
                       }
                   }
                   else
                   {
                       if(day.length == 2)
                       { 
                           return  dateObj.substring(0,5) + "0" + imonth + "-" + day + hours + "30"
                       }
                       else
                       {
                            return  dateObj.substring(0,5) + "0" + imonth + "-0" + day + hours + "30"

                       } 
                   }
        	}
}

Date.prototype.Format = function(fmt) 
{
    var o =
    { 
       "M+" : this.getMonth() + 1,  
        "d+" : this.getDate(), 
        "h+" : this.getHours(),  
        "m+" : this.getMinutes(), 
        "s+" : this.getSeconds(), 
        "q+" : Math.floor((this.getMonth() + 3) / 3),  
        "S" : this.getMilliseconds()
    }; 
    if (/(y+)/.test(fmt)) 
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
    for (var k in o) 
        if (new RegExp("(" + k + ")").test(fmt)) 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
    return fmt; 
}


Date.prototype.addDays = function(d)
{
    this.setDate(this.getDate() + d);
};


Date.prototype.addWeeks = function(w)
{
    this.addDays(w * 7);
};


Date.prototype.addMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};


Date.prototype.addYears = function(y)
{
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth()) 
    {
        this.setDate(0);
    }
};



