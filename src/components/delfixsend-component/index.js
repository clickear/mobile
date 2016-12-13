/* 详情 删除抄送人 */
var delFixSendVueCom = Vue.extend({
    props: ['step', 'delsendpersonarr'],
    data : function(){
        return {
            path : Global.HostUrl || ""
        }
    },
    template:   '<div v-show="step == 3" style="padding-top: 70px;">'
                +   '<div class="receipt-add">'
                +       '<div class="avatar" v-for="row in delsendpersonarr" @click="delsendpersonarr.splice($index, 1)">'
                +           '<ximg :xsrc="path+\'/officephoto/\' + row.code + \'/80\'"></ximg>'
                +           '<span class="name">{{ row.name }}</span>'
                +       '</div>'
                +   '</div>'
                +'</div>'
});
Vue.component('delfixsend-component', delFixSendVueCom);