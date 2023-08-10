import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { AboutUsTosService } from 'src/app/services/about-us-tos/about-us-tos.service';
import { AboutUsTosSection } from 'src/assets/models/sitedetails';
import { OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { HttpErrorResponse } from '@angular/common/http';
import { formatAboutUsTos } from 'src/app/utilities/response-utils';

@Component({
  selector: 'app-admin-manage-about-us',
  templateUrl: './admin-manage-about-us.component.html',
  styleUrls: ['./admin-manage-about-us.component.css']
})
export class AdminManageAboutUsComponent {

  aboutUsSections: Observable<AboutUsTosSection[]>;

  showAddSectionForm: boolean = false;

  aboutUsAddSectionForm = this.formBuilder.group({
    sectionHeader: ['', [Validators.required, Validators.pattern('^[a-zA-Z\d_ .!?]*$')]],
    sectionContent: ['', [Validators.required]]
  });

  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 
  @ViewChild(ToastComponent) toast: ToastComponent;

  selectedSection: AboutUsTosSection = {
    id: '',
    title: '',
    content: '',
    order: 0,
    updated_at: '',
    created_at: '',
  };

  @ViewChild("confirmDeleteModal") confirmDeleteModal: ElementRef;

  modal: bootstrap.Modal;

  private refreshData$ = new Subject<void>();

  constructor(private aboutUsToSService: AboutUsTosService, private formBuilder: FormBuilder) {}

  ngOnInit(): void
  {
    this.aboutUsSections = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.aboutUsToSService.getAboutUs()),
      map((response: any) => formatAboutUsTos(response)),
    );
  }

  refreshTableData(): void {
    this.refreshData$.next();
  }

  closeModal()
  {
    this.confirmDeleteModal.nativeElement.click();
  }

  toggleAddSectionForm(): void
  {
    this.showAddSectionForm = !this.showAddSectionForm;
  }

  getSelectedSection(section: any)
  {
    this.selectedSection = section;
  }

  submitAddSectionForm()
  {
    if(this.aboutUsAddSectionForm.valid) {

      let formData: any = new FormData();
      formData.append('title', this.aboutUsAddSectionForm.get('sectionHeader')?.value);
      formData.append('content', this.aboutUsAddSectionForm.get('sectionContent')?.value);

      console.log(formData);

      this.aboutUsToSService.postAddAboutUs(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Successfully added section', 'Added a section to about us.');

          this.aboutUsAddSectionForm.reset();

          this.refreshTableData();

          this.toggleAddSectionForm();
        },
        error: (error: HttpErrorResponse) => {
          this.showFailedToast('Failed to add section', 'Something wen\'t wrong when adding section.');

          console.log(error);
        }
      });

    } else {
      this.showWarnToast('Missing required fields.', 'Please fill up the form completely.');
    }
  }

  private showWarnToast(header: string, content: string)
  {
    this.toastHeader = header;
    this.toastContent = content;
    this.toast.switchTheme('warn');
    this.toast.show();
  }

  private showSuccessToast(header: string, content: string)
  {
    this.toastHeader = header;
    this.toastContent = content;
    this.toast.switchTheme('default');
    this.toast.show();
  }

  private showFailedToast(header: string, content: string)
  {
    this.toastHeader = header;
    this.toastContent = content;
    this.toast.switchTheme('negative');
    this.toast.show();
  }

  public deleteAboutUsSection()
  {
    if(this.selectedSection != null) {
      let formData: any = new FormData();
      formData.append('id', this.selectedSection.id);

      this.aboutUsToSService.deleteAboutUsSection(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Successfully deleted section', 'Removed a section to about us.');

          this.closeModal();

          this.refreshTableData();

          // Reset selected
          this.selectedSection = {
            id: '',
            title: '',
            content: '',
            order: 0,
            updated_at: '',
            created_at: '',
          };

        },
        error: (error: HttpErrorResponse) => {
          this.showFailedToast('Failed to remove section', 'Something wen\'t wrong when removing section.');

          console.log(error);
        }
      });
    } else {
      this.showWarnToast('No Section Selected', 'Please select a section to delete.');
    }
  }
}
