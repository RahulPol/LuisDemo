$(function () {
    console.log('How are you?');
    window.count = 1;
    console.log('distinctTreeLevelName...', window.ReportData);

    $('#chatIcon').on('click',function(){
        $('.Chatbox').toggle('slide', { direction: 'right' }, 500 );
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

    var parseFilter = function (en) {
        var response = {
            "query": "filter report for MGNL Balance Type",
            "topScoringIntent": {
                "intent": "ModifyReport",
                "score": 1.0
            },
            "intents": [{
                    "intent": "ModifyReport",
                    "score": 1.0
                },
                {
                    "intent": "None",
                    "score": 0.009853389
                },
                {
                    "intent": "GetDataLineage",
                    "score": 0.004855418
                }
            ],
            "entities": [{
                    "entity": "mgnl",
                    "type": "ModificatoinValue",
                    "startIndex": 18,
                    "endIndex": 21,
                    "score": 0.9430733
                },
                {
                    "entity": "balance type",
                    "type": "ReportParam",
                    "startIndex": 23,
                    "endIndex": 34,
                    "score": 0.999162
                }
            ]
        };
    }


    $('#chatArea').keypress(function (e) {
        if (e.keyCode == 13) {
            var request = '<div class="Request" style=""> <span>' + $(this).val() + '</div>';
            var api = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1e6344a7-1a3c-45b5-975b-20ed1b156638?subscription-key=bad5fac60ddd4cd89170ba2cadb66e59&verbose=true&timezoneOffset=0&q=";

            $.ajax({
                url: api + $(this).val(),
                method: 'GET',
                beforeSend: function () {
                }
            }).done(function (response) {
                $('.chatbox-response').append(request);
                $(this).val('');
                console.log('response',response);
                switch (response.intents[0].intent) {
                    case 'GetDataLineage':
                        parseLineage(response.entities);
                        break;

                    case 'ModifyReport':
                        break;

                    case 'None':
                        break;
                }

            })
            $('.chatbox-response').append(request);
            $(this).val('');

            // var response = {
            //     entities: [{
            //         "entity": "fx rate",
            //         "type": "ReportParam",
            //         "startIndex": 20,
            //         "endIndex": 26,
            //         "score": 0.967157543
            //     }]
            // }


            //parseLineage(response.entities);

        }
    })
})