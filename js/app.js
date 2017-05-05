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
            var request = '<div class="Request" style=""> <span>' + $(this).val() + '</div>';
            var api = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/03cfd60b-dde9-426f-b437-11c2278dd72c?subscription-key=ab3581dac63c46ac9b755d803f477fbd&verbose=true&timezoneOffset=330&spellCheck=true&q=";
            $(this).val('');

            $.ajax({
                url: api + $(this).val(),
                method: 'GET',
                beforeSend: function () {

                }
            }).done(function (response) {
                console.log('Response..', response);
            })



            var response = '<div class="Response"><span> You tell me </span></div>';



            $('.chatbox-response').append(request);
            $('.chatbox-response').append(response)
        }
    })
})