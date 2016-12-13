/* 图片查看2 */
var photoSlideVueCom = Vue.extend({
    props : ['items', 'allowedit', 'resize'],
    template :  '<div class="pic" :class="(items.length == 4 || items.length <= 2) && resize? \'fix\' : \'\'">'
                +   '<span v-for="row in items"><em class="img-box" v-bind:style="{ backgroundImage: getBackground(row.src)}" @click="gotoPlay($index)"  track-by="src"></em>'
                +   '<ins id="{{row.key}}" class="progress"></ins>'
                +   '<em class="progress-box"><em class="progress-txt">图片上传中</em><em class="progress-num"></em></em>'
                +   '<ins v-if="allowedit" @click="del($index)" class="icon-del"></ins></span>'
                +'</div>',
    methods : {
        gotoPlay : function(i){
            var items = this.items;
            initPhotoSwipe({
                index : i,
                items : items
            });
        },
        del:function(i){
            if(!this.allowedit){
                return
            }
            try{
                if(this.items[i] && this.items[i].key){
                    imgProgressAry[this.items[i].key] = {};
                }
            }
            catch(e){              
            }
            this.items.splice(i, 1);
            // this.$dispatch('del', i);
        },
        getBackground : function(src){
            src = src.replace('(','\\(');
            src = src.replace(')','\\)');
            return "url("+src+"&size=80)";
        }
    }
});
Vue.component('photo-slide', photoSlideVueCom);