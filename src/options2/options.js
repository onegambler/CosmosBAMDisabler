$(document).ready(function () {
    var i = 1;
    $("#add_row").click(function () {
        $('#opt' + i).html(
            "<td>" + (i + 1) + "</td>" +
            "<td><input name='name" + i + "' type='text' placeholder='Name' class='form-control input-md' /> </td>" +
            "<td><input name='url" + i + "' type='text' placeholder='Rule Url' class='form-control input-md'></td>" +
            "<td><input  name='selector" + i + "' type='text' placeholder='Mobile' class='form-control input-md'></td>" +
            "<td><input  name='disable" + i + "' type='checkbox'</td>" +
            "<td><input  name='color" + i + "' type='checkbox'</td>");

        $('#optionsTable').append('<tr id="opt' + (i + 1) + '"></tr>');
        i++;
    });
    $("#delete_row").click(function () {
        if (i > 1) {
            $("#opt" + (i - 1)).html('');
            i--;
        }
    });

});