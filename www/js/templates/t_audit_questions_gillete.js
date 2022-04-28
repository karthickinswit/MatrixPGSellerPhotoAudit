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
                            <div class="gillete_product" style="display:block">\
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
                            </div>\
                            </div>\
                            <div class="gillete_product_non" style="display:none">\
                            <div class="con_adt_header font_18 bold" style="margin: 2.5%;padding:5px">Install Device :\
                            <div class="con_adt_option font_18 bold" style="" >\
                                Yes<input type="radio" id="yes" name="confirmation" checked value=1 class="aud_confirmation">\
                                No<input type="radio" id="no" name="confirmation" value=0 class="aud_confirmation">\
                            </div>\
                            </div>\
                            <div class="reason_status" style="margin: 2.5%;padding:10px">\
                            <div class="audit_reason_block" style="display:none;">\
                                <div class="con_adt_status font_18 bold" >{{reasonTitle}} : </div>\ <select class="audit_reason font_18 text_ellipsis" style="margin-left: 10%;" type="select">\
                                {{#reasons}}<option id="{{reason_id}}" class="audit_reason{{reason_id}}" value="{{reason_id}}">{{reason_name}}</option>{{/reasons}}\
                            </select>\</div>\
                            </div>\
                            <div class="device_yes_block" style="display:block">\
                            <div class="con_adt_header font_18 bold" style="margin: 2.5%;padding:5px">Space Photo :</div>\
                            {{^isSpaceImage}}\
                            <button class="btn take_product_photo">\
                                <img class="ico_16" src="images/matrix_icons/take_photo_48.png">\
                                <i class="icon_photo"></i> Take Space Photo\
                            </button>\
                            {{/isSpaceImage}}\
                            <div class="photo_block">\
                            {{#isSpaceImage}}\
                            <img src="{{spaceImageURI}}" width="95%" height="300px" style="margin-left:2.5%">\
                            <a class="retake_photo retake_product_photo">Retake</a>\
                            {{/isSpaceImage}}\
                            </div>\
                            <div class="reason_status" style="margin: 2.5%;padding:10px">\
                            <div class="device_type_block" style="display:block">\
                            <div class="con_adt_status font_18 bold" >{{deviceTypeTitle}} :</div>\  <select class="audit_device_type font_18 text_ellipsis" style="margin-left: 10px;" type="select">\
                            {{#deviceTypes}}<option id="{{device_type_id}}" class="audit_device_type{{device_type_id}}" value="{{device_type_id}}">{{device_type}}</option>{{/deviceTypes}}\
                        </select>\</div>\
                        </div>\
                        </div>\
                        </div>\
                            <button href={{mId}} class="product_done btn btn-success">Done</button>\
                        </div>\
                    </div>';

    return template;
});