import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AboutUsTosService } from 'src/app/services/about-us-tos/about-us-tos.service';
import { formatAboutUsTos } from 'src/app/utilities/response-utils';
import { AboutUsTosSection } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.css']
})
export class TosComponent {
  
  constructor(private aboutustosService: AboutUsTosService) {}
  
  sections: Observable<AboutUsTosSection[]>;

  ngOnInit(): void {
    this.sections = this.aboutustosService.getTos().pipe(map((response: any) => formatAboutUsTos(response)));
  }
  
}
