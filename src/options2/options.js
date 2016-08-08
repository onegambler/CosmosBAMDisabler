var i = 0;

$(document).ready(function () {

    $("#add_row").click(function () {
        addRow(i);
        i++;
    });

    $("#delete_row").click(function () {
        if (i > 1) {
            $("#opt" + (i - 1)).html('');
            i--;
        }
    });

});

function addRow(id) {
    $('#opt' + id).html(
        "<td>" + (id + 1) + "</td>" +
        "<td><input name='name" + id + "' type='text' placeholder='Name' class='form-control input-md' /> </td>" +
        "<td><input name='url" + id + "' type='text' placeholder='Rule Url' class='form-control input-md'></td>" +
        "<td><input  name='selector" + id + "' type='text' placeholder='Mobile' class='form-control input-md'></td>" +
        "<td><input  name='disable" + id + "' type='checkbox'</td>" +
        "<td><input  name='color" + id + "' type='checkbox'</td>");

    $('#optionsTable').append('<tr id="opt' + (id + 1) + '"></tr>');
}

// Saves options to chrome.storage
function saveOptions() {
    var disabledContentOptions = getDisabledContentOptionsFromTable();

    chrome.storage.sync.set({
        'disabledContent': disabledContentOptions
    }, function () {
        //TODO: mostrare che e' stato salvato 
        console.info('Options saved');
    });
}

function getDisabledContentOptionsFromTable() {
    var array = [];
    var headers = [];
    $('#optionsTable th').each(function (index, item) {
        headers[index] = $(item).attr('name');
    });
    $('#optionsTable tr').has('td').each(function () {
        var arrayItem = {};
        $('td', $(this)).each(function (index, item) {
            arrayItem[headers[index]] = getTableCellValue($(item));
        });
        array.push(arrayItem);
    });
    return array;
}

function getTableCellValue(item) {
    var child = $(":first-child", item);
    if (child.length === 0) {
        return item.text().trim();
    }

    switch (child.attr('type')) {
    case 'checkbox':
        return child.is(':checked');
    case 'text':
        return child.val();
    default:
        console.log('Impossible to correclty map input type, returning empty');
        return '';
    }
}

function restoreOptions(options) {
    chrome.storage.sync.get({
        'disabledContent': []
    }, function (options) {
        options.disabledContent.forEach(function (item) {
            i = parseInt(item['id']) - 1;
            addRow(i);
            for (var field in item) {
                var value = item[field];
                if (typeof value === 'string') {
                    $('tr input[name=' + field + i + ']').val(value);
                } else if (typeof value === 'boolean') {
                    $('tr input[name=' + field + i + ']').prop("checked", value);
                }
            }
        });
        i++;
        console.info(options);
    });
}

$("#saveOptionsButton").click(saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);