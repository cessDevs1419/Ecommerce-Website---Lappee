import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  @Input() size: string = ''
  @Input() admin!: boolean;
  @Input() individual!: boolean;
  @Input() client!: boolean;
  @Input() channels!: Observable<any>;
  @Input() chatData!: Observable<any>;
  @Input() chatRows: any[];
  @Input() selectedRowData: any;

  public searchString: string;
  public openedAccount: any[] = []
  messageContent: FormGroup;
  isLoading: boolean = true;
  
  constructor(
    private formBuilder: FormBuilder,
  ){

    this.messageContent = new FormGroup({
      content: new FormControl('', Validators.required),
  });
  }
  send(){
    const contentValue = this.messageContent.get('content')?.value;
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    
    console.log('Content:', contentValue);
    console.log('Current Time:', currentTime);
  }
	loaded(){
		this.isLoading = false
	}
  getUser(data: any, index: number){
    this.openedAccount.splice(0)
    this.openedAccount.push(data)
  }
  
}
