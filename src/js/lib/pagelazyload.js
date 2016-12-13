var personPicPath = "";
var s_lock = false;
var jqMod ,$= jQuery.noConflict();
function showApprovelog() {
    stopBubble(event);

    var panel = new NdMobile.Panel();
    panel.id = "NDApprovelog";
    panel.title = "审批记录";
    panel.contentWrap = '#container';
    panel.contentPanel = '#approvelog';
    panel.isButtonRow = false;
    panel.open();
    doResize(document.getElementById("panel_main_NDApprovelog"));
}
function touchEvent() {
    // var _touch = event.srcElement;

    // _touch.className = "button button-active";
    // setTimeout(function () {
    //     _touch.className = "button";
    // }, 300);
}
function showApprovelist(){
    jQuery("#NdFlowNode_0 .form").removeClass("hiddenfield overflowcontrol");
    jQuery("#footer-head").removeClass("up");
    jQuery("#footer-head").addClass("down");
    if (jQuery("#txtIsScoll").val() == "true") {
        jQuery("#approvelist").height(jQuery(window).height() * 0.4);
    }
}
function setlist() {
    jQuery('#panel_NDSelectMultPeople').css('-webkit-transform', 'translate3d(-200px,0,0)');
}
function stopBubble(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
}

