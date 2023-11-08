import { Component, ComponentRef, Input, ViewContainerRef } from '@angular/core';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { ToastComponent } from '../../toast/toast.component';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent {
  constructor(private toast: ToastsService, public vcr: ViewContainerRef) {}

  @Input() positionClasses: string = ''
  @Input() maxToastsShown: number = 5
  @Input() limitWidth: boolean = true;

  activeToasts: ComponentRef<ToastComponent>[] = [];
  index: number = 0;

  showToast(title: string, message: string, theme: string = 'default', customClass: string = "", routerLink: string = "", limitWidth: boolean = true): void {
    console.log(limitWidth)
    const toast = this.toast.showToast(title, message, theme, customClass, routerLink, limitWidth);
    let index = this.index;

    // limit toasts shown
    if(this.activeToasts.length == this.maxToastsShown){
      this.index = 0;
      this.destroyToast(this.activeToasts[index], index);
    }

    if(toast){
      toast.instance.show();
      this.activeToasts.push(toast);
    }

    //console.log(this.activeToasts)
    setTimeout(() => {
      toast.instance.hide();
      this.destroyToast(toast, index);
    }, 5000)
  }

  destroyToast(toast: ComponentRef<ToastComponent>, index: number): void {
    setTimeout(() => {
      toast.destroy();
      toast.hostView.detach();
      this.activeToasts.splice(index, 1);
    }, 500)
  }
}
