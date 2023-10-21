import { Component, OnDestroy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Editor, Toolbar, toHTML } from 'ngx-editor';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit, OnDestroy {
  
  @Output() value: EventEmitter<string> = new EventEmitter();
  @Input() darkmode!: boolean;
  
  editor: Editor;
  html = '';
  
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['format_clear']
  ];
  
  ngOnInit(): void {
    this.editor = new Editor();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  
  editorReset(){
    this.editor.setContent('');
  }
  
  onEditorInput(event: Event): void {
    const htmlTextEditor = this.html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTextEditor, 'text/html');
    
    // Access the children of the <body> element
    const bodyChildren = Array.from(doc.body.children);
    const container = document.createElement('div');
    
    // Append the body children to the container
    bodyChildren.forEach(child => {
      container.appendChild(child.cloneNode(true)); 
    });
    
    // Get the HTML string of the container
    const htmlString = container.innerHTML;
    
    this.value.emit(htmlString); 

  }

}


    // // Get the input value from the event
    // const htmlTextEditor = this.html;
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(htmlTextEditor, 'text/html');
    // const jsonText = JSON.stringify(this.serializeNode(doc.documentElement), null, 2);
    // // console.log(jsonText);
    // this.value.emit(jsonText)
    
    // const htmlTextEditor = this.html;
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(htmlTextEditor, 'text/html');
    // const htmlString = doc.documentElement.innerHTML;
  
    // this.value.emit(htmlString); // Emit the HTML string
    
      
  // serializeNode(node: Node): any {
  //   const obj: any = {
  //     type: node.nodeType,
  //     name: node.nodeName,
  //   };
  
  //   if (node.nodeType === Node.TEXT_NODE) {
  //     obj.value = node.nodeValue;
  //   } else {
  //     obj.children = Array.from(node.childNodes).map(childNode => this.serializeNode(childNode));
  //   }
  
  //   return obj;
  // }