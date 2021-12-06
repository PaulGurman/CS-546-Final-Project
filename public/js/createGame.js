(function ($) {
    var previewArea = $('#preview');
    var errorArea = $('.error');

    previewArea.hide();

    errorArea.click(function(){
        $(this).hide();
        $(this).empty();
    });

    $("#preview_boxart").on('click', function(event){
        event.preventDefault();
        previewArea.empty();
        if(!$('#boxart').val()){
            errorArea.empty();
            errorArea.append($('<p>Please provide a boxart link<p>'));
            errorArea.show();
        }
        else{
            var image = $(`<img src=${$('#boxart').val()} alt=Bad_Image>`);
            previewArea.append(image);
            previewArea.show();
        }
    });
})(window.jQuery);
