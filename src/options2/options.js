$(function () {
    $("td").click(function () {

        var firstChild = $(this).children().first();
        if ($(this).children().length === 0) {
            var OriginalContent = $(this).text();

            $(this).addClass("cellEditing");
            $(this).html("<input class='form-control' type='text' value='" + OriginalContent + "' />");
            $(this).children().first().focus();

            $(this).children().first().keypress(function (e) {
                if (e.which == 13 || e.wich == 27) {
                    var newContent = $(this).val();
                    $(this).parent().text(newContent);
                    $(this).parent().removeClass("cellEditing");
                }
            });
            $(this).children().first().focusout(function () {
                var newContent = $(this).val();
                $(this).parent().text(newContent);
                $(this).parent().removeClass("cellEditing");
            });


            $(this).children().first().blur(function () {
                $(this).parent().text(OriginalContent);
                $(this).parent().removeClass("cellEditing");
            });
        }
    });
});