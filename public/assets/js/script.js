$(function () {
    $("#scrape-button").on("click", function () {
        $.ajax("/scrape", {type: "GET"}).then(function (data) {
            location.reload();
        })
    });

    $("#delete-button").on("click", function () {
        $.ajax("/delete", {type: "DELETE"}).then(function (data) {
            location.reload();
        })
    });

    $(".pin-button").on("click", function () {
        $.ajax(`/pinned/${$(this).data("id")}`, {type: "PUT"})
        .then(function (data) {
            location.reload();
        })
    });

    $(".comment-form").submit(function (event) {
        event.preventDefault();
        var id = $(this).data("id");
        var text = $(this).find(".comment-text").val();
        $(this).find(".comment-text").val("");
        $.ajax("/comments", {type: "POST", data: {id: id, text: text}}).then(function (data) {
            reloadComments(id, data);
        });
    });
});

function reloadComments(id, data) {
    console.log(data);
    var commentsDiv = $(`#${id}-comments`);
    commentsDiv.empty();
    for(var i = 0; i < data.comments.length; i++) {
        var comment = $("<div class='well'>");
        comment.text(data.comments[i].text);
        commentsDiv.append(comment);
    }
}