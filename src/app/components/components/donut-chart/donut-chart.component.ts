import { ChangeDetectorRef, Component, Input, NgZone, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Observable } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  bgColor: string = 'table-bg-dark';
  fontColor: string = 'font-grey';
  titleColor: string = 'font-grey';
  itemColor: string = 'font-grey';
  subitemColor: string = 'sub-font-grey';

  data: any[];
  @Input() colors: string[] = [];
  @Input() title: string;
  @Input() subTitle: string;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [],
      label: 'My Chart Label', 
      borderColor: 'transparent',
      backgroundColor: [] 
    },
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,

  };
  public doughnutChartColors: any[] = [{}];

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}
  
  ngOnInit() {
   
  }

  loadData(data: any) {
    this.data = data;

    const newData: number[] = [];
    const backgroundColors: string[] = [];

    for (const item of data) {
      newData.push(item.product_sold || 0);
      backgroundColors.push(this.colors[newData.length - 1]);
    }

    // Set a default value if all values are zero
    const hasNonZeroValues = newData.some(value => value !== 0);
    if (!hasNonZeroValues) {
      newData[0] = 1; // Set a default non-zero value
      backgroundColors[0] = this.colors[0] || 'rgba(0, 0, 0, 0)'; // Use a transparent color if colors array is empty
    }
    
    this.doughnutChartDatasets[0].data = newData;
    this.doughnutChartDatasets[0].backgroundColor = backgroundColors;
    this.chart?.update();
  }
  
}
