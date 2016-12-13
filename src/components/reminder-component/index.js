

/* 催审 */
var reminderVueCom = Vue.extend({
    props : ['step', 'personid', 'personname', 'remindertype', 'remindercontent'],
    template:   '<div class="reminder" v-if="step == 4">'
                +   '<div class="receipt-add">'
                +      '<span class="s1">接收人</span>'
                +      '<div class="avatar">'
                +          '<ximg :xsrc="getSrc(personid)"></ximg>'
                +          '<span class="name">{{personname}}</span>'
                +      '</div>'
                // +      '<a class="fn-btn-add" href="javascript:;"></a>'
                +   '</div>'
                +   '<div class="reminder-content ui-tab">'
                +      '<ul class="ui-tab-nav tab-nav-2 clx">'
                +          '<li :class="{\'active\':remindertype == 0}"><a @click="remindertype=0" href="javascript:;">短信</a></li>'
                +          '<li :class="{\'active\':remindertype == 1}"><a @click="remindertype=1" href="javascript:;">IM</a></li>'
                +      '</ul>'
                +      '<div class="ui-tab-content">'
                +          '<div class="tab-pane active">'
                +              '<div class="txt-con">'
                +                  '<textarea class="text-area" v-model="remindercontent" maxlength="100" placeholder="（点击编辑内容）"></textarea>'
                +                  '<span class="num"><i>{{remindercontent.length}}</i>/100</span>'
                +              '</div>'
                +          '</div>'
                +      '</div>'
                +   '</div>'
                +'</div>',
    methods : {
        getSrc : function(code){
            return becomeAvatarSrc(code);
        }
    }
});
Vue.component('reminder-component', reminderVueCom);