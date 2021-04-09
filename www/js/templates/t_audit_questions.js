define([],function(){
    var template =  '<div class="audit_header">\
                        <div class="back">\
                            <img src="images/matrix_icons/back_arrow_red_72.png" class="ico_36">\
                        </div>\
                        <div class="left_content">\
                            <div class="center_content bold font_18 ellipsis width_80p">{{name}}</div>\
                        </div>\
                    </div>\
                    <div class="product_header"><h2 class="font_16" id={{productId}}>{{productName}}</h2></div>\
                    <div class="scroll_parent question_list" id="wrapper_norms">\
                        <div class="norms scroll_ele" href={{priority}} rel={{takePhoto}}>\
                            <button class="btn non_execution_btn">\
                                <span>\
                                    <label class="checbox_label" for="chk1">\
                                        <input type="checkbox" name="tester" class="execution_checkbox" id="chk1" value="Test1" >\
                                        <span class="non_brand_txt"> Device Not executed </span>\
                                    </label>\
                                </span>\
                            </button>\
                            <div class="photo_block">\
                                {{#isImage}}\
                                    <div style="font-weight:bold">Longshot</div>\
                                    <img src="{{imageURI}}" width="95%" height="300px" style="margin-left:2.5%">\
                                    <a class="retake_photo retake_product_photo">Retake</a>\
                                {{/isImage}}\
                            </div>\
                            <div class="opt_photo_block">\
                                {{#isOptImage}}\
                                    <div style="font-weight:bold">Closeup</div>\
                                    <img src="{{optImageURI}}" width="95%" height="300px" style="margin-left:2.5%">\
                                    <a class="retake_photo retake_second_product_photo">Retake</a>\
                                {{/isOptImage}}\
                            </div>\
                            {{#takePhoto}}\
                                {{#isHotspot}}\
                                    <button class="btn take_product_photo">\
                                        <img class="ico_16 img_vertical_align" src="images/matrix_icons/take_photo_48.png">\
                                        <i class="icon_photo"></i> Take Hotspot(Longshot)\
                                    </button>\
                                {{/isHotspot}}\
                                {{^isHotspot}}\
                                    <button class="btn take_product_photo">\
                                        <img class="ico_16 img_vertical_align" src="images/matrix_icons/take_photo_48.png">\
                                        <i class="icon_photo"></i> Take photo\
                                    </button>\
                                {{/isHotspot}}\
                            {{/takePhoto}}\
                            {{#takeOptionalPhoto}}\
                                 <button class="btn take_second_product_photo">\
                                        <img class="ico_16 img_vertical_align" src="images/matrix_icons/take_photo_48.png">\
                                        <i class="icon_photo"></i> Take Hotspot(Closeup)\
                                    </button>\
                            {{/takeOptionalPhoto}}\
                            <div>\
                               <!--<input type="text" class="qrcode_text" value="{{qrCode}}" disabled ></input>\
                                <button class="btn btn-small scan_qr">Scan QR</button> -->\
                            </div>\
                            <button href={{mId}} class="product_done btn btn-success">Done</button>\
                        </div>\
                    </div>';

    return template;
});