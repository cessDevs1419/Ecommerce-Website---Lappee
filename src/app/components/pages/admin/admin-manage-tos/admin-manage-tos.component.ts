import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { RichTextEditorComponent } from 'src/app/components/components/rich-text-editor/rich-text-editor.component';
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


  titleColor: string = 'text-white';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  
  aboutUsSections: Observable<AboutUsTosSection[]>;

  showAddSectionForm: boolean = false;
  rtfValue: string;
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 
  @ViewChild(ToastComponent) toast: ToastComponent;
  @ViewChild('rte') childComponent: RichTextEditorComponent;
  @ViewChild("confirmDeleteModal") confirmDeleteModal: ElementRef;

  modal: bootstrap.Modal;

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

  private refreshData$ = new Subject<void>();

  constructor(private aboutUsToSService: AboutUsTosService, private formBuilder: FormBuilder) {}

  ngOnInit(): void
  {
    this.aboutUsSections = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.aboutUsToSService.getTos()),
      map((response: any) => formatAboutUsTos(response)),
    );
  }

  refreshTableData(): void {
    this.refreshData$.next();
  }
  getRTFValue(value: any){
      // console.log(value)
      this.rtfValue = value
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
    if(this.tosAddSectionForm.valid) {

      let formData: any = new FormData();
      formData.append('title', this.tosAddSectionForm.get('sectionHeader')?.value);
      formData.append('content', this.rtfValue);

      console.log(formData);

      this.aboutUsToSService.postAddToS(formData).subscribe({
        next: (response: any) => {
          this.showSuccessToast('Successfully added section', 'Added a section to about us.');

          this.tosAddSectionForm.reset();

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

  public deleteToSSection()
  {
    if(this.selectedSection != null) {
      let formData: any = new FormData();
      formData.append('id', this.selectedSection.id);

      this.aboutUsToSService.deleteToSSection(formData).subscribe({
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
