
function getHostUrlByDom()
{
	return document.getElementById('HostUrl').value ;
}

var NDMobile_Ajax ={
	RemoteUrl: "/api/cloudoffice/",
	GetFormAndNodeStateHtml:function(Form,callback)
	{
		this.RemoteInvoke("getFormHtml","POST",Form,"","FormCenter",callback);
	},
	DoFlowNodeSave:function(Form,callback,errorCallBack){
		this.RemoteInvoke("DoFlowNewSave","POST",Form,"","FormCenter",callback,errorCallBack);
	},
	DoFlowRemove:function(Form,callback)
	{
		this.RemoteInvoke("DoFlowRemove","POST",Form,"","FormCenter",callback);
	},
	AddSendPersons:function(Form,callback)
	{
		this.RemoteInvoke("AddSendPersons","POST",Form,"","FormCenter",callback);
	},
	DeleteSendPersons:function(Form,parmar,callback)
	{
		this.RemoteInvoke("DeleteSendPersons","POST",Form,parmar,"FormCenter",callback)
	},
	GetFormHtmlVersion:function(parmar,callback){
		this.RemoteInvoke("GetFormHtmlVersion","GET","",parmar,"FormCenter",callback);
	},
	GetFormTrips:function(Form,parmar,callback){
		this.RemoteInvoke("GetFormTrips","GET",Form,parmar,"Form",callback);
	},
	GetFormTripsByPerson:function(Form,parmar,callback){
		this.RemoteInvoke("GetFormTripsByPerson","GET",Form,parmar,"Form",callback);
	},
	GetFormAuxiliaryStatistical:function(Form,callback){
		this.RemoteInvoke("GetFormAuxiliaryStatistical","POST",Form,"","Form",callback);
	},
	MapFormTripToClaim:function(Form,callback){
		this.RemoteInvoke("MapFormTripToClaim","POST",Form,"","Form",callback);
	},
	RemoteInvoke:function(Method,type,Form,parmar,FormCenter,callBack,errorCallBack){

	var url = Global.HostUrl + this.RemoteUrl + FormCenter + '/'+Method+'.ashx?'+parmar;
//http://testyunoa.99.com/api/cloudoffice/Form/GetFormTrips.ashx?personCode=900470&claimId=1

	jQuery.ajax({
  	    type: type,
	    async: true,
	    contentType: "application/json",
	    url: url,
	    dataType: "json",   
	    timeout : 15000,
	    beforeSend: function (xhr) {
          if(false)
          {
               xhr.setRequestHeader("Nd-CompanyOrgId","481036347163");
	           xhr.setRequestHeader("Nd-UcUid","2080365102");
          }else
          {
               xhr.setRequestHeader("Nd-CompanyOrgId",document.getElementById('txtCurrCompanyId').value);
	           xhr.setRequestHeader("Nd-UcUid",document.getElementById("txtCurrUserId").value);
          }
		            

		},
	    data: JSON.stringify(Form),
	    success: callBack,
	    error:function(jqXHR,textStatus,errorThrown ){
	    	if(errorCallBack && typeof errorCallBack == "function"){
		    	errorCallBack(jqXHR,textStatus,errorThrown);
	    	}else
	    	{
	    		sys_setMsgkPop("网络异常","warn");
	    	}

	    }
	})

	}


}


var testAndroid = 1;
function getPersonFromAndroid(){
    return "900183";
}
	


    





                   
