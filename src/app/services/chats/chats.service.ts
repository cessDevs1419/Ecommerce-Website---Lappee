import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chats, ChatsChannel } from 'src/assets/models/chats';
import { DELETEConvo, GETConversation, GETConversationList, POSTSendConvo } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private activeChat: any[] = []
  constructor(private http: HttpClient) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };

  getActiveChats(){
    return this.activeChat;
  }

  setActiveChats(chats: any){
    this.activeChat.push(chats)
  }
  removeChat(){
    this.activeChat.splice(0)
  }
  getAllChats(): Observable<ChatsChannel>{
    return this.http.get<ChatsChannel>(GETConversationList);
  }
  getConversation(id: string ): Observable<Chats>{
    return this.http.get<Chats>(GETConversation + id);
  }

  sendConvo(data: FormData): Observable<any> {
    return this.http.post<Chats>(POSTSendConvo, data, this.httpOptions);
  } 

  // deleteMessage(messageIds: number[]): Observable<any> {
  //   return this.http.delete(DELETEConvo, {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': 'true'
  //     }),
  //     responseType: 'json',
  //     body: {
  //       message: messageIds 
  //     }
  //   })
  // }
  
}
