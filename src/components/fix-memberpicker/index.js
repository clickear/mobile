/* 创建表单编辑抄送人 */
var fixMemberPickerVueCom = Vue.extend({
    props : ['items', 'allowedit', 'apply'],
    template :  '<div :id="apply? \'fixMembers\' : \'\'">'
                +   '<div class="avatar" v-for="row in items" name="{{row.code}}" :class="getIgnores($index)">'
                +      '<ximg :xsrc="getSrc(row.code)"></ximg>'
                +      '<span class="name">{{ row.name }}</span>'
                +      '<ins v-if="allowedit" class="icon-del" @click="del($index)"></ins>'
                +   '</div>'
                +   '<a v-if="allowedit" class="fn-btn-add" href="javascript:;" @click="add"></a>'
                +'</div>',

    data:function(){
        return{
                defaultSortable: {}
            }
    },
    watch:{
        'allowedit':function(val,oldVal){
            this.defaultSortable && this.defaultSortable.option && this.defaultSortable.option("disabled", !val);
        }
    },
    ready:function(){
        var that = this;
        if(this.apply){
            //这里注意，只能初始化一次。如果初始化多次。会出错。
            var drags = document.getElementById('fixMembers');
            this.defaultSortable = Sortable.create(drags, {
            animation: 150,
            forceFallback: false,
            disabled:!this.allowedit,
            ghostClass : 'ghost',
            filter: ".ignore",
            draggable : '.avatar',
            onEnd : function(evt){
                var copy = cloundOfficeApp.fixNextPersonArr.concat([]);
                if(evt.newIndex != undefined) {
                        //首节点
                        if(evt.newIndex == 0){
                            if(Global.CurrentPerson.code == $("#fixMembers .avatar").eq(evt.newIndex).attr("name")){
                                cloundOfficeApp.fixNextPersonArr = [];
                                cloundOfficeApp.fixNextPersonArr = copy.concat([]);
                                return false;
                            }
                        }

                        if(evt.newIndex > 0){
                            if($("#fixMembers .avatar").eq(evt.newIndex).attr("name") == $("#fixMembers .avatar").eq(evt.newIndex - 1).attr("name")){
                                cloundOfficeApp.fixNextPersonArr = [];
                                cloundOfficeApp.fixNextPersonArr = copy.concat([]);
                                return false;
                            }
                        }
                        if(evt.newIndex < copy.length){
                            if($("#fixMembers .avatar").eq(evt.newIndex).attr("name") == $("#fixMembers .avatar").eq(evt.newIndex + 1).attr("name")){
                                cloundOfficeApp.fixNextPersonArr = [];
                                cloundOfficeApp.fixNextPersonArr = copy.concat([]);
                                return false;
                            }
                        }
                        var old = copy[evt.oldIndex];
                        copy.splice(evt.oldIndex, 1);
                        copy.splice(evt.newIndex, 0, old);
                        cloundOfficeApp.fixNextPersonArr = [];
                        cloundOfficeApp.fixNextPersonArr = copy.concat([]);     
                    }
                }
            });
        }
    },
    methods : {
        add : function(){
            this.$dispatch('add');
        },
        del : function(i){
            if(this.allowedit){
                this.items.splice(i, 1);
                this.$dispatch('del', i, 'edit');
            }
        },
        getSrc : function(code){
            return becomeAvatarSrc(code);
        },
        getIgnores : function(i){
            // console.log(i)
            if(i > 0 && i < this.items.length){
                if(this.items[i - 1].code == this.items[i + 1].code){
                    return 'ignore';
                }else{
                    return '';
                }
            }else{
                return '';
            }
        }
    }
});
Vue.component('fix-memberpicker', fixMemberPickerVueCom);