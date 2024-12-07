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
    };

    var configLine = {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
          {
            label: "Revenue (millions)",
            data: [65, 59, 80, 81, 56, 55, 40, 33, 44, 19, 38, 46],
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
            cubicInterpolationMode: "monotone",
            pointRadius: 0
          },
          {
            label: "Profit (millions)",
            data: [33, 45, 37, 21, 55, 74, 69, 33, 44, 19, 38, 46],
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            cubicInterpolationMode: "monotone",
            pointRadius: 0
          },
          {
            label: "Number of orders (single unit)",
            data: [44, 19, 38, 46, 85, 66, 79, 33, 44, 19, 38, 46],
            fill: false,
            borderColor: "rgba(153, 102, 255, 1)",
            cubicInterpolationMode: "monotone",
            pointRadius: 0
          }
        ]
      },
      options: optionsLine
    };

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
            data: [18.24, 6.5, 9.15],
            backgroundColor: ["#F7604D", "#4ED6B8", "#A8D582"],
            label: "Storage"
          }
        ],
        labels: [
          "Used Storage (18.240GB)",
          "System Storage (6.500GB)",
          "Available Storage (9.150GB)"
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
