$(document).ready(function () {		
	moment.locale('hu');	
	var format = 'YYYY. MM. DD.';
	var today = moment().format(format);
	var yesterday = moment().subtract(1, 'days').format(format);
	var last7day = moment().subtract(7, 'days').format(format);
	var last30day = moment().subtract(30, 'days').format(format);
	var thisMonthFirstDay = moment().startOf('month').format(format);
	var thisMonthLastDay = moment().endOf('month').format(format);
	var lastMonthFirstDay = moment().subtract(1, 'month').startOf('month').format(format);
	var lastMonthLastDay = moment().subtract(1, 'month').endOf('month').format(format);
	var tmpStart = '2215. 01. 01.';
	var tmpEnd = '2215. 01. 31.'

	dateStart = tmpStart;
	dateEnd = tmpEnd;
	$('input[name="datetimeselect"]').daterangepicker({
		"timePicker24Hour": true,
		"ranges": {
	        "Ma": [
	            today,
	            today
	        ],
	        "Tegnap": [
	            yesterday,
	            yesterday
	        ],
	        "Elmúlt 7 nap": [
	            last7day,
	            today
	        ],
	        "Elmúlt 30 nap": [
	            last30day,
	            today
	        ],
	        "Ez a hónap": [
	            thisMonthFirstDay,
	            thisMonthLastDay
	        ],
	        "Múlt hónap": [
	            lastMonthFirstDay,
	            lastMonthLastDay
	        ]
	    },
	    "locale": {
	        "direction": "ltr",
	        "format": "YYYY. MM. DD.",
	        "separator": " - ",
	        "applyLabel": "Ok",
	        "cancelLabel": "Mégse",
	        "fromLabel": "Tól",
	        "toLabel": "Ig",
	        "customRangeLabel": "Egyedi",
	        "daysOfWeek": [
	            "V",
	            "H",
	            "K",
	            "Sze",
	            "Cs",
	            "P",
	            "Szo"
	        ],
	        "monthNames": [
	            "Január",
	            "Február",
	            "Március",
	            "Április",
	            "Május",
	            "Június",
	            "Július",
	            "Augusztus",
	            "Szeptember",
	            "Október",
	            "November",
	            "December"
	        ],
	        "firstDay": 1
	    },
	    "startDate": tmpStart,//thisMonthFirstDay,
	    "endDate": tmpEnd,//thisMonthLastDay,
	    "opens": "center",
	    "buttonClasses": "btn",
	    "applyClass": "btn btn-primary"
	}, function(start, end, label) {
		dateStart = start.format('YYYY. MM. DD.');
		dateEnd = end.format('YYYY. MM. DD.');
	  //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
	  //getData(dateStart, dateEnd);
	});

	$('#profile').change(function(){
		//getData(dateStart, dateEnd);
	});

	$( ".profile-button" ).each(function(index) {
	    $(this).on("click", function(){
	    	$('select[name=profile]').val($(this).attr('value'));
	    	//getData(dateStart, dateEnd);
	    });
	});

	$(".get-data-button").on("click", function(){
		console.log('Downloading data from server...');
		getData(dateStart, dateEnd);
	});

	getData(dateStart, dateEnd);
});