$(function () {
    console.log('How are you?');

    console.log('distinctTreeLevelName...', window.ReportData);


    $('#cashBalanceReport').dataTable({
        data: window.ReportData,
        columns: [
            { title: 'DataType' },
            { title: 'Party' },
            { title: 'FxRate' },
            { title: 'VIP' },
            { title: 'Fund 6-A' },
            { title: '[VIP (Offshore)]' },
            { title: 'VCP' },
            { title: 'Skyway Master' }
        ],
        "scrollY": $('.Report').height() - 100,
        "scrollCollapse": true,
        "paging": false
    });

    $('#chatArea').keypress(function (e) {
        if (e.keyCode == 13) {
            var message = '<div style="border:1px solid black;margin-top:2px;">' + $(this).val() + '</div>';

            $(this).val('');
            $(this).focus();

            $('.chatbox-response').append(message)
        }
    })
})