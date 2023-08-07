import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { AboutUsTosService } from 'src/app/services/about-us-tos/about-us-tos.service';
import { formatAboutUsTos } from 'src/app/utilities/response-utils';
import { AboutUsTosSection } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-admin-manage-tos',
  templateUrl: './admin-manage-tos.component.html',
  styleUrls: ['./admin-manage-tos.component.css']
})
export class AdminManageTosComponent {

  aboutUsSections: Observable<AboutUsTosSection[]>;

  showAddSectionForm: boolean = false;

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

  tosAddSectionForm = this.formBuilder.group({
    sectionHeader: ['', [Validators.required, Validators.pattern('^[a-zA-Z\d_ .!?]*$')]],
    sectionContent: ['', [Validators.required]]
  });


  constructor(private aboutUsToSService: AboutUsTosService, private formBuilder: FormBuilder) {}

  ngOnInit(): void
  {
    this.aboutUsSections = this.aboutUsToSService.getTos().pipe(
      map((response: any) => formatAboutUsTos(response))
    );
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
    if(this.tosAddSectionForm.valid) {

      let formData: any = new FormData();
      formData.append('title', this.tosAddSectionForm.get('sectionHeader')?.value);
      formData.append('content', this.tosAddSectionForm.get('sectionContent')?.value);

      console.log(formData);

      this.aboutUsToSService.postAddToS(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Successfully added section', 'Added a section to about us.');
          this.tosAddSectionForm.reset();
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

  public deleteToSSection()
  {
    if(this.selectedSection != null) {
      let formData: any = new FormData();
      formData.append('id', this.selectedSection.id);

      this.aboutUsToSService.deleteToSSection(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Successfully deleted section', 'Removed a section to about us.');

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
