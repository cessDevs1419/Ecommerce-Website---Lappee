import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { Banner, SiteLogo } from 'src/assets/models/sitedetails';
import { OnInit } from '@angular/core';
import { BannersService } from 'src/app/services/banners/banners.service';
import { formatBanners, formatSiteLogo } from 'src/app/utilities/response-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteDetailsService } from 'src/app/services/site-details/site-details.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { FormBuilder, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';

@Component({
  selector: 'app-admin-site-settings',
  templateUrl: './admin-site-settings.component.html',
  styleUrls: ['./admin-site-settings.component.css']
})
export class AdminSiteSettingsComponent {
  
  titleColor: string = 'text-white';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  size: string = 'w-100';

  // To know whether to show or hide add banner form.
  showAddForm: boolean = false;

  banners !: Observable<Banner[]>;
  selectedBanner: Banner = {
    id: '',
    label: '',
    path: '',
  };

  siteLogo: Observable<SiteLogo>;

  logoImage: any;

  // To know what file to upload for site logo.
  imagePath: any;
  url:any;

  // Banner to be uploaded
  bannerFile: any;
  bannerUrl: any;

  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 

  @ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild("confirmDeleteModal") confirmDeleteModal: ElementRef;

  modal: bootstrap.Modal;
  

  // Site Name Form
  siteNameForm = this.fb.group({
    siteName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
  });
  
  // Upload banner form
  addBannerForm = this.fb.group({
    bannerLabel: ['', [Validators.required, Validators.pattern('^[a-zA-Z_ \d]*$')]],
    bannerImage: ['', [Validators.required]],
  });

  private refreshData$ = new Subject<void>();

  constructor(
    private bannerService: BannersService, 
    private route: ActivatedRoute,
    private router: Router,
    private siteDetailsService: SiteDetailsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit()
  {
    this.banners = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.bannerService.getBanners()),
      map((response: any) => formatBanners(response)),
    );

    this.route.paramMap.subscribe((param) => {
      const action = param.get('action');

      if(action == 'add') {
        this.showAddForm = true;
      } else {
        this.showAddForm = false;
      }
    });

    // Get current logo
    this.siteLogo = this.siteDetailsService.getSiteLogo().pipe(map((response: any) => formatSiteLogo(response)));
  }

  ngAfterViewInit()
  {
    //this.modal = new bootstrap.Modal(this.confirmDeleteModal.nativeElement);
  }

  closeModal()
  {
    this.confirmDeleteModal.nativeElement.click();
  }

  refreshTableData(): void {
    this.refreshData$.next();
  }
  
  
  editSiteLogo()
  {
    if(this.imagePath != null) {
      let uploadFormData: any = new FormData();
      uploadFormData.append('file', this.imagePath);

      this.siteDetailsService.uploadSiteLogo(uploadFormData).subscribe({
        next: (response: any) => {
          this.toaster.showToast("Image upload success!", "Site logo has been updated.", 'default', '', )
        },
        error: (error: HttpErrorResponse) => {
          this.toaster.showToast("Image upload failed!", "Site logo has not been updated.", 'negative', '', )
        }
      });
    } else {
      this.toaster.showToast("No Image Upload!", "Please select a logo before uploading.", 'warn', '', )
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

      let formData: any = new FormData();
      formData.append('name', this.siteNameForm.get('siteName')?.value);

      this.siteDetailsService.editSiteTitle(formData).subscribe({
        next: (response: any) => {
          this.toaster.showToast("Updated site name!", "You have changed the site name.", 'default', '', )
          this.siteNameForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.toaster.showToast("Can't change site name!", "Failed to update site name.", 'negative', '', )
        }
      });
    } else {
      this.toaster.showToast("Invalid Site Name!", "Please enter a valid site name.", 'warn', '', )
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
    this.bannerFile = null;
    this.bannerUrl = null;

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
        return;
    }

    const reader = new FileReader();
    this.imagePath = files[0];
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.url = reader.result; 
    }
  }

  onBannerFileChanged(event: any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        return;
    }

    const reader = new FileReader();
    this.bannerFile = files[0];
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.bannerUrl = reader.result; 
    }
  }

  showBannerFileDialog()
  {
    let logoUploadInput: HTMLElement = document.getElementById('bannerUpload') as HTMLElement;

    logoUploadInput.click();
  }

  uploadBanner()
  {
    if(this.addBannerForm.valid) {
      let formData: any = new FormData();
      
      formData.append('label', this.addBannerForm.get('bannerLabel')?.value);
      formData.append('file', this.bannerFile);

      console.log(formData);

      this.siteDetailsService.uploadBanner(formData).subscribe({
        next: (response: any) => {
          this.toaster.showToast("Successfully uploaded banner!", "You have added a banner.", 'default', '', )
          this.resetBannerForm();
          this.addBannerForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.toaster.showToast("Failed to upload banner!", "Cannot add banner.", 'negative', '', )
        }
      });

    } else {
      this.toaster.showToast("Invalid Banner!", "Please enter a valid image and/or label.", 'warn', '', )
    }
  }

  resetBannerForm()
  {
    this.bannerFile = null;
    this.bannerUrl = null;
  }

  deleteBanner()
  {
    let formData: any = new FormData();

    formData.append('id', this.selectedBanner.id);
    
    this.siteDetailsService.deleteBanner(formData).subscribe({
      next: (response: any) => {
        this.toaster.showToast("Successfully removed banner!", "You have deleted a banner.", 'default', '', )
        this.closeModal();

        this.refreshTableData();
        
        this.selectedBanner = {
          id: '',
          label: '',
          path: '',
        };

      },
      error: (error: HttpErrorResponse) => {
        this.toaster.showToast("Failed to remove banner!", "Cannot delete banner.", 'negative', '', )
      }
    })
  }
}
