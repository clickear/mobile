var FE_Util = {
    formatNumber : function (opts){
        var temp = opts.val.replace(/[^\d.]/g, '');
        var hasdot = new RegExp("\\.", "").test(temp);
        var strArr = temp.split('.'),
            intStr = strArr[0],
            floatStr = strArr[1]||''
            returnStr = '';
        if(strArr.length > 2){
            strArr.shift()
            floatStr = strArr.join('')
        }
        if(intStr.length > opts.intSize){
            intStr = parseInt(intStr.toString().substr(0, opts.intSize))
        }
        if(floatStr.length > opts.floatSize){
            floatStr = floatStr.toString().substr(0, opts.floatSize);
        }

        if(opts.isFormat){
            if(floatStr.length>0){
                if(floatStr == "0"){
                    floatStr = 0;
                }else{
                    floatStr = 5
                }
            }
        }
        if(floatStr === "" && hasdot){
            returnStr = intStr + '.' ;
        }else if(floatStr !== ""){
            returnStr = intStr + '.' + floatStr;;
        }else{
            returnStr = intStr;
        }

        return returnStr
    }
}
/* filter */
Vue.filter('onlyNumber', {
    // model -> view
    // 在更新 `<input>` 元素之前格式化值
    read: function(val, t) {
        var s = 1;
        if(t){
            s = parseInt(t)
        }
        return parseFloat(val.toFixed(s))
    },
    // view -> model
    // 在写回数据之前格式化值
    write: function(val, oldVal, t) {
        var number = +val.replace(/[^\d.]/g, '');
        var len = 1;
        if(t){
            len = t;
        }
        return isNaN(number) ? 0 : parseFloat(number.toFixed(len));
    }
});

Vue.filter('timeStepFilter', {
    // model -> view
    // 在更新 `<input>` 元素之前格式化值
    read: function(val) {
        var s = Math.floor(val);
        if(val*10 == s*10){
            return val
        }
        return (s*10+5)/10;
    },

    // view -> model
    // 在写回数据之前格式化值
    write: function(val, oldVal) {
        var number = +val.replace(/[^\d.]/g, '')
        return isNaN(number) ? 0 : parseFloat(number.toFixed(1))
    }
});