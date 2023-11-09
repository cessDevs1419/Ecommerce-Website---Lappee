import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CircleProgressOptions } from 'ng-circle-progress';
import { Observable, of, take } from 'rxjs';

export class MostSellingVariantsSampleData {
  constructor(
    public id: number,
    public name: string,
    public percent: number,
  ) {}
}

@Component({
  selector: 'app-admin-product-statistics',
  templateUrl: './admin-product-statistics.component.html',
  styleUrls: ['./admin-product-statistics.component.css']
})
export class AdminProductStatisticsComponent {
	constructor(private route: ActivatedRoute) {}

  variants$: Observable<MostSellingVariantsSampleData[]>;
  
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
  colors: string[] = ['red', 'green', 'blue', 'pink', 'yellow'];
  
	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			const id = params.get('id') || null;
		});

    this.variants$ = of([
      new MostSellingVariantsSampleData(1, 'Variant A', 20, ),
      new MostSellingVariantsSampleData(2, 'Variant B', 10, ),
      new MostSellingVariantsSampleData(3, 'Variant C', 20, ),
      new MostSellingVariantsSampleData(4, 'Variant D', 30, ),
      new MostSellingVariantsSampleData(5, 'Variant E', 20, ),
    ])
	}

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


}
