
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