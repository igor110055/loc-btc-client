import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  isShow: boolean | undefined;
  constructor(private spin: NgxSpinnerService) { }


  show() {
    this.isShow = true;
    this.spin.show();
    setTimeout(() => {
      if (this.isShow) {
        this.spin.hide();
      }
    }, 8000);
  }

  hide() {
    this.isShow = false;
    this.spin.hide();
  }

}

