import { Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  @Input() item: any;

  transform(value: any, searchText: any): any {
    if(!searchText) {
      return value;
    }
    return value.filter((data: any) => this.matchValue(data,searchText)); 
  }
  
  matchValue(data: any, value: any) {
    return Object.keys(data).map((key) => {
      return new RegExp(value, 'gi').test(data[key]);
    }).some(result => result);
  }
}
