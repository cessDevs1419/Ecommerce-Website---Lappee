import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  @Input() data: Observable<any[]>;
  @Input() colors: string[] = [];

  bgColor: string = 'table-bg-dark';
  fontColor: string = 'font-grey';
  titleColor: string = 'font-grey';
  itemColor: string = 'font-grey';
  subitemColor: string = 'sub-font-grey';

  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [],
      label: 'My Chart Label', 
      backgroundColor: []  },
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
  };
  public doughnutChartColors: any[] = [{}];


  ngOnInit() {
    this.data.subscribe((dataItems: any[]) => {
      if (dataItems && dataItems.length > 0) {
        const values = dataItems.slice(0, 5).map((item) => item.percent);

        this.doughnutChartDatasets[0].data = values;
        this.doughnutChartDatasets[0].backgroundColor = this.colors;  
      }
    });
  }
}
