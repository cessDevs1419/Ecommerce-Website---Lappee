import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';
import { Observable, of } from 'rxjs';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number
  ) {}
}

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.component.html',
  styleUrls: ['./admin-sales.component.css']
})
export class AdminSalesComponent {

  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;
  @ViewChild('selectBox', { static: true }) selectBox: ElementRef;
  
  products$: Observable<Product[]>;
  
  constructor(
		private router: Router
	) {}
	
  ngOnInit() {
    // Create an observable of Product data
    this.products$ = of([
      new Product(1, 'Product A', 10.99),
      new Product(2, 'Product B', 19.99),
      new Product(3, 'Product C', 5.99),
    ]);

    
  }
  
  bgColor: string = 'table-bg-dark';
  fontColor: string = 'font-grey';
  titleColor: string = 'font-grey';
  itemColor: string = 'font-grey';
  subitemColor: string = 'sub-font-grey';
  
  outerColor: string = '#1C92FF'
  innerColor: string = '#094175'
  outerData: number = 300;
  innerData: number = 100;
  total: number = this.outerData + this.innerData
  percent: number = (this.outerData  / this.total) * 100;
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
  
  outerDataOptions: CircleProgressOptions = {
    title: `${this.percent}`,
    percent: this.percent,
    radius: 60,
    outerStrokeWidth: 12,
    innerStrokeWidth: 12,
    space: -12,
    outerStrokeColor: this.outerColor,
    innerStrokeColor: this.innerColor,
    showBackground: false,
    animateTitle: false,
    clockwise: false,
    showUnits: false,
    showTitle:true,
    showSubtitle:false,
    animationDuration: 500,
    startFromZero: false,
    outerStrokeGradient: true,
    outerStrokeGradientStopColor: this.outerColor,
    lazy: true,
    subtitleFormat: (percent: number): string => {
      return `${percent}%`;
    },
    class: '',
    backgroundGradient: false,
    backgroundColor: '',
    backgroundGradientStopColor: '',
    backgroundOpacity: 0,
    backgroundStroke: '',
    backgroundStrokeWidth: 0,
    backgroundPadding: 0,
    toFixed: 0,
    maxPercent: this.total,
    renderOnClick: false,
    units: '',
    unitsFontSize: '',
    unitsFontWeight: '',
    unitsColor: '',
    outerStrokeLinecap: 'round',
    titleFormat: undefined,
    titleColor: 'white',
    titleFontSize: '40',
    titleFontWeight: '700',
    subtitle: '',
    subtitleColor: '',
    subtitleFontSize: '',
    subtitleFontWeight: '',
    imageSrc: undefined,
    imageHeight: 0,
    imageWidth: 0,
    animation: true,
    animateSubtitle: false,
    showImage: false,
    showInnerStroke: true,
    responsive: false,
    showZeroOuterStroke: true
  }
  
  innerDataOptions: CircleProgressOptions = {
    title: '',
    percent: (this.secondinnerData / this.secondouterData) * 100,
    radius: 37,
    outerStrokeWidth: 12,
    innerStrokeWidth: 12,
    space: -12,
    outerStrokeColor: this.innerColor,
    innerStrokeColor: "#3C3C3C",
    showBackground: false,
    animateTitle: false,
    clockwise: false,
    showUnits: false,
    showTitle:false,
    showSubtitle:false,
    animationDuration: 500,
    startFromZero: false,
    outerStrokeGradient: true,
    outerStrokeGradientStopColor: this.innerColor,
    lazy: true,
    subtitleFormat: (percent: number): string => {
      return `${percent}%`;
    },
    class: '',
    backgroundGradient: false,
    backgroundColor: '',
    backgroundGradientStopColor: '',
    backgroundOpacity: 0,
    backgroundStroke: '',
    backgroundStrokeWidth: 0,
    backgroundPadding: 0,
    toFixed: 0,
    maxPercent: this.secondouterData,
    renderOnClick: false,
    units: '',
    unitsFontSize: '',
    unitsFontWeight: '',
    unitsColor: '',
    outerStrokeLinecap: 'round',
    titleFormat: undefined,
    titleColor: '',
    titleFontSize: '',
    titleFontWeight: '',
    subtitle: '',
    subtitleColor: '',
    subtitleFontSize: '',
    subtitleFontWeight: '',
    imageSrc: undefined,
    imageHeight: 0,
    imageWidth: 0,
    animation: true,
    animateSubtitle: false,
    showImage: false,
    showInnerStroke: true,
    responsive: false,
    showZeroOuterStroke: false
  }
  
  select(){
    this.selectBox.nativeElement.click()
  }
  
  showPage(row: any){
    console.log(row)
    this.router.navigate(['/admin/product-statistics', row.id]);
  }
  
}
