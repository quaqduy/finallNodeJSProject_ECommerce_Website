const width_threshold = 480;

var lineChart;
var pieChart;

function drawLineChart() {
  if ($("#lineChart").length) {
    var ctxLine = document.getElementById("lineChart").getContext("2d");

    var optionsLine = {
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Month",
              fontColor: "white" // Change label color to white
            },
            ticks: {
              fontColor: "white" // Change tick color to white
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Value",
              fontColor: "white" // Change label color to white
            },
            ticks: {
              fontColor: "white" // Change tick color to white
            }
          }
        ]
      },
      legend: {
        labels: {
          fontColor: "white" // Change legend label color to white
        }
      }
    }

    lineChart = new Chart(ctxLine, configLine);
  }
}

function drawPieChart() {
  if ($("#pieChart").length) {
    console.log("Pie chart element found");
    var chartHeight = 300;

    $("#pieChartContainer").css("height", chartHeight + "px");

    var ctxPie = document.getElementById("pieChart").getContext("2d");

    var optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
      legend: {
        position: "top"
      }
    };

    var configPie = {
      type: "pie",
      data: {
        datasets: [
          {
            data: [10, 7, 3],
            backgroundColor: ["#F7604D", "#4ED6B8", "#A8D582"],
            label: "Storage"
          }
        ],
        labels: [
          "Phones (Units)",
          "PC (Units)",
          "Laptop (Units)"
        ]
      },
      options: optionsPie
    };

    pieChart = new Chart(ctxPie, configPie);
    console.log("Pie chart drawn");
  } else {
    console.log("Pie chart element not found");
  }
}

function updateLineChart() {
  if (lineChart) {
    lineChart.options = optionsLine;
    lineChart.update();
  }
}

function updatePieChart() {
  if (pieChart) {
    pieChart.options = optionsPie;
    pieChart.update();
  }
}

// Call the drawLineChart function and updateMiniBlocks when the document is ready
$(document).ready(function() {
  drawLineChart();
});
