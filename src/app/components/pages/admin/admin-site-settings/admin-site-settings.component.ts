import { Component, ViewChild } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Banner } from 'src/assets/models/sitedetails';
import { OnInit } from '@angular/core';
import { BannersService } from 'src/app/services/banners/banners.service';
import { formatBanners } from 'src/app/utilities/response-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteDetailsService } from 'src/app/services/site-details/site-details.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-site-settings',
  templateUrl: './admin-site-settings.component.html',
  styleUrls: ['./admin-site-settings.component.css']
})
export class AdminSiteSettingsComponent {
  
  size: string = 'w-100';

  // To know whether to show or hide add banner form.
  showAddForm: boolean = false;

  banners !: Observable<Banner[]>;
  selectedBanner: Banner = {
    id: '',
    label: '',
    path: '',
  };

  // To know what file to upload for site logo.
  imagePath: any;
  url:any;

  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 
  @ViewChild(ToastComponent) toast: ToastComponent;

  // Site Name Form Data
  siteNameForm = this.fb.group({
    siteName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
  });
  
  constructor(
    private bannerService: BannersService, 
    private route: ActivatedRoute,
    private router: Router,
    private siteDetailsService: SiteDetailsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit()
  {
    this.banners = this.bannerService.getBanners().pipe(
      map((response: any) => formatBanners(response))
    );

    this.route.paramMap.subscribe((param) => {
      const action = param.get('action');

      if(action == 'add') {
        this.showAddForm = true;
      } else {
        this.showAddForm = false;
      }
    });

    console.log(this.showAddForm);  
  }

  editSiteLogo()
  {
    if(this.imagePath != null) {
      let uploadFormData: any = new FormData();
      uploadFormData.append('file', this.imagePath);

      this.siteDetailsService.uploadSiteLogo(uploadFormData).subscribe({
        next: (response: any) => {
          this.toastHeader = "Image upload success!";
          this.toastContent = "Site logo has been updated.";
          this.toast.switchTheme('default');
          this.toast.show();
        },
        error: (error: HttpErrorResponse) => {
          this.toastHeader = "Image upload failed!";
          this.toastContent = "Site logo has not been updated.";
          this.toast.switchTheme('negative');
          this.toast.show();
        }
      });

      console.log(uploadFormData);
    } else {
      this.toastHeader = "No Image Upload!";
      this.toastContent = "Please select a logo before uploading.";
      this.toast.switchTheme('warn');
      this.toast.show();
    }
  }

  cancelEditSiteLogo()
  {
    this.url = null;
    this.imagePath = null;
  }

  editSiteName()
  {
    if(this.siteNameForm.valid) {
      console.log(this.siteNameForm.get('siteName')?.value);

      let formData: any = new FormData();
      formData.append('name', this.siteNameForm.get('siteName')?.value);

      this.siteDetailsService.editSiteTitle(formData).subscribe({
        next: (response: any) => {
          this.toastHeader = "Updated site name!";
          this.toastContent = "You have changed the site name.";
          this.toast.switchTheme('default');
          this.toast.show();

          this.siteNameForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.toastHeader = "Can't change site name!";
          this.toastContent = "Failed to update site name.";
          this.toast.switchTheme('negative');
          this.toast.show();

          console.log(error);
        }
      });
    } else {
      this.toastHeader = "Invalid Site Name!";
      this.toastContent = "Please enter a valid site name.";
      this.toast.switchTheme('warn');
      this.toast.show();
    }
  }

  getBannerData(banner: any)
  {
    this.selectedBanner = banner
  }

  addBanner()
  {
    this.router.navigate(['/admin/site-settings', 'add']);
  }

  hideAddBanner()
  {
    this.showAddForm = false;
    this.router.navigate(['/admin/site-settings']);
  }

  showUploadLogo() 
  {
    let logoUploadInput: HTMLElement = document.getElementById('logoUpload') as HTMLElement;

    logoUploadInput.click();
  }

  onFileChanged(event: any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
    }

    const reader = new FileReader();
    this.imagePath = files[0];
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.url = reader.result; 
    }
  }
}