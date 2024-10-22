import { Component, ElementRef, ViewChild } from '@angular/core';
import { CircleProgressOptions } from 'ng-circle-progress';
import { Observable, Subject, map, of, startWith, switchMap } from 'rxjs';
import { formatDashboard, formatProductStatistics, formatSalesStatistics } from 'src/app/utilities/response-utils';
import {List, ProductStatistics, ProductStatisticsDetails, ProductStatisticsOrders, ProductStatisticsRating, ProductStatisticsSolds, ProductStatisticsVariants, Sales, SalesStatistics } from 'src/assets/models/sales';
import { ProductStatisticsVariant } from '../admin-product-statistics/admin-product-statistics.component';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';
import { ActivatedRoute } from '@angular/router';
import { DonutChartComponent } from 'src/app/components/components/donut-chart/donut-chart.component';
import { LineGraphComponent } from 'src/app/components/components/line-graph/line-graph.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Dashboard, DashboardBestSellers, DashboardCustomers, DashboardOrders, DashboardRecentOrders, DashboardViews } from 'src/assets/models/dashboard';
import { TableComponent } from 'src/app/components/components/table/table.component';

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
  @ViewChild(TableComponent) table: TableComponent;
  
	constructor(
    private route: ActivatedRoute,
    private dashboard: DashboardService,
    private salesService: SalesStatisticsService,
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
    selectedOption: string = 'Weekly';
    showSuccess: boolean;
    showGraphSelection: boolean

    recentOrders$: Observable<DashboardRecentOrders[]>;
    dashboard$: Observable<Dashboard>
    sales$: Observable<SalesStatistics>;
    bestSellers$: DashboardBestSellers[];
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
    
    customers: DashboardCustomers = {
      current_month: '0',
      increase: false,
      last_month: '',
      percent: ''
    }
  
    views: DashboardViews = {
      current_month: '0',
      increase: false,
      last_month: '',
      percent: ''
    }
  
    orders: DashboardOrders = {
      current_month: '0',
      increase: false,
      last_month: '',
      percent: '',
    }
  
    sales: DashboardOrders = {
      current_month: '0',
      increase: false,
      last_month: '',
      percent: '',
    }
  
    recent_orders: DashboardRecentOrders[] = [{
      id: '',
      status: '',
      total_price: '',
      created_at: ''
    }]

    salesCount: Sales = {
      line_graph_data: [],
      total: ''
    }

	ngOnInit() {
    this.dashboard$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.dashboard.getDashboard()),
      map((Response: any) => formatDashboard(Response))  
    );

    this.sales$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.salesService.getSalesStatistics()),
      map((Response: any) => formatSalesStatistics(Response))  
    );
    
    this.dashboard$.subscribe(data => {
      this.showSuccess = true
      this.customers = {...data.customers}
      this.views = {...data.views}
      this.orders = {...data.orders}
      this.sales = {...data.sales}
      this.recentOrders$ = of(Object.values(data.recent_orders))
      this.bestSellers$ = data.best_sellers
      this.donut.loadData(this.bestSellers$)

      this.table.loaded()
    })

    this.sales$.subscribe(data => {

      this.salesCount = data.sales
      this.totalIncome = data.sales.total

      this.showGraphSelection = true
      this.line.runChart(this.salesCount.line_graph_data)


    })

	}


  
  selectOption(option: string) {
    this.selectedOption = option;
    // switch(this.selectedOption){
    //   case 'Monthly':
    //     this.salesYear$.subscribe(data => {
    //       this.salesCount = data.sales

    //       this.line.runChart(this.salesCount.line_graph_data)
    //     })
    //   break;
    //   default:
    //     this.sales$.subscribe(data => {
    //       this.salesCount = data.sales

    //       this.line.runChart(this.salesCount.line_graph_data)

    //     })
    //   break;
    // }
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
