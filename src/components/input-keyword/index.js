/* 表单快捷输入 */
var inputkeywordVueCom = Vue.extend({
    props : ['items', 'current'],
    template :  '<div class="usual-txt">'
                +    '<a :class="{\'fn-btn-gray\':true, \'active\': current == row}" v-for="row in items" href="javascript:;" @click="select(row)">{{ row }}</a>'
                +'</div>',
    methods : {
        select : function(row){
            if(this.current.length + row.length > 200){
                return;
            }
            this.current += row;
        }
    }
});
Vue.component('input-keyword', inputkeywordVueCom)