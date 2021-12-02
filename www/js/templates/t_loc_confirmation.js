define([],function(){
    var template =  '<div class="audit_header">\
                        <div class="left_content no_border_left">\
                            <div class="center_content bold font_18 ellipsis width_80p">{{name}}</div>\
                        </div>\
                    </div>\
                    <div id="continue_audit_wrapper" class="scroll_parent audit_continue">\
                        <div class="scroll_ele" style="padding:10px">\
                            <div class="con_adt_header font_18 bold">Take Location Preview Photo :</div>\
                            <button class="btn take_store_photo">\
                                <img class="ico_16" src="images/matrix_icons/take_photo_48.png">\
                                <i class="icon_photo"></i> Take Preview Photo\
                            </button>\
                            <div class="photo_block"></div>\
                            <div class="opt_photo_block"></div>\
                            <button class="continue_audit btn btn-success" href="{{mId}}">Proceed</button>\
                        </div>\
                    </div>';
                   

    return template;
});