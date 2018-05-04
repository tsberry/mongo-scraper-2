$(function () {
    $("#scrape-button").on("click", function () {
        $.ajax("/scrape", {type: "GET"}).then(function (data) {
            location.reload();
        })
    });

    $(".comment-form").submit(function (event) {
        event.preventDefault();
        var id = $(this).data("id");
        var text = $(this).find(".comment-text").val();
        $.ajax("/comments", {type: "POST", data: {id: id, text: text}}).then(function () {
            location.reload();
        })
    });
});