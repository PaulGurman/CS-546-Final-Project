(function($) {
    var leftGame = $('#Left');
    var rightGame = $('#Right');

    function resetGames(config) {
        $.ajax(config).then(function(response){
            if(response === null) {
                alert('Issue with storing rating, please try again.');
                return;
            }
            var leftHTML = "<h1 id='Name'>" + response.name1 + "</h1>" + 
                "<img src='" + response.image1 + "'/>" +
                "<p id='Release'>" + response.release1 + "</p>" + 
                "<p id='genre'>" + response.genre1 + "</p>" +
                "<p id='price'>" + response.price1 + "</p>" + 
                "<p id='developer'>" + response.developer1 + "</p>";
            var rightHTML = "<h1 id='Name'>" + response.name2 + "</h1>" +
                "<img src='" + response.image2 + "'/>" +
                "<p id='Release'>" + response.release2 + "</p>" +
                "<p id='genre'>" + response.genre2 + "</p>" +
                "<p id='price'>" + response.price2 + "</p>" + 
                "<p id='developer'>" + response.developer1 + "</p>";
            leftGame.html(leftHTML);
            rightGame.html(rightHTML);
        });
    }

    leftGame.on('click', function() {
        var config = {
            method: 'POST',
            url: '/rating/reset',
            data: {side: 'left'}
        };
        resetGames(config);
    });

    rightGame.on('click', function() {
        var config = {
            method: 'POST',
            url: '/rating/reset',
            data: {side: 'right'}
        };
        resetGames(config);
    });

})(window.jQuery);