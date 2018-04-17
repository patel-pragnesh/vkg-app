var ctx = document.getElementById('myChart');
ctx.height = 50;
// var data = {
//     labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
//     datasets: [{ 
//         data: [86,114,106,106,107,111,133,221,783,2478],
//         label: "Africa",
//         borderColor: "#3e95cd",
//         fill: false
//       }, 
      // { 
      //   data: [282,350,411,502,635,809,947,1402,3700,5267],
      //   label: "Asia",
      //   borderColor: "#8e5ea2",
      //   fill: false
      // }, { 
      //   data: [168,170,178,190,203,276,408,547,675,734],
      //   label: "Europe",
      //   borderColor: "#3cba9f",
      //   fill: false
      // }, { 
      //   data: [40,20,10,16,24,38,74,167,508,784],
      //   label: "Latin America",
      //   borderColor: "#e8c3b9",
      //   fill: false
      // }, { 
      //   data: [6,3,2,2,7,26,82,172,312,433],
      //   label: "North America",
      //   borderColor: "#c45850",
      //   fill: false
      // }
  //   ]
  // }
// var options = {
//         scales: {
//             yAxes: [{
//                 stacked: true
//             }]
//         }
//     }

// var data= {
//     datasets: [{
//       type: 'line',
//       label: 'Predicted',
//       data: [{
//                 x: -12,
//                 y: 70
//             }, {
//                 x: 15,
//                 y: 35
//             }],
//       fill: false,
//       backgroundColor: "rgba(218,83,79, .7)",
//       borderColor: "rgba(218,83,79, .7)",
//       // pointRadius: 0
//     }, {
//       type: 'line',
//       label: 'Real',
//       data: [{
//                 x: -5,
//                 y: 40
//             },
//             {
//                 x: 25,
//                 y: 10
//             }],
//         fill: false,
//       backgroundColor: "rgba(76,78,80, .7)",
//       borderColor: "rgba(76,78,80, .7)"
//     }]
//   };
// var options= {
//     responsive: true,
//     scales: {
//       xAxes: [{
//         type: 'time',
//         distribution:'linear',
//         position: 'bottom',
//         time:{
//             format: 'YYYY. MM. DD. HH:ss',
//             //unit: 'hour'
//         }
//         // ticks: {
//         //   autoSkip: true,
//         //   min: moment("2000. 01. 01. 01:00", "YYYY. MM. DD. HH:ss"),
//         //   max: moment("2000. 02. 01. 01:00", "YYYY. MM. DD. HH:ss")
//         //   //min: -13,
//         //   //max: 30//Math.max(...makeLabels().arr)
//         // }
//       }],
//       yAxes: [{
//             ticks: {
//                 beginAtZero: true
//             }
//         }]
//     }
//   };

// var myLineChart = new Chart(ctx, {
    // type: 'line',
    // data: chart_data,
    // options: options
// });



function newDate(days) {
    return moment().add(days, 'd').toDate();
}

function newDateString(days) {
    return moment().add(days, 'd').format();
}

var color = Chart.helpers.color;
var config = {
    type: 'line',
    data: {
        // datasets: [{
        //     label: 'Dataset with string point data',
        //     backgroundColor: "rgba(76,78,80, .7)",
        //     borderColor: "rgba(76,78,80, .7)",
        //     fill: false,
        //     data: [{
        //         x: newDateString(0),
        //         y: 1
        //     }, {
        //         x: newDateString(2),
        //         y: 2
        //     }, {
        //         x: newDateString(4),
        //         y: 3
        //     }, {
        //         x: newDateString(5),
        //         y: 4
        //     }],
        // }, {
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
        // }]
    },
    options: {
        responsive: true,
        title: {
            display: false,
            text: 'Vízhozam idősor'
        },
        legend:{
          display: false,
        },
        scales: {
            xAxes: [{
                type: 'time',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Időpont'
                },
                time: {
                  parser: 'YYYY-MM-DD HH:mm:ss',
                  unit: 'day',
                  // unit:'hour',
                  displayFormats: {
                     year: 'YYYY',
                     day: 'MM. DD.',
                     // hour: 'YYYY. MM. DD. HH:mm',
                     hour: 'HH:mm',
                     quarter: 'MMM YYYY'
                  },
                  // min: '2017-10-02 18:43:53',
                  // max: '2017-10-09 18:43:53'
                },
                ticks: {
                    major: {
                        fontStyle: 'bold',
                        fontColor: '#FF0000'
                    }
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Vízhozam (m3/s)'
                }
            }]
        }
    }
};

var myLineChart = new Chart(ctx, config);

        // window.onload = function() {
        //     var ctx = document.getElementById('canvas').getContext('2d');
        //     window.myLine = new Chart(ctx, config);
        // };

        // document.getElementById('randomizeData').addEventListener('click', function() {
        //     config.data.datasets.forEach(function(dataset) {
        //         dataset.data.forEach(function(dataObj) {
        //             dataObj.y = randomScalingFactor();
        //         });
        //     });

        //     window.myLine.update();
        // });

        // // TODO : fix issue with addData
        // // See https://github.com/chartjs/Chart.js/issues/5197
        // // The Add Data button for this sample has no effect.
        // // An error is logged in the console.
        // document.getElementById('addData').addEventListener('click', function() {
        //     if (config.data.datasets.length > 0) {
        //         var numTicks = window.myLine.scales['x-axis-0'].ticksAsTimestamps.length;
        //         var lastTime = numTicks ? moment(window.myLine.scales['x-axis-0'].ticksAsTimestamps[numTicks - 1]) : moment();

        //         var newTime = lastTime
        //             .clone()
        //             .add(1, 'day')
        //             .format('MM/DD/YYYY HH:mm');

        //         for (var index = 0; index < config.data.datasets.length; ++index) {
        //             config.data.datasets[index].data.push({
        //                 x: newTime,
        //                 y: randomScalingFactor()
        //             });
        //         }

        //         window.myLine.update();
        //     }
        // });

        // document.getElementById('removeData').addEventListener('click', function() {
        //     config.data.datasets.forEach(function(dataset) {
        //         dataset.data.pop();
        //     });

        //     window.myLine.update();
        // });
    