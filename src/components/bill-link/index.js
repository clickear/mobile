/*关联单据组件*/
var billLink = Vue.extend({
    props: ["edite", "show", "data"],
    template :   '<div class="account" v-show="show">'
                +    '<div class="item" v-for="row in data">'
                +           '<span class="s2">出差单</span>'
                +        '<span class="s1"><i>{{row.price}}</i>元</span> <br>'
                // +        '<div class="clx">'
                +            '<span class="s3" v-html="getTime(row.dDate)"></span>'
                // +        '</div>'
                +        '<ins v-show="edite" @click="del($index)" class="icon-del"></ins>'
                +    '</div>'
                +'</div>',
    methods : {
        del : function(i){
            this.data.splice(i, 1);
        },
        getTime : function(date){
            return moment(date).format("MM-DD HH:mm");
        }
    }
});
Vue.component('bill-link', billLink);