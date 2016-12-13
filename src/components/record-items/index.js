
/* 审批记录 */
var recordItemsVueCom = Vue.extend({
    props : ['items', 'viewtype', 'flowstate','donotremind','donotlookperson'],
    template:   '<ul class="receipt-list">'
                +   '<li v-for="item in items" :data-action="getAction(item.nodeState)">'
                +       '<h4>{{item.option}}</h4>'
                +       '<p class="t">{{getCompleTiemFormatStr(item.nodeState,item.completeTime)}}</p>'
                +       '<div class="avatar">'
                +           '<ximg @click="look(item.approverId)" :xsrc="getSrc(item.approverId)"></ximg>'
                +           '<span class="name">{{item.approverName}}</span>'
                +       '</div>'
                +       '<div class="opts" v-if="!donotremind">'
                +           '<a v-show="viewtype == 1 && item.nodeState == 1 && flowstate != 5" @click="gotoReminder(item)" href="javascript:;">催审</a>'/*+'<a href="javascript:;">沟通</a>'*/
                +       '</div>'

                +       '<div class="opinion" v-if=" item.contentStr.length">'
                +           '<p class="p1">审批意见：</p>'
                +           '<p class="p2">{{ item.contentStr }} </p>'
                // +           '<a href="javascript:;">显示更多</a>'
                +       '</div>'

                +       '<audio-player :items="item.approverUploadSound" :allowedit="false"></audio-player>'

                +       '<div class="addition" v-if="item.approverSendPerson.length">'
                +          '<p class="s1">新增抄送人：<span class="s2" v-for="index in item.approverSendPerson">{{index.name}}</span></p>'
                +       '</div>'
                +   '</li>'
                +'</ul>',
    methods : {
        getSrc : function(code){
            return becomeAvatarSrc(code);
        },
        gotoReminder : function(data){
            // return this.$dispatch('gotoreminder', data)
            sys_urge(data.approverId, data.approverName)
        },
        getAction : function(row){
            return receiptStatusCfg[row].action
        },
        look : function(code){
            if(!!!this.donotlookperson){
                lookPersonInfo(code);
            
            }
        },
        getCompleTiemFormatStr:function(nodeState,completeTime){
            if(nodeState == 1){
                var result = completeTime;
                try {
                    var dt = moment(completeTime, "HH:mm:ss YYYY-MM-DD");
                    if (moment().add(-5, "m").isBefore(dt)) {
                        result = "刚刚";
                    } else if (moment().add(-5, "m").isAfter(dt) && moment().add(-1, "h").isBefore(dt)) {
                        result = moment().diff(dt, "minutes") + "分钟前";
                    } else if (moment().add(-1, "h").isAfter(dt) && moment().add(-1, "d").isBefore(dt)) {
                        result = moment().diff(dt, "hours") + "小时前";
                    } else if (moment().add(-1, "d").isAfter(dt)) {
                        result = moment().diff(dt, "days") + "天前";
                    }
                } catch (e) { }

                return result;

            }else{
                return completeTime;
            }
        }
    }
});
Vue.component('record-items', recordItemsVueCom);