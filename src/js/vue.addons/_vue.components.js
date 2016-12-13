/* components */

__inline('../../components/ximg/index.js');
__inline('../../components/input-keyword/index.js');
__inline('../../components/fix-memberpicker/index.js');
__inline('../../components/audio-player/index.js');
__inline('../../components/photo-slide/index.js');
__inline('../../components/photoswipe-gallery/index.js');
__inline('../../components/receipt-status/index.js');
__inline('../../components/record-items/index.js');
__inline('../../components/detail-operation/index.js');
__inline('../../components/approval-component/index.js');
__inline('../../components/reminder-component/index.js');
__inline('../../components/upload-images/index.js');
__inline('../../components/delfixsend-component/index.js');
__inline('../../components/pop-massege/index.js');
__inline('../../components/pop-checked/index.js');
__inline('../../components/bill-link/index.js');

function initPhotoSwipe(opt) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var items = opt.items;

    var options = {
        index: opt.index,
        galleryUID: 1
    };
    gallery2 = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery2.listen('gettingData', function(index, item) {
    if(!item.w  || item.w == 0){
        item.w = 1600;
    }
    if(!item.h || item.h == 0 ){
          item.h = 1600;
    }

    });
    gallery2.init();
}

/*自定义命令*/
Vue.directive('calc-input',{
  bind: function(){
    var me = this;
    me.evt = function(e) {
      var val = me.el.value;
      var maxlengt = me.el.getAttribute('length')
      if(val.length>maxlengt){
        val = val.substr(0,maxlengt)
      }
       me.el.value = val;
      // Prevent falling in undefined value 
      return val;
    };

    // Add a Event listener
    me.el.addEventListener('input',me.evt, false);
  },

  unbind: function() {
    var me = this;
    // Remove The listener
    me.el.removeEventListener('input',me.evt, false);
  }
});


Vue.directive('input-timeformat',{
  bind: function(){
    var me = this;
    me.evt = function(e) {
        var val = me.el.value;
        var returnStr = "";
        var intSize = me.el.getAttribute('intSize')
        var floatSize = me.el.getAttribute('floatSize')
        var isFormat = me.el.getAttribute('isFormat') == "true";
        returnStr = FE_Util.formatNumber({
                        val : val,
                        intSize : intSize,
                        floatSize: floatSize,
                        isFormat:isFormat
                    });

        me.el.value = returnStr;
        // Prevent falling in undefined value
        return returnStr;
    };


    me.blurEvt = function(e){
        var val = me.el.value;
        var floatSize = me.el.getAttribute('floatSize')
        floatSize = floatSize || 1;
        me.el.value = val*Math.pow(10,floatSize)/Math.pow(10,floatSize);
        return val*1;
    };

    me.focusEvt = function(e){
        var val = me.el.value;
        if(val == "0"){
             me.el.value ='';
        }
        return me.el.value;
    }

    // Add a Event listener
    me.el.addEventListener('input',me.evt, false);
    me.el.addEventListener('blur',me.blurEvt, false);
    me.el.addEventListener('focus',me.focusEvt, false);
  },

  unbind: function() {
    var me = this;
    // Remove The listener
    me.el.removeEventListener('input',me.evt, false);
    me.el.removeEventListener('blur',me.blurEvt, false);
    me.el.removeEventListener('focus',me.focusEvt, false);
  }
});
