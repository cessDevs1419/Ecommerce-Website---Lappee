import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent {
  @Input() amount!: number;
  @Input() total!: number;
  @Input() colorhex!: string;
  backgroundColor!: string;
  percent!: number;

  ngOnInit() {
    this.percent = (this.amount / this.total) * 100;
    this.backgroundColor = this.colorhex ? this.colorhex : '#1C76CA';
  }
}


