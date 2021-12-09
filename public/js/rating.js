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
                "<img src='" + response.image1 + "' alt='" + response.name1 + "'/>" +
                "<p id='releaseL'>" + response.release1 + "</p>" + 
                "<p id='genreL'>" + response.genre1 + "</p>" +
                "<p id='priceL'>" + response.price1 + "</p>" + 
                "<p id='developerL'>" + response.developer1 + "</p>";
            var rightHTML = "<a href='/videogames/" + response.id2 + "'>" + response.name2 + "</a>" +
                "<img src='" + response.image2 + "'alt='" + response.name2 + "'/>" +
                "<p id='releaseR'>" + response.release2 + "</p>" +
                "<p id='genreR'>" + response.genre2 + "</p>" +
                "<p id='priceR'>" + response.price2 + "</p>" + 
                "<p id='developerR'>" + response.developer2 + "</p>";
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