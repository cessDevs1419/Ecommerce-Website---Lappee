import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AboutUsTosService } from 'src/app/services/about-us-tos/about-us-tos.service';
import { formatAboutUsTos } from 'src/app/utilities/response-utils';
import { AboutUsTosSection } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  constructor(private aboutustosService: AboutUsTosService) {}
  
  sections: Observable<AboutUsTosSection[]>;

  ngOnInit(): void {
    this.sections = this.aboutustosService.getAboutUs().pipe(map((response: any) => formatAboutUsTos(response)));
  }
}
