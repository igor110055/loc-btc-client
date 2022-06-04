import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-portals',
  templateUrl: './portals.component.html',
  styleUrls: ['./portals.component.css']
})
export class PortalsComponent implements OnInit {
  wBidPrice: any = {};
  setzpoff: boolean = true
  setzpon: boolean = false
  setwon: boolean = true
  setwoff: boolean = false
  @Input("fetchWBidPrice") set function(data: any) {
    this.wBidPrice = data;
  }
  constructor() { }

  ngOnInit(): void {
  }

  selectedWP(data: any) {
    if(data.target.value == "on") {
      this.setzpoff = true;
      this.setzpon = false;
      this.setwon = true;
      this.setwoff = false;
    } else {
      this.setzpoff = false;
      this.setzpon = true;
      this.setwon = false;
      this.setwoff = true;
    }
  }
  selectedZP(data: any) {
    if(data.target.value == "on") {
      this.setwoff = true;
      this.setwon = false;
      this.setzpoff = false;
      this.setzpon = true;
    } else {
      this.setwoff = false;
      this.setwon = true;
      this.setzpoff = true;
      this.setzpon = false;
    }
  }
}
