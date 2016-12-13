/* 音频播放 */
var audioPlayerVueCom = Vue.extend({
    // uploadSoundArr
    props : ['items', 'allowedit', 'status'],
    template :  '<div class="voice" v-for="row in items" @click="gotoPlay(row)" :class="status? status : \'stop\'" :status="row.status">'
                +   '<span class="v1" v-html="getTime(row.time)"></span>'
                +   '<span class="v2" v-html="getDate(row.date)"></span>'
                +   '<ins v-if="allowedit" class="icon-del" @click="del"></ins>'
                +'</div>',
    methods : {
        gotoPlay : function(row){
            var selft = this;
            sys_recordPlay(row.src,function(recordStatus){
                if(recordStatus){
                    if(recordStatus.status == 'play'){
                        selft.status = 'play'
                    }else
                    {
                        selft.status = 'stop';
                    }
                }
            });
        },
        getTime : function(t){
            var time = "";
            var minu = Math.floor(t/60) ;
            var secon = t%60;
            if(minu > 0){
                time = minu +'m'
            }
            time += (secon + 's');
            return time;
        },
        getDate : function(d){
            var date = "";
            var recordDate;
            if(d){
                recordDate = new Date(d);
            }else{
                recordDate = new Date();
            }
            date = moment(recordDate).format("MM-DD");
            return date;
        },
        del : function(i){
            if(!this.allowedit){
                return
            }
            this.items.splice(i, 1);
        }
    }
});
Vue.component('audio-player', audioPlayerVueCom)