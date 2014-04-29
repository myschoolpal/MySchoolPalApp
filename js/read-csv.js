function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);             
}
	var surname = [];
	var forename = [];
	var target = [];
	var initial = [];
	var result = [];
	var target_result = [];
	var initial_result = [];
	var levels_progress = {};
	var levels_target = {};
	var grade_array = ['U','G','F','E','D','C','B','A','A*','W','1C','1B','1A','2C','2B','2A','3C','3B','3A','4C','4B','4A','5C','5B','5A','6C','6B','6A','7C','7B','7A','8C','8B','8A'];
	function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
	
	for (var i = 1; i < lines.length; i++) {
		if(lines[i][0].length >0) {
			surname.push(lines[i][0]);
			forename.push(lines[i][1]);
			target.push(lines[i][2]);
			initial.push(lines[i][3]);
			result.push(lines[i][4]);
			initial_result.push(grade_array.indexOf(lines[i][4].toUpperCase())-grade_array.indexOf(lines[i][3].toUpperCase()));
			target_result.push(grade_array.indexOf(lines[i][4].toUpperCase())-grade_array.indexOf(lines[i][2].toUpperCase()));

		}
	}
	
	
	for (var i = 0; i < initial_result.length; i++) {
		if(levels_progress[initial_result[i]]){
			levels_progress[initial_result[i]]++;
		}
		else {
		levels_progress[initial_result[i]] = 1;
		}
	}
	
	for (var i = 0; i < target_result.length; i++) {
		if(levels_target[target_result[i]]){
			levels_target[target_result[i]]++;
		}
		else {
		levels_target[target_result[i]] = 1;
		}
	}
	
	drawOutput(lines);
	
	pieChart_levels();
	pieChart_target();
	
	barChart_target(lines);
	tm_1_2(lines);
	
	
}


function pieChart_levels() {


  var data = [];
   for (i=-50; i<51; i++) {
	data.push([i +' LP', levels_progress[i]]);
	}
  
  var plot1 = jQuery.jqplot ('pie_chart', [data], 
    { 
		title: 'Levels of Progress',
		  seriesDefaults: {
			renderer: jQuery.jqplot.PieRenderer, 
			rendererOptions: {
			  showDataLabels: true
			}
		  }, 
      legend: { show:true, location: 'e' }
    }
  );
  $('#lpModal').on('shown.bs.modal', function(event, ui) {
      
      plot1.replot();
	 
  });
}

function pieChart_target() {
  var data = [];
   for (i=-50; i<51; i++) {
	data.push([i +' Levels', levels_target[i]]);
	}
  
  var plot2 = jQuery.jqplot ('pie_chart_target', [data], 
    { 
		title: 'Comparison to Target',
      seriesDefaults: {
        renderer: jQuery.jqplot.PieRenderer, 
        rendererOptions: {
          showDataLabels: true
		  
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
  $('#targetModal').on('shown.bs.modal', function(event, ui) {
      
      plot2.replot();
	 console.log('abc');
  });
}





function barChart_target(lines) {
    var s1 = [];
	for (i=1; i<lines.length; i++) {
		if (lines[i][3] === undefined) {
		}
		else {
		s1.push(grade_array.indexOf(lines[i][3].toUpperCase()));
		}
	 }
	var s2 = [];
	for (i=1; i<lines.length; i++) {
		if (lines[i][4] === undefined) {
		}
		else {
		s2.push(grade_array.indexOf(lines[i][4].toUpperCase()));
		}
	 }
    var s3 = [];
	 for (i=1; i<lines.length; i++) {
		if (lines[i][2] === undefined) {
		}
		else {
		s3.push(grade_array.indexOf(lines[i][2].toUpperCase()));
		}
	 }
	
    // Can specify a custom tick Array.
    // Ticks should match up one for each y value (category) in the series.
    var ticks = [];
     for (i=1; i<lines.length; i++) {
		ticks.push([lines[i][0] + '<br>'+ lines[i][1]]);
	 }
    var plot1 = $.jqplot('barChart_target', [s1, s2, s3], {
        // The "seriesDefaults" option is an options object that will
        // be applied to all series in the chart.
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {fillToZero: true}
        },
        // Custom labels for the series are specified with the "label"
        // option on the series option.  Here a series option object
        // is specified for each series.
        series:[
            {label:'Comparison'},
            {label:'Result'},
            {label:'Target'}
        ],
        // Show the legend and put it outside the grid, but inside the
        // plot container, shrinking the grid to accomodate the legend.
        // A value of "outside" would not shrink the grid and allow
        // the legend to overflow the container.
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            // Use a category axis on the x axis and use our custom ticks.
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis: {
                pad: 1.05,
                show: false
            }
        }
    });
	$('#barChartModal').on('shown.bs.modal', function(event, ui) {
      
      plot1.replot();
	 console.log('abc');
  });
};


function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}




function drawOutput(lines){
	
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	table.className = 'table table-hover';
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < lines[i].length; j++) {
			var firstNameCell = row.insertCell(-1);
			if (i>0 && j==4) {
				if(grade_array.indexOf(lines[i][j].toUpperCase())>grade_array.indexOf(lines[i][j-2].toUpperCase())) {
				firstNameCell.className = 'above_target';
				}
				if(grade_array.indexOf(lines[i][j].toUpperCase())==grade_array.indexOf(lines[i][j-2].toUpperCase())) {
				firstNameCell.className = 'on_target';
				}
				if(grade_array.indexOf(lines[i][j].toUpperCase())==((grade_array.indexOf(lines[i][j-2].toUpperCase()))-1)) {
				firstNameCell.className = 'one_below_target';
				}
				if(grade_array.indexOf(lines[i][j].toUpperCase())<((grade_array.indexOf(lines[i][j-2].toUpperCase()))-1)) {
				firstNameCell.className = 'below_target';
				}
			}
			firstNameCell.appendChild(document.createTextNode(lines[i][j].toUpperCase()));
		}
		var levelsProgress = row.insertCell(-1);
		if (i==0) {
			levelsProgress.appendChild(document.createTextNode('Sublevels of Progress'));
		}
		else {
			if (lines[i][4]) {
				lp = grade_array.indexOf(lines[i][4].toUpperCase())-grade_array.indexOf(lines[i][3].toUpperCase())
				levelsProgress.appendChild(document.createTextNode(lp));
			}
		}
	}
	
	document.getElementById("output").appendChild(table);
}

var arr = [];
  for (var i = 0; i < 6000; i++) {
    arr[i] = [];
	}

function tm_1_2(lines) {

for (i=1; i<lines.length-1; i++) {
		if (lines[i][3]=== undefined) {
		}
		else {
		a = grade_array.indexOf(lines[i][3].toUpperCase());
		b = grade_array.indexOf(lines[i][4].toUpperCase());
		v = (a+193)*(b-7);
		console.log(a+193);
		arr[v].push(lines[i][0]+" "+lines[i][1]);
		}
	 }

n=0;
	var below_target = [0,1,2,3,19,20,21,22,23,24,25,38,39,40,41,42,43,44,57,58,59,60,61,62,63,76,77,78,79,80,81,82,83,84,85,95,96,97,98,99,100,101,102,103,104,114,115,
	116,117,118,119,120,121,122,123,133,134,135,136,137,138,139,140,141,142,143,144,145,152,153,154,155,156,157,158,159,160,161,162,163,164,171,172,173,174,175,176,177,
	178,179,180,181,182,183];
	var one_below_target = [4,5,6,26,27,28,45,46,47,64,65,66,86,87,88,105,106,107,124,125,126,146,147,148,165,166,167,184,185,186];
	var on_target = [7,8,9,29,30,31,48,49,50,67,68,69,89,90,91,108,109,110,127,128,129,149,150,151,168,169,170,187,188,189];
	var above_target = [10,11,12,13,14,15,16,17,18,32,33,34,35,36,37,51,52,53,54,55,56,70,71,72,73,74,75,92,93,94,111,112,113,130,131,132];
	document.getElementById("tm_1_2").innerHTML = "";
	var table = document.createElement("table");
	table.className = 'tm_layout';
	for (j=201; j<212; j++) {
	var row = table.insertRow(-1);
	for (i=1; i<21; i++) {
	var firstNameCell = row.insertCell(-1);
	if (j==201 && i ==1){
	firstNameCell.appendChild(document.createTextNode('Grade'));
	firstNameCell.className = 'tm_layout';
	}
	else if (j==201 && i!=1) {
	firstNameCell.appendChild(document.createTextNode(grade_array[i+7]));
	firstNameCell.className = 'tm_layout';
	}
	else {
	if (i==1) {
	firstNameCell.appendChild(document.createTextNode(grade_array[j-193]));
	firstNameCell.className = 'tm_layout';
	}
	else {
		if (arr[i*j].length >0) {
			
		newButton = document.createElement('input');
        newButton.type = 'button';
        newButton.value = arr[i*j].length + " , " + arr[i*j].length*100/(lines.length-2)+'%' ;
        newButton.id = "tooltip";
		newButton.rel = "tooltip";
		newButton.toggle = "tooltip";
		
		newButton.title = arr[i*j];
		newButton.className = "tm_button";
		  firstNameCell.appendChild(newButton);
			

		}
		if(below_target.indexOf(n)!= -1) {
		firstNameCell.className = 'below_target tm_layout';
		}
		else if(one_below_target.indexOf(n)!= -1) {
		firstNameCell.className = 'one_below_target tm_layout';
		}
		else if(on_target.indexOf(n)!= -1) {
		firstNameCell.className = 'on_target tm_layout';
		}
		else if(above_target.indexOf(n)!= -1) {
		firstNameCell.className = 'above_target tm_layout';
		}
		n++;
	}
	}
	}
	}
	
	document.getElementById("tm_1_2").appendChild(table);
	
	}
	
	$('body').tooltip({
	
    selector: '[id=tooltip]'
	});