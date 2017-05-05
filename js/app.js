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
            var request = '<div style="margin-top:2px;float:right;width:80%;text-align:right;margin-right:10px;">' + $(this).val() + '</div>';
            $(this).val();
            var response = '<div style="margin-top:2px;float:left;width:80%;text-align:left;margin-left:10px;"> You tell me</div>';

            $('.chatbox-response').append(request);
            $('.chatbox-response').append(response)
        }
    })
})