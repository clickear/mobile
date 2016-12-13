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