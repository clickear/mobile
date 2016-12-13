/* 图片上传 */
var uploadImagesVueCom = Vue.extend({
    props:['show'],
    template:  '<div class="ui-btm-modal" :class="{\'hide\':!show}">'
               +   '<div class="btm-modal-content">'
               +      '<a @click="pick(\'album\')" href="javascript:;" style="border-bottom:#e5e5e5 1px solid;">添加照片</a>'
               +      '<a @click="pick(\'camera\')" href="javascript:;">拍照</a>'
               +   '</div>'
               +   '<a href="javascript:;" class="btm-modal-btn" @click="this.show = false">返回</a>'
               +'</div>',
    methods:{
        pick : function( type){
            this.$dispatch(type);
        }
    }
})
Vue.component('upload-images', uploadImagesVueCom);