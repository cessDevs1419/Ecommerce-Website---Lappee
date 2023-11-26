import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import channels from 'pusher-js/types/src/core/channels/channels';
import { Observable, Subject, filter, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { formatChats, formatUser } from 'src/app/utilities/response-utils';
import { Chats } from 'src/assets/models/chats';
import { User } from 'src/assets/models/user';

interface CustomFile extends File {
  url?: string;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  @ViewChild('fileInputs') fileInputs: ElementRef;
  @Output() rowData: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Input() size: string = ''
  @Input() admin!: boolean;
  @Input() individual!: boolean;
  @Input() client!: boolean;
  @Input() channels!: Observable<any>;
  @Input() chatData!: Observable<any>;
  @Input() chatRows: any[];
  @Input() selectedRowData: any;
  @Input() closeBtn!: boolean;
  @Input() ChatTitle: string = ''

  private refreshData$ = new Subject<void>();
  containerbordercolor: string = ''
  panel_bg: string = ''
  text_color: string = ''
  channelboxContainer: string = ''
  chatboxContainer: string = ''

  public searchString: string;
  public openedAccount: any[] = []
  public convo_active: boolean[] = [];
  
  chatsList!: Observable<Chats[]>;
  user: Observable<User[]>;

  messageContent: FormGroup;
  isLoading: boolean = true;
  files: any[] = []
  imageSrc: string;
  file: string
  active: boolean = false;
  loggedInUserId: string | null; 
  conversation_id: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private chats: ChatsService,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    public accountService: AccountsService
  ){
    this.chats.removeChat()
    this.openedAccount = this.chats.getActiveChats()
    this.convo_active = Array(this.openedAccount.length).fill(false);
    this.messageContent = new FormGroup({
      content: new FormControl('', Validators.required)
    });

    this.user = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.accountService.getLoggedUser()),
      map((Response: any) => formatUser(Response))
  );

  }

  ngOnInit(): void{
    if(this.client){
      this.containerbordercolor = 'linear-gradient-border'
      this.panel_bg = 'bg-white'
      this.text_color = 'text-dark-emphasis'
    }else{
      this.containerbordercolor = 'linear-gradient-border'
      this.panel_bg = 'table-bg-dark'
      this.text_color = 'text-white-50'
    }
    this.route.paramMap.subscribe((params) => {
			const id = params.get('id');

      this.chatsList = this.refreshData$.pipe(
        startWith(undefined),
        switchMap(() => {
          if (id !== null) {
            return this.chatsService.getConversation(id);
          } else {
            return of(null);
          }
        }),
        filter(response => response !== null), 
        map((response: any) => formatChats(response)),
        tap(() => {
            this.loaded()
        })
      );

      this.conversation_id = id !== null ? id : ''; 
      console.log(this.chatsList)

		});

  }
  
  refreshTableData(): void {
    this.refreshData$.next();
  }


	loaded(){
		this.isLoading = false
	}

  fileInput(){
    this.fileInputs.nativeElement.click();
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.readAndDisplayFile(files[i]);
    }
  }

  readAndDisplayFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const customFile: CustomFile = file as CustomFile;
      customFile.url = reader.result as string;
      this.files.push(customFile);
      this.active = true
    };

    reader.readAsDataURL(file);
  }

  convertToBase64(data: string): string {
    return data.replace(/^data:image\/[a-z]+;base64,/, "");
  }

  isImage(item: any): boolean {
    if (item && item.name) {
      const fileName = item.name.toLowerCase();
      return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif');
    }
    return false;
  }

  getFileType(fileName: string): string {
    const fileType = fileName.split('.').pop(); 
    return fileType ? fileType.toUpperCase() : ''; 
  }

  removeFile(index: number){
    this.files.splice(index)
    this.active = false
  }

  send(id: string){
    const contentValue = this.messageContent.get('content')?.value;
    const currentTime = new Date().toLocaleTimeString(); 
    

    let formData: any = new FormData();
    formData.append('conversation_id',  this.conversation_id)
    formData.append('message', contentValue)
    // console.log('file', this.files)
    // console.log('Current Time:', currentTime);
    this.messageContent.reset()
    this.active = false

    formData.forEach((value: any, key: number) => {
      console.log(`${key}: ${value}`);
    });

    this.chatsService.sendConvo(formData).subscribe({
      next: (response: any) => { 
        console.log(response)
      },
      error: (error: HttpErrorResponse) => {
          // if (error.error?.data?.error) {
          //     const fieldErrors = error.error.data.error;
          //     const errorsArray = [];
          
          //     for (const field in fieldErrors) {
          //         if (fieldErrors.hasOwnProperty(field)) {
          //             const messages = fieldErrors[field];
          //             let errorMessage = messages;
          //             if (Array.isArray(messages)) {
          //                 errorMessage = messages.join(' '); // Concatenate error messages into a single string
          //             }
          //             errorsArray.push(errorMessage);
          //         }
          //     }
          
          //     const errorDataforProduct = {
          //         head: 'Error Invalid Inputs',
          //         sub: errorsArray,
          //     };
          
          //     this.CategoryWarn.emit(errorDataforProduct);
          // } else {
          
          //     const errorDataforProduct = {
          //         head: 'Error Invalid Inputs',
          //         sub: 'Please Try Another One',
          //     };
          //     this.CategoryError.emit(errorDataforProduct);
          // }
          console.log(error)
          return throwError(() => error);
          
      }
    });


  }

  getData(data: any){
    this.rowData.emit(data)
  }

  getUser(data: any, index: number){
    this.router.navigate(['/admin/chats',data.user_id]);
    
    //for showcase only real process will be at the page load
    this.channelboxContainer = 'channel-box-container-inactive'
    this.chatboxContainer = 'chat-box-container-active'
    this.chats.removeChat()
    this.chats.setActiveChats(data);
    this.convo_active = Array(this.openedAccount.length).fill(false);
    this.convo_active[index] = true;
  }

  back(){
    this.router.navigate(['/admin/chats']);

    this.channelboxContainer = ''
    this.chatboxContainer = ''
  }

  closeChat(){
    this.closeModal.emit()
  }
  

  
}
