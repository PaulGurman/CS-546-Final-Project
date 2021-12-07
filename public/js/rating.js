(function($) {
    var leftGame = $('.Left');
    var rightGame = $('.Right');

    function resetGames(config) {
        $.ajax(config).then(function(response){
            if(response === null) {
                alert('Issue with storing rating, please try again.');
                return;
            }
            var leftHTML = "<a href='/videogames/" + response.id1 + "'>" + response.name1 + "</a>" + 
                "<img src='" + response.image1 + "'/>" +
                "<p id='Release'>" + response.release1 + "</p>" + 
                "<p id='genre'>" + response.genre1 + "</p>" +
                "<p id='price'>" + response.price1 + "</p>" + 
                "<p id='developer'>" + response.developer1 + "</p>";
            var rightHTML = "<a href='/videogames/" + response.id2 + "'>" + response.name2 + "</a>" +
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