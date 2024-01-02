import { Component, ElementRef, Input, ViewChild, OnInit, AfterViewInit, ViewContainerRef, OnChanges, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  constructor(public vcr: ViewContainerRef){}

  @Input() componentName!: any;
  @Input() flag: boolean;

  component: ComponentRef<any>;
  
  ngOnInit(): void {  
    this.component = this.vcr.createComponent(this.componentName);
    //console.log(this.flag);
  }

  ngOnChanges(): void {
    if(!this.flag){
      this.component.destroy();
    }
  }

}
