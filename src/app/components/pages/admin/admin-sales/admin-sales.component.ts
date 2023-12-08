import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { LineGraphComponent } from 'src/app/components/components/line-graph/line-graph.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ProductsService } from 'src/app/services/products/products.service';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';
import { formatAdminProducts, formatSalesStatistics } from 'src/app/utilities/response-utils';
import { AdminProduct } from 'src/assets/models/products';
import { Monthly, OrderCount, Sales, SalesStatistics } from 'src/assets/models/sales';



@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.component.html',
  styleUrls: ['./admin-sales.component.css']
})
export class AdminSalesComponent {
  @ViewChild(TableComponent) table: TableComponent;
  @ViewChild(LineGraphComponent) line: LineGraphComponent
  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;
  @ViewChild('selectBox', { static: true }) selectBox: ElementRef;
  


  bgColor: string = 'table-bg-dark';
  fontColor: string = 'font-grey';
  titleColor: string = 'font-grey';
  itemColor: string = 'font-grey';
  subitemColor: string = 'sub-font-grey';
  
  outerColor: string = '#1C92FF'
  innerColor: string = '#094175'
  outerData: number = 0
  innerData: number = 0;
  total: number = 0;
  percent: number = 0;
  totalIncome: number;
  monthlyValue: any

  private refreshData$ = new Subject<void>();

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



  products$: Observable<AdminProduct[]>;
  sales$: Observable<SalesStatistics>;


  constructor(
		private router: Router,
    private service: ProductsService,
    private sales: SalesStatisticsService,
    private cdr: ChangeDetectorRef
	) {}
	
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

  orderCount: OrderCount = {
    incomplete: 0,
    complete: 0,
    all: 0
  }

  salesCount: Sales = {
    monthly: this.monthly,
    total: '',
  }



  ngOnInit() {
    // Create an observable of Product data
    this.products$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.service.getAdminProducts()),
      map((Response: any) => formatAdminProducts(Response))  
      ,
      tap(() => {
          this.table.loaded()
      })
    );

    this.sales$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.sales.getSalesStatistics()),
      map((Response: any) => formatSalesStatistics(Response))  
    );



    this.sales$.subscribe(data => {
      this.orderCount = data.order_count
      this.salesCount = data.sales
      this.outerData = this.orderCount.complete
      this.innerData = this.orderCount.incomplete
      this.total = this.orderCount.all
      this.percent = parseFloat(((this.outerData  / this.total) * 100).toFixed(1));
      this.totalIncome = parseFloat(this.salesCount.total)
      this.monthly = { ...this.salesCount.monthly };

      this.outerDataOptions = {
        title: `${this.total}`,
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

      this.line.runChart(this.monthly)
      console.log('sales', this.monthly)
    })



  }


  

  refreshTableData(): void {
    this.refreshData$.next();
  }

  select(){
    this.selectBox.nativeElement.click()
  }
  
  showPage(row: any){
    this.router.navigate(['/admin/product-statistics', row.product_id]);
  }
  
}
