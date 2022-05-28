import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrsService {

  feed:any ={
    closeButton:true, 
    timeOut:5000,
    extendedTimeOut:1000,
    easing:'ease-in',
    enableHtml:false,
    progressBar:true,
    progressAnimation:'decreasing',// 'increasing
    toastClass:'ngx-toastr',
    positionClass:'toast-top-right',
    titleClass:'toast-title',
    messageClass:'toast-message',
    tapToDismiss:true,
    onActivateTick:false
  }
  Ninfo:any ={
    closeButton:true, 
    timeOut:4000,
    extendedTimeOut:1000,
    easing:'ease-in',
    enableHtml:false,
    progressBar:true,
    progressAnimation:'decreasing',// 'increasing
    toastClass:'ngx-toastr',
    positionClass:'toast-top-right',
    titleClass:'toast-title',
    messageClass:'toast-message',
    tapToDismiss:true,
    onActivateTick:false
  }

  warn:any ={
    closeButton:true, 
    timeOut:4000,
    extendedTimeOut:1000,
    easing:'ease-in',
    enableHtml:false,
    progressBar:true,
    progressAnimation:'decreasing',// 'increasing
    toastClass:'ngx-toastr wrn',
    positionClass:'toast-bottom-right',
    titleClass:'toast-title',
    messageClass:'toast-message',
    tapToDismiss:true,
    onActivateTick:false
  }
  constructor(private toastr: ToastrService) { }

  success(header:string, msg:string) {
    this.toastr.success(msg,header, this.feed);
  }
  info(header:string, msg:string) {
    this.toastr.info(msg, header, this.Ninfo);
  }
  error(header:string, msg:string) {
    this.toastr.error(msg, header, this.feed);
  }
 
  warning(header:string, msg:string) {
    this.toastr.error(msg, header, this.warn);
  }
}
