import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CircleProgressOptions } from 'ng-circle-progress';
import { Observable, Subject, map, of, startWith, switchMap, take } from 'rxjs';
import { DonutChartComponent } from 'src/app/components/components/donut-chart/donut-chart.component';
import { LineGraphComponent } from 'src/app/components/components/line-graph/line-graph.component';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';
import { formatProductStatistics } from 'src/app/utilities/response-utils';
import { Monthly, ProductStatistics, ProductStatisticsDetails, ProductStatisticsOrders, ProductStatisticsRating, ProductStatisticsSolds, ProductStatisticsVariants, Sales } from 'src/assets/models/sales';

export class MostSellingVariantsSampleData {
  constructor(
    public id: number,
    public name: string,
    public percent: number,
  ) {}
}

export class ProductStatisticsVariant {
  constructor(
    public id: string, 
    public name: string, 
    public percent: number, 
    public product_sold: number
  ) {}
}

@Component({
  selector: 'app-admin-product-statistics',
  templateUrl: './admin-product-statistics.component.html',
  styleUrls: ['./admin-product-statistics.component.css']
})
export class AdminProductStatisticsComponent {
  @ViewChild(LineGraphComponent) line: LineGraphComponent
  @ViewChild(DonutChartComponent) donut: DonutChartComponent

	constructor(
    private route: ActivatedRoute,
    private sales: SalesStatisticsService
    ) {}
    bgColor: string = 'table-bg-dark';
    fontColor: string = 'font-grey';
    titleColor: string = 'font-grey';
    itemColor: string = 'font-grey';
    subitemColor: string = 'sub-font-grey';
    
    outerColor: string = '#1C92FF'
    innerColor: string = '#094175'
    outerData: number = 300;
    innerData: number = 100;
    totalIncome: number
    total: number = this.outerData + this.innerData
    percent: number = (this.outerData  / this.total) * 100;
    colors: string[] = ['red', 'green', 'blue', 'pink', 'yellow'];

  variants$: Observable<ProductStatisticsVariant[]>;
  productStatistics$: Observable<ProductStatistics>
  private refreshData$ = new Subject<void>();
  lineChartData: { label: string, value: number }[] = [];
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
  


	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			const id = params.get('id') || null;
      this.loadProductStatistics(id)
		});

	}
  
  monthly: Monthly = {
    January: '',
    February: '',
    March: '',
    April: '',
    May: '',
    June: '',
    July: '',
    August: '',
    September: '',
    October: '',
    November: '',
    December: ''
  }
  
  salesCount: Sales = {
    monthly: this.monthly,
    total: '',
  }

  variants: ProductStatisticsVariants[] = [{
    id: '',
    name: '',
    product_sold: 0,
    percent: 0
  }]

  product_detail: ProductStatisticsDetails = {
    id: '',
    name: ''
  }

  product_sold: ProductStatisticsSolds = {
    current_month: '',
    increase: false,
    last_month: '',
    percent: ''
  }

  rating: ProductStatisticsRating = {
    current_month: '',
    increase: false,
    last_month: '',
    percent: ''
  }

  orders: ProductStatisticsOrders = {
    current_month: '',
    increase: false,
    last_month: '',
    percent: '',
    sales: this.salesCount,
    variants: this.variants
  }

  loadProductStatistics(id: string | null){
    this.productStatistics$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.sales.getProductStatistics(id)),
      map((Response: any) => formatProductStatistics(Response))  
    );
    
    this.productStatistics$.subscribe(item => {
      this.product_detail = {...item.product_details}
      this.product_sold = {...item.product_sold}
      this.rating = {...item.rating}
      this.orders = {...item.orders}
      this.salesCount = {... this.orders.sales}
      this.totalIncome = parseFloat(this.salesCount.total)
      this.variants = {... this.orders.variants}
      this.monthly = { ...this.salesCount.monthly };

      for(const item of this.orders.variants){
        this.variants$ = of([
          new ProductStatisticsVariant(item.id, item.name, item.percent, item.product_sold),
        ])
      }

      console.log(this.orders.variants)
      this.donut.loadData(this.variants$)
      this.line.runChart(this.monthly)
    })
  }
  refreshTableData(): void {
    this.refreshData$.next();
  }





}
