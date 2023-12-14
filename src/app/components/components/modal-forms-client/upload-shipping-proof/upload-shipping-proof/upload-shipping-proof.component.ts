import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-shipping-proof',
  templateUrl: './upload-shipping-proof.component.html',
  styleUrls: ['./upload-shipping-proof.component.css']
})
export class UploadShippingProofComponent {

  imgname: string;
  imgpath: string;
  imgfile: any;

  shippingProofError: boolean;

  @ViewChild('shippingProofInput') imginput: ElementRef;

  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();

  shippingProofForm = new FormGroup({
    shippingProof: new FormControl('', Validators.required)
  })

  get shippingProof() { return this.shippingProofForm.get('shippingProof') }

  imageUpload(event: any): void {
    let img: File = event.target.files[0];
    let reader = new FileReader();
    this.imgfile = img;

    reader.onload = (e: any) => {
      this.imgpath = e.target.result;
    }

    this.imgname = img.name;
    reader.readAsDataURL(img);
  }

  clearImg(event: any): void {
    this.imginput.nativeElement.value = null;
    this.imginput.nativeElement.files = null;
    this.imgpath = '';
    this.imgname = ''; 
    this.shippingProof?.setValue(null);
    console.log("Img Proof: " + this.shippingProof?.valid);
  }

  dismissModal(): void {
    this.dismiss.emit();
  }

  validateUpload(): void {
    if(this.shippingProofForm.valid){
      let formdata: any;
      formdata.append('image', this.shippingProof?.value);

      // send form data
    }
    else {
      this.shippingProofForm.markAllAsTouched();
      this.shippingProofError = true;
    }
  }
}
