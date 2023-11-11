import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';


@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent {
  @Input() data: { label: string, value: number }[];
  @Input() theme: string;
  @Input() width: string;
  @Input() height: string;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef;
  
  backGround: string;
  fontColor: string;
  borderColor: string;
  
  constructor() { }

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
    this.drawChart();
  }

  private drawChart() {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    const data = this.data;
  
  
    // Clear the canvas
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  
    const chartHeight = canvas.height - 0;
    const chartWidth = canvas.width - 0;
  
    // Find the maximum and minimum data values
    const values = data.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
  
    const valueRange = maxValue - minValue;
  
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
    for (let i = 1; i < data.length; i++) {
      const x = i * dataPointWidth + 0;
      const y = canvas.height - (data[i].value - minValue) * heightRatio;
      ctx?.lineTo(x, y);
    }
  
    ctx?.lineTo(canvas.width - 0, canvas.height); // End at the bottom right corner
    ctx?.closePath();
  
    if(ctx){
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
  

    if(ctx){
      ctx.lineWidth = 0;
      ctx.strokeStyle = '#1E2029';    
    }
    ctx?.stroke();
    ctx?.closePath();
  
    // Draw data point circles
    ctx?.beginPath();
    if(ctx){
      ctx.fillStyle = '#67B6FF';
    }
    
    for (let i = 0; i < data.length; i++) {
      const x = i * dataPointWidth + 0;
      const y = canvas.height - (data[i].value - minValue) * heightRatio;
      ctx?.arc(x, y, 4, 0, 2 * Math.PI);
      ctx?.fill();
      ctx?.closePath();
    }
  }
  
  
  
  
}