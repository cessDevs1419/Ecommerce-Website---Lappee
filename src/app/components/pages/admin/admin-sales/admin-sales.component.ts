import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { LineGraphComponent } from 'src/app/components/components/line-graph/line-graph.component';
import { SidebarComponent } from 'src/app/components/components/sidebar/sidebar.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';
import { formatAdminProducts, formatSalesStatistics } from 'src/app/utilities/response-utils';
import { AdminProduct } from 'src/assets/models/products';
import { DateRange, OrderCount, Sales, SalesStatistics } from 'src/assets/models/sales';



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
  @ViewChild(SidebarComponent) sb: SidebarComponent;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild('closeBtn') modal: ElementRef;

  productSuccessMessage = 'Product: ';
  errorMessage = 'Please fill in all the required fields.';
  inputColor: string = "text-white"
  borderColor: string = "border-grey"
  textcolor: string = 'text-light-subtle'
  bordercolor: string = 'dark-subtle-borders'
  selectedReason: string = '';
  isDropdownOpen: boolean = false;

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
  totalIncome: string;
  monthlyValue: any
  from: string = 'Select Date From';
  to: string = 'Select Date To'; 
  selectedOption: string = 'Weekly';
  dateFilterForm: FormGroup
  showSuccess: boolean
  showGraphSelection: boolean

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
  salesMonth$: Observable<SalesStatistics>;
  salesYear$: Observable<SalesStatistics>;

  constructor(
		private router: Router,
    private service: ProductsService,
    private sales: SalesStatisticsService,
    private cdr: ChangeDetectorRef,
    private err: ErrorHandlerService

	) {
    this.dateFilterForm = new FormGroup({
      duration_from: new FormControl('', Validators.required),
      duration_to: new FormControl('', Validators.required),
  });

  }
	
  date_range: DateRange = {
    start: '',
    end: ''
  }

  orderCount: OrderCount = {
    incomplete: 0,
    complete: 0,
    all: 0
  }

  salesCount: Sales = {
    line_graph_data: [],
    total: ''
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

    this.salesMonth$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.sales.getSalesStatisticsMonthly()),
      map((Response: any) => formatSalesStatistics(Response))  
    );

    this.salesYear$ = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.sales.getSalesStatisticsYearly()),
      map((Response: any) => formatSalesStatistics(Response))  
    );



    this.sales$.subscribe(data => {
      this.date_range = data.date_range
      this.salesCount = data.sales
      this.orderCount = data.order_count
      
      this.outerData = this.orderCount.complete
      this.innerData = this.orderCount.incomplete
      this.total = this.orderCount.all
      this.percent = parseFloat(((this.outerData  / this.total) * 100).toFixed(1));
      this.totalIncome = this.salesCount.total

      const sales = {
        title: '',
        from: this.date_range.start,
        to: this.date_range.end
      }

      this.showGraphSelection = true
      this.sales.triggerFunction(sales)
      this.line.runChart(this.salesCount.line_graph_data)

      this.outerDataOptions = {
        title: `${this.total}`,
        percent: this.percent,
        radius: 71,
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
    })



  }

  selectOption(option: string) {
    this.selectedOption = option;
    
    switch(this.selectedOption){
      case 'Monthly':
        this.salesYear$.subscribe(data => {
          this.salesCount = data.sales
          this.outerData = data.order_count.complete
          this.innerData = data.order_count.incomplete
          this.total = data.order_count.all
          this.percent = parseFloat(((this.outerData  / this.total) * 100).toFixed(1));
          this.totalIncome = this.salesCount.total

          this.outerDataOptions = {
            title: `${this.total}`,
            percent: this.percent,
            radius: 71,
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
          const sales = {
            title: '',
            from: data.date_range.start,
            to: data.date_range.end
          }
          this.showGraphSelection = true
          this.sales.triggerFunction(sales)
          this.line.runChart(this.salesCount.line_graph_data)
        })
      break;
      default:
        this.sales$.subscribe(data => {
          this.salesCount = data.sales
          this.outerData = data.order_count.complete
          this.innerData = data.order_count.incomplete
          this.total = data.order_count.all
          this.percent = parseFloat(((this.outerData  / this.total) * 100).toFixed(1));
          this.totalIncome = this.salesCount.total

          this.outerDataOptions = {
            title: `${this.total}`,
            percent: this.percent,
            radius: 71,
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
          const sales = {
            title: '',
            from: data.date_range.start,
            to: data.date_range.end
          }
          this.showGraphSelection = true
          this.sales.triggerFunction(sales)
          this.line.runChart(this.salesCount.line_graph_data)

        })
      break;
    }
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

  refreshTableData(): void {
    this.refreshData$.next();
  }

  select(){
    this.selectBox.nativeElement.click()
  }
  
  showPage(row: any){
    this.router.navigate(['/admin/product-statistics', row.product_id]);
  }
  
  onDateSubmit(){
    const from = this.dateFilterForm.get('duration_from')?.value
    const to = this.dateFilterForm.get('duration_to')?.value

    this.sales.getDatedSalesStatistics(from, to).subscribe({
      next: (response: any) => {
        const data = formatSalesStatistics(response);
        this.salesCount = data.sales
        this.outerData = data.order_count.complete
        this.innerData = data.order_count.incomplete
        this.total = data.order_count.all
        this.percent = parseFloat(((this.outerData  / this.total) * 100).toFixed(1));
        this.totalIncome = this.salesCount.total

        this.outerDataOptions = {
          title: `${this.total}`,
          percent: this.percent,
          radius: 71,
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
        const sales = {
          title: '',
          from: data.date_range.start,
          to: data.date_range.end
        }
        this.sales.triggerFunction(sales)
      
        this.modal.nativeElement.click()
        this.showGraphSelection = false
        this.sales.triggerFunction(sales);
        this.line.runChart(this.salesCount.line_graph_data);
      },
      error: (error: HttpErrorResponse) => {
        const errors = this.err.handle(error)
        const errorHandle = {
          head: 'Date Filter',
          sub: errors
        }
        this.ErrorToast(errorHandle)
      }
    });
    
  }

  SuccessToast(value: any): void {
    this.toaster.showToast(value.head, value.sub, 'default', '', )
  }
  
  WarningToast(value: any): void {
    this.toaster.showToast(value.head, value.sub, 'warn', '', )
  }
  
  ErrorToast(value: any): void {
    this.toaster.showToast(value.head, value.sub, 'negative', '', )
  }
}
