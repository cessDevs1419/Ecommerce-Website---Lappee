import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CircleProgressOptions } from 'ng-circle-progress';
import { Observable, Subject, map, of, startWith, switchMap, take } from 'rxjs';
import { DonutChartComponent } from 'src/app/components/components/donut-chart/donut-chart.component';
import { LineGraphComponent } from 'src/app/components/components/line-graph/line-graph.component';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';
import { formatProductStatistics } from 'src/app/utilities/response-utils';
import { DateRange, LineGraph, List, ProductStatistics, ProductStatisticsDetails, ProductStatisticsOrders, ProductStatisticsRating, ProductStatisticsSolds, ProductStatisticsVariants, Sales } from 'src/assets/models/sales';

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
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  
	constructor(
    private route: ActivatedRoute,
    private sales: SalesStatisticsService
    ) {

      this.dateFilterForm = new FormGroup({
        duration_from: new FormControl('', Validators.required),
        duration_to: new FormControl('', Validators.required),
    });
    }
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
    colors: string[] = ['#FE4C34', '#28C81A', '#1C7DD7', 'pink', '#E1E428'];
    from: string = 'Select Date From';
    to: string = 'Select Date To'; 
    dateFilterForm: FormGroup
    product_id: string | null;
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
      this.product_id = id
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

  date_range: DateRange = {
    start: '',
    end: ''
  }

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

  list: List = {
    id: '',
    order_content_id: '',
    name: '',
    created_at: '',
    status: 0,
    total_price: '',
    variant_id: ''
  }

  orders: ProductStatisticsOrders = {
    current_month: '',
    increase: false,
    last_month: '',
    percent: '',
    sales: this.salesCount,
    list: this.list,
    variants: this.variants
  }

  loadProductStatistics(id: string | null){
    this.productStatistics$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.sales.getProductStatistics(id)),
      map((Response: any) => formatProductStatistics(Response))  
    );
    
    this.productStatistics$.subscribe(item => {
      this.date_range = item.date_range
      this.product_detail = {...item.product_details}
      this.product_sold = {...item.product_sold}
      this.rating = {...item.rating}
      this.orders = {...item.orders}
      this.salesCount = {... this.orders.sales}
      this.totalIncome = this.salesCount.total
      this.variants = {... this.orders.variants}

      this.variants$ = this.orders.variants

      this.donut.loadData(this.variants$)

      
      const sales = {
        title: this.product_detail.name,
        from: item.date_range.start,
        to: item.date_range.end
      }
  
      this.sales.triggerFunction(sales)
      this.line.runChart(this.salesCount.line_graph_data)
    })
  }
  selectedOption: string = 'Weekly';
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

  onDateSubmit(){
    const from = this.dateFilterForm.get('duration_from')?.value
    const to = this.dateFilterForm.get('duration_to')?.value

    this.sales.getDatedProductStatistics(this.product_id, from, to).subscribe((data: any) => {
      // Assuming formatProductStatistics returns an object with the specified properties
      const formattedData = formatProductStatistics(data);
    
      this.date_range = formattedData.date_range;
      this.product_detail = { ...formattedData.product_details };
      this.product_sold = { ...formattedData.product_sold };
      this.rating = { ...formattedData.rating };
      this.orders = { ...formattedData.orders };
      this.salesCount = { ...this.orders.sales };
      this.totalIncome = this.salesCount.total;
      this.variants = { ...this.orders.variants };
    
      this.variants$ = this.orders.variants;
    
      console.log(formattedData)
     
      // this.donut.loadData(this.variants$);
    
      const sales = {
        title: this.product_detail.name,
        from: formattedData.date_range.start,
        to: formattedData.date_range.end,
      };
    
     
      this.sales.triggerFunction(sales);
      this.line.runChart(this.salesCount.line_graph_data);
    });
    
  }




}
