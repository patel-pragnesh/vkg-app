var ctx = document.getElementById('testChart');
ctx.height = 50;

function newDate(days) {
    return moment().add(days, 'd').toDate();
}

function newDateString(days) {
    return moment().add(days, 'd').format();
}

// var color = Chart.helpers.color;
var config = {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Dataset with string point data',
            backgroundColor: "rgba(76,78,80, .7)",
            borderColor: "rgba(76,78,80, .7)",
            //fill: false,
            data: [{
                x: '1',
                y: 1
            }, {
                x: '2',
                y: 2
            }, {
                x: '3',
                y: 3
            }, {
                x: '4',
                y: 4
            }],
            //borderColor: "rgba(220,220,220,1)",
            //backgroundColor: "rgba(220,220,220,0.2)",
            pointBorderColor: "rgba(220,220,220,1)",
            pointBackgroundColor: "rgba(220,220,220,1)",
            pointBorderWidth: "1",
            showLine: true
        }, 
        // {
        //     label: 'Dataset with date object point data',
        //     backgroundColor: "rgba(76,78,80, .7)",
        //     borderColor: "rgba(76,78,80, .7)",
        //     fill: false,
        //     data: [{
        //         x: newDate(0),
        //         y: 5
        //     }, {
        //         x: newDate(2),
        //         y: 5
        //     }, {
        //         x: newDate(4),
        //         y: 6
        //     }, {
        //         x: newDate(5),
        //         y: 7
        //     }]
        // }
    ]
    },
    options: {
        responsive: true,
        // title:{
        //     display:true,
        //     text:"Chart.js Time Point Data"
        // },
        // scales: {
        //     xAxes: [{
        //         //ticks:{autoSkip: false},
        //         //stacked: true,
        //         type: "linear",
        //         display: true,
        //         // time: {
        //         //   parser: 'YYYY-MM-DD HH:mm:ss',
        //         //   unit: 'hour',
        //         //   // unit:'hour',
        //         //   displayFormats: {
        //         //      year: 'YYYY',
        //         //      day: 'DD',
        //         //      hour: 'YYYY. MM. DD. HH:mm',
        //         //      quarter: 'MMM YYYY'
        //         //   },
        //         //   // min: '2017-10-02 18:43:53',
        //         //   // max: '2017-10-09 18:43:53'
        //         // },
        //         scaleLabel: {
        //             display: true,
        //             labelString: 'Date'
        //         }
        //     }],
        //     yAxes: [{
        //         display: true,
        //         scaleLabel: {
        //             display: true,
        //             labelString: 'value'
        //         }
        //     }]
        // }
    }
    // options: {
    //     responsive: true,
    //     title: {
    //         display: true,
    //         text: 'Vízhozam idősor'
    //     },
    //     scales: {
    //         xAxes: [{
    //             type: 'time',
    //             display: true,
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Időpont'
    //             },
    //             // time: {
    //             //     unit: 'hour'
    //             // },
    //             ticks: {
    //                 major: {
    //                     fontStyle: 'bold',
    //                     fontColor: '#FF0000'
    //                 }
    //             }
    //         }],
    //         yAxes: [{
    //             display: true,
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Vízhozam (m3/s)'
    //             }
    //         }]
    //     }
    // }
};

var myLineChart = new Chart(ctx, config);

console.log(newDateString(0));