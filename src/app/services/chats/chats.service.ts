import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private activeChat: any[] = []
  constructor() { }

  getActiveChats(){
    return this.activeChat;
  }

  setActiveChats(chats: any){
    this.activeChat.push(chats)
  }
  removeChat(){
    this.activeChat.splice(0)
  }
}
