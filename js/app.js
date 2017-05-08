$(function () {
    console.log('How are you?');
    window.count = 1;
    console.log('distinctTreeLevelName...', window.ReportData);

    $('#chatIcon').on('click', function () {
        $('.Chatbox').toggle('slide', {
            direction: 'right'
        }, 500);
    });


    $('#cashBalanceReport').dataTable({
        data: window.ReportData,
        columns: window.columns,
        "scrollY": $('.Report').height() - 100,
        "scrollCollapse": true,
        "paging": false,
        "bFilter": false
    });


    var parseLineage = function (entities) {
        var result = '',
            elem = 'chart' + window.count,
            chartData;
        window.count++;

        result = '<div class="Response"><div class="dependency" style="height:20%;width:100%"  >\
                                <div class="sankey box box-default">\
                                    <div class="box-body">\
                                        <div id=' + elem + '>\
                                        </div>\
                                        <table class="sankeyTable" style="width:100%; margin-top:13px;">\
                                        </table>\
                                    </div>\
                                </div>\
                            </div>';
        if (entities[0].type == 'ReportParam') { //got the report param
            if (entities[0].entity == 'fx rate') {
                chartData = window.FxRateMapping;
            } else {

            }
            $('.chatbox-response').append(result);
            elem = '#' + elem;
            getChart(chartData, elem);
        } else { //report param is not available
            $('.chatbox-response').append('No lineage exist for given column.')
        }
    }

    var parseFilter = function (entities) {
        var pred = '',
            value;

        entities.forEach(function (d) {
            if (d.type == 'ReportParam') {                
                pred = d.entity == 'price' ?  'Price': d.entity;
                
            }

            if (d.type == 'builtin.datetime.date' && d.resolution.hasOwnProperty('date')) {
                value = d.resolution.date;
            } else if (d.type == 'builtin.number' && d.resolution.hasOwnProperty('value')) {
                value = d.resolution.value;
            }

        })

        $('#cashBalanceReport').dataTable().fnClearTable();

        console.log(entities, pred, value)
        var myData2 = [];

        window.SourceData.forEach(function (d) {            
            if (d["Curr " + pred] > value) {                
                myData2.push([d.CurrAsOfDate, d['Security Description'], d['Balance Type'],
                    d['Curr Quantity'], d['Curr Price'], d['FxRate'], d['Curr MV'], d['Curr House Req.']
                ]);
            }
        })
        console.log(entities, pred, value, myData2);
        $('#cashBalanceReport').dataTable().fnAddData(myData2);




    }


    $('#chatArea').keypress(function (e) {
        if (e.keyCode == 13) {
            var request = '<div class="Request" style=""> <span>' + $(this).val() + '</div>';
            var api = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1e6344a7-1a3c-45b5-975b-20ed1b156638?subscription-key=bad5fac60ddd4cd89170ba2cadb66e59&verbose=true&timezoneOffset=0&q=";

            $('.chatbox-response').append(request);
            $.ajax({
                url: api + $(this).val(),
                method: 'GET',
                beforeSend: function () {}
            }).done(function (response) {

                $(this).val('');
                console.log('response', response);
                switch (response.intents[0].intent) {
                    case 'GetDataLineage':
                        parseLineage(response.entities);
                        break;

                    case 'ModifyReport':
                        parseFilter(response.entities);
                        break;

                    case 'Greetings':
                        $('.chatbox-response').append('<div class="Response" style=""> Hey</div>');
                        break;
                    case 'None':
                        break;
                }

            })

            $(this).val('');
        }
    })
})