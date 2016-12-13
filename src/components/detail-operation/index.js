/* 详情页操作 */
var detailOperateVueCom = Vue.extend({
    props: ['enable', 'viewtype', 'flowstate'],
    template:   '<div class="ly-footer" v-if="enable">'
                +   '<a class="fn-btn" href="javascript:;" @click="modify" v-if="viewtype == 1" v-text="flowstate == 1?\'撤销\':\'修改\'"></a>'
                +   '<div style="height: 40px;" class="receipt-btns clx" v-if="viewtype == 2">'
                +       '<a class="btn-reject fixed" data-view="left" href="javascript:;" @click="approval(\'reject\')">拒绝</a>'
                +       '<a class="btn-primary fixed" data-view="right" href="javascript:;" @click="approval(\'agree\')">同意</a>'
                +   '</div>'
                +'</div>',
    methods : {
        approval : function(type){
            this.$dispatch('approval', type);
        },
        modify : function(){
            this.$dispatch('modify');
        }
    }
});
Vue.component('detail-operation', detailOperateVueCom);