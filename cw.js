$(document).ready(function(){
    if($('#verify').length && $('#nodocs').length){
        $('#nodocs').click();
    } 
    else{
        if($('#verify').length){
            $('#verify').click();
        }
        else{
            $('#divform').removeClass('verify');
        } 

        if($('#nodocs').length){
            $('#nodocs').click();
        } 
        else{
            $('#divfilelist').removeClass('expire');   
        } 
    }

});

$(document).ajaxComplete(function(){
    if($('#expire').length){
        $('#expire').click();
    }
    else{
        $('#divfilelist').removeClass('expire'); 
    }

    if($('#verify').length && $('#nodocs').length){
        $('#nodocs').click();
    } 
    else{
        if($('#verify').length){
            $('#verify').click();
        }
        else{
            $('#divform').removeClass('verify');
        } 

        if($('#nodocs').length){
            $('#nodocs').click();
        } 
        else{
            $('#divfilelist').removeClass('expire');   
        } 
    }

});


$('#verify').click(function(e){
    var id = this.id;
    debugger;
    e.preventDefault();
    verifydialog(e);
    $('#divform').addClass('verify');
});

$('#nodocs').click(function(e){
    var id = this.id;
    debugger;
    e.preventDefault();
    nodocsdialog(e);
    $('#divfilelist').addClass('verify');
});

$('#verifybutt').click(function(e){
    var id = this.id;
    $('#divform').removeClass('verify');
    $('#verify').detach();
});

$('#expire').click(function(e){
    var id = this.id;
    debugger;
    e.preventDefault();
    $('#divfilelist').addClass('expire');
    expiredialog(e);
});

function vernodocsdialog(e){

    $('<div></div>').appendTo('body')
    .html('<div><h6>Records show that you need to verify AND complete your travel document data entry before being allowed to make a overseas trip selection. If you are intending to go on a local trip, you can ignore this message. Please indicate your intent on Data Manager form.</h6></div>')
    .dialog({
        modal: true,
        title: 'Travel Data verification',
        zIndex: 10000,
        autoOpen: true,
        width: 'auto',
        resizable: false,
        close: function (event, ui) {
            debugger;
            $(this).remove();
        }
    });
}

function verifydialog(e){

    $('<div></div>').appendTo('body')
    .html('<div><h6>Records show that you need to verify your travel document data entry before being allowed to make a overseas trip selection. If you are intending to go on a local trip, you can ignore this message. Please indicate your intent on Data Manager form.</h6></div>')
    .dialog({
        modal: true,
        title: 'Travel Data verification',
        zIndex: 10000,
        autoOpen: true,
        width: 'auto',
        resizable: false,
        close: function (event, ui) {
            debugger;
            $(this).remove();
        }
    });
}

function nodocsdialog(e){

    $('<div></div>').appendTo('body')
    .html('<div><h6>Records show that you need to complete the upload of both of your travel documents. If you are intending to go on a local trip, you can ignore this message. Please indicate your intent on Data Manager form.</h6></div>')
    .dialog({
        modal: true,
        title: 'Travel Document Upload',
        zIndex: 10000,
        autoOpen: true,
        width: 'auto',
        resizable: false,
        close: function (event, ui) {
            debugger;
            $(this).remove();
        }
    });
}

function expiredialog(e){

    $('<div></div>').appendTo('body')
    .html('<div><h6>Records show that the passport you uploaded last year will not be valid for the coming year. <br/> Please upload a valid passport and re-enter the data before selection opens.</h6></div>')
    .dialog({
        modal: true,
        title: 'Travel Data verification',
        zIndex: 10000,
        autoOpen: true,
        width: 'auto',
        resizable: false,
        close: function (event, ui) {
            debugger;
            $(this).remove();
        }
    });
}
