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