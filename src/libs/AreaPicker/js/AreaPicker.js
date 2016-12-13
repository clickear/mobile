function AreaPicker() {
    /// <summary>地址选择器</summary>
    this.config = {
        SelectCallback: null,
        DataUrl: "http://" + document.domain + "/YunBanGong/Handler/Default.ashx",
        SearchInput: "[name=BodyScroll] [name=txtSearch]",
        SearchArea: "[name=BodyScroll] [name=SearchArea]",
        OutputFramework: true
    };
    this.Data = {};
    this.Init = function (config) {
        /// <summary>初始化</summary>
        //用户选项覆盖插件默认选项   
        this.config = jQuery.extend(true, {}, this.config, config);

        if (!!this.config.OutputFramework) {
            OutputFramework();
        }

        jQuery(this.config.SearchInput).on('input', SearchEvent);
        jQuery(this.config.SearchArea).hide();

        //var data = {
        //    Action: "Init",
        //    Business: "Area",
        //    Rnd: Math.random()
        //};
        //Post(data, function (Result, Status) {
        //    if (typeof Result == "undefined") {
        //        areaPicker.Alert("请求失败。");
        //        return;
        //    }
        //    switch (Result.Code) {
        //        case 101: //成功。
        //            areaPicker.Data = Result;
        //            Bind(Result);
        //            break;
        //        default: // 失败
        //            areaPicker.Alert(Result.Message);
        //            break;
        //    }
        //}, areaPicker.config.DataUrl);

        var Result = { "CurrentArea": { "Id": 59, "Name": "福州" }, "HistoryArea": [{ "Id": 3, "Name": "阿里" }, { "Id": 4, "Name": "安康" }], "AllArea": [[{ "Id": 0, "Name": "A" }, { "Id": 1, "Name": "阿坝" }, { "Id": 2, "Name": "阿拉善" }, { "Id": 3, "Name": "阿里" }, { "Id": 4, "Name": "安康" }, { "Id": 5, "Name": "安庆" }, { "Id": 6, "Name": "鞍山" }, { "Id": 7, "Name": "安顺" }, { "Id": 8, "Name": "安阳" }, { "Id": 9, "Name": "澳门" }], [{ "Id": 0, "Name": "B" }, { "Id": 10, "Name": "北京" }, { "Id": 11, "Name": "白银" }, { "Id": 12, "Name": "保定" }, { "Id": 13, "Name": "宝鸡" }, { "Id": 14, "Name": "保山" }, { "Id": 15, "Name": "包头" }, { "Id": 16, "Name": "巴中" }, { "Id": 17, "Name": "北海" }, { "Id": 18, "Name": "蚌埠" }, { "Id": 19, "Name": "本溪" }, { "Id": 20, "Name": "毕节" }, { "Id": 21, "Name": "滨州" }, { "Id": 22, "Name": "百色" }, { "Id": 23, "Name": "亳州" }], [{ "Id": 0, "Name": "C" }, { "Id": 24, "Name": "重庆" }, { "Id": 25, "Name": "成都" }, { "Id": 26, "Name": "长沙" }, { "Id": 27, "Name": "长春" }, { "Id": 28, "Name": "沧州" }, { "Id": 29, "Name": "常德" }, { "Id": 30, "Name": "昌都" }, { "Id": 31, "Name": "长治" }, { "Id": 32, "Name": "常州" }, { "Id": 33, "Name": "巢湖" }, { "Id": 34, "Name": "潮州" }, { "Id": 35, "Name": "承德" }, { "Id": 36, "Name": "郴州" }, { "Id": 37, "Name": "赤峰" }, { "Id": 38, "Name": "池州" }, { "Id": 39, "Name": "崇左" }, { "Id": 40, "Name": "楚雄" }, { "Id": 41, "Name": "滁州" }, { "Id": 42, "Name": "朝阳" }], [{ "Id": 0, "Name": "D" }, { "Id": 43, "Name": "大连" }, { "Id": 44, "Name": "东莞" }, { "Id": 45, "Name": "大理" }, { "Id": 46, "Name": "丹东" }, { "Id": 47, "Name": "大庆" }, { "Id": 48, "Name": "大同" }, { "Id": 49, "Name": "大兴安岭" }, { "Id": 50, "Name": "德宏" }, { "Id": 51, "Name": "德阳" }, { "Id": 52, "Name": "德州" }, { "Id": 53, "Name": "定西" }, { "Id": 54, "Name": "迪庆" }, { "Id": 55, "Name": "东营" }], [{ "Id": 0, "Name": "E" }, { "Id": 56, "Name": "鄂尔多斯" }, { "Id": 57, "Name": "恩施" }, { "Id": 58, "Name": "鄂州" }], [{ "Id": 0, "Name": "F" }, { "Id": 59, "Name": "福州" }, { "Id": 60, "Name": "防城港" }, { "Id": 61, "Name": "佛山" }, { "Id": 62, "Name": "抚顺" }, { "Id": 63, "Name": "抚州" }, { "Id": 64, "Name": "阜新" }, { "Id": 65, "Name": "阜阳" }], [{ "Id": 0, "Name": "G" }, { "Id": 66, "Name": "广州" }, { "Id": 67, "Name": "桂林" }, { "Id": 68, "Name": "贵阳" }, { "Id": 69, "Name": "甘南" }, { "Id": 70, "Name": "赣州" }, { "Id": 71, "Name": "甘孜" }, { "Id": 72, "Name": "广安" }, { "Id": 73, "Name": "广元" }, { "Id": 74, "Name": "贵港" }, { "Id": 75, "Name": "果洛" }], [{ "Id": 0, "Name": "H" }, { "Id": 76, "Name": "杭州" }, { "Id": 77, "Name": "哈尔滨" }, { "Id": 78, "Name": "合肥" }, { "Id": 79, "Name": "海口" }, { "Id": 80, "Name": "呼和浩特" }, { "Id": 81, "Name": "海北" }, { "Id": 82, "Name": "海东" }, { "Id": 83, "Name": "海南" }, { "Id": 84, "Name": "海西" }, { "Id": 85, "Name": "邯郸" }, { "Id": 86, "Name": "汉中" }, { "Id": 87, "Name": "鹤壁" }, { "Id": 88, "Name": "河池" }, { "Id": 89, "Name": "鹤岗" }, { "Id": 90, "Name": "黑河" }, { "Id": 91, "Name": "衡水" }, { "Id": 92, "Name": "衡阳" }, { "Id": 93, "Name": "河源" }, { "Id": 94, "Name": "贺州" }, { "Id": 95, "Name": "红河" }, { "Id": 96, "Name": "淮安" }, { "Id": 97, "Name": "淮北" }, { "Id": 98, "Name": "怀化" }, { "Id": 99, "Name": "淮南" }, { "Id": 100, "Name": "黄冈" }, { "Id": 101, "Name": "黄南" }, { "Id": 102, "Name": "黄山" }, { "Id": 103, "Name": "黄石" }, { "Id": 104, "Name": "惠州" }, { "Id": 105, "Name": "葫芦岛" }, { "Id": 106, "Name": "呼伦贝尔" }, { "Id": 107, "Name": "湖州" }, { "Id": 108, "Name": "菏泽" }], [{ "Id": 0, "Name": "J" }, { "Id": 109, "Name": "济南" }, { "Id": 110, "Name": "佳木斯" }, { "Id": 111, "Name": "吉安" }, { "Id": 112, "Name": "江门" }, { "Id": 113, "Name": "焦作" }, { "Id": 114, "Name": "嘉兴" }, { "Id": 115, "Name": "嘉峪关" }, { "Id": 116, "Name": "揭阳" }, { "Id": 117, "Name": "吉林" }, { "Id": 118, "Name": "金昌" }, { "Id": 119, "Name": "晋城" }, { "Id": 120, "Name": "景德镇" }, { "Id": 121, "Name": "荆门" }, { "Id": 122, "Name": "荆州" }, { "Id": 123, "Name": "金华" }, { "Id": 124, "Name": "济宁" }, { "Id": 125, "Name": "晋中" }, { "Id": 126, "Name": "锦州" }, { "Id": 127, "Name": "九江" }, { "Id": 128, "Name": "酒泉" }], [{ "Id": 0, "Name": "K" }, { "Id": 129, "Name": "昆明" }, { "Id": 130, "Name": "开封" }], [{ "Id": 0, "Name": "L" }, { "Id": 131, "Name": "兰州" }, { "Id": 132, "Name": "拉萨" }, { "Id": 133, "Name": "来宾" }, { "Id": 134, "Name": "莱芜" }, { "Id": 135, "Name": "廊坊" }, { "Id": 136, "Name": "乐山" }, { "Id": 137, "Name": "凉山" }, { "Id": 138, "Name": "连云港" }, { "Id": 139, "Name": "聊城" }, { "Id": 140, "Name": "辽阳" }, { "Id": 141, "Name": "辽源" }, { "Id": 142, "Name": "丽江" }, { "Id": 143, "Name": "临沧" }, { "Id": 144, "Name": "临汾" }, { "Id": 145, "Name": "临夏" }, { "Id": 146, "Name": "临沂" }, { "Id": 147, "Name": "林芝" }, { "Id": 148, "Name": "丽水" }, { "Id": 149, "Name": "六安" }, { "Id": 150, "Name": "六盘水" }, { "Id": 151, "Name": "柳州" }, { "Id": 152, "Name": "陇南" }, { "Id": 153, "Name": "龙岩" }, { "Id": 154, "Name": "娄底" }, { "Id": 155, "Name": "漯河" }, { "Id": 156, "Name": "洛阳" }, { "Id": 157, "Name": "泸州" }, { "Id": 158, "Name": "吕梁" }], [{ "Id": 0, "Name": "M" }, { "Id": 159, "Name": "马鞍山" }, { "Id": 160, "Name": "茂名" }, { "Id": 161, "Name": "眉山" }, { "Id": 162, "Name": "梅州" }, { "Id": 163, "Name": "绵阳" }, { "Id": 164, "Name": "牡丹江" }], [{ "Id": 0, "Name": "N" }, { "Id": 165, "Name": "南京" }, { "Id": 166, "Name": "南昌" }, { "Id": 167, "Name": "南宁" }, { "Id": 168, "Name": "宁波" }, { "Id": 169, "Name": "南充" }, { "Id": 170, "Name": "南平" }, { "Id": 171, "Name": "南通" }, { "Id": 172, "Name": "南阳" }, { "Id": 173, "Name": "那曲" }, { "Id": 174, "Name": "内江" }, { "Id": 175, "Name": "宁德" }, { "Id": 176, "Name": "怒江" }], [{ "Id": 0, "Name": "P" }, { "Id": 177, "Name": "盘锦" }, { "Id": 178, "Name": "攀枝花" }, { "Id": 179, "Name": "平顶山" }, { "Id": 180, "Name": "平凉" }, { "Id": 181, "Name": "萍乡" }, { "Id": 182, "Name": "莆田" }, { "Id": 183, "Name": "濮阳" }], [{ "Id": 0, "Name": "Q" }, { "Id": 184, "Name": "青岛" }, { "Id": 185, "Name": "黔东南" }, { "Id": 186, "Name": "黔南" }, { "Id": 187, "Name": "黔西南" }, { "Id": 188, "Name": "庆阳" }, { "Id": 189, "Name": "清远" }, { "Id": 190, "Name": "秦皇岛" }, { "Id": 191, "Name": "钦州" }, { "Id": 192, "Name": "齐齐哈尔" }, { "Id": 193, "Name": "泉州" }, { "Id": 194, "Name": "曲靖" }, { "Id": 195, "Name": "衢州" }], [{ "Id": 0, "Name": "R" }, { "Id": 196, "Name": "日喀则" }, { "Id": 197, "Name": "日照" }], [{ "Id": 198, "Name": "S" }, { "Id": 199, "Name": "上海" }, { "Id": 200, "Name": "深圳" }, { "Id": 201, "Name": "苏州" }, { "Id": 202, "Name": "沈阳" }, { "Id": 203, "Name": "石家庄" }, { "Id": 204, "Name": "三门峡" }, { "Id": 205, "Name": "三明" }, { "Id": 206, "Name": "三亚" }, { "Id": 207, "Name": "商洛" }, { "Id": 208, "Name": "商丘" }, { "Id": 209, "Name": "上饶" }, { "Id": 210, "Name": "山南" }, { "Id": 211, "Name": "汕头" }, { "Id": 212, "Name": "汕尾" }, { "Id": 213, "Name": "韶关" }, { "Id": 214, "Name": "绍兴" }, { "Id": 215, "Name": "邵阳" }, { "Id": 216, "Name": "十堰" }, { "Id": 217, "Name": "朔州" }, { "Id": 218, "Name": "四平" }, { "Id": 219, "Name": "绥化" }, { "Id": 220, "Name": "遂宁" }, { "Id": 221, "Name": "随州" }, { "Id": 222, "Name": "宿迁" }, { "Id": 223, "Name": "宿州" }], [{ "Id": 0, "Name": "T" }, { "Id": 224, "Name": "天津" }, { "Id": 225, "Name": "太原" }, { "Id": 226, "Name": "泰安" }, { "Id": 227, "Name": "泰州" }, { "Id": 228, "Name": "台州" }, { "Id": 229, "Name": "唐山" }, { "Id": 230, "Name": "天水" }, { "Id": 231, "Name": "铁岭" }, { "Id": 232, "Name": "铜川" }, { "Id": 233, "Name": "通化" }, { "Id": 234, "Name": "通辽" }, { "Id": 235, "Name": "铜陵" }, { "Id": 236, "Name": "铜仁" }, { "Id": 237, "Name": "台湾" }], [{ "Id": 0, "Name": "W" }, { "Id": 238, "Name": "武汉" }, { "Id": 239, "Name": "乌鲁木齐" }, { "Id": 240, "Name": "无锡" }, { "Id": 241, "Name": "威海" }, { "Id": 242, "Name": "潍坊" }, { "Id": 243, "Name": "文山" }, { "Id": 244, "Name": "温州" }, { "Id": 245, "Name": "乌海" }, { "Id": 246, "Name": "芜湖" }, { "Id": 247, "Name": "乌兰察布" }, { "Id": 248, "Name": "武威" }, { "Id": 249, "Name": "梧州" }], [{ "Id": 0, "Name": "X" }, { "Id": 250, "Name": "厦门" }, { "Id": 251, "Name": "西安" }, { "Id": 252, "Name": "西宁" }, { "Id": 253, "Name": "襄樊" }, { "Id": 254, "Name": "湘潭" }, { "Id": 255, "Name": "湘西" }, { "Id": 256, "Name": "咸宁" }, { "Id": 257, "Name": "咸阳" }, { "Id": 258, "Name": "孝感" }, { "Id": 259, "Name": "邢台" }, { "Id": 260, "Name": "新乡" }, { "Id": 261, "Name": "信阳" }, { "Id": 262, "Name": "新余" }, { "Id": 263, "Name": "忻州" }, { "Id": 264, "Name": "西双版纳" }, { "Id": 265, "Name": "宣城" }, { "Id": 266, "Name": "许昌" }, { "Id": 267, "Name": "徐州" }, { "Id": 268, "Name": "香港" }, { "Id": 269, "Name": "锡林郭勒" }, { "Id": 270, "Name": "兴安" }], [{ "Id": 0, "Name": "Y" }, { "Id": 271, "Name": "银川" }, { "Id": 272, "Name": "雅安" }, { "Id": 273, "Name": "延安" }, { "Id": 274, "Name": "延边" }, { "Id": 275, "Name": "盐城" }, { "Id": 276, "Name": "阳江" }, { "Id": 277, "Name": "阳泉" }, { "Id": 278, "Name": "扬州" }, { "Id": 279, "Name": "烟台" }, { "Id": 280, "Name": "宜宾" }, { "Id": 281, "Name": "宜昌" }, { "Id": 282, "Name": "宜春" }, { "Id": 283, "Name": "营口" }, { "Id": 284, "Name": "益阳" }, { "Id": 285, "Name": "永州" }, { "Id": 286, "Name": "岳阳" }, { "Id": 287, "Name": "榆林" }, { "Id": 288, "Name": "运城" }, { "Id": 289, "Name": "云浮" }, { "Id": 290, "Name": "玉树" }, { "Id": 291, "Name": "玉溪" }, { "Id": 292, "Name": "玉林" }], [{ "Id": 0, "Name": "Z" }, { "Id": 293, "Name": "杂多县" }, { "Id": 294, "Name": "赞皇县" }, { "Id": 295, "Name": "枣强县" }, { "Id": 296, "Name": "枣阳市" }, { "Id": 297, "Name": "枣庄" }, { "Id": 298, "Name": "泽库县" }, { "Id": 299, "Name": "增城市" }, { "Id": 300, "Name": "曾都区" }, { "Id": 301, "Name": "泽普县" }, { "Id": 302, "Name": "泽州县" }, { "Id": 303, "Name": "札达县" }, { "Id": 304, "Name": "扎赉特旗" }, { "Id": 305, "Name": "扎兰屯市" }, { "Id": 306, "Name": "扎鲁特旗" }, { "Id": 307, "Name": "扎囊县" }, { "Id": 308, "Name": "张北县" }, { "Id": 309, "Name": "张店区" }, { "Id": 310, "Name": "章贡区" }, { "Id": 311, "Name": "张家港" }, { "Id": 312, "Name": "张家界" }, { "Id": 313, "Name": "张家口" }, { "Id": 314, "Name": "漳平市" }, { "Id": 315, "Name": "漳浦县" }, { "Id": 316, "Name": "章丘市" }, { "Id": 317, "Name": "樟树市" }, { "Id": 318, "Name": "张湾区" }, { "Id": 319, "Name": "彰武县" }, { "Id": 320, "Name": "漳县" }, { "Id": 321, "Name": "张掖" }, { "Id": 322, "Name": "漳州" }, { "Id": 323, "Name": "长子县" }, { "Id": 324, "Name": "湛河区" }, { "Id": 325, "Name": "湛江" }, { "Id": 326, "Name": "站前区" }, { "Id": 327, "Name": "沾益县" }, { "Id": 328, "Name": "诏安县" }, { "Id": 329, "Name": "召陵区" }, { "Id": 330, "Name": "昭平县" }, { "Id": 331, "Name": "肇庆" }, { "Id": 332, "Name": "昭通" }, { "Id": 333, "Name": "赵县" }, { "Id": 334, "Name": "昭阳区" }, { "Id": 335, "Name": "招远市" }, { "Id": 336, "Name": "肇源县" }, { "Id": 337, "Name": "肇州县" }, { "Id": 338, "Name": "柞水县" }, { "Id": 339, "Name": "柘城县" }, { "Id": 340, "Name": "浙江" }, { "Id": 341, "Name": "镇安县" }, { "Id": 342, "Name": "振安区" }, { "Id": 343, "Name": "镇巴县" }, { "Id": 344, "Name": "正安县" }, { "Id": 345, "Name": "正定县" }, { "Id": 346, "Name": "正定新区" }, { "Id": 347, "Name": "正蓝旗" }, { "Id": 348, "Name": "正宁县" }, { "Id": 349, "Name": "蒸湘区" }, { "Id": 350, "Name": "正镶白旗" }, { "Id": 351, "Name": "正阳县" }, { "Id": 352, "Name": "郑州" }, { "Id": 353, "Name": "镇海区" }, { "Id": 354, "Name": "镇江" }, { "Id": 355, "Name": "浈江区" }, { "Id": 356, "Name": "镇康县" }, { "Id": 357, "Name": "镇赉县" }, { "Id": 358, "Name": "镇平县" }, { "Id": 359, "Name": "振兴区" }, { "Id": 360, "Name": "镇雄县" }, { "Id": 361, "Name": "镇原县" }, { "Id": 362, "Name": "志丹县" }, { "Id": 363, "Name": "治多县" }, { "Id": 364, "Name": "芝罘区" }, { "Id": 365, "Name": "枝江市" }, { "Id": 366, "Name": "芷江侗族自治县" }, { "Id": 367, "Name": "织金县" }, { "Id": 368, "Name": "中方县" }, { "Id": 369, "Name": "中江县" }, { "Id": 370, "Name": "钟楼区" }, { "Id": 371, "Name": "中牟县" }, { "Id": 372, "Name": "中宁县" }, { "Id": 373, "Name": "中山" }, { "Id": 374, "Name": "中山区" }, { "Id": 375, "Name": "钟山区" }, { "Id": 376, "Name": "钟山县" }, { "Id": 377, "Name": "中卫" }, { "Id": 378, "Name": "钟祥市" }, { "Id": 379, "Name": "中阳县" }, { "Id": 380, "Name": "中原区" }, { "Id": 381, "Name": "周村区" }, { "Id": 382, "Name": "周口" }, { "Id": 383, "Name": "周宁县" }, { "Id": 384, "Name": "舟曲县" }, { "Id": 385, "Name": "舟山" }, { "Id": 386, "Name": "周至县" }, { "Id": 387, "Name": "庄河市" }, { "Id": 388, "Name": "诸城市" }, { "Id": 389, "Name": "珠海" }, { "Id": 390, "Name": "珠晖区" }, { "Id": 391, "Name": "诸暨市" }, { "Id": 392, "Name": "驻马店" }, { "Id": 393, "Name": "准格尔旗" }, { "Id": 394, "Name": "涿鹿县" }, { "Id": 395, "Name": "卓尼" }, { "Id": 396, "Name": "涿州市" }, { "Id": 397, "Name": "卓资县" }, { "Id": 398, "Name": "珠山区" }, { "Id": 399, "Name": "竹山县" }, { "Id": 400, "Name": "竹溪县" }, { "Id": 401, "Name": "株洲" }, { "Id": 402, "Name": "株洲县" }, { "Id": 403, "Name": "淄博" }, { "Id": 404, "Name": "子长县" }, { "Id": 405, "Name": "淄川区" }, { "Id": 406, "Name": "自贡" }, { "Id": 407, "Name": "秭归县" }, { "Id": 408, "Name": "紫金县" }, { "Id": 409, "Name": "自流井区" }, { "Id": 410, "Name": "资溪县" }, { "Id": 411, "Name": "资兴市" }, { "Id": 412, "Name": "资阳" }]], "Code": 101, "Message": "成功" };

        areaPicker.Data = Result;
        Bind(Result);
    };

    function OutputFramework() {
        var html = ''
                + '    <div class="area-select" name="BodyScroll" id="BodyScroll" >'
                + '        <div class="fn-search-tool">'
                + '            <input class="txt" placeholder="搜索" name="txtSearch">'
                + '            <a class="btn-search" href="javascript:;"></a>'
                + '        </div>'
                + '        <div class="current-city clx">'
                + '            <span class="s1">当前定位城市</span>'
                + '            <a class="area-btn" data-action="checked" name="CurrentArea" href="javascript:;"></a>'
                + '        </div>'
                + '        <div class="history-city" name="SearchArea" style="display: none;">'
                + '            <h4>搜索城市</h4>'
                + '            <div class="area-btn-box clx">'
                + '            </div>'
                + '        </div>'
                // + '        <div class="history-city">'
                // + '            <h4>历史城市</h4>'
                // + '            <div class="area-btn-box clx" name="HistoryArea">'
                // + '            </div>'
                // + '        </div>'
                + '        <!-- 列表 -->'
                + '        <div name="AllArea">'
                + '        </div>'
                + '        <div class="fn-fix-tool" name="ScrollPicker">'
                + '        </div>'
                + '    </div>';
        layer.open({
            type: 1,
            content: html,
            style: 'position:fixed; left:0; top:0; width:100%; height:100%; border:none;overflow:auto;'
        });
    }

    function SearchEvent() {
        /// <summary>搜索事件</summary>
        var value = jQuery(areaPicker.config.SearchInput).val();
        if (value == "") {
            jQuery(areaPicker.config.SearchArea).hide();
            jQuery(areaPicker.config.SearchArea).find('div').html("");
        }
        else {
            jQuery(areaPicker.config.SearchArea).show();
            var html = "";
            var Data = areaPicker.Data;
            for (var index = 0; index < Data.AllArea.length; index++) {
                for (var itemIndex = 1; itemIndex < Data.AllArea[index].length; itemIndex++) {
                    if (Data.AllArea[index][itemIndex].Name.indexOf(value) >= 0) {
                        html += '<a class="area-btn" href="javascript:areaPicker.SelectItem(\'' + Data.AllArea[index][itemIndex].Id + '\', \'' + Data.AllArea[index][itemIndex].Name + '\');">' + Data.AllArea[index][itemIndex].Name + '</a>'
                    }
                }
            }
            jQuery(areaPicker.config.SearchArea).find('div').html(html);
        }
    }


    function Bind(Data) {
        /// <summary>绑定数据</summary>
        jQuery("[name=BodyScroll] [name=CurrentArea]").html("");
        if (null != Data.CurrentArea && typeof Data.CurrentArea.Name == 'string') {
            jQuery("[name=BodyScroll] [name=CurrentArea]").html(Data.CurrentArea.Name);
            jQuery("[name=BodyScroll] [name=CurrentArea]").click(function () {
                areaPicker.SelectItem(Data.CurrentArea.Id, Data.CurrentArea.Name);
            });
        }

        var html = "";
        if (null != Data.HistoryArea && Data.HistoryArea.length > 0) {
            for (var index = 0; index < Data.HistoryArea.length; index++) {
                html += '<a class="area-btn" href="javascript:areaPicker.SelectItem(\'' + Data.HistoryArea[index].Id + '\', \'' + Data.HistoryArea[index].Name + '\');">' + Data.HistoryArea[index].Name + '</a>'
            }
            jQuery("[name=BodyScroll] [name=HistoryArea]").html(html);
        }

        html = "";
        var scrollPicker = "";
        for (var index = 0; index < Data.AllArea.length; index++) {
            var ddhtml = "";
            for (var itemIndex = 1; itemIndex < Data.AllArea[index].length; itemIndex++) {
                //if (itemIndex != 0) {
                ddhtml += '<a class="area-btn" href="javascript:areaPicker.SelectItem(\'' + Data.AllArea[index][itemIndex].Id + '\', \'' + Data.AllArea[index][itemIndex].Name + '\');">' + Data.AllArea[index][itemIndex].Name + '</a>'
                //}
            }
            if (ddhtml != "") {
                html += '<dl><dt name="Anchor' + Data.AllArea[index][0].Name + '">' + Data.AllArea[index][0].Name + '</dt><dd class="area-btn-box clx">';
                html += ddhtml;
                html += '</dd></dl>';
                scrollPicker += '<a href="javascript:areaPicker.ScrollIntoView(\'[name=BodyScroll] [name=Anchor' + Data.AllArea[index][0].Name + ']\');">' + Data.AllArea[index][0].Name + '</a>';
            }
        }
        jQuery("[name=BodyScroll] [name=AllArea]").html(html);
        jQuery("[name=BodyScroll] [name=ScrollPicker]").html(scrollPicker);
    };

    this.ScrollIntoView = function (value) {
        /// <summary>滚动到视图位置</summary>
        jQuery(value)[0].scrollIntoView();
    };

    this.SelectItem = function (key, name) {
        /// <summary>选择项目</summary>
        if (typeof areaPicker.config.SelectCallback == 'function') {
            areaPicker.config.SelectCallback({ Key: key, Name: name });
        }
        else if (typeof areaPicker.config.SelectCallback == 'string') {
            eval(areaPicker.config.SelectCallback + "({Key:" + key + ",Name:'" + name + "'})");
        }
        else {
            alert('[key]:' + key + ' [name]:' + name);
        }
        if (!!areaPicker.config.OutputFramework)
            layer.closeAll();
    };
    this.Close = function () {
        /// <summary>外部关闭</summary>
        if (!!areaPicker.config.OutputFramework)
            layer.closeAll();
    };

    //post请求
    function Post(Data, Callback, Url, DataType) {
        //if (typeof Url != 'string' || Url.length == 0)
        //    Url = common.baseurl + this.handler;

        if (typeof DataType != 'string' || DataType.length == 0)
            DataType = 'json';
        $.post(Url, Data, function (Result, textStatus) {
            if (null != Result) {
                if (typeof Callback == 'function') {
                    Callback(Result, textStatus);
                }
            } else {// 服务端响应失败
                areaPicker.Alert("返回数据异常，请系统管理员！"); //服务端响应失败，请重试
            }
        },
        'json');
    }

    //post请求，默认需要登录 同步
    function PostSync(Data, Callback, Url, IsShowError, DataType) {
        if (typeof IsShowError == 'undefined')
            IsShowError = true;
        else
            IsShowError = !!IsShowError;
        if (typeof DataType != 'string' || DataType.length == 0)
            DataType = 'json';
        jQuery.ajax({
            url: Url,
            type: 'POST',
            data: Data,
            dataType: DataType,
            async: false,
            timeout: 5000,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (IsShowError)
                    areaPicker.Alert(errorThrown.message);
            },
            success: function (Result) {
                if (typeof Callback == 'function') {
                    Callback(Result);
                }
            }
        });
    }

    this.Alert = function (message) {
        alert(message);
    };
}
var areaPicker = new AreaPicker();