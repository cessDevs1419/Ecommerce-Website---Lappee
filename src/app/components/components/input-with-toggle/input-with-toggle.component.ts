import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-with-toggle',
  templateUrl: './input-with-toggle.component.html',
  styleUrls: ['./input-with-toggle.component.css']
})
export class InputWithToggleComponent  {
  show: boolean = false;

  @Input() parent!: FormGroup;
  @Input() componentName!: string;
}
