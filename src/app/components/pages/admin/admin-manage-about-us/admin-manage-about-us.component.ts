import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap, tap } from 'rxjs';
import { AboutUsTosService } from 'src/app/services/about-us-tos/about-us-tos.service';
import { AboutUsTosSection } from 'src/assets/models/sitedetails';
import { OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { HttpErrorResponse } from '@angular/common/http';
import { formatAboutUsTos } from 'src/app/utilities/response-utils';
import { RichTextEditorComponent } from 'src/app/components/components/rich-text-editor/rich-text-editor.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';

@Component({
  selector: 'app-admin-manage-about-us',
  templateUrl: './admin-manage-about-us.component.html',
  styleUrls: ['./admin-manage-about-us.component.css']
})
export class AdminManageAboutUsComponent {
  @ViewChild(TableComponent) table: TableComponent;
  // theme
  titleColor: string = 'text-white';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  
  size: string = 'w-100';
  aboutUsSections: Observable<AboutUsTosSection[]>;

  showAddSectionForm: boolean = false;
  showEditSectionForm: boolean = false;

  aboutUsAddSectionForm = this.formBuilder.group({
    sectionHeader: ['', [Validators.required, Validators.pattern('^[a-zA-Z\d_ .!?]*$')]],
  });

  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 
  rtfValue: string;
  setValue: string;

  @ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild('rte') childComponent: RichTextEditorComponent;
  @ViewChild(RichTextEditorComponent) editor: RichTextEditorComponent;

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

  constructor(private aboutUsToSService: AboutUsTosService, private formBuilder: FormBuilder, private error: ErrorHandlerService) {}

  ngOnInit(): void
  {
    this.aboutUsSections = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.aboutUsToSService.getAboutUs()),
      map((response: any) => formatAboutUsTos(response)),
      tap(() => {
        this.table.loaded()
      })
      
    );
  }


  getRTFValue(value: any){
      // console.log(value)
      this.rtfValue = value
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

  toggleEditSectionForm(): void {
    this.showEditSectionForm = !this.showEditSectionForm;
  }


  getSelectedSection(section: any) {
    this.selectedSection = section;
  }

  getEditSection(section: any): void {
    this.toggleEditSectionForm();
    this.selectedSection = section;
    this.aboutUsAddSectionForm.get('sectionHeader')?.setValue(section.title);

    setTimeout(() => {
      this.editor.editorSetValue(this.selectedSection.content);
    }, 1000);
  }
  submitAddSectionForm()
  {
    if(this.aboutUsAddSectionForm.valid) {

      let formData: any = new FormData();
      formData.append('title', this.aboutUsAddSectionForm.get('sectionHeader')?.value);
      formData.append('content', this.rtfValue);

      for (const value of formData.entries()) {
        console.log(`${value[0]}, ${value[1]}`);
      }
      
      this.aboutUsToSService.postAddAboutUs(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Manage Contents', response.message);
          
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

  submitEditSectionForm()
  {
    if(this.aboutUsAddSectionForm.valid) {

      let formData: any = new FormData();
      formData.append('id', this.selectedSection.id);
      formData.append('title', this.aboutUsAddSectionForm.get('sectionHeader')?.value);
      formData.append('content', this.rtfValue);

      for (const value of formData.entries()) {
        console.log(`${value[0]}, ${value[1]}`);
      }
      
      this.aboutUsToSService.patchEditAboutUs(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Manage Contents', response.message);
          
          this.aboutUsAddSectionForm.reset();

          this.refreshTableData();

          this.toggleEditSectionForm();
        },
        error: (error: HttpErrorResponse) => {
          this.showFailedToast('Manage Contents', this.error.handle(error));

        }
      });

    } else {
      this.showWarnToast('Missing required fields.', 'Please fill up the form completely.');
    }
  }

  private showSuccessToast(header: string, content: string)
  {
    this.toaster.showToast(header, content, 'default', '', )
  }

  private showFailedToast(header: string, content: string)
  {
    this.toaster.showToast(header, content, 'negative', '', )
  }
  
  private showWarnToast(header: string, content: string)
  {
    this.toaster.showToast(header, content, 'warn', '', )
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
