import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas: ElementRef;

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');

    const data: ChartData = {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [150, 200, 100],
          backgroundColor: ['#00F0FF', '#58AFFF', '#3C3C3C'],
          borderWidth: 0,
          weight: 2,
        },
        {
          label: 'Dataset 2',
          data: [50, 100, 75],
          backgroundColor: ['#5AB0FF', '#1A7FDD', '#3C3C3C'],
          borderWidth: 0,
          weight: 1,
        },
      ],
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
      },
      cutoutPercentage: 40,
    };

    new Chart(ctx, {
      type: 'pie',
      data: data,
      options: options,
    });
  }
}
