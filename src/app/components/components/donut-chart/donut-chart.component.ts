import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  public chartLabels: Label[] = ['Pending Orders', 'Complete Orders'];
  public chartData: MultiDataSet = [
    [60, 40], 
    [0, 0], 
    [60, 40]   
  ];
  public chartType: ChartType = 'doughnut';

  public chartColors: any[] = [
    {
      backgroundColor: ['#1C92FF', '#3C3C3C'],
      hoverBackgroundColor: ['#1C92FF', '#3C3C3C'],
      borderWidth: [0, 0],
      hoverBorderColor: ['#1C92FF', '#3C3C3C'],
      hoverBorderWidth: [0, 0]
    },
    {
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderWidth: [0, 0],
      hoverBorderColor: [],
      hoverBorderWidth: [0, 0]
    },
    {
      backgroundColor: ['#00F0FF', '#3C3C3C'],
      hoverBackgroundColor: ['#00F0FF', '#3C3C3C'],
      borderWidth: [0, 0],
      hoverBorderColor: ['#00F0FF', '#3C3C3C'],
      hoverBorderWidth: [0, 0]
    }
  ];

  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 30, 
    elements: {
      arc: {
        borderRadius: 10 
      }
    },
    plugins: {
      tooltip: {
        enabled: false 
      },
      legend: {
        display: false
      }
    }
  };

  
  
}
