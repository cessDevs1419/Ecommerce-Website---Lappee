import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ChartType, ChartOptions, ChartData, ChartConfiguration } from 'chart.js';
import { throttle } from 'rxjs';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent {
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef;
  @Input() data: { label: string, value: number }[] = [];
  @Input() theme: string;
  @Input() width: string;
  @Input() height: string;
  @Input() showGraphSelection: boolean
  lineChartData: { label: string, value: number }[] = [];

  backGround: string;
  fontColor: string;
  borderColor: string;
  isDrawingLabel: boolean = false;
  
  constructor(private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    switch(this.theme){
      case 'dark':
        this.theme = ''
      break;
      case 'light':
        this.theme = ''
      break;
    }

  }

  ngAfterViewInit() {
    
  }

  runChart(data: { label: string, data: string }[]){
    
    // this.lineChartData = Object.entries(data).map(([label, value]) => ({
    //   label: label,
    //   value: parseFloat(value)
    // }));
    
    
    // this.drawChart()

    const labels = data.map(item => item.label);
    const datasetData = data.map(item => parseFloat(item.data)); // Convert data to a numeric type if needed
    const gradient = this.canvasRef.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, 'rgba(28, 146, 255, 0.47)');
    gradient.addColorStop(1, 'rgba(28, 146, 255, 0.00)');

    this.lineChartDatas = {
      labels: labels,
      datasets: [
        {
          data: datasetData,
          label: '',
          fill: true,
          tension: 0.5,
          borderColor: '#1C92FF',
          backgroundColor: gradient,
          pointBackgroundColor: 'black'
        }
      ],
      
    };

  }

  private drawChart() {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    const data = this.lineChartData;
  
    // Clear the canvas
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  
    const chartHeight = canvas.height - 0;
    const chartWidth = canvas.width - 0;
  
    // Find the maximum and minimum data values
    const values = data.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
  
    // Ensure a non-zero range to avoid division by zero
    const valueRange = maxValue !== minValue ? maxValue - minValue : 1;
  
    // Calculate the height ratio based on the data range and canvas height
    const heightRatio = chartHeight / valueRange;
  
    // Calculate the width of each data point based on the canvas width and data length
    const dataPointWidth = chartWidth / (data.length - 1);
  
    // Draw the gradient background behind the line graph
    const gradient = ctx?.createLinearGradient(0, 0, 0, canvas.height);
    gradient?.addColorStop(0, 'rgba(28, 146, 255, 0.47)');
    gradient?.addColorStop(1, 'rgba(28, 146, 255, 0.00)');
  
    ctx?.save(); // Save the current state of the context
    ctx?.beginPath();
    ctx?.moveTo(0, canvas.height); // Start at the bottom left corner
    ctx?.lineTo(0, canvas.height - (data[0].value - minValue) * heightRatio); // Move to the first data point
  
    // Draw lines to connect each data point
    for (let i = 0; i < data.length; i++) {
      const x = i * dataPointWidth + 0;
      const y = canvas.height - (data[i].value - minValue) * heightRatio;
      ctx?.lineTo(x, y);
    }
  
    ctx?.lineTo(canvas.width - 0, canvas.height); // End at the bottom right corner
    ctx?.closePath();
  
    if (ctx) {
      ctx.fillStyle = gradient || 'white'; // Use the gradient as the fill style
    }
  
    ctx?.fill();
    ctx?.restore(); // Restore the saved state
  
    // Draw the line graph
    ctx?.beginPath();
    ctx?.moveTo(0, canvas.height - (data[0].value - minValue) * heightRatio); // Move to the first data point
  
    // Draw lines to connect each data point
    for (let i = 1; i < data.length; i++) {
      const x = i * dataPointWidth + 0;
      const y = canvas.height - (data[i].value - minValue) * heightRatio;
      ctx?.lineTo(x, y);
    }
  
    if (ctx) {
      ctx.lineWidth = 0;
      ctx.strokeStyle = '#1E2029';
    }
    ctx?.stroke();
    ctx?.closePath();
  
    // Draw data point circles
    ctx?.beginPath();
    if (ctx) {
      ctx.fillStyle = '#67B6FF';
    }
  
    for (let i = 0; i < data.length; i++) {
      const x = i * dataPointWidth + 0;
      const y = canvas.height - (data[i].value - minValue) * heightRatio;
      ctx?.arc(x, y, 4, 0, 2 * Math.PI);
      ctx?.fill();
      ctx?.closePath();
    }
  
    // const handleMouseMove = (event: MouseEvent) => {
    //   const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    //   const mouseY = event.clientY - canvas.getBoundingClientRect().top;
  
    //   // Remove the event listener temporarily
     
  
    //   // Iterate through data points to find the one closest to the mouse position
    //   // for (let i = 0; i < data.length; i++) {
    //   //   const x = i * dataPointWidth + 0;
    //   //   const y = canvas.height - (data[i].value - minValue) * heightRatio;

    //   //   // Check if the mouse is close to the data point
    //   //   if (Math.abs(mouseX - x) < 10 && Math.abs(mouseY - y) < 10) {
    //   //     const label = `Value: ${data[i].value}`;
    //   //     ctx?.clearRect(0, 0, canvas.width, canvas.height);

    //   //     // Draw the chart without labels only if the label hasn't been drawn yet
    //   //     if (this.isDrawingLabel) {
    //   //       this.isDrawingLabel = false; 
    //   //       this.drawChart();
    //   //     }

    //   //     // Display label near the hovered data point
    //   //     // ctx?.fillStyle = 'black';
    //   //     // ctx?.font = '12px Arial';
    //   //     ctx?.fillText(label, x, y - 10);
    //   //     break; // Exit the loop once a data point is found
    //   //   }
    //   // }
  
    //   console.log('nagana')
    //   // Reattach the event listener
     
    // };
  
    // // Attach the initial event listener
    // canvas.addEventListener('mousemove', handleMouseMove);
  
    // // Event listener for mouseout to clear the canvas and redraw the chart without labels
    // canvas.addEventListener('mouseout', () => {
      
    // });

  }

  public lineChartDatas: ChartConfiguration<'line'>['data'] = { 
    labels: [
      ''
    ],
    datasets: [
      {
        data: [ 0 ],
        label: 'Series A',
        fill: false,
        tension: 0.5,
        borderColor: '#1C92FF',
        backgroundColor: 'transparent',
        pointBackgroundColor: 'black'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          display: false, 
        },
      },
      y: {
        beginAtZero: true
      }

    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };
  public lineChartLegend = false;


  
  
  
  
}