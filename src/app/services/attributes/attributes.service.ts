import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GETAttributesAdmin, PostAttributeAdmin } from '../endpoints';
import { AttributeList, Attributes } from 'src/assets/models/attributes';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  private attributes: FormArray = this.formBuilder.array([]);
  private attributesArray: any[] = [];
  private index: number;
  constructor(private http: HttpClient,
    private formBuilder: FormBuilder
  ) { 

  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  getAttribute(): Observable<any>{
      return this.http.get<AttributeList>(GETAttributesAdmin);
  }
  
  postAttribute(data: FormData): Observable<any> {
      return this.http.post<Attributes>(PostAttributeAdmin, data, this.httpOptions);
  } 
  
  // patchAttribute(data: FormData): Observable<any> {
  //     return this.http.patch<Attributes>(PatchAttributeAdmin, data, this.httpOptions);
  // } 
  
  // deleteAttribute(attributeId: number): Observable<any> {
  //   return this.http.delete(DeleteAttribute, {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': 'true'
  //     }),
  //     responseType: 'json',
  //     body: {
  //         id: attributeId
  //       }
  //   })
  // }

  getSelectedAttributes(): FormArray {
    return this.attributes;
  }
  
  postSelectedAttribute(data: Attributes[]): void {
    data.forEach((attribute) => {
      this.attributes.push(this.formBuilder.group(attribute)); 
    });
  } 
  
  removeSelectedAttribute(id: string){
    const index = this.attributes.controls.findIndex(control => control.value.id === id);
    if (index !== -1) {
      this.attributes.removeAt(index);
    }
  }
  
  removeAllSelectedAttribute(){
    this.attributes.clear()
  }

  postIndex(index: number){
    this.index = index
  }
  
  getIndex(){
    return this.index
  }

  postSelectedAttributeForm(attribute: any): void {
    this.attributesArray.push(attribute);
    console.log(this.attributesArray);
  }

  getSelectedAttributesForm(): any[] {
    return this.attributesArray;
  }
  removeSelectedAttributeForm(id: string) {
    // const index = this.addAttributeForm.findIndex((formGroup) => formGroup.get('id')?.value === id);
    // if (index !== -1) {
    //   this.addAttributeForm.splice(index, 1);
    // }
  }
  
}
