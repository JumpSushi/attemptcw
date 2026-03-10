
// for canvas preview uploaded images
var preview_images = [];
isProcessing = false;


if (window.FormData) {
    formdata = new FormData();
}

$(document).ready(function(){
    // anything with class .item will be treated as a link rather than toggle collapse

    $('.accordion').accordion({header:'> .acchead:not(.item)',
        active:false,
        collapsible:true,heightStyle:'content',autoHeight:false});

    alwaysnew('body');
    always();
    $('.modal').modal('hide');
    $('#appbody').removeClass('hidden');
    $('footer').removeClass('hidden');
    $('.triggerclick').each(function(){
        $(this).closest('a').trigger('click');
    });
    rotateheadings('body');
    $('#appbody').addClass('bodyready');

    temporal(0);
});   

$('body').delegate('#voiceoff', 'click', function(e) {
    e.preventDefault();
    $('#voiceon').removeClass('hidden'); 
    $('#voiceoff').addClass('hidden');  
});
$('body').delegate('#voiceon', 'click', function(e) {
    e.preventDefault();
    $('#voiceoff').removeClass('hidden'); 
    $('#voiceon').addClass('hidden');   
});

function dissolve(time){
    setTimeout(function(){ 
        $('.jxdissolve').fadeOut(); 
        }, time);      
}
function temporal(time){
    setTimeout(function(){ 
        $('#jxtmp').fadeOut(); 
        }, time);      
}
function triggerclick(){
    $('.triggerclick').each(function(){
        $(this).closest('a').trigger('click');
    });   
}
function shifty(){ // used for postcallback sorting heights of photogrid
    //alert (9999); 
    imagesLoaded( '.photogrid', function( instance ) { 
        equalizor('.photogrid');
        setTimeout(function(){ 
            equalizor('.photogrid'); 
            }, 5000);

    });
}
$('body').delegate('label.checkbox', 'click', function(e){
    var inp=$('#' + $(this).attr('for'));

    var val=inp.prop('checked');
    //console.log(val);
    if(val){
        //$(this).attr('aria-pressed', 'false'); 
        //inp.prop('checked',false);
        $(this).removeClass('checkbox-on');
        $(this).addClass('checkbox-off');
    }else{
        //$(this).attr('aria-pressed', 'true');
        //inp.prop('checked',true);
        $(this).addClass('checkbox-on');
        $(this).removeClass('checkbox-off');
    }  
    var val=inp.prop('checked');


});          

$('body').delegate('.jxauto', 'focus', function(e){initautocomplete(id(e));});

$('body').delegate('select.jxclick', 'change', function(e){
    helper($(e.currentTarget),'change');});
$('body').delegate('input.jxclick', 'click', function(e){
    helper($(e.currentTarget),'click');});
$('body').delegate('input.jxautoaction', 'blur', function(e){
    var input=$(e.currentTarget); 
    tagonly = input.data('tagonly');
    var value = input.data('pair');
    if($('#'+value).length==0){
        value=input;   
    } else{
        value = $('#'+value);
    }
    if(tagonly){ 
        //MetricSearch after selected item
        if(!value.data('tag')){
            value.val('');
            input.val('');
        }
    }else{
        value.val(input.val());
        helper($(value),'autoaction');
        value
    }

});
$('body').delegate('input.jxautoaction', 'focus', function(e){
    var input=$(e.currentTarget); 
    tagonly = input.data('tagonly');
    var value = input.data('pair');
    if($('#'+value).length==0){
        value=input;   
    } else{
        value = $('#'+value);
    }
    if(tagonly){
        value.data('tag',0);
        value.val('');
        input.val('');
    }

}); 
$('body').delegate('.allowvoice', 'click', function(e){
    e.preventDefault();
    var ed=$(this).data('editor');
    //console.log(ed); 
    var editor = CKEDITOR.instances[ed];  


    editor.fire('focus');

    // var range = editor.createRange();
    //range.moveToPosition( range.root, CKEDITOR.POSITION_BEFORE_END );


    //console.log("listening...");
    $('#voiceinterim').remove();
    $( "<div id='voiceinterim' data-linkeditor='"+ed+"' ></div>" ).insertBefore( "input[value='ok']" );
    startVoice(e);

}); 


$('body').delegate('a.jxclick', 'click', function(e){
    e.preventDefault();
    helper($(e.currentTarget),'click',null,e);});
$('body').delegate('a.jxpopwindow', 'click', function(e){
    e.preventDefault();   
    var element=$(e.currentTarget);   
    var fields=element.data('fields');
    var url=element.attr('href');
    if(fields){                              
        url+=getFields(fields,0);
    }      
    window.open(url, 'bullpreview',"menubar=no,location=no,resizable=no,scrollbars=yes,status=no");});  
$('body').delegate('.jxconfirmer', 'click', function(e){
    e.stopImmediatePropagation();           
    e.preventDefault();
    e.stopPropagation();
    confirmer($(this).attr('id'));});
$('body').delegate('.ui-accordion','accordionactivate', function (e) {
    lazyloader($(this));
    $('.tt').hide();// hide and subsequent show - hack to make it work in Chrome!! both needed
    // initialse any newly exposed masonry
    $(this).children('.ui-accordion-content').children('.initmasonry').first().each(function(d){
        $(this).masonry();   
        $(this).removeClass('initmasonry');

    }); 
    //$('body').scrollTo(this,{duration:1000});  
    setTimeout(function() {       // hack to format masonry
        $('.tt').show();}, 1);

}) ;

$('body').delegate('div.jxeditable','click', function(e){ipeditor($(e.currentTarget));});
$('body').delegate('div.jxeditable','touchend', function(e){ipeditor($(e.currentTarget));});

//$('body').delegate('.jxadved', 'click', function(e){adveditor($(this).data('editor'));});   

var loadedScripts = {
    jxeditor: false,
    jxeditorid: 0
}

$('body').delegate('div.jxeditor','click focus', function(e){  
    //edit = $('div.jxeditor');
    edit = $(this);
    if (loadedScripts.jxeditor === false) {
        //$('head').append('<link rel="stylesheet" href="/local/mis/theme/style/bootstrap-wysiwyg.css" type="text/css"/>');
        $.when($.getScript("/local/mis/theme/javascript/editor/jquery.hotkeys.js")
            ,$.getScript("/local/mis/theme/javascript/editor/bootstrap-wysiwyg.js")
            ,$.getScript("/local/mis/theme/javascript/editor/bootstrap.min.js")).done( function () {

            loadedScripts.jxeditor = true;
            loadedScripts.jxeditorid = $('div.editor-area').attr('id');
            edit.wysiwyg();            
            openbweditor(edit);
        })
    } else {
        if (loadedScripts.jxeditorid != $('div.editor-area').attr('id')) {
            loadedScripts.jxeditorid = $('div.editor-area').attr('id');
            edit.wysiwyg();
        }
        openbweditor(edit);
    }    

});

$('body').delegate('div.editor-area','mouseover', function(e){  
    //$('body').delegate('div.jxeditor','click focus', function(e){  
    //console.log(e);
    edit = $('div.jxeditor');
    if (loadedScripts.jxeditor === false) {
        //$('head').append('<link rel="stylesheet" href="/local/mis/theme/style/bootstrap-wysiwyg.css" type="text/css"/>');
        $.when($.getScript("/local/mis/theme/javascript/editor/jquery.hotkeys.js")
            ,$.getScript("/local/mis/theme/javascript/editor/bootstrap-wysiwyg.js")
            ,$.getScript("/local/mis/theme/javascript/editor/bootstrap.min.js")).done( function () {

            loadedScripts.jxeditor = true;
            edit.wysiwyg();            
            openbweditor(edit);
        })
    } else {
        if (loadedScripts.jxeditorid != $('div.editor-area').attr('id')) {
            loadedScripts.jxeditorid = $('div.editor-area').attr('id');
            edit.wysiwyg();
        }
        openbweditor(edit);
    }

});

$('body').delegate('div.jxeditor','blur', function(e){  
    $(e.currentTarget).next().val($(e.currentTarget).html());
});

/*
$('body').delegate('div.jxeditor','change', function(e){  
$(e.currentTarget).next().val($(e.currentTarget).html());
});
*/

$('body').delegate('.hovertoggler','mouseenter',function(e){
    var d=this.id;
    $('#'+d+' .tog').toggle();});
$('body').delegate('.hovertoggler','mouseleave',function(e){
    var d=this.id;
    $('#'+d+' .tog').toggle();}
);

$('body').delegate('.icontoggler', 'click', function(e) {
    var id = $(this).attr('id');
    $('#tgl_'+id).toggle();
    $('#tgl_'+id+' input[type="text"]').focus();
}); 
$('body').delegate('.tickboxtoggler', 'click', function(e) {
    var id = $(this).attr('id');
    var checked = $(this).is(":checked");
    if(checked){
        $('#tcktgl_'+id).removeClass('hidden');
        $('#tcktgl_'+id+' input[type="text"]').focus();
    }else{
        $('#tcktgl_'+id).addClass('hidden');
    }
}); 


$('body').delegate('.morebtn', 'click', function(e) {
    var morechild = $(this).prev().find('.morechild');
    var hideheight = morechild.attr('data-hideheight');
    if(morechild.css('height')<=hideheight){
        morechild.css('height','100%');
        $(this).html($(this).attr('data-less'));
    }else{
        morechild.css('height',hideheight);
        $(this).html($(this).attr('data-more'));
    }
});

$('body').delegate('.moreparent', 'click', function(e) {
    var morechild = $(this).find('.morechild');
    var morebtn = $(this).next();
    var hideheight = morechild.attr('data-hideheight');
    if(morechild.css('height')==hideheight){
        morechild.css('height','100%');
        morebtn.html(morebtn.attr('data-less'));
    }else{
        morechild.css('height',hideheight);
        morebtn.html(morebtn.attr('data-more'));
    }
});

var offset = 20;
var duration = 500;
jQuery(window).scroll(function() {
    if (jQuery(this).scrollTop() > offset) {
        jQuery('.back-to-top').fadeIn(duration);
    } else {
        jQuery('.back-to-top').fadeOut(duration);
    }
});

jQuery('.back-to-top').click(function(event) {
    event.preventDefault();
    jQuery('html, body').animate({scrollTop: 0}, duration);
    return false;
})

$('body').delegate('.closepopup','click', function(e){
    e.preventDefault();
    if($('#voiceon').length>0){
        if($('#voiceon.hidden').length==0){
            //console.log("stop listening...");
            stopVoice(e);
        }
    }
    $('#jxpopupouter').modal('hide');
    $('.jxdialog').addClass('hidden');
    $('.jxldialog').addClass('hidden');
});
$('body').delegate('.closechecker','click', function(e){
    e.preventDefault();

    $('#jxpopupouter').modal('hide');
    $('.jxdialog').addClass('hidden');
    $('.jxldialog').addClass('hidden');
    helper($(e.currentTarget),'click',null,e);
});

$('body').delegate('.genaicomm','click', function(e){
    e.preventDefault(); 
    if(e.currentTarget.defaultValue == 'Regenerate'){
        $("#my-dialog").dialog({
            modal: true,
            buttons: {
                OK: function() {
                    $(this).dialog("close");
                    // Call the function intended
                    $('#loadingIndicator').show();
                    openaiprompt($(e.currentTarget),'click',null,e);
                },
                Cancel: function() {
                    $(this).dialog("close");
                    // User clicked Cancel
                    // Prevent the function from running
                    return false;
                }
            },
            close: function() {
                // Dialog box closed
            }
        });
        /*
        if (confirm("Are you sure you want to regenerate? This will replace all existing text.")) {
        // User clicked OK
        // Call the function intended
        $('#loadingIndicator').show();
        openaiprompt($(e.currentTarget),'click',null,e);
        } else {
        // User clicked Cancel
        // Prevent the function from running
        return false;
        } */  
    }
    else{
        $('#loadingIndicator').show();
        openaiprompt($(e.currentTarget),'click',null,e);  
    }

});
$('body').delegate('.jxpoplnk','click', function(e){

    $('.jxdialog').addClass('hidden');
    $('.jxldialog').addClass('hidden');

    var popup='#dlg_'+id(e);                 
    if(popup==undefined)
        popup = '#dlg_'+$(this).attr('id');
    var style=$(popup).data('popup')||'popout';
    if(style=='fullscreen'){ 
        $(popup).removeClass('hidden');
        var h= $(window).height()-50; 

        $(popup).attr('style','height:90px').css('background','#000')
        .css('left','1%')
        .css('top','0%')
        .css('width','98%')
        .css('height', h);
        $('.modal-body').css({height:h-80});
    }else{
        // popout - height and width given fixed in data-popwidth/height
        $(popup).removeClass('hidden');

        var parentl=$(this).position(); 
        var winwidth=$(document).innerWidth(); 

        var left=$(this).css('left');                     
        var top=$(this).css('top');                                  
        var w= $(this).data('popwidth');    
        var h= $(this).data('popheight'); 

        if(parentl.left+parseInt(w, 10)+50>winwidth){
            left=winwidth-parseInt(w, 10)-50;
        }   
        $(popup).css('background','#aaa')
        .css('left',left)
        .css('top',top)
        .css('width',w)
        .css('height', h)
        .css('zindex',100);
        //console.log(h);
        //console.log($('.jxpopupinner'));
        $('.jxpopupinner').slimScroll({alwaysVisible: true,height:h});

        $(popup).find('.jxlz').each(function(d){

            var id=($(this).attr('id'));  
            var action=($(this).data('lazy'));  
            var callback=($(this).data('callback'));  
            $(popup).removeClass('jxdialog').addClass('jxldialog');

            ajaxloader(id,action,'',false,callback);
        }).removeClass('jxlz');
    }
});  
$('body').delegate('.modal','shown.bs.modal', function () {


});

/* helper functions  --------------------------------------------------------------*/

function helper(element,dataaction,callback,event){
    console.log(element); 
    var fields=element.data('fields');
    //force a read from the current DOM and not a cached value
    element.removeData(dataaction);
    var action=element.data(dataaction);
    var postdata=element.data('post'); 
    var data='';
    if(postdata){
        data+='posted='+postdata+'&';
    }
    sep='&';
    if(fields){                              
        data+=getFields(fields,element.val());
    }    
    if(element.data('postfocus')){
        if(event.shiftKey){
            postfocus=null;
        } else{
            postfocus='#'+element.data('postfocus'); 
        }
    } else{
        postfocus=null; 
    }                  
    if(event){
        if(event.shiftKey){
            data+=sep+'shift=1';
        }
        if(event.ctrlKey){

            event.stopImmediatePropagation();           
            event.preventDefault();
            event.stopPropagation();
            postfocus=null;
        }   
    }    
    //console.log(action);
    //console.log(data);
    var target=element.data('targetdiv');
    if(callback==null){
        callback=element.data('callback');
    }
    if(element.data('toggleafter')){
        toggleafter=element.data('toggleafter');
    } else{
        toggleafter=null; 
    }                  

    ajaxloader(target,action,data,target!='DOMremove',callback,postfocus,toggleafter); 
    element=null;
    fields=null;
} 

function openaiprompt(a,b,c,d){
    isProcessing = true;
    var loadingDiv = document.getElementById('loadingDiv');
    loadingDiv.style.pointerEvents = 'none';
    var xhr = new XMLHttpRequest();
    args = a.data('click');
    editor =  CKEDITOR.instances['popupeditor'];//.InsertText(txt);
    oldcomment = editor.getData();
    var promptguide = document.getElementById("promptguide");

    // Select all the text in the editor
    editor.execCommand('selectAll');
    var was =  editor.getData();
    // Clear the selected text by inserting an empty string
    editor.insertHtml('');

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 3) { // state 3 means partial data has been received
            $('#loadingIndicator').hide();                                                                        
            //  var response = xhr.responseText;
            // process the partial response here
            $('#loadingDiv').show();
            $('#loadingDiv').text(xhr.responseText);
            // editor = CKEDITOR.instances['popupeditor'];
            //  editor.setData(response);
        } else if (xhr.readyState == 4) { // state 4 means the entire response has been received
            $('#loadingDiv').hide();
            editor =  CKEDITOR.instances['popupeditor'];//.InsertText(txt);
            var promptguide = document.getElementById("promptguide");
            debugger;
            var value = document.querySelector('#jxpopup input[type="hidden"][name="replacename"]').value;
            var response = xhr.responseText;
            if(response.startsWith('OpenAI is tired')){
                editor.setData(was);
                alert(response);
            }
            else if(response.startsWith('No response')){
                editor.setData(was);
                alert(response);
            }
            else{
                response = response.replace(/\[Firstname\]/g, value);
                // Insert the modified text into the editor

                var generateBtn = document.querySelector('.genaicomm');
                generateBtn.value = "Regenerate";
                response = $('<div>').html(response).text();
                editor.setData(response);

                args = args.replace(/_promptguide.*/, "").trim();
                var check = args.endsWith("_regenerate");
                if(check){
                    var subval = -18;
                }
                else{
                    var subval = -16;
                }
                var id = '#'+args.slice(0, subval);
                id  = id.replace("genAIComm", "updatetext");
                var clickeddiv = document.querySelector(id);
                clickeddiv.setAttribute('data-butttype', 'regen');
                isProcessing = false;

                if(promptguide){
                    promptguide.value = "";
                }
                else{
                    var promptguide = '<textarea id="promptguide" placeholder="If you would like to direct the AI on how to adjust the comment, add an instruction here. If not, leave this section blank"></textarea>';

                    var textarea = document.createElement('textarea');
                    textarea.id = 'promptguide';
                    textarea.placeholder = "If you would like to direct the AI on how to adjust the comment, add an instruction here. If not, leave this section blank";
                    var parentElement = generateBtn.parentNode;
                    parentElement.appendChild(textarea);
                }

            }
        }
    };
    xhr.onerror = function() {
        console.error("AJAX request failed");
    };
    // Check if there is text in the promptguide field
    if (promptguide && promptguide.value.trim() !== '') {
        // Append the promptguide text to the args array
        args += '_promptguide_'+promptguide.value;
        args += '_oldcomment_'+oldcomment;
    }
    xhr.open("POST", "openai.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({args: args}));
}

function getFields(fields,self){
    if(fields != undefined){

        fields=fields.split(',');
        sep='&';
        var data='';

        for(i=0;i<fields.length;i++){
            value=false;
            if(fields[i]=='self'){
                value=self;
            }else{ 
                /*try{
                var ed = tinyMCE.get(fields[i]); 
                if(ed){
                value=encodeURIComponent(ed.getContent());                                         
                ed.setContent('');
                delete ed;
                }
                }
                catch (err) {
                } */
                if(value==''){
                    if($('#'+fields[i]).attr('type')=='checkbox'){
                        //console.log($('#'+fields[i]));
                        //console.log($('#'+fields[i]).prop('checked'));
                        var value = $('#'+fields[i]).prop('checked')?1:0; 
                    }else{           
                        /*try{
                        var ed = tinyMCE.get(fields[i]); 
                        if(ed){
                        value=encodeURIComponent(ed.getContent());                                         
                        ed.setContent('');
                        delete ed;
                        }
                        }
                        catch (err) {
                        } */

                        if(typeof(ed)=='object'){
                            var value=encodeURIComponent(ed.getContent());
                        }else{
                            var value=$('#'+fields[i]).val();  
                            if(value!=undefined){
                                value = removeEmojis(value);
                            }
                            value=encodeURIComponent(value);
                        }

                    }
                }
            }

            if(value===false){

            }else{
                data+=sep+fields[i]+'='+value;
            }
        }
    }
    return data;
}

function removeEmojis(str) {
    var ranges = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
    ];
    try{
        return str.replace(new RegExp(ranges.join('|'), 'g'), '');
        //return str.replace(/([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g, '');
    }  catch (err) {
        return str;               
    }
}

function ajaxloader(div,params,data,ajax,callbackafter,focusafter,toggleafter){   
    $('.jxpopup').modal('hide');
    $('.jxdialog').addClass('hidden'); 
    $('.tooltip').remove();   

    if(ajax){
        if(div=='form'){
            saveform(div);
        }  
        if (div) {
            $('#'+div).html('');
            $('#'+div).html(spinner('fa-2x'));
        }
        //$('#'+div).html('<div style="z-index:1000;position:fixed;margin:15% 45%;text-align:center">'+spinner('fa-5x')+'</div>');
        if(div=='jxpopup'||div=='jxpopupfull'){  
            $('#jxpopup').html(spinner('fa-2x'));
            if(div=='jxpopup'){
                $('#jxpopupouter').css({width:'auto',
                    height:'auto', 
                    'max-height':'100%'});
                var w= $('#jxpopupouter').width()/-2;
                $('#jxpopupouter').css({'margin-left': w});         
            }else{
                var h= $(window).height()-50; 

                $('#jxpopupouter').css({'z-index':'5000',width:'99%',
                    height:h,'margin-left': '-49.8%','top': '40px'}); 
                $('.modal-body').css({height:h-80});

            }
            $('#jxpopupouter').modal();

        }

    }
    if($('.jxloaderold').length==0){
        //$('.jxloader').before('<div class="jxloaderold" style="text-align:center"><div style="text-align:center">'+spinner('fa-2x')+'</div></div>');
        $('.jxloader').after(spinner('fa-2x jxloaderold'));
        $('.jxloader').hide();
    }
    $('.jxloader').addClass('hidden'); 

    $.ajax({ dataType: "json", type: "POST",data: data, 
        url: getAjaxURL()+'?lct='+div+'&act='+params, cache:false
    }).done(function( json ) {

        var phonics = false;
        Object.keys(json).forEach((key) => {
            if (key.startsWith('^') && json[key].includes('phonics')) {
                phonics = true;
            }
        });
        if (phonics) {
            Object.keys(json).forEach((key) => {
                if (key.startsWith('|')) {
                    json[key] = '';
                }
            });
        }

        domupdater(json);

    })
    .always(function(){ 
        always();            
        if(callbackafter!=null){  
            var callback = window[callbackafter];
            if(typeof callback === 'function') {
                callback();
            }else{
                if(typeof(callbackafter)==='function'){
                    callbackafter();
                }     
            }
        }   
        if(focusafter!=null){
            //console.log(focusafter);
            if(!$(focusafter).isUpperScreen()) {    
                $('body').scrollTo($(focusafter),{duration:1000,offset:-200});
            }
        }
        if(toggleafter!=null){
            if($(toggleafter).hasClass('hidden')){
                $(toggleafter).removeClass('hidden');
            }else{
                $(toggleafter).addClass('hidden');
            }
        }
    });
}

function domupdater(json){
    $.each(json, function (index, value) {
        if(index=='DOMremove'){
            $('#'+value).remove('');   
        }else{      
            var replace=false;
            var newclass=false;
            var newclassandupdate=false;
            if(index[0]=='^'){
                var index=index.substring(1);
                newclass=true;
            } 
            if(index[0]=='!'){
                var index=index.substring(1);
                replace=true;
            } 
            if(index[0]=='@'){
                var selector='[id='+index.substring(1)+']';
                var selector='[id='+index.substring(1)+']';
                newclassandupdate=true;
            } else if(index[0]=='.'){
                var selector=index;
            } else if(index[0]=='#'){
                var selector=index;
            } else if(index[0]=='|'){
                var selector=index.substring(1)+' .dvcell';
                postcelledit(index.substring(1));
                postcellchecker(json);
            } 
            /* else if (index[0] == '*'){
            var txt=value;
            $('#loadingIndicator').hide();
            editor =  CKEDITOR.instances['popupeditor'];//.InsertText(txt);
            // Select all the text in the editor
            editor.execCommand('selectAll');

            // Clear the selected text by inserting an empty string
            editor.insertHtml('');
            editor.insertHtml(txt);
            }*/else if(index[0]=='~'){
                var selector='div#' + index.substring(1)+' div.innerdlgeditor';  
                if($(selector).length>0){   
                    $(selector).html(value);   
                }else{
                    var selector='textarea#' + index.substring(6);  
                    if($(selector).length>0){   
                        $(selector).text(value);   
                        $(selector).next('.cke_editable').html(value); 
                    }else{
                        var selector= index.substring(1); 
                        if($('div#'+selector+' div.innerdlgeditor').length){   

                            var hastip = $('#popupeditor').data('hastip'); 
                            var proxytext = $('#'+selector).data('proxytext');
                            tip=value;
                            if(proxytext){ 
                                var proxynotext = $('#'+selector).data('proxynotext');
                                if(tip){
                                    data=proxytext; 
                                }else{
                                    data=proxynotext;
                                }     
                                $('#'+selector).data('value',tip);
                                $('#'+selector).html('<div style="display:inline-block;" data-html="1" data-toggle="tooltip" title="" class=" innerdlgeditor" data-original-title="<div class=&quot; titletip&quot;>'+tip+'</div>">'+value+'</div>');
                            }else{
                                if(hastip){
                                    $('#'+selector).html('<div style="display:inline-block;" data-html="1" data-toggle="tooltip" title="" class=" innerdlgeditor" data-original-title="<div class=&quot; titletip&quot;>'+tip+'</div>">'+value+'</div>');
                                }else{
                                    $('#'+selector).html('<div class="innerdlgeditor">'+value+'</div>');

                                }
                            }
                        }else{
                            if($('div.editable#'+selector).length){ 
                                $('div.editable#'+selector).html(value);
                            }
                        }
                    }
                }
            } else{
                var selector='#'+index;
            }            
            if(index=='jxtmp'){
                $('#jxtmp').fadeIn();
                temporal(4000);
            }  
            if(index=='form'){
                saveform(index);
            } 
            if(index=='jxalert'){
                alert(value);
            }
            if(index=='jxpopupfull'){
                $('#jxpopup').html('');
                var w= '99%';    
                var h= $(window).height()-50; 

                $('#jxpopupouter').css({'margin-left': '-49.8%','width': w,'height':h});
                $('.modal-body').css({height:h-80});
                $('#jxpopup').html(value);
                $('.accordion','#jxpopup').accordion({header:'> .acchead:not(.item)',
                    active:false,
                    collapsible:true,
                    heightStyle:'content',
                    autoHeight:false});
                $('.accordionstartopen > div.acchead','#jxpopup').trigger('click');

                $('.triggermagicclick').each(function(){
                    $(this).closest('a').trigger('click');
                });
                alwaysnew("#jxpopup");
            }else{ // normall
                if (index.substring(0,4) == 'jxed') {
                    var txta='textarea#' + index.substring(5);  
                    $(txta).text(value);   
                    $(txta).next('.cke_editable').html(value);                     
                    value = nl2br(value);
                }
                if(index=='jxpopup'){
                    $(selector).html('');
                    $('#jxpopupouter').css({opacity:0}); 
                    $(selector).html(value); 
                    $('.accordion',selector).accordion({header:'> .acchead:not(.item)',
                        active:false,
                        collapsible:true,
                        heightStyle:'content',
                        autoHeight:false}); 
                    $('.accordionstartopen > div.acchead',selector).trigger('click');

                    $('#jxpopupouter').css({width:'auto',
                        height:'auto', 
                        'max-height':'100%'}); 
                    var w= $('#jxpopupouter').width();    
                    var h= $('#jxpopupouter').height();    
                    $(selector).html('');  
                    $('#jxpopupouter').css({zIndex:9999,opacity:0,height:'5px',width:'5px'}); 

                    $('#jxpopupouter').animate({'margin-left': w/-2,'width': w,'height':h},500);
                    $('#jxpopupouter').css({opacity:1});  


                    $(selector).html(value);  
                }
                if (index.substring(0,7) == 'aibutt!') {
                    var res = index.split("!");
                    selector = res[1];
                    if(value == 'gen' || value=='regen'){
                        $('#'+selector).parent('td').removeClass('notready ready');
                        $('#'+selector).parent('td').addClass('ready');
                        $('#'+selector).attr('data-butttype', value);
                        // $('#'+selector).data('butttype',value);
                    }
                    else{
                        $('#'+selector).parent('td').removeClass('notready ready');
                        $('#'+selector).parent('td').addClass('notready'); 
                        $('#'+selector).data('butttype','none'); 
                    }
                }
                else if(index.substring(0,9) == 'prepbadge'){
                    var res = value.split("_");  
                    for (var i = 0; i < res.length; i++) {
                        var attr = res[i].split('#');
                        if(attr[0] == 'sid'){
                            var sid = attr[1]; 
                        }
                        if(attr[0] == 'col'){
                            var col = attr[1]; 
                        }
                        if(attr[0] == 'count'){
                            var count = attr[1]; 
                        }
                    }
                    // Get the element containing the badge
                    var badgeElement = $("#prepto_"+sid+" .badge");
                    // Update the badge text to '1'
                    badgeElement.text(count);
                    var thumbsUpIcon = $("#prepto_"+sid+" .fa-thumbs-up");
                    // Update the color of the thumbs-up icon to red
                    thumbsUpIcon.css('color', col);
                }
                else{
                    if($(selector).is("input")){
                        if($(selector).is(':radio'))
                            $(selector).attr('checked', 'checked');
                        else
                            $(selector).val(value);
                    }else if($(selector).is("select")){
                        $(selector).val(value);
                    }else if($(selector).is("textarea")){
                        $(selector).val(value);
                    }else{ // normall     
                        if(newclass){                    
                            var swap=value.split(',');
                            $(selector).removeClass(swap[0]);
                            $(selector).addClass(swap[1]);
                        }else if(newclassandupdate){
                            var newvalue=value.split(';');
                            $(selector).html('');
                            $(selector).html(newvalue[0]);
                            var swap=newvalue[1].split(',');
                            $(selector).removeClass(swap[0]);
                            $(selector).addClass(swap[1]);
                        }else{ 
                            $(selector).html('');
                            if(replace){
                                $(selector).replaceWith(value);
                            }else{
                                $(selector).html(value);
                            }


                            $(selector).removeClass('lazy'); 
                            $(selector).removeClass('eager'); 
                        }
                    }
                }
            }
            alwaysnew(selector);
            if(index=='form'){
                formfocus();  
            }
            if(index=='jxpopup'){
                $('#jxpopupouter').css({width:'auto',
                    height:'auto', 
                    'max-height':'100%'});   
                var w= $('#jxpopupouter').width()/-2;
                //$('#jxpopupouter').css({'margin-left': w});
                $('#jxpopupouter').animate({'margin-left': w},1000);
            }
        }

    });
    dissolve(10000);
}

function postcellchecker(json){
    $.each(json, function (index, value) {
        var istype = index.substring(0,4);
        if(istype == 'chek'){
            var xy=index.substring(4);
            vals = value.split('_');
            var chktype = vals[0];
            var chkdata = vals[1];
            var remove = json['curr'];
            var newid;

            if(chktype == 'suggest'){
                var el = document.querySelector(xy);
                el.setAttribute('data-order',chkdata);
                var cell=$(xy);
                cell.removeClass(remove).addClass('suggested');  
                var innercell = $(xy+' .dve');
                var id = innercell.attr('id');
                var suggdiv = $('#'+id+'_suggest');
                suggdiv.html(chkdata);//setAttribute('data-suggest',chkdata);
                var mydiv = document.querySelector('#'+id);
                newid = id.replace('status_0','status_2');
                newid = newid.replace('current_'+remove,'current_suggested');
                mydiv.setAttribute('id',newid); 
                suggdiv = document.querySelector('#'+id+'_suggest');
                suggdiv.setAttribute('id',newid+'_suggest');        
            }
            else if(chktype == 'reject'){
                var el = document.querySelector(xy);
                el.setAttribute('data-order',chkdata);
                var cell=$(xy); 
                cell.removeClass(remove).addClass('rejected'); 
                var innercell = $(xy+' .dve');
                var id = innercell.attr('id');
                var mydiv = document.querySelector('#'+id);
                newid = id.replace('status_0','status_99');
                newid = newid.replace('current_'+remove,'current_rejected');
                mydiv.setAttribute('id',newid);          
            }
            else if(chktype == 'approve'){
                var el = document.querySelector(xy);
                el.setAttribute('data-order',chkdata);
                var cell=$(xy); 
                cell.removeClass(remove).addClass('approved'); 
                var innercell = $(xy+' .dve');
                var id = innercell.attr('id');
                var mydiv = document.querySelector('#'+id);
                newid = id.replace('status_0','status_1');
                newid = newid.replace('current_'+remove,'current_approved');
                mydiv.setAttribute('id',newid); 
            }
            else if(chktype == 'appsugg'){
                var el = document.querySelector(xy);
                el.setAttribute('data-order',chkdata);
                var cell=$(xy); 
                var t = cell.html();
                cell.removeClass(remove).addClass('approved'); 
                var innercell = $(xy+' .dve');
                var id = innercell.attr('id');
                var mydiv = document.querySelector('#'+id);
                newid = id.replace('status_0','status_1');
                newid = newid.replace('current_'+remove,'current_approved');
                mydiv.setAttribute('id',newid); 
                var innerdiv = $(xy).find('.innerdlgtextchecker');
                innerdiv.html(chkdata); 
            }
            else if(chktype == 'undo'){
                var el = document.querySelector(xy);
                var stat;
                el.setAttribute('data-order',chkdata);
                var cell=$(xy); 
                cell.removeClass(remove).addClass('none'); 
                var innercell = $(xy+' .dve');
                var id = innercell.attr('id');
                var mydiv = document.querySelector('#'+id);
                if(remove == 'rejected'){
                    stat = 'status_99'; 
                }
                else if(remove == 'approved'){
                    stat = 'status_1'; 
                }
                else if(remove == 'suggested'){
                    stat = 'status_2'; 
                }
                newid = id.replace(stat,'status_0');
                newid = newid.replace('current_'+remove,'current_none');
                mydiv.setAttribute('id',newid); 
                var suggdiv = document.querySelector('#'+id+'_suggest');
                suggdiv.setAttribute('id',newid+'_suggest');  
            }

            var meta = json['meta'];
            var innercell = $(xy+' .mlabel');
            innercell.html(meta);
            newid = newid+'_mlabel';
            var id = innercell.attr('id');
            var metdiv = document.querySelector('#'+id);
            metdiv.setAttribute('id',newid);

            var note = json['note'];
            var innercell = $(xy+' .note');
            if(typeof note == 'undefined'){
                note = '';
            }
            innercell.html(note);
            newid = newid.replace('_mlabel','_note');
            var id = innercell.attr('id');
            var metdiv = document.querySelector('#'+id);
            metdiv.setAttribute('id',newid);     
        }
        else if(istype=='writ'){
            var xy=index.substring(4);
            vals = value.split('_');
            var remove = vals[0];
            var replace = vals[1];
            var newid;

            if(remove == 'rejected'){
                var cell=$(xy); 
                cell.removeClass(remove).addClass('none'); 
                var innercell = $(xy+' .dlgrejectchecker');
                innercell.removeClass('dlgrejectchecker').addClass('dlgeditor'); 
                var id = innercell.attr('id');
                var thediv = document.querySelector('#'+id);
                newid = id.replace('studentdata_checkaction','studentdata_updatetext');
                thediv.setAttribute('id',newid);
                var innerdiv = $(xy).find('.innerrejectchecker');
                innerdiv.removeClass('innerrejectchecker').addClass('innerdlgeditor');
                innerdiv.html(json['data']); 

                var innercell = $(xy+' .note');
                newid = newid+'_note';
                var id = innercell.attr('id');
                var metdiv = document.querySelector('#'+id);
                metdiv.setAttribute('id',newid);  

            }
            else if(remove == 'suggested'){
                if(replace == 'accept'){
                    var cell=$(xy); 
                    cell.removeClass(remove).addClass('accepted'); 
                    var innercell = $(xy+' .dlgsuggestchecker');
                    innercell.removeClass('dlgsuggestchecker').addClass('dlgapprovedchecker'); 
                    var id = innercell.attr('id');
                    var thediv = document.querySelector('#'+id);
                    newid = id.replace('studentdata_checkaction','studentdata_updatetext');
                    newid = id.replace('status_2','status_1');
                    newid = newid.replace('current_'+remove,'current_approved');
                    thediv.setAttribute('id',newid); 
                    var innerdiv = $(xy).find('.innersuggestchecker');
                    innerdiv.removeClass('innersuggestchecker').addClass('innerapprovedchecker');
                    innerdiv.html(json['data']);
                }  
                else if(replace=='edit'){
                    var cell=$(xy); 
                    cell.removeClass(remove).addClass('none'); 
                    var innercell = $(xy+' .dlgsuggestchecker');
                    innercell.removeClass('dlgsuggestchecker').addClass('dlgeditor'); 
                    var id = innercell.attr('id');
                    var thediv = document.querySelector('#'+id);
                    newid = id.replace('studentdata_checkaction','studentdata_updatetext');
                    thediv.setAttribute('id',newid);
                    var innerdiv = $(xy).find('.innersuggestchecker');
                    innerdiv.removeClass('innersuggestchecker').addClass('innerdlgeditor');
                    innerdiv.html(json['data']); 
                }

                //update the dlg accordingly
            }
            else if(remove == 'accepted'){
                var cell=$(xy); 
                cell.removeClass(remove).addClass('none'); 
                var innercell = $(xy+' .dlgapprovedchecker');
                innercell.removeClass('dlgapprovedchecker').addClass('dlgeditor'); 
                var id = innercell.attr('id');
                var thediv = document.querySelector('#'+id);
                newid = id.replace('studentdata_checkaction','studentdata_updatetext');
                thediv.setAttribute('id',newid);
                var innerdiv = $(xy).find('.innerapprovedchecker');
                innerdiv.removeClass('innerapprovedchecker').addClass('innerdlgeditor');
                innerdiv.html(json['data']); 

            }

            var meta = json['meta'];
            var innercell = $(xy+' .mlabel');
            innercell.html(meta);
            newid = newid+'_mlabel';
            var id = innercell.attr('id');
            var metdiv = document.querySelector('#'+id);
            metdiv.setAttribute('id',newid); 


        }
        else if(istype=='dupd'){
            var bits = index.split('#');
            var xy = bits[1];
            if(value == 1){
                var cell=$('#'+xy); 
                cell.removeClass('olddata');
            }
        }
    });
}
function postcelledit(xy){
    var cell=$(xy);
    cell.removeClass('dvprocessing');
    var locking = $(xy+' .dvcell').data('locking');
    if(locking=='cell'){
        cell.removeClass('dvlocked');
    }else if(locking=='row'){
        cell.closest('tr').children('td.dve').removeClass('dvlocked');
    }else if (locking=='table'){
        cell.closest('table').children('td.dve').removeClass('dvlocked');
    }

}

function syncajax(div,params,data){
    $.ajax({ async:false, dataType: "json", type: "POST",data: data,
        url: getAjaxURL()+'?lct='+div+'&act='+params
    }).done(function( json ) {
        domupdater(json);
    })           
}
function hide(id){
    $('#'+id).addClass('hidden');    
}
function unhide(id){
    $('#'+id).removeClass('hidden');    
}
function initautocomplete(e){
    var value = $('#'+e).data('pair');
    if($('#'+value).length>0){
        value=$('#'+value);
        var input = $('#'+e);  
    }else {
        value=$(e);
        var input = $('#'+e);   
    }

    input.removeClass('jxauto'); 
    input.addClass('jxautocomplete'); 
    acdata = input.data('autocomplete');
    action = input.data('autoaction');
    fields = input.data('fields');
    callback = input.data('callback');
    minlength = input.data('minlength')||2;
    tagonly = input.data('tagonly');
    zone = input.data('targetdiv')?input.data('targetdiv'):e;
    /* handled by blur - calling autoaction now */
    if(!tagonly){
        input.keyup(function(event){
            if(event.keyCode == 13){
                input.trigger('blur'); 
                //ajaxloader(zone,action+this.value,getFields(fields,input.val()),1,callback);
            }
        });
    }

    $.ajax({ dataType: "json", type: "POST",data: '',
        url: getAjaxURL()+'?lct=&act='+acdata
    }).done(function( json ) {               
        input.autocomplete({
            source: json,
            minLength: minlength,
            select: function( event, ui ) {
                console.log(action+'_acvalue_'+ui.item.value); 
                if(action != undefined && action.slice(-1)=='_'){
                    action=action+ui.item.value;
                }else{
                    input.val(ui.item.label);
                    value.val(ui.item.value);
                    value.data('tag',0);

                }

                if(action){
                    ajaxloader(zone,action,getFields(fields,input.val()),1,callback);
                } 
                //input.val('');

                input.blur();
                return false;
            },
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            }
        });
    });

}
function removeeditor(e,stub,was,callback,targetdiv){
    value = $('#jxedd_'+stub).val();
    value = encodeURIComponent(value);
    //p.html(value);

    if (targetdiv != null){
        p=$('#'+targetdiv);
        p.html('<div style="text-align:center">'+spinner('fa-lg')+'</div>');
        ajaxloader(targetdiv,stub,'data='+value+'&was='+was,false,callback);
    } else {
        p=$('#jxed_'+stub);
        p.html('<div style="text-align:center">'+spinner('fa-lg')+'</div>');
        p.addClass('jxeditable');     
        ajaxloader('jxed_'+stub,stub,'data='+value+'&was='+was,false,callback);
    }                                                                          
}
function ipeditor(edit){
    //edit = $('#'+e); 
    edit.removeClass('jxeditable');
    stub = edit.data('edit');
    targetdiv = edit.data('targetdiv');
    if(edit.html() == '<div style="text-align:center">'+spinner('fa-lg')+'</div>') {
        return;
    }
    params = edit.data('params');
    callback = edit.data('callback');
    was = edit.html();

    edit.removeClass('startopen');

    if(params){
        var ninput = document.createElement("select");
        ninput.setAttribute("name", 'jxedd_'+stub);
        ninput.setAttribute("id", 'jxedd_'+stub);
        //ninput.style.width = "60px";
        bits=params.split(';');
        for(i=0;i<bits.length;i++){
            temp = bits[i] +'='+ bits[i];                 
            b=temp.split('=');
            var option;                   
            option = document.createElement("option");
            option.setAttribute("value", b[0]);
            option.innerHTML = b[1];
            if(was==b[0]){
                option.setAttribute("selected", 1);    
            }
            ninput.appendChild(option);
        }
    }else{
        height = edit.data('height');
        width = edit.data('width');
        style = edit.data('style');
        if(height>1){
            ninput = document.createElement('textarea');
            //ninput.setAttribute('type', 'text');
            ninput.setAttribute('id', 'jxedd_'+stub);
            ninput.value = br2nl(was);
            ninput.setAttribute('rows', height);
            ninput.setAttribute('cols', width);
            ninput.setAttribute('style', style);
        }else{
            ninput = document.createElement('input');
            ninput.setAttribute('type', 'text');
            ninput.setAttribute('id', 'jxedd_'+stub); 
            ninput.setAttribute('style', style);
            ninput.value = was;
            if(width){
                ninput.setAttribute('size', width);
            }else{
                ninput.setAttribute('size', (was?was.length:3));
            }
        }

    }
    ninput.className = 'jxediting';
    edit.html('');
    edit.prepend(ninput);
    nbutt = document.createElement('input');
    nbutt.setAttribute('type', 'button');
    nbutt.setAttribute('value', 'ok');
    nbutt.setAttribute('class', 'jxokbutton');
    edit.append(nbutt);
    //$('#jxedd_'+stub).on('blur',function(e){removeeditor(e,stub,was,callback)});
    $('#jxedd_'+stub).on('blur',function(e){
        x = e.currentTarget.id;
        stub = x.substr(x.indexOf("_")+1);
        //was = e.currentTarget.html();      
        removeeditor(e,stub,was,callback,targetdiv);});
    //autocomplete
    autocom = edit.data('autocom');
    if(autocom==true){
        var obj_class = edit.data('obj');
        var obj_func = edit.data('func');
        $('#jxedd_'+stub).autocomplete({
            source: getAjaxURL()+'?lct=1&act='+obj_class+'_'+obj_func,
            minLength: 2
        });
    }
    //end autocomplete
    if(!params){
        ninput.select();    
    } else {
        ninput.focus();
    }
}                                   

function openbweditor(edit){
    if (!edit.hasClass('editorOn')) {
        closebweditor();
        //edit.wysiwyg();
        edit.parent().addClass('editor-area');
        edit.addClass('editorOn');
        edit.addClass('nohover');
        edit.prev('.btn-toolbar').show();
        edit.next().next('#btn-save').show();

        height = edit.data('height');
        width = edit.data('width');
        style = edit.data('style');
        edit.css(style);

    }  

}

function closebweditor(edit){    
    if (edit == null) {
        //edit = $('#btn-save');
        //edit = edit.prev().prev("div.jxeditor");
        edit = $('.jxeditor.editorOn');        
    }    

    if (edit.length > 0) {
        stub = edit.data('edit');
        //params = edit.data('params');
        was = edit.data('was');
        value = edit.html();    

        ajaxloader('jxed_'+stub,stub,'data='+value+'&was='+was);
        edit.prev('.btn-toolbar').hide();
        edit.next().next('#btn-save').hide();
        edit.parent().removeClass('editor-area');
        edit.removeClass('editorOn');
        edit.removeClass('nohover');
        edit.removeAttr('style');
    }
}

// For CKEditor
window.CKEDITOR_BASEPATH = '/local/mis/theme/javascript/ckeditor/'; 
function ckeditor(edit){ 
    var id = edit.data('edit');
    //if (CKEDITOR.instances[id]) {
    //  return;
    // }    
    var style = edit.data('style');
    if (style != '') {
        x = style.split(';');
        var style = {};        
        for (var i = 0; i < x.length; i++) {
            var split = x[i].split(':');
            if (split.length == 2)
                style[split[0].trim()] = split[1].trim();
        }        
    }        
    CKEDITOR.disableAutoInline = true;

    CKEDITOR.config.toolbar_default = myToolBar;
    CKEDITOR.config.toolbar_simple = simpleToolBar;
    CKEDITOR.config.toolbar_full = fullToolBar;
    CKEDITOR.config.toolbar_appmessage = appmessageToolBar;
    if (document.querySelector('.aicomment')) {
        CKEDITOR.config.scayt_autoStartup = false;
        CKEDITOR.config.removePlugins = 'scayt';
    }
    //CKEDITOR.config.toolbar = 'default'; 
    CKEDITOR.config.font_names = 'Arial/Arial, Helvetica, sans-serif;'+
    'Comic Sans MS/Comic Sans MS, cursive;'+
    'Courier New/Courier New, Courier, monospace;'+
    'Georgia/Georgia, serif;'+
    'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;'+
    'Tahoma/Tahoma, Geneva, sans-serif;'+
    'Times New Roman/Times New Roman, Times, serif;'+
    'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;'+
    'Verdana/Verdana, Geneva, sans-serif;'+
    'Dyslexic Font/DyslexicFont';       
    var cktoolbar =edit.data('toolbar')?edit.data('toolbar'):'default';

    var maxchar =edit.data('maxchar')?edit.data('maxchar'):-1;
    var showchar = maxchar > 0;
    var showword = edit.data('wordcount');

    var focus =edit.data('focus')?edit.data('focus'):false;

    if (edit.data('mode') == 'standard') {
        if (id == 'popupeditor') {
            CKEDITOR.on('instanceReady', function(ev) {
                ev.editor.focus();

                var s = ev.editor.getSelection(); // getting selection
                var selected_ranges = s.getRanges(); // getting ranges
                var node = selected_ranges[0].startContainer; // selecting the starting node

                if (node.getText().trim()) {
                    var parents = node.getParents(true);
                    node = parents[parents.length - 2].getFirst();

                    while (true) {
                        var x = node.getNext();
                        if (x == null) {
                            break;
                        }
                        node = x;
                    }

                    s.selectElement(node);
                    selected_ranges = s.getRanges();
                    selected_ranges[0].collapse(false);  //  false collapses the range to the end of the selected node, true before the node.
                    s.selectRanges(selected_ranges);  // putting the current selection there
                }
            });        
        }        

        var editor = CKEDITOR.replace( edit.data('edit'),{ 
            toolbar : cktoolbar ,
            startupFocus : focus,
            wordcount: {
                showCharCount: showchar,
                showWordCount: showword,
                maxCharCount: maxchar,
                charCountGreaterThanMaxLengthEvent: function (currentLength, maxLength) {
                    var notification = editor.showNotification( "More than max characters: " + maxLength, 'warning' );
                    notification.update( { duration: 2000, important: true } );
                }
            }
        } );
    } else {
        var editor = CKEDITOR.inline( edit.data('edit'),{
            toolbar : cktoolbar,
            wordcount: {
                showCharCount: showchar,
                maxCharCount: maxchar,
                charCountGreaterThanMaxLengthEvent: function (currentLength, maxLength) {
                    var notification = editor.showNotification( "More than max characters: " + maxLength, 'warning' );
                    notification.update( { duration: 2000, important: true } );                        
                }             
            },            
            on: {
                blur: function( event ) {       
                    debugger;             
                    $('#'+event.editor.name).parent().addClass('ckeditable');
                    $('.ckokbutton').remove();     

                    var data = event.editor.getData();
                    stub = event.editor.name;
                    was = ''; 
                    value = encodeURIComponent(data);
                    $('textarea#'+stub).text('saving...');   
                    $('textarea#'+stub).next('.cke_editable').html('saving...');   

                    ajaxloader('jxed_'+stub,stub,'data='+value+'&was='+was);
                    $('#voiceinterim').remove();

                },
                focus: function(event) {

                    $('#'+event.editor.name).parent().removeClass('ckeditable');
                    if ( !$( ".ckokbutton" ).length ) {
                        nbutt = document.createElement('input');
                        nbutt.setAttribute('type', 'button');
                        nbutt.setAttribute('value', 'ok');
                        nbutt.setAttribute('class', 'ckokbutton');
                        $('#'+event.editor.name).parent().append(nbutt);        

                    }                    
                },
                contentDom: function() {                   
                    var keys = Object.keys(style);
                    if (keys.length > 0) {
                        for (var i = 0; i < keys.length; i++) {
                            this.editable().setStyle(keys[i], style[keys[i]] );    
                        }                                                   
                    }
                }                
            }
        } );

    }

    editor.config.height = style['height'];
    editor.config.width = style['width'];
    editor.on( 'change', function( evt ) {
        $('#'+evt.editor.name).html(evt.editor.getData());
    });

    CKEDITOR.timestamp='ABCD';
    editor.on( 'blur', function( evt ) { 
        if(isProcessing){
            evt.editor.focus();
            return;
        }
        var stub = evt.editor.name.replace('text_','');

        var myArray = stub.split("_");
        if (!myArray.includes("promptname")) {
            var data = evt.editor.getData();
            var value = encodeURIComponent(data);
            var params = $('#rich_'+stub).data('blur'); 
            if (params) {
                ajaxloader('div_rich_'+stub,params,'data='+value);
            }else{
                var params = $('#popupeditor').data('blur'); 
                if (params) {
                    $('div#'+params+' div.innerdlgeditor').html('saving...'); 
                    if(value == ''){  
                        var id = '#'+params;
                        var clickeddiv = document.querySelector(id);
                        if(clickeddiv){
                            clickeddiv.setAttribute('data-butttype', 'gen');
                        }
                    }
                    ajaxloader('~'+params,params,'data='+value,false,'repaint');

                }
            }
        }
    });
}



$('body').delegate('.aidlgeditor','click',function(e){
    var params=id(e);  
    debugger;
    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;

    var meta=$('#'+params).data('metalabel');

    var datagroup=$('#'+params).data('datagroup');
    var phrasegroup=$('#'+params).data('phrasegroup');
    var metafoot=$('#'+params).data('metalabelfoot')||'';
    var wordcount=$('#'+params).data('wordcount');
    var buttontype = $('#'+params).attr('data-butttype');
    var dlgopencallback=$('#'+params).data('dlgopencallback')||'';
    // var thedatavalue=$('#'+params).data('value');
    //  var thetext=thedatavalue || '';
    var thetext=$('#'+params+' .innerdlgeditor').html();  
    var temp= thetext.replace(/"/g, "'");
    temp = temp.replace(/<p><\/p>\s*$/g, '');
    theplaceholder = temp.replace(/""\s*$/g, '');

    aiparams  = params.replace("updatetext", "genAIComm");
    if(buttontype == 'none'){
        var gen = '<p class="aimissing"> You have not yet entered enough data to generate a comment.</p>';
    }
    else if(buttontype == 'gen'){
        var gen = '<input value="Generate" type="button" class="genaicomm" data-click="'+aiparams+'_action_generate"></input><input value="save" type="button" class="closepopup"></input><div id="loadingIndicator" display=><div class="spinner"></div></div><div id="loadingDiv" display=></div>';
    } 
    else{
        var promptguide = '<textarea id="promptguide" placeholder="If you would like to direct the AI on how to adjust the comment, add an instruction here. If not, leave this section blank"></textarea>';
        var gen = '<input value="Regenerate" type="button" class="genaicomm" data-click="'+aiparams+'_action_regenerate"></input><input value="save" type="button" class="closepopup"></input><div id="loadingIndicator" display><div class="spinner"></div></div><div id="loadingDiv" display=></div>'+promptguide;
    }
    var h = '<p>'+meta+'</p><div data-textplaceholder="'+theplaceholder+'" data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor" data-wordcount="'+wordcount+'" data-blur="'+params+'" id="popupeditor" spellcheck="false">'+thetext+'</div>'+gen;

    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 

    if($('#voiceon.hidden').length==0){
        //console.log("listening...");
        $( '#voiceinterim').remove();
        $( "<div id='voiceinterim' data-linkeditor='popupeditor'  ></div>" ).insertBefore( "input[value='save']" );
        startVoice(e);
    }
    $('#popupeditor').each(function () { 
        try {
            ckeditor($(this));   
        }catch(err) {
            //console.log('ckeditor already initiated');
        }
    });  

    if(dlgopencallback !== '') {
        var callback = window[dlgopencallback];
        callback();
    }

    loadphrases(datagroup,phrasegroup);
});


$('body').delegate('.dlgeditor','click',function(e){
    console.log('clicked');
    var params=id(e);  

    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;

    var meta=$('#'+params).data('metalabel');

    var datagroup=$('#'+params).data('datagroup');
    var phrasegroup=$('#'+params).data('phrasegroup');
    debugger;
    var metafoot=$('#'+params).data('metalabelfoot')||'';
    var wordcount=$('#'+params).data('wordcount');
    var dlgopencallback=$('#'+params).data('dlgopencallback')||'';

    if($('#'+params+"[data-value]").length){
        var thedatavalue=$('#'+params).data('value');
        var thetext=thedatavalue;
        var theplaceholder=$('#'+params+' .innerdlgeditor').html();    
        var h = '<p>'+meta+'</p><div data-textplaceholder="'+theplaceholder+'" data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor" data-wordcount="'+wordcount+'" data-blur="'+params+'" id="popupeditor" spellcheck="true">'+thetext+'</div><input value="save" type="button" class="closepopup"></input>';
    }else{
        var thetext='loading...';
        var note = $('#'+params+'_note').html();
        var livemeta = $('#'+params+'_meta').html();
        if(typeof livemeta != 'undefined'){
            meta = livemeta;
        }
        var checker=params.replace('studentdata_updatetext','studentdata_checktext');
        syncajax('~'+params,checker);
        var thetext=$('#'+params+' .innerdlgeditor').html();
        if(typeof note == 'undefined'){
            var h = '<p>'+meta+'</p><div data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor"  data-wordcount="'+wordcount+'" data-blur="'+params+'" id="popupeditor" spellcheck="true">'+thetext+'</div><input value="save" type="button" class="closepopup"></input><p>'+metafoot+'</p>';
        }
        else{
            var h = '<p>'+meta+'</p><h5>Notes</h5><div id="chknote">'+note+'</div><div data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor"  data-wordcount="'+wordcount+'" data-blur="'+params+'" id="popupeditor" spellcheck="true">'+thetext+'</div><input value="save" type="button" class="closepopup"></input><p>'+metafoot+'</p>';
        }
    }
    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 

    if($('#voiceon.hidden').length==0){
        //console.log("listening...");
        $( '#voiceinterim').remove();
        $( "<div id='voiceinterim' data-linkeditor='popupeditor'  ></div>" ).insertBefore( "input[value='save']" );
        startVoice(e);
    }
    $('#popupeditor').each(function () { 
        try {
            ckeditor($(this));   


        }catch(err) {
            //console.log('ckeditor already initiated');
        }
    });  

    if(dlgopencallback !== '') {
        var callback = window[dlgopencallback];
        callback();
    }

    loadphrases(datagroup,phrasegroup);
});


$('body').delegate('.dlgchecker','click',function(e){
    var params=id(e);    
    var tdcell=$(this).closest('td');  
    var xy=indextdcell(tdcell);

    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;

    var meta=$('#'+params+'_mlabel').html();//data('metalabel');

    var thedatavalue=$('#'+params).html();
    var thetext=thedatavalue;


    params=params+'_xy_'+xy;    
    var h = '<p>'+meta+'</p><div>'+thetext+'</div><input data-click="'+params+'_checked_1" value="Checked" type="button" class="closechecker"></input><input data-click="'+params+'_checked_0" value="Unchecked" type="button" class="closechecker"></input>';

    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 
});


$('body').delegate('.dlgtextchecker','click',function(e){
    var params=id(e);    
    var tdcell=$(this).closest('td');  
    var xy=indextdcell(tdcell);
    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;

    var meta=$('#'+params+'_mlabel').html();//data('metalabel');
    var note=$('#'+params+'_note').html();//data('metalabel');

    if(typeof note == 'undefined'){
        note = '';
    }

    var thedatavalue=$('#'+params +' .innerdlgtextchecker').html();
    var thetext=thedatavalue;
    var suggestion = $('#'+params+'_suggest').html();

    if(suggestion !== '' && typeof suggestion != 'undefined'){
        var diff=diffString(thetext,suggestion);
        var pararray = params.split('_');
        var i;
        var type = 0;
        for(i = 0; i<pararray.length;i++){
            if(pararray[i]=='status'){
                type= pararray[i+1];
                break;
            }
        }

        params=params+'_xy_'+xy;

        if(type == 0){  
            var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div><h5>Differences </h5><div id="chkdiff">'+diff+'</div><h5>Suggested</h5/><textarea rows="4" cols="50" id="chksuggest">'+suggestion+'</textarea>'+
            '</div><h5>Notes</h5/><textarea rows="4" cols="50" id="chknote">'+note+'</textarea><br/><input data-click="'+params+'_action_approve" value="Approve" type="button" class="closechecker" id="btnApprove" ></input><input data-fields="chksuggest,chknote" data-click="'+params+'_action_appsugg" value="Approve with minor edit" type="button" class="closechecker" disabled="disabled" id="btnAppsugg"></input><input data-fields="chksuggest,chknote" data-click="'+params+'_action_correct" value="Reject with suggestion from proof reader" type="button" class="closechecker" disabled="disabled" id="btnCorrect"></input><input data-fields="chknote" data-click="'+params+'_action_reject" value="Needs re-writing by teacher" type="button" class="closechecker" id="btnUnapprove"></input>';
        }
        else{
            var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div><h5>Differences </h5><div id="chkdiff">'+diff+'</div>'+
            '<h5>Notes: </h5><div id="chknote">'+note+'</div>'+
            '<br/><input data-fields="chknote" data-click="'+params+'_action_undo" value="Undo" type="button" class="closechecker" id="btnUndo" ></input>';    
        }
    }
    else{

        var pararray = params.split('_');
        var i;
        var type = 0;
        for(i = 0; i<pararray.length;i++){
            if(pararray[i]=='status'){
                type= pararray[i+1];
                break;
            }
        }
        params=params+'_xy_'+xy;

        if(type ==1){
            var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div>'+
            '<br/><input data-fields="chksuggest,chknote" data-click="'+params+'_action_undo" value="Undo" type="button" class="closechecker" id="btnUndo"></input>';  
        } 
        else if(type ==99){
            var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div>'+
            '<h5>Notes: </h5><div id="chknote">'+note+'</div>'+
            '<br/><input data-fields="chksuggest,chknote" data-click="'+params+'_action_undo" value="Undo" type="button" class="closechecker" id="btnUndo"></input>';  
        } 
        else{
            var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div><h5>Differences </h5><div id="chkdiff"></div><h5>Suggested</h5/><textarea rows="4" cols="50" id="chksuggest">'+thetext+'</textarea>'+
            '<h5>Notes</h5><textarea rows="4" cols="50" id="chknote">'+note+'</textarea><br/>'+
            '<br/><input data-click="'+params+'_action_approve" value="Approve" type="button" class="closechecker" id="btnApprove" ></input><input data-fields="chksuggest,chknote" data-click="'+params+'_action_appsugg" value="Approve with minor edit" type="button" class="closechecker" disabled="disabled" id="btnAppsugg"></input><input data-fields="chksuggest,chknote" data-click="'+params+'_action_correct" value="Reject with suggestion from proof reader" type="button" class="closechecker" disabled="disabled" id="btnCorrect"></input><input data-fields="chknote" data-click="'+params+'_action_reject" value="Needs re-writing by teacher" type="button" class="closechecker" id="btnUnapprove"></input>';
        }

    }


    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 
});

$('body').delegate('.dlgsuggestchecker','click',function(e){
    var params=id(e);    
    var tdcell=$(this).closest('td');  
    var xy=indextdcell(tdcell);

    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;

    var meta=$('#'+params).data('metalabel');
    var note=$('#'+params+'_note').html();//data('metalabel');

    var thedatavalue=$('#'+params +' .innersuggestchecker').html();
    var thetext=thedatavalue;
    var suggestion = $('#'+params).data('suggest');
    var diff=diffString(thetext,suggestion);
    params=params+'_xy_'+xy;
    params = params+'_type_dlgsuggestchecker';

    if(typeof note != 'undefined'){
        var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div><h5>Suggested </h5><div id="chkdiff">'+diff+'</div><h5>Notes</h5/><div id="chknote">'+note+'</div><br/><input data-click="'+params+'_action_accept_previous_suggested" value="Accept Suggestions" type="button" class="closechecker" id="btnAccept" ></input><input data-fields="chkedit" data-click="'+params+'_action_edit_previous_suggested" value="Edit Myself" type="button" class="closechecker" id="btnEdit"></input>';

    }
    else{
        var h = '<p>'+meta+'</p><h5>Original Text</h5><div id="chkorig">'+thetext+'</div><h5>Suggested </h5><div id="chkdiff">'+diff+'</div><br/><input data-click="'+params+'_action_accept_previous_suggested" value="Accept Suggestions" type="button" class="closechecker" id="btnAccept" ></input><input data-fields="chkedit" data-click="'+params+'_action_edit_previous_suggested" value="Edit Myself" type="button" class="closechecker" id="btnEdit"></input>';

    }    

    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 
});

$('body').delegate('.dlgapprovedchecker','click',function(e){
    var params=id(e);  
    debugger;  
    var tdcell=$(this).closest('td');  
    var xy=indextdcell(tdcell);

    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;
    var meta=$('#'+params+'_mlabel').html();//data('metalabel');
    // if(typeof meta == 'undefined'){
    // var meta=$('#'+params).data('metalabel');
    //  }

    var thedatavalue=$('#'+params +' .innerapprovedchecker').html();
    var thetext=thedatavalue;

    params=params+'_xy_'+xy;
    params = params+'_type_dlgapprovedchecker';

    var h = '<p>'+meta+'</p><h5>Comment</h5><div id="chkorig">'+thetext+'</div>'+
    '<br/><input data-click="'+params+'_action_unlock_previous_accepted" value="Edit" type="button" class="closechecker" id="btnUnlock" ></input>';

    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 
});

$('body').delegate('.dlgrejectchecker','click',function(e){

    var params=id(e);  
    var tdcell=$(this).closest('td');  
    var xy=indextdcell(tdcell);

    $('#jxpopupouter').css({'z-index':'5000',width:'50%', height:'60%','margin-left': '-25%','top': '15%'});    

    var ht=$('#jxpopupouter').height()/4*2;

    var meta=$('#'+params).data('metalabel');
    var note=$('#'+params+'_note').html();//data('metalabel');
    var datagroup=$('#'+params).data('datagroup');
    var phrasegroup=$('#'+params).data('phrasegroup');
    var metafoot=$('#'+params).data('metalabelfoot')||'';
    var wordcount=$('#'+params).data('wordcount');
    var dlgopencallback=$('#'+params).data('dlgopencallback')||'';


    /*   if($('#'+params+"[data-value]").length){
    var thedatavalue=$('#'+params).data('value');
    var thetext=thedatavalue;
    var theplaceholder=$('#'+params+' .innerrejectchecker').html(); 
    params=params+'_xy_'+xy; 
    params = params+'_type_dlgrejectchecker';   
    var h = '<p>'+meta+'</p><div data-textplaceholder="'+theplaceholder+'" data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor" data-wordcount="'+wordcount+'" data-blur="'+params+'_action_editreject" id="popupeditor" spellcheck="true">'+thetext+'</div><input value="Edit" type="button" class="closepopup"></input>';
    }else{      */
    var thetext='loading...';
    var checker=params.replace('studentdata_updatetext','studentdata_checktext');
    syncajax('~'+params,checker);
    var thetext=$('#'+params+' .innerrejectchecker').html();
    params=params+'_xy_'+xy;
    params = params+'_type_dlgrejectchecker';


    if(typeof note != 'undefined'){  
        var h = '<p>'+meta+'</p><h5>Notes</h5/><div id="chknote">'+note+'</div><div data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor"  data-wordcount="'+wordcount+'" data-blur="'+params+'_action_edit_previous_rejected" id="popupeditor" spellcheck="true">'+thetext+'</div><input value="Edit" type="button" class="closepopup"></input><p>'+metafoot+'</p>';
    }
    else{
        var h = '<p>'+meta+'</p><div data-style="" class="ckeditor" height="90%" width="90%" data-toolbar="simple" data-mode="standard" data-focus="1" data-edit="popupeditor"  data-wordcount="'+wordcount+'" data-blur="'+params+'_action_edit_previous_rejected" id="popupeditor" spellcheck="true">'+thetext+'</div><input value="Edit" type="button" class="closepopup"></input><p>'+metafoot+'</p>';   
    }
    $('#jxpopup').html(h);       
    $('#jxpopupouter').modal();

    $('#popupeditor').css({width:'90%',height:ht,'top': '20%'}); 

    if($('#voiceon.hidden').length==0){
        //console.log("listening...");
        $( '#voiceinterim').remove();
        $( "<div id='voiceinterim' data-linkeditor='popupeditor'  ></div>" ).insertBefore( "input[value='save']" );
        startVoice(e);
    }
    $('#popupeditor').each(function () { 
        try {
            ckeditor($(this));   


        }catch(err) {
            //console.log('ckeditor already initiated');
        }
    });  

    if(dlgopencallback !== '') {
        var callback = window[dlgopencallback];
        callback();
    }

    loadphrases(datagroup,phrasegroup);
});

function indextdcell(tdcell){    
    var table = tdcell.closest("table");
    var tindex= $( "table" ).index( table ); 

    var col   = tdcell.index();
    var row   = tdcell.closest('tr').index();
    var xy="t"+tindex+"x"+col+"y"+row;

    tdcell.attr('id',xy);
    return xy;
}

function loadphrases(datagroup,phrasegroup){
    // $('.phrase').addClass('hidden');
    $('#jxpopup div.dlgphrasearea').html($('#phrasebank').html());

    if(phrasegroup!=datagroup){
        $('#jxpopup .phrase.'+datagroup+'.phrasegrp'+phrasegroup).removeClass('hidden').addClass('phrasewrap');
    }else{
        $('#jxpopup .phrase.'+datagroup).removeClass('hidden').addClass('phrasewrap');
    }
    $('#jxpopup div.dlgphrasearea').removeClass('hidden');

    var l = $('#jxpopup div.dlgphrasearea .phrase.'+datagroup).length;

    if(l>0){
        $("#phraseportal").removeClass('hidden');
        $("#phraseportal .accordion").accordion({header:'> .acchead:not(.item)',
            active:false,
            collapsible:true,
            heightStyle:'content',
            autoHeight:false});
    }else{
        $("#phraseportal").addClass('hidden');
    }

}

$('#jxpopup').delegate('.phrase','click',function(e){                                  
    var txt=$(this).html();
    CKEDITOR.instances['popupeditor'].insertText(txt);
});

$('#jxpopup').delegate('.lasttext','click',function(e){
    var txt=$(this).html();
    CKEDITOR.instances['popupeditor'].insertText(txt);
});
$('#jxpopup').delegate('.historypaste','click',function(e){
    var data=$(this).data();
    var field=data.field;
    var src=data.src;
    var val=$('#'+src).html();
    if(edt=CKEDITOR.instances[field]){
        edt.setData(val); 
    }else{
        $(field).val(val);
    }
    $('.closepopup').trigger('click');
});


function saveform(div){
    var saves='';
    $.each($('#'+div+' form .jxsaving'),function(index,value){   

        /*var ed = tinyMCE.get(value.name);*/
        var val='';
        var fld='';
        /*if(ed){
        if(ed.getContent){
        val=encodeURIComponent(ed.getContent());                                         
        ed.setContent('');
        }
        } */
        if($(value).hasClass('ckeditor')){
            fld=$(value).data('edit');
            val=CKEDITOR.instances[fld].getData();
        }else{ 
            if($(value).hasClass('jxeditor')){
                val=$(value).html();
                fld=value.id;
            }else{
                val=encodeURIComponent(value.value);
                fld=value.name;
            }  
        }
        saves+=fld+'='+val+'&';
    });   
    if(saves!=''){
        // console.log(saves);
        var cl=$('#'+div+' form').attr('name');
        if(cl){
            ajaxloader('',cl,saves+'autosave=1',false);
        }

    } 
}

function lazyloader(e){
    e.children('.ui-accordion-content').children('.jxlz').first().each(function(d){
        var id=($(this).attr('id')); 
        var action=($(this).data('lazy')); 
        var callback=($(this).data('callback'));  

        if(callback==undefined||callback==''){
            callback = $(this).attr('data-callback');
        }
        ajaxloader(id,action,'',false,callback);}).removeClass('jxlz'); 

    var chrts=e.find('.ahighchart');
    if(chrts.length){
        chrts.highcharts().reflow();
    }

}  
var zoomer=0;
function delayedlazyonscreen(pause){
    clearTimeout(zoomer);
    zoomer=setTimeout(function () {
        lazyonscreen();
        }, pause);
}
function lazyonscreen(){

    $('.jxlz').each(
        function(d){ 
            $(this).parent().attr('style')

            var parent=$(this).parent();
            if(parent.hasClass('ui-accordion-content')&&parent.css("display") == "none"){


            }else{
                if($(this).isOnScreen()) {
                    var id=($(this).attr('id')); 
                    var action=($(this).data('lazy')); 

                    var callback=($(this).data('callback'));  

                    if(callback==undefined||callback==''){
                        callback = $(this).attr('data-callback');
                    } 

                    ajaxloader(id,action,'',false,callback);
                    $(this).removeClass('jxlz'); 
                } 
            } 

        }   

    );
}
function eagerloader(){
    $('.jxegr').each(function(d){
        var id=($(this).attr('id')); 
        var action=($(this).data('eager')); 
        var callback=($(this).data('callback'));  
        if(callback==undefined||callback==''){
            callback = $(this).attr('data-callback');
        }
        ajaxloader(id,action,'',false,callback);}
    ).removeClass('jxegr'); 
}  

function eagergrapher(e){
    $('.jxg').each(
        function(d){
            var id=$(this).attr('id');  
            var data=$(this).data();  
            requestData(id,data); 
    }); 
    $('.jxg').removeClass('jxg'); 
}

function requestData(id,data) {         
    $.ajax({ dataType: "json", type: "POST", data: data,
        url: '../myajax.php?lct='+data.targetdiv+'&act='+data.source
    }).done(function( json ) { 
        colchart('#'+id,json); 
    }); 
}

function id(e){
    return e.currentTarget.id;
}  
function parse_id(id){
    return id.substring(id.indexOf('_')+1);    
}          

/*
if(typeof(tinyMCE) != "undefined"){
tinyMCE.init({
mode : "none",
theme : 'simple',
theme_simple_resizing: true,
theme_simple_resizing_use_cookie : false
});
}

function adveditorsize(ed,height,width){
tinyMCE.activeEditor.theme.resizeTo (width - 2, height - 32);
}                

function adveditor(ed){ 
//$('#'+ed).height($('#'+ed).height()+300);
var oldEditor = tinyMCE.get(ed);
if (oldEditor != undefined) {
tinyMCE.remove(oldEditor);
}  
tinyMCE.init({
mode : "none",
theme : 'simple',
theme_simple_resizing: true,
theme_simple_resizing_use_cookie : false
//theme_advanced_buttons1: " undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link "
});

tinyMCE.execCommand("mceAddControl", true, ed);
}                */

function confirmer(e,cancel){
    if(cancel==1){
        $('#'+e).addClass();
        $('#'+parse_id(e)).removeClass('hidden'); 
    }else{
        $('#'+e).hide();
        $('#'+parse_id(e)).removeClass('hidden');
        $('#'+parse_id(e)).focus();  
    }

}
function addeditor(e){
    alert(8); 
}

$('body').delegate('.jxfile', 'change', function(e){
    var element = $(e.currentTarget);
    var target=element.data('targetdiv');
    var i = 0, len = this.files.length, img, reader, file;
    // created by Unix, upload progress check interval
    var loaded = 0;
    var total = 0; 
    if($('.meter')){
        $('.meter').show();
        $('#choose_err_div').hide();
        var uploadInterval = setInterval(function() {
            intValue = Math.floor((loaded/total)*100);
            $('.meter').html(intValue+"%"); 
            $('.meter').css({"background":"-moz-linear-gradient(left, #57a957 "+intValue+"%, #cccccc "+intValue+"%)"}); 
            $('.meter').css({"background":"-webkit-linear-gradient(left, #57a957 "+intValue+"%, #cccccc "+intValue+"%)"}); 
            },500);
    }

    //End created by Unix
    for ( ; i < len; i++ ) {
        file = this.files[i];
        if ( window.FileReader ) {
            reader = new FileReader();
            reader.onloadend = function (e) { 
                // showUploadedItem(e.target.result, file.fileName);
            };
            reader.readAsDataURL(file);
        }

        if (formdata) {
            formdata.append("attachment", file);
            // total size of uploaded
            if($('#total_size_uploaded')){
                totalSizeUploaded = parseInt($('#total_size_uploaded').val());
                $('#total_size_uploaded').val(totalSizeUploaded+file.size);
            }
        }

        if (formdata) {
            jQuery('#'+target).html(spinner('fa-2x'));
            var action=$(e.currentTarget).data('click');
            jQuery.ajax({
                url: getAjaxURL()+'?lct='+target+'&act='+action,
                dataType: "json",
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                //created by Unix add XHR event listener check upload progress
                xhr:function(){
                    var xhr = new window.XMLHttpRequest();

                    //Upload progress
                    xhr.upload.addEventListener("progress", function(evt){
                        loaded = evt.loaded;
                        total = evt.total;

                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            //Do something with upload progress
                        }

                        if($('.meter')){
                            if(percentComplete==1){
                                clearInterval(uploadInterval);
                                $('.meter').html("100%"); 
                                $('.meter').css({"background":"-webkit-linear-gradient(left, #57a957 100%, #cccccc 100%)"}); 
                                $('.meter').css({"background":"-moz-linear-gradient(left, #57a957 100%, #cccccc 100%)"}); 
                                $('.meter').fadeOut( "slow" );
                            }
                        }

                        }, false);
                    //Download progress
                    xhr.addEventListener("progress", function(evt){
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            //Do something with download progress
                            /*
                            var downloadInterval = setInterval(function() {
                            console.log(percentComplete+" Download.");
                            },100);
                            */
                        }
                        }, false);
                    return xhr;
                },
                // end created by Unix
                success: function (json) {
                    domupdater(json);             
                    always();
                    resetFormElement(element);
                }
            });
        }
    }
});

function resetFormElement(e){
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}

function formfocus(){
    // focus on a text field or a button
    $('#form :input').first().focus();   
    if(document.activeElement.tagName!='INPUT'&&document.activeElement.tagName!='TEXTAREA'){    
        $("#form a").first().focus();    
    }


} 


function alwaysnew(context){
    $(".btn",context).button(); 
    $(".nobtn",context).button(); 
    $(".nobtn.ui-inactive",context).button({disabled:true}).removeClass('ui-state-disabled'); 

    //  $(".checkbox").button();   

    $(".ui-buttonset",context).buttonset();  
    //$(" .titletipright").tooltip({placement:'right'}); 
    //$(" .titletip").tooltip({placement:'top'}); 
    $("[data-toggle='tooltip']").tooltip({delay:{ show: 500, hide: 100 }});
    $('.richtextarea', context).each(function (index, value) { 
        //adveditor(value.id); 
        ipeditor($(this));
    }); 
    // For CKEditor
    $('.ckeditor',context).each(function () { // IGC added ,context 20210207 - performance of datagrids very poor with re-initialised editors in columns unnecessarily!!
        try {
            ckeditor($(this));
        }catch(err) {
            //console.log('ckeditor already initiated');
        }
    });    
    $('.tabs',context).each(function(){
        var initial=($(this).data('selected'));
        $(this).tabs({active:initial});  

    });
    $('.accordion',context).accordion({header:'> .acchead:not(.item)',
        active:false,
        collapsible:true,
        heightStyle:'content',
        autoHeight:false});
    $(".buttonsetv",context).buttonsetv();  
    $('.slimscroll',context).slimScroll({alwaysVisible: true,height:'auto'});                  
    //equalizor('.photogrid'); 
    imagesLoaded( '.photogrid', function( instance ) { 
        equalizor('.photogrid'); 
    });
    setTimeout(function(){ 
        equalizor('.photogrid'); 
        }, 3000);
    $('.accordionstartopen > div.acchead',context).trigger('click');
    $('.jxeditable.startopen',context).trigger('click');
    eagerloader(context);
    eagergrapher(context);
    // stop an icon from toggling an accordion
    $('.accordion .icon',context).on('click', function(e) { 
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(e.ctrlKey){     
            e.preventDefault();
        }
        helper($(e.currentTarget),'click',null,e);      
    });    
    $('.tooltip').remove(); 
    rotateheadings(context);

    initializeDatepicker(context);
    initializeTimepicker(context);
    initializeDragDrop(context);
    initializeHoverToggle(context);
    init_video_wall();
    initializeDropzone(context);

}   

function init_video_wall(){
    $("video").each(function(vplayer){
        $(".rotate_confirm_video_btn").hide();
        properties = ['transform', 'WebkitTransform', 'MozTransform',
            'msTransform', 'OTransform'],
        prop = properties[0];
        /* Iterators and stuff */    
        var i,j,t;
        if($.browser == undefined){
            $.browser = {};

            $('body').delegate('.rotate_left_video_btn','click',rotate_left_video);
            $('body').delegate('.rotate_right_video_btn','click',rotate_right_video);
            $('body').delegate('.rotate_save_video_btn','click',rotate_save_video);
            $('body').delegate('.rotate_confirm_video_btn','click',rotate_confirm_video);

            //console.log("delegate rotate init...");
            /*
            $('body').delegate('.closepopup','click', function(e){
            console.log("popup closed then undelegate");
            $('body').undelegate('.rotate_left_video_btn','click',rotate_left_video);
            $('body').undelegate('.rotate_right_video_btn','click',rotate_right_video);
            $('body').undelegate('.rotate_save_video_btn','click',rotate_save_video);
            $('body').undelegate('.rotate_confirm_video_btn','click',rotate_confirm_video);
            });
            */
        } 
        $.browser.video = this;
        $.browser.video.rotate = 0;
        //console.log("browser:"+$.browser);
        /* Find out which CSS transform the browser supports */
        for(i=0,j=properties.length;i<j;i++){
            if(typeof this.style[properties[i]] !== 'undefined'){
                $.browser.transform = properties[i];
                break;
            }
        }
        //vplayer = document.getElementsByTagName('video')[0];
    });
}

function rotate_left_video(e){
    e.preventDefault();
    $(".rotate_save_video_btn").show();
    $(".rotate_confirm_video_btn").hide();
    var h = $('#video_player').height();
    var w = $('#video_player').width();
    //console.log('rotate:'+$.browser.video.rotate);
    $.browser.video.rotate = $.browser.video.rotate + 90;
    $.browser.video.rotate = $.browser.video.rotate%360;
    $.browser.video.style[$.browser.transform]='rotate('+$.browser.video.rotate+'deg)';
    if($('#video_player').position().top<55){
        $('#video_player').css("margin-top","55px");
    }
    if($('#video_player').position().top>60){
        $('#video_player').css("margin-top","0px");
    }
    //console.log($('#video_player').position());
    if(w>h){
        if(w>400)
            w=400;
        $('#video_player').width(w);
        $('#video_player').height(h);
    }else{
        if(h>400)
            h=400;
        $('#video_player').width(h);
        $('#video_player').height(w);
    }
}
function rotate_right_video(e){
    e.preventDefault();
    $(".rotate_save_video_btn").show();
    $(".rotate_confirm_video_btn").hide();
    var h = $('#video_player').height();
    var w = $('#video_player').width();
    //console.log('rotate:'+$.browser.video.rotate);
    $.browser.video.rotate = $.browser.video.rotate + (360-90);
    $.browser.video.rotate = $.browser.video.rotate%360;
    $.browser.video.style[$.browser.transform]='rotate('+$.browser.video.rotate+'deg)';

    if($('#video_player').position().top<55){
        $('#video_player').css("margin-top","55px");
    }
    if($('#video_player').position().top>60){
        $('#video_player').css("margin-top","0px");
    }

    if(w>h){
        if(w>400)
            w=400;
        $('#video_player').width(w);
        $('#video_player').height(h);
    }else{
        if(h>400)
            h=400;
        $('#video_player').width(h);
        $('#video_player').height(w);
    }
}
function rotate_save_video(e){
    e.preventDefault();
    $(this).hide();
    $(".rotate_confirm_video_btn").html(" Save Change?");
    $(".rotate_confirm_video_btn").show();
}
function rotate_confirm_video(e){
    e.preventDefault();
    $(this).hide();
    $(".rotate_save_video_btn").hide();
    $(".rotate_left_video_btn").hide();
    $(".rotate_right_video_btn").hide();
    //show confirm save
    saveData = new FormData();
    saveData.append("eid",$("#video_player").data("eid"));
    saveData.append("rotate",$.browser.video.rotate);
    reqAjax(getAjaxURL()+'?lct=&act=evidencer_rotatevideo_do_wall',saveData,null);

}




function always(){
    $('input.autocomplete').val('');
    $('.jxloaderold').remove();
    $('.jxloader').removeClass('hidden');
    $('.jxloader').show();

    $( ".tabs" ).tabs({  activate: function( event, ui ) {
        var ldiv = ui.newPanel.find('.jxlz').each(function(d){
            var id=($(this).attr('id'));  
            var action=($(this).data('lazy'));  
            var callback=($(this).data('callback')); 
            ajaxloader(id,action,'',false,callback); 
        })     
        }
    }); 
    //$(" .titletipright").tooltip({placement:'right'}); 
    //$(" .titletip").tooltip({placement:'top'}); 
    $("[data-toggle='tooltip']").tooltip();
    // $(".ui-buttonset label").removeClass('ui-state-active');;  

}   

function spinner(more){
    return '<i class="fa fa-spinner fa-pulse fa-grey '+more+'"></i>';
}

function rotateheadings(context){
    $('.rotateheading',context).each(function(i,e){

        var $e = $(e),
        t = $e.text(),col = $e.css('color'),
        c = document.createElement('canvas'),
        ctx = c.getContext('2d');
        c.width = 200;
        c.height = 20;
        ctx.font="14px Sans-Serif";

        ctx.fillText(t,0,0);
        var sizes = ctx.measureText(t);
        c.height = sizes.width+4; 
        c.width = 20;
        ctx.save();
        ctx.rotate(Math.PI/2);
        ctx.font="14px Sans-Serif";
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.fillText(t,0,-5); 
        ctx.restore();
        $e.replaceWith($(c));      
    });
}

function initializeDatepicker(context){

    $('input.jxdatepicker').each(function(d){
        var options = {
            dateFormat: $(this).attr('data-dateformat')==undefined?'dd/mm/yy':$(this).attr('data-dateformat'),
            changeMonth: $(this).attr('data-allowmonthselection')==undefined?true:$(this).attr('data-allowmonthselection'),
            changeYear: $(this).attr('data-allowyearselection')==undefined?true:$(this).attr('data-allowyearselection'),
            numberOfMonths: $(this).attr('data-monthno')==undefined?1:parseInt($(this).attr('data-monthno')), 
            constrainInput: $(this).attr('data-noinput')==undefined?true:$(this).attr('data-noinput'),
            valid_callback: $(this).attr('data-validcallback')==undefined?'':$(this).attr('data-validcallback'),
            invalid_callback: $(this).attr('data-invalidcallback')==undefined?'':$(this).attr('data-invalidcallback'),
            yearRange:$(this).attr('data-yearRange')==undefined?'+0:+10':$(this).attr('data-yearRange'),

            onClose: function( selectedDate ) {
                if($(this).attr('data-click')!=undefined && $(this).attr('data-click')!=''){
                    var callback = '';
                    if($(this).attr('data-callback')!=undefined && $(this).attr('data-callback')!=''){              
                        callback = $(this).attr('data-callback');
                    }                       
                    helper($(this),'click',callback);
                }
                if($(this).attr('data-onclose')!=undefined){
                    eval($(this).attr('data-onclose'));
                }     
                $( context ).datepicker( "option", "", selectedDate );
            }

        }


        if($(this).attr('data-ayearRange')!=undefined){
            var minyear = $(this).attr('data-ayearRange');
            var minmonth = '08';
            var minday = '01';
            var maxyear = parseInt(minyear)+1;
            var maxday = '31';
            var maxmonth = '07';

            var minDate = '';
            var maxDate = '';

            switch(options.dateFormat){
                case 'dd-mm-yy':
                    minDate = minday+'-'+minmonth+'-'+minyear;
                    maxDate = maxday+'-'+maxmonth+'-'+maxyear;
                    break;
                case 'yy-mm-dd':
                    minDate = minyear+'-'+minmonth+'-'+minday;
                    maxDate = maxyear+'-'+maxmonth+'-'+maxday;
                    break;
                case 'yy-dd-mm':
                    minDate = minyear+'-'+minday+'-'+minmonth;
                    maxDate = maxyear+'-'+maxday+'-'+maxmonth;
                    break;
                case 'dd/mm/yy':
                    minDate = minday+'/'+minmonth+'/'+minyear;
                    maxDate = maxday+'/'+maxmonth+'/'+maxyear;
                    break;
                case 'yy/mm/dd':
                    minDate = minyear+'/'+minmonth+'/'+minday;
                    maxDate = maxyear+'/'+maxmonth+'/'+maxday;
                    break;
                case 'yy/dd/mm':
                    minDate = minyear+'/'+minday+'/'+minmonth;
                    maxDate = maxyear+'/'+maxday+'/'+maxmonth;
                    break;
            }
            options.minDate = minDate;
            options.maxDate = maxDate;
        }


        if($(this).attr('data-nopastdate')==undefined||$(this).attr('data-nopastdate')==true){
            options.minDate = new Date();
        }
        if($(this).attr('data-pastonly')==true){
            options.maxDate = "0";
        }



        //defaultDate: "+1w",
        $( "#"+$(this).attr('id') ).datepicker(options).removeClass('jxdatepicker');

        if(options.invalid_callback!='' || options.valid_callback!=''){
            $( "#"+$(this).attr('id') ).change(function() {
                try { jQuery.datepicker.parseDate( options.dateFormat, $( this ).val());
                    if(options.valid_callback!='')
                    eval(options.valid_callback);
                }
                catch(e){
                    if(options.invalid_callback!='')
                        eval(options.invalid_callback);
                }                                                        
            });
        }
    });         
}                   

function initializeTimepicker(context){
    $('input.jxtimepicker',context).each(function(d){
        var options = {
            template: $(this).attr('data-template')==undefined?'dropdown':parseInt($(this).attr('data-template')),
            minuteStep: $(this).attr('data-minuteStep')==undefined?1:parseInt($(this).attr('data-minuteStep')),
            showSeconds: $(this).attr('data-showSeconds')==undefined?false:parseInt($(this).attr('data-showSeconds')),
            secondStep: $(this).attr('data-secondStep')==undefined?1:parseInt($(this).attr('data-secondStep')), 
            defaultTime: $(this).attr('data-defaultTime')==undefined?'current':$(this).attr('data-defaultTime'),
            showMeridian: $(this).attr('data-showMeridian')==undefined?false:$(this).attr('data-showMeridian'),
            showInputs: $(this).attr('data-showInputs')==undefined?true:$(this).attr('data-showInputs'),
            disableFocus: $(this).attr('data-disableFocus')==undefined?false:$(this).attr('data-disableFocus'),
            disableMousewheel: $(this).attr('data-disableMousewheel')==undefined?false:$(this).attr('data-disableMousewheel'),
            modalBackdrop: $(this).attr('data-modalBackdrop')==undefined?false:$(this).attr('data-modalBackdrop'),

        }

        $( "#"+$(this).attr('id') ).timepicker(options).on('hide.timepicker', function(e) {
            /*alert('The time is ' + e.time.value);
            alert('The hour is ' + e.time.hours);
            alert('The minute is ' + e.time.minutes);
            alert('The second is ' + e.time.seconds);
            alert('The meridian is ' + e.time.meridian);*/

            // if fields of start and end time are set, make sure start is always earlier
            if($(this).attr('data-starttime')!=undefined && $(this).attr('data-starttime')!='' && $(this).attr('data-endtime')!=undefined && $(this).attr('data-endtime')!=''){
                var start = '';
                var end = '';
                if($(this).attr('id') == $(this).attr('data-starttime')){
                    start = e.time.value;
                    end = $('#'+$(this).attr('data-endtime')).val();
                }else if($(this).attr('id') == $(this).attr('data-endtime')){
                    start = $('#'+$(this).attr('data-starttime')).val();
                    end = e.time.value;
                }
                //cater am pm
                if($(this).attr('data-showMeridian')==true){
                    var start_arr = start.split(":");
                    var s_hr = parseInt(start_arr[0]);
                    var s_min = parseInt(start_arr[1]);
                    var s_sec = parseInt(start_arr[2]);

                    if(s_hr>12 || start.indexOf('PM')>0){
                        s_hr = s_hr+12;
                    }

                    var end_arr = end.split(":");
                    var e_hr = parseInt(end_arr[0]);
                    var e_min = parseInt(end_arr[1]);
                    var e_sec = parseInt(end_arr[2]);

                    if(e_hr>12 || end.indexOf('PM')>0)
                        e_hr = parseInt(e_hr)+12;

                    var comp_s = s_hr+''+s_min+''+s_sec;
                    var comp_e = e_hr+''+e_min+''+e_sec;

                    if(comp_s<=comp_e==false){

                    }
                }else{
                    start = start.replace(/:/g,'');
                    end = end.replace(/:/g,'');
                    start = parseInt(start);
                    end = parseInt(end);
                    if(start<=end==false){
                        alert('Start time has to be earlier than end time');
                        $('#'+$(this).attr('data-starttime')).val('');
                    }
                }

            }
            if($(this).attr('data-click')!=undefined && $(this).attr('data-click')!=''){

                var callback = '';
                if($(this).attr('data-callback')!=undefined && $(this).attr('data-callback')!=''){              
                    callback = $(this).attr('data-callback');
                }                       
                helper($(this),'click',callback);
            }

        });



    });
}

function initializeDragDrop(context){

    $('.cm_draggable',context).each(function(d){
        $('#'+$(this).attr('id'),context).draggable({
            revert:$(this).attr('data-revert')==undefined?"invalid":$(this).attr('data-revert'),
        });                       
    }); 


    $('.cm_droppable',context).each(function(d){
        var id = $(this).attr('id');

        $('#'+id,context).droppable({
            tolerance:"intersect", 
            accept: $('#'+id).attr('data-acceptclass')==undefined?".cm_draggable":"."+$('#'+id).attr('data-acceptclass'),
            //accept:'.cm_draggable',
            activeClass: $('#'+id).attr('data-activeclass')==undefined?"":$('#'+id).attr('data-activeclass'),
            hoverClass: $('#'+id).attr('data-hoverclass')==undefined?"":$('#'+id).attr('data-hoverclass'),
            drop: function( event, ui ) {

                if($('#'+ui.draggable.attr('id')).attr('data-drop')!=undefined && $('#'+ui.draggable.attr('id')).attr('data-drop')!=''){
                    var callback = '';

                    if($('#'+ui.draggable.attr('id')).attr('data-callback')!=undefined && $('#'+ui.draggable.attr('id')).attr('data-callback')!=''){
                        callback = $('#'+ui.draggable.attr('id')).attr('data-callback');
                    }

                    var data = $('#'+ui.draggable.attr('id')).attr('data-drop');
                    data = data+= '_dropid_'+id.replace(/drop/g,'').replace(/_/g,'');
                    $('#'+ui.draggable.attr('id')).attr('data-drop',data);
                    helper($('#'+ui.draggable.attr('id')),'drop',callback);

                }
            }

        });      

        /*if($('#'+id).attr('data-acceptclass')==undefined){
        $("#"+id ).droppable( "option","accept",".cm_draggable");
        }else{

        var accept_arr = $('#'+id).attr('data-acceptclass').split(",");
        var acc = new Array();                       
        for(var a=0;a<accept_arr.length;a++){
        if(accept_arr[a]!=''){
        acc[a] = "."+accept_arr[a];
        }

        }
        alert(acc);
        //alert(acc.join(','));
        $("#"+id ).droppable( "option","accept",acc);

        //$("#"+id ).droppable( "option","accept",".odd,.even");    
        //alert(id);
        //  alert($( "#"+id ).droppable( "option", "accept" ));
        //$("#"+id ).droppable( "option","accept",$('#'+id).attr('data-acceptclass'));    

        }                                                          */


    }); 
}

function initializeHoverToggle(context){
    var ct = 0 ;
    var first = '';

    /*Loop through thumbnails*/
    var loop = '';
    inside = false;

    $('.hovertogglerslider').mouseenter(function(){
        var e = $(this);
        if (!inside) {
            inside = true;
            $(this).children().eq(1).slideToggle( "slow", function() {

            }); 
            $(this).children().eq(1).addClass("toggled");
            loop = setInterval(function(){
                var ct = 0;

                var total = $(e).children('div').length;
                $(e).children('div').each(function (index) {
                    if(ct>0){ 
                        $('.hovertogglerslider .toggled').hide(); 

                        if(index==total-1){
                            $('.hovertogglerslider .toggled').removeClass('toggled');
                        }
                        if($(this).hasClass("toggled")==false){

                            $(this).slideToggle( "slow", function() {

                            }); 
                            $(this).addClass("toggled");
                            return false;
                        }

                    }
                    ct++;
                });                                                                                 
                }, 5000);
        }
    }).mouseleave(function(){
        inside = false;
        clearInterval(loop);
        $('.hovertogglerslider .toggled').hide();
        $('.hovertogglerslider .toggled').removeClass('toggled');
    });

}

function initializeDropzone(context){
    $('.jxdropzone',context).each(function(d){
        var id = $(this).attr('id');
        var displayres = $(this).attr('data-displayres');
        var myDropzone = new Dropzone("#"+id, { 
            url: $(this).attr('data-url'),
            method:$(this).attr('data-method')==undefined?'':$(this).attr('data-method'),
            maxFilesize:$(this).attr('data-maxfilesize')==undefined?'':$(this).attr('data-maxfilesize'),
            paramName: $(this).attr('data-paramname')==undefined?'file':$(this).attr('data-paramname'),
            acceptedFiles:$(this).attr('data-acceptedfiles'),
            maxFiles:$(this).attr('data-maxfiles'),
            init: function () {
                this.on('success', function(file,response) {
                    if(displayres){
                        try {
                            var redirect=$(this.element).data('gotourl');
                            if(redirect){
                                $(location).attr('href',redirect);
                            }else{
                                var obj = jQuery.parseJSON(response);
                                if(obj.result=='error'){
                                    file.previewElement.classList.add("dz-error");
                                    file.previewElement.querySelector("[data-dz-errormessage]").textContent = obj.msg;
                                    alert(obj.msg);
                                }else if(obj.result=='success'&&obj.msg!=undefined){
                                    alert(obj.msg);
                                }
                            }

                        }

                        catch(err) {
                            //console.log(err);
                        } 
                    }
                });
            }
        });  

    }); 
}

function setHoverToggle(first,child,s){

    var sec = s*1000
    setTimeout(function() {
        first.hide();
        child.prev().hide();

        child.slideToggle( "slow", function() {

        });           

        }, sec);
}


function getAjaxURL(){
    return getBaseURL()+'/local/mis/myajax.php';
}

function getAliveURL(){
    return getBaseURL()+'/local/mis/alive.php';
}
function getBaseURL() {

    pathArray = window.location.href.split( '/' );
    protocol = pathArray[0];
    host = pathArray[2];
    baseURL = protocol + '//' + host;

    return  baseURL;
}

$.fn.isOnScreen = function(){
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    //console.log((bounds.top +'<='+ viewport.bottom));
    //console.log( bounds.bottom +'>='+ viewport.top);
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};
$.fn.isPartOnScreen = function(){
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + 300;// this.outerHeight();
    //console.log((bounds.top +'<='+ viewport.bottom));
    //console.log( bounds.bottom +'>='+ viewport.top);
    return ((bounds.top>0) && (bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};
$.fn.isUpperScreen = function(){
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height()/2;
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    //console.log((bounds.top +'<='+ viewport.bottom));
    //console.log( bounds.bottom +'>='+ viewport.top);
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};



/*function getBaseURL() {
var url = location.href;  // entire url including querystring - also: window.location.href;
var baseURL = url.substring(0, url.indexOf('/', 14));   

if (baseURL.indexOf('http://localhost') != -1) {
// Base Url for localhost
var url = location.href;  // window.location.href;
var pathname = location.pathname;  // window.location.pathname;
var index1 = url.indexOf(pathname);
var index2 = url.indexOf("/", index1 + 1);
var baseLocalUrl = url.substr(0, index2);

return baseLocalUrl + "/";
}
else {
// Root Url for domain name
return baseURL + "/";
}

}            */

(function( $ ){
    //plugin buttonset vertical
    $.fn.buttonsetv = function() {
        $('label', this).wrap('<div style="margin: 1px"/>');
        $(this).buttonset();
        $('label:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
        $('label:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');

        $('label', this).each(function(index){
            $(this).width('100%');
        })
    }; 
})( jQuery );

var colchart;

// highcharts theme
function colchart(container,json) { 
    debugger;
    if(json){  
        Highcharts.theme = {
            credits:{
                enabled: false
            }, 
            chart: {
                backgroundColor: "#fff",

                plotBackgroundColor: 'rgba(253, 253, 253, .9)'
            },

            colors: [ "#88c", "#6b4", "#c66", "#aa0000", "#00aa00", "#0000aa", "#8c8", "#b46", "#66c", "#aaaa00",
                "#00aaaa", "#aa00aa",  "#440000", "#c88", "#46b", "#66c", "#004400", "#000044", "#444400",
                "#004444", "#440044"],
            title: {
                style: {
                    color: '#FFF',
                    font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            },
            subtitle: {
                style: {
                    color: '#DDD',
                    font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            },
            xAxis: {
                gridLineWidth: 0,
                lineColor: '#999',
                tickColor: '#999',
                labels: {
                    style: {
                        color: '#222',
                        fontWeight: 'bold'
                    }
                },
                title: {
                    style: {
                        color: '#222',
                        font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                }
            },
            yAxis: {
                alternateGridColor: null,
                minorTickInterval: null,
                gridLineColor: 'rgba(255, 255, 255, .1)',
                minorGridLineColor: 'rgba(255,255,255,0.07)',
                lineWidth: 0,
                tickWidth: 0,
                labels: {
                    style: {
                        color: '#222',
                        fontWeight: 'bold'
                    }
                },
                title: {
                    style: {
                        color: '#222',
                        font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                }
            },
            legend: {
                itemStyle: {
                    color: '#222'
                },
                itemHoverStyle: {
                    color: '#000'
                },
                itemHiddenStyle: {
                    color: '#999'
                }
            },
            labels: {
                style: {
                    color: '#222'
                }
            },
            tooltip: {
                backgroundColor:'#fff',
                borderWidth: 0,
                style: {
                    color: '#000'
                }
            },


            plotOptions: {
                series: {
                    shadow: false,
                    events: {
                        legendItemClick: function(event) {
                            var hideAllOthers = (event.browserEvent.metaKey || event.browserEvent.ctrlKey);
                            var seriesIndex = this.index;
                            var series = this.chart.series;
                            var v1 = series[seriesIndex].visible;
                            var hashidden = false;

                            for (var i = 0; i < series.length; i++) {
                                if (!series[i].visible) {
                                    hashidden = true;
                                    break;    
                                }   
                            }
                            for (var i = 0; i < series.length; i++) {
                                // rather than calling 'show()' and 'hide()' on the series', we use setVisible and then
                                // call chart.redraw --- this is significantly faster since it involves fewer chart redraws
                                if (hideAllOthers) {
                                    if (series[i].visible) {
                                        series[i].setVisible(false, false);
                                    } else {
                                        series[i].setVisible(true, false);
                                    } 
                                } else {
                                    if (v1 && hashidden) {
                                        series[i].setVisible(true, false);
                                    } else if (v1 && !hashidden) {
                                        series[i].setVisible((seriesIndex==i), false);
                                    } else if (seriesIndex==i) {
                                        series[i].setVisible(!series[i].visible, false);
                                    }     
                                } 
                            }
                            this.chart.redraw();
                            return false;
                        }
                    }
                },
                line: {
                    dataLabels: {
                        color: '#CCC'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                spline: {
                    marker: {
                        lineColor: '#333'
                    }
                },
                scatter: {
                    marker: {
                        lineColor: '#333'
                    }
                },
                candlestick: {
                    lineColor: 'white'
                },
                column:{
                    pointPadding:0,
                    groupPadding:0.05 
                }
            },

            toolbar: {
                itemStyle: {
                    color: '#CCC'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    hoverSymbolStroke: '#FFFFFF',
                    theme: {
                        fill: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0.4, '#606060'],
                                [0.6, '#333333']
                            ]
                        },
                        stroke: '#000000'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    stroke: '#000000',
                    style: {
                        color: '#CCC',
                        fontWeight: 'bold'
                    },
                    states: {
                        hover: {
                            fill: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0.4, '#BBB'],
                                    [0.6, '#888']
                                ]
                            },
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0.1, '#000'],
                                    [0.3, '#333']
                                ]
                            },
                            stroke: '#000000',
                            style: {
                                color: 'yellow'
                            }
                        }
                    }
                },
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(16, 16, 16, 0.5)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                }
            },

            scrollbar: {
                barBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0.4, '#888'],
                        [0.6, '#555']
                    ]
                },
                barBorderColor: '#CCC',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0.4, '#888'],
                        [0.6, '#555']
                    ]
                },
                buttonBorderColor: '#CCC',
                rifleColor: '#FFF',
                trackBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#000'],
                        [1, '#333']
                    ]
                },
                trackBorderColor: '#666'
            },

            // special colors for some of the demo examples
            legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
            legendBackgroundColorSolid: 'rgb(70, 70, 70)',
            dataLabelsColor: '#444',
            textColor: '#E0E0E0',
            maskColor: 'rgba(255,255,255,0.3)'
        };
        var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

        // console.log(json);

        if($("#jxpopupouter.in").length>0){
            var height=$('.modal-body').height()-70;
            if (height>0){
                $(container).parent('div').height(height);            
            } 
        }           
        $(container).highcharts(json
        );   
    }   
} 

function br2nl(str) {
    //return str.replace(/<br\s*\/?>/mg,"\n");
    return str.replace(/<br\s*\/?>/mg,"");
}

function nl2br (str) {
    if($.type(str) === "string"){
        return str.replace(/(\r\n|\n\r|\r|\n)/g, "<br>\n");
    }else{
        return str;
    }
}



window.___gcfg = { lang: 'en' };
(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    $('#voiceon').addClass('hidden');
    $('#voiceoff').addClass('hidden');
} else {

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        //console.log('info_speak_now');
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {

            //console.log('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            //console.log('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                //console.log('info_blocked');
            } else {
                //console.log('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }

        if (!final_transcript) {
            return;
        }

    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        var allFinal=true;
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {

            } else {
                allFinal=false;
            }
            interim_transcript += event.results[i][0].transcript;
        }
        if($('#voiceinterim').length){
            var link=  $('#voiceinterim').data('linkeditor');

            if(allFinal){
                var txt=linebreak(capitalize(interim_transcript));       
                CKEDITOR.instances[link].insertText(tosentence(txt)+"\r\n"); 
                interim_transcript='';

            }
            $('#voiceinterim').html( linebreak(interim_transcript));
        }
    };
}

$('body').delegate('#chksuggest','keyup',function(e){
    var suggest=$('#chksuggest').val();
    var orig=$('#chkorig').html();
    var diff=diffString(orig,suggest);
    $('#chkdiff').html(diff);
    var same=orig==suggest;
    $('input#btnApprove').prop('disabled', !same);
    $('input#btnCorrect').prop('disabled', same);
    $('input#btnAppsugg').prop('disabled', same);
    $('input#btnRejectToMe').prop('disabled', same);
    $('input#btnRejectToAuthor').prop('disabled', same);
    // $('input#btnUnapprove').prop('disabled', !same);
})

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function tosentence(m){
    m=m.trim();
    m.replace('&nbsp;','');  
    var l=m.substr(-1);
    if(l=='.'||l=='!'|l=='?'){
        a='';
    }else{
        a='. ';
    } 
    m=m.concat(a);
    return m;
}
var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) {  
        return m.toUpperCase();
        ; });
}

function startVoice(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    recognition.lang = 'en-GB';
    recognition.start();
    ignore_onend = false;
    $('#voiceinterim').html('');
    start_timestamp = event.timeStamp;
}
function stopVoice(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
}
function diffString( o, n ) {

    var wikEdDiff = new WikEdDiff();
    var diffHtml = wikEdDiff.diff( o, n );

    return diffHtml;

    /*
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
    var str = "";

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) {
    oSpace = ["\n"];
    } else {
    oSpace.push("\n");
    }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) {
    nSpace = ["\n"];
    } else {
    nSpace.push("\n");
    }

    if (out.n.length == 0) {
    for (var i = 0; i < out.o.length; i++) {
    str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
    }
    } else {
    if (out.n[0].text == null) {
    for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
    str += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
    }
    }

    for ( var i = 0; i < out.n.length; i++ ) {
    if (out.n[i].text == null) {
    str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
    } else {
    var pre = "";

    for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
    pre += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
    }
    str += " " + out.n[i].text + nSpace[i] + pre;
    }
    }
    }

    return decodeURIComponent(str);
    */
}

function randomColor() {
    return "rgb(" + (Math.random() * 100) + "%, " + 
    (Math.random() * 100) + "%, " + 
    (Math.random() * 100) + "%)";
}

function diffString2( o, n ) {
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) {
        oSpace = ["\n"];
    } else {
        oSpace.push("\n");
    }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) {
        nSpace = ["\n"];
    } else {
        nSpace.push("\n");
    }

    var os = "";
    var colors = new Array();
    for (var i = 0; i < out.o.length; i++) {
        colors[i] = randomColor();

        if (out.o[i].text != null) {
            os += '<span style="background-color: ' +colors[i]+ '">' + 
            escape(out.o[i].text) + oSpace[i] + "</span>";
        } else {
            os += "<del>" + escape(out.o[i]) + oSpace[i] + "</del>";
        }
    }

    var ns = "";
    for (var i = 0; i < out.n.length; i++) {
        if (out.n[i].text != null) {
            ns += '<span style="background-color: ' +colors[out.n[i].row]+ '">' + 
            escape(out.n[i].text) + nSpace[i] + "</span>";
        } else {
            ns += "<ins>" + escape(out.n[i]) + nSpace[i] + "</ins>";
        }
    }

    return { o : os , n : ns };
}

function diff( o, n ) {
    var ns = new Object();
    var os = new Object();

    for ( var i = 0; i < n.length; i++ ) {
        if ( ns[ n[i] ] == null )
            ns[ n[i] ] = { rows: new Array(), o: null };
        ns[ n[i] ].rows.push( i );
    }

    for ( var i = 0; i < o.length; i++ ) {
        if ( os[ o[i] ] == null )
            os[ o[i] ] = { rows: new Array(), n: null };
        os[ o[i] ].rows.push( i );
    }

    for ( var i in ns ) {
        if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
            n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
            o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
        }
    }

    for ( var i = 0; i < n.length - 1; i++ ) {
        if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
            n[i+1] == o[ n[i].row + 1 ] ) {
            n[i+1] = { text: n[i+1], row: n[i].row + 1 };
            o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
        }
    }

    for ( var i = n.length - 1; i > 0; i-- ) {
        if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
            n[i-1] == o[ n[i].row - 1 ] ) {
            n[i-1] = { text: n[i-1], row: n[i].row - 1 };
            o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
        }
    }

    return { o: o, n: n };
}


