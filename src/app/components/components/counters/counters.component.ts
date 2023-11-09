import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.css']
})
export class CountersComponent {
  counter_bg: string = 'table-bg-dark'
  counter_heading_text_color: string = 'text-white'
  text_color: string = 'dark-theme-text-color'

  @Input() title: string;
  @Input() data: any;
}
