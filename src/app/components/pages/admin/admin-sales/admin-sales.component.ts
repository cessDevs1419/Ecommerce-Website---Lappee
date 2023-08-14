import { Component, ViewChild } from '@angular/core';
import { CircleProgressComponent } from 'ng-circle-progress';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.component.html',
  styleUrls: ['./admin-sales.component.css']
})
export class AdminSalesComponent {

  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;
  
  outerData: number = 300;
  innerData: number = 100;
  
  secondouterData: number = 500;
  secondinnerData: number = 200;
  
  lineChartData: { label: string, value: number }[] = [
    { label: 'January', value: 50 },
    { label: 'February', value: 30 },
    { label: 'March', value: 60 },
    { label: 'April', value: 70 },
    { label: 'January', value: 50 },
    { label: 'February', value: 30 },
    { label: 'March', value: 60 },
    { label: 'April', value: 70 }
  ];
  
  outerDataOptions = {
    percent: (this.innerData / this.outerData) * 100,
    radius: 60,
    outerStrokeWidth: 12,
    innerStrokeWidth: 12,
    space: -12,
    outerStrokeColor: "#4882c2",
    innerStrokeColor: "#3C3C3C",
    showBackground: false,
    title: 'UI',
    animateTitle: false,
    clockwise: false,
    showUnits: false,
    showTitle:false,
    showSubtitle:false,
    animationDuration: 1000,
    startFromZero: false,
    outerStrokeGradient: true,
    outerStrokeGradientStopColor: '#53a9ff',
    lazy: true,
    subtitleFormat: (percent: number): string => {
      return `${percent}%`;
    }
  }
  
  innerDataOptions = {
    percent: (this.secondinnerData / this.secondouterData) * 100,
    radius: 37,
    outerStrokeWidth: 12,
    innerStrokeWidth: 12,
    space: -12,
    outerStrokeColor: "#58AFFF",
    innerStrokeColor: "#3C3C3C",
    showBackground: false,
    title: 'UI',
    animateTitle: false,
    clockwise: false,
    showUnits: false,
    showTitle:false,
    showSubtitle:false,
    animationDuration: 1000,
    startFromZero: false,
    outerStrokeGradient: true,
    outerStrokeGradientStopColor: '#00F0FF',
    lazy: true,
    subtitleFormat: (percent: number): string => {
      return `${percent}%`;
    }
  }
}
