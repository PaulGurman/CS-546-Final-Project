var thisScript = document.currentScript;
(function($){
    const commentSection = $('#comment-section');
    const newCommentForm = $('#new-comment');
    const commentTextArea = $('#comment-text-area');
    const titleInput = $('#title-input');
    const missingInputMessage = $('#missing-input-message');

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

        console.log(`${game_id}, ${username}, ${title}, ${comment}, ${date}`);

        // Make content for page
        const titlePar = $('<p>', {text: title});
        const reviewerPar = $('<p>', {text: `${username}, ${date}`});
        const commentPar = $('<p>', {text: comment});
        const commentDiv = $('<div>', {class: 'comment'});
        commentDiv.append(titlePar).append(reviewerPar).append(commentPar);
        const listItem = $('<li>');
        listItem.append(commentDiv);
        commentSection.append(listItem);

        // cool animation idea from:
        // https://stackoverflow.com/a/21353858
        commentSection.animate({
            scrollTop: commentSection.prop('scrollHeight')
          }, 1000);

        // Ajax call
        $.post(window.location.href, {reviewer: username, title: title, comment: comment, date: date}, (res) => {
            // no-op
        });

        // Clear inputs
        titleInput.val('');
        commentTextArea.val('');

    });
})(window.jQuery);