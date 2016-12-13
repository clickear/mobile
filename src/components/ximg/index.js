
/* 图片组件 ss*/
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

