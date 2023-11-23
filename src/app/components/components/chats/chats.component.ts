import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import channels from 'pusher-js/types/src/core/channels/channels';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats/chats.service';

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

  containerbordercolor: string = ''
  panel_bg: string = ''
  text_color: string = ''
  channelboxContainer: string = ''
  chatboxContainer: string = ''

  public searchString: string;
  public openedAccount: any[] = []
  public convo_active: boolean[] = [];
  
  messageContent: FormGroup;
  isLoading: boolean = true;
  files: any[] = []
  imageSrc: string;
  file: string
  active: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private chats: ChatsService,
    private route: ActivatedRoute
  ){
    this.chats.removeChat()
    this.openedAccount = this.chats.getActiveChats()
    this.convo_active = Array(this.openedAccount.length).fill(false);
    this.messageContent = new FormGroup({
      content: new FormControl('', Validators.required)
    });

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
      console.log(id)
		});
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

  send(){
    const contentValue = this.messageContent.get('content')?.value;
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    
    console.log('Content:', contentValue);
    console.log('file', this.files)
    console.log('Current Time:', currentTime);
    this.messageContent.reset()
    this.active = false
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
