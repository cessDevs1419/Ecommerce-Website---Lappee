import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import * as bootstrap from 'bootstrap'; 


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})



export class ModalComponent {
	//Delete Item
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild('modalRef', { static: true }) modalRef!: ElementRef;

	
	@Output() success: EventEmitter<any> = new EventEmitter();
	@Output() invalid: EventEmitter<any> = new EventEmitter();
	@Output() delete: EventEmitter<any> = new EventEmitter();
	@Output() RefreshTable: EventEmitter<void> = new EventEmitter<void>();
	
	@Input() modalId!: string;
    @Input() modalTitle!: string;
	@Input() modalSubTitle!: string;
	
	@Input() selectedRowData: any;
	@Input() modalDeleteCategory!: boolean;
	@Input() modalDeleteSubCategory!: boolean;
	@Input() modalDeleteProduct!: boolean; 
	@Input() modalDeleteVariant!: boolean;
	@Input() modalBanAccounts!: boolean;  
	@Input() modalUnBanAccounts!: boolean; 
	
    private bsModal: bootstrap.Modal;

    backdrop: string = 'true';
	toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    

    onRowDataSelected(rowData: any) {
        console.log('nagana', rowData)
    }
    
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 2500); 
        });
    }
    
    async closeModal() {
        await this.asyncTask();
    
    }

    
	triggerRefreshTable(): void {
		this.RefreshTable.emit();
        console.log('nagana')
	}

    
	deleteSuccessToast(value: any): void {
        this.toastHeader = value.head;
        this.toastContent = value.sub;
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	banSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully Banned";
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	unbanSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully UnBanned";
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
    WarningToast(value: any): void {
        this.toastHeader = value.errorMessage;
        this.toastContent = value.suberrorMessage;
        this.toast.switchTheme('warn');
        this.toast.show();
    }
    
	ErrorToast(value: any): void {
        this.toastHeader = value.errorMessage;
        this.toastContent = value.suberrorMessage;
        this.toast.switchTheme('negative');
        this.toast.show();
    }
    
}
