var ctx = document.getElementById('myChart');
ctx.height = 50;

function newDate(days) {
    return moment().add(days, 'd').toDate();
}

function newDateString(days) {
    return moment().add(days, 'd').format();
}

//console.log(actDataTpye);

if(actDataTpye == 0){
    var chartType= 'line';
    var yAxesLabel = 'Vízhozam (m3/s)';
    var xAxesLabel = 'Időpont';
    var xAxesSettings = [{
        type: 'time',
        display: true,
        scaleLabel: {
            display: true,
            labelString: xAxesLabel
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
    }];
}else if(actDataTpye == 1){
    var chartType= 'line';
    var yAxesLabel = 'Vízszint (m)';
    var xAxesLabel = 'Időpont';
    var xAxesSettings = [{
        type: 'time',
        display: true,
        scaleLabel: {
            display: true,
            labelString: xAxesLabel
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
    }];
}else if(actDataTpye == 2){
    var chartType='scatter';
    var yAxesLabel = 'Vízszint (m)';
    var xAxesLabel = 'Szelvény (m)';
    var xAxesSettings = [{
        display: true,
        scaleLabel: {
            display: true,
            labelString: xAxesLabel
        },
        ticks:{
            stepSize: 5000
        }
    }];
}else if(actDataTpye == 3){
    var chartType= 'scatter';
    var yAxesLabel = 'Vízhozam (m3/s)';
    var xAxesLabel = 'Szelvény (m)';
    var xAxesSettings = [{
        display: true,
        scaleLabel: {
            display: true,
            labelString: xAxesLabel
        },
        ticks:{
            stepSize: 5000
        }
    }];
}else if(actDataTpye == 4){
    var chartType= 'line';
    var yAxesLabel = 'Vízkészlet (m3)';
    var xAxesLabel = 'Időpont';
    var xAxesSettings = [{
        type: 'time',
        display: true,
        scaleLabel: {
            display: true,
            labelString: xAxesLabel
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
    }];
}

var color = Chart.helpers.color;
var config = {
    type: chartType,
    data: {        
    },
    options: {
        responsive: true,
        title: {
            display: false,
            text: ''
        },
        legend:{
          display: false,
        },
        scales: {
            xAxes: xAxesSettings,
            yAxes: [{
                type: 'linear',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: yAxesLabel
                }
                
            }]
        }
    }
};

var myLineChart = new Chart(ctx, config);
    