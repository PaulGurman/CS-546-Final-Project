var thisScript = document.currentScript;
(function($){
    const commentSection = $('#comment-section');
    const newCommentForm = $('#new-comment');
    const commentTextArea = $('#comment-text-area');
    const titleInput = $('#title-input');
    const missingInputMessage = $('#missing-input-message');
    const likeButton = $('.like-button');

    newCommentForm.submit(function(e){
        e.preventDefault();

        const game_id = thisScript.getAttribute('game-id');
        const username = thisScript.getAttribute('username');
        const title = titleInput.val();
        const comment = commentTextArea.val();
        const date = (new Date()).toISOString().slice(0,10);

        if(title.replace(/\s*/g, '').length === 0 || comment.replace(/\s*/g, '').length === 0) {
            missingInputMessage.show();
            return;
        } else {
            missingInputMessage.hide();
        }

        // Make content for page
        const titlePar = $('<p>', {text: title});
        const reviewerPar = $('<p>', {text: `${username}, ${date}`});
        const commentPar = $('<p>', {text: comment});
        const commentDiv = $('<div>', {class: 'comment'});
        const likeButton = $('<button>', {class: 'like-button', text: 'Like'});
        const dislikeButton = $('<button>', {class: 'dislike-button', text: 'Dislike'});
        commentDiv.append(titlePar).append(reviewerPar).append(commentPar).append(likeButton).append(dislikeButton);
        const listItem = $('<li>');
        listItem.append(commentDiv);
        commentSection.append(listItem);

        // cool animation idea from:
        // https://stackoverflow.com/a/21353858
        commentSection.animate({
            scrollTop: commentSection.prop('scrollHeight')
          }, 1000);

        // Ajax call
        const requestConfig = {
            type: 'POST',
            url: window.location.href,
            data: {reviewer: username, title: title, comment: comment, date: date}
        }
        $.ajax(requestConfig).then((res) => {
            console.log(res._id);
            commentDiv.attr('comment-id', res._id);
        });

        // Clear inputs
        titleInput.val('');
        commentTextArea.val('');

    });

    likeButton.click(function(e) {
        e.preventDefault();

        const commentId = $(e.target).parent().attr('comment-id');
    });
})(window.jQuery);