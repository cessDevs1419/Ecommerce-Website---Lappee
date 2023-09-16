import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GETAttributesAdmin, PostAttributeAdmin } from '../endpoints';
import { AttributeList, Attributes } from 'src/assets/models/attributes';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  private attributesID: FormArray = this.formBuilder.array([]);
  private attributesNAME: FormArray = this.formBuilder.array([]);

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

  getSelectedAttributesID(): FormArray {
    return this.attributesID;
  }
  
  getSelectedAttributesName(): FormArray {
    return this.attributesNAME;
  }
  
  postSelectedAttribute(id: FormControl, name: FormControl): void {
    this.attributesID.push(id)
    this.attributesNAME.push(name)
  } 
  
  removeSelectedAttribute(index: number){
    this.attributesID.removeAt(index)
    this.attributesNAME.removeAt(index)
  }
  
  removeAllSelectedAttribute(){
    this.attributesID.clear()
    this.attributesNAME.clear()
  }
  
}
