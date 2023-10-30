import { ApplicationRef, ComponentRef, Injectable, ViewContainerRef, createComponent } from '@angular/core';
import { Toast } from 'bootstrap';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(private appRef: ApplicationRef) { }

  showToast(title: string, message: string, theme: string = 'default', customClass: string = "", routerLink: string = ""): ComponentRef<ToastComponent> {
    let toast = createComponent(ToastComponent, {
      environmentInjector: this.appRef.injector
    })

    toast.instance.toastTitle = title;
    toast.instance.toastContent = message;
    toast.instance.toastClass = title;
    if(theme){
      toast.instance.switchTheme(theme)
    }

    if(customClass){
      toast.instance.toastClass = customClass
    }

    if(routerLink){
      toast.instance.routerLink = routerLink
    }

    this.appRef.attachView(toast.hostView)
    toast.changeDetectorRef.detectChanges()
    document.getElementById('toast-container')?.appendChild(toast.location.nativeElement)

    return toast
  }


}
