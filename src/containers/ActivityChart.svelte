<script lang="ts">
  import type { ChartConfiguration, ChartData } from 'chart.js';
  import { Chart, registerables } from 'chart.js';
  import { dayWithMonth } from '../helpers';
  import { activityHistory } from '../stores/activity-history';


  let chartCanvas: HTMLCanvasElement;
  let activityChartContainer: HTMLDivElement;
  let chart: Chart | undefined;

  function initChart() {
    // debugger;
    if (chartCanvas) {
      Chart.register(...registerables);
      
      const data: ChartData = {
        labels: $activityHistory.histories.map((day) => dayWithMonth(day.date)),
        datasets: [
          {
            label: 'Activity',
            data: Object.values($activityHistory.histories).map(
              (day) => day.score.h,
            ),
            fill: true,
            // backgroundColor: 'rgba(75,192,192,0.2)',
            // borderColor: 'rgba(75,192,192,1)',
            // tension: 2,
          },
        ],
      };

      const options: ChartConfiguration['options'] = {
        backgroundColor: 'black',
        color: 'black',
        
        // legend: {
        //         labels: {
        //             fontColor: "blue",
        //             fontSize: 18
        //         }
        //     },
        elements: {
          bar: {
            borderWidth: 0
          },
          line: {
            borderWidth: 2,
            stepped: false
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            // labels: {
              // color: 'black'
            // },
            display: false,
          },
        },
        scales: {
          y: {
            // color: 'black',
            min: 0,
            max:  Math.max(...Object.values($activityHistory.histories).map(
              (day) => day.score.h,
            )),
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return `${value.toString()}h`;
              },
              color: 'black'
            },
          },
          x: {
            grid: {
              // drawTicks: false,
              // drawOnChartArea: false,
              display: false
            },
            ticks: {
              color: 'black'
            }
          }
        },
      };

      chart = new Chart(chartCanvas, {
        type: 'bar',
        data,
        options,
      });
    }
  }

  $: {
    if (!chart && $activityHistory.histories.length > 0) {
      console.log('init chart');
      initChart();
    }

    if(chart && $activityHistory.histories.length > 0) {
      console.log('it should update the chart')
      chart?.update();
    }
  }

</script>

<div class="activity-chart" >
  <canvas id="activity-chart" width="100%" height="100%" bind:this={chartCanvas}></canvas>
</div>

<style lang="scss">
  .activity-chart {
    height: 100%;
    // width: 100%;

    #activity-chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
