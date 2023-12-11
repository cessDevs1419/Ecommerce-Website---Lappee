import { Component, ElementRef, ViewChild } from '@angular/core';
import { CircleProgressOptions } from 'ng-circle-progress';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { formatProductStatistics } from 'src/app/utilities/response-utils';
import {ProductStatistics, ProductStatisticsDetails, ProductStatisticsOrders, ProductStatisticsRating, ProductStatisticsSolds, ProductStatisticsVariants, Sales } from 'src/assets/models/sales';
import { ProductStatisticsVariant } from '../admin-product-statistics/admin-product-statistics.component';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';
import { ActivatedRoute } from '@angular/router';
import { DonutChartComponent } from 'src/app/components/components/donut-chart/donut-chart.component';
import { LineGraphComponent } from 'src/app/components/components/line-graph/line-graph.component';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css']
})
export class AdminOverviewComponent {
  @ViewChild(LineGraphComponent) line: LineGraphComponent
  @ViewChild(DonutChartComponent) donut: DonutChartComponent
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  
	constructor(
    private route: ActivatedRoute,
    private sales: SalesStatisticsService
    ) {}
    bgColor: string = 'table-bg-dark';
    fontColor: string = 'font-grey';
    titleColor: string = 'font-grey';
    itemColor: string = 'font-grey';
    subitemColor: string = 'sub-font-grey';
    productSuccessMessage = 'Product: ';
    errorMessage = 'Please fill in all the required fields.';
    inputColor: string = "text-white"
    borderColor: string = "border-grey"
    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
    selectedReason: string = '';
    
    outerColor: string = '#1C92FF'
    innerColor: string = '#094175'
    outerData: number = 300;
    innerData: number = 100;
    totalIncome: string
    total: number = this.outerData + this.innerData
    percent: number = (this.outerData  / this.total) * 100;
    colors: string[] = ['red', 'green', 'blue', 'pink', 'yellow'];
    from: string = 'Select Date From';
    to: string = 'Select Date To'; 

  variants$: ProductStatisticsVariant[];
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
  

  
  salesCount: Sales = {
    line_graph_data: [],
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
    
    // this.productStatistics$.subscribe(item => {
    //   this.product_detail = {...item.product_details}
    //   this.product_sold = {...item.product_sold}
    //   this.rating = {...item.rating}
    //   this.orders = {...item.orders}
    //   this.salesCount = {... this.orders.sales}
    //   this.totalIncome = this.salesCount.total
    //   this.variants = {... this.orders.variants}
    //   this.monthly = { ...this.salesCount.monthly };

    //   this.variants$ = this.orders.variants

    //   this.donut.loadData(this.variants$)
    //   this.line.runChart(this.monthly)
      
    //   const sales = {
    //     title: this.product_detail.name,
    //     from: '2023',
    //     to: '2024'
    //   }
  
    //   this.sales.triggerFunction(sales)
    // })
  }
  refreshTableData(): void {
    this.refreshData$.next();
  }

  selectFromDate(){
    this.date1.nativeElement.showPicker()
  }

    selectToDate(){
    this.date2.nativeElement.showPicker()
  }

  getDateFromValue(event: any) {
    const date = event.target.value;
        this.from = date
  }

    getDateToValue(event: any) {
    const date = event.target.value;
        this.to = date
  }


}
