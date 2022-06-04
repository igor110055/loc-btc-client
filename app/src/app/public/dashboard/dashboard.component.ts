import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chatStatusData: any;
  bankDetailsData: any;
  adsDetailsData: any;
  updatedMarginData: any;
  postWBidPrice: any;


  constructor() { }

  ngOnInit(): void {
  }
  handleDataChatStatus(data: any) {
    this.chatStatusData = data;
  }
  handleDataBankDetails(data:any) {
    this.bankDetailsData = data;
  }
  handleDataAdsListDetails(data: any) {
    this.adsDetailsData = data;
  }
  handleDataCompListUpdatedMargin(data: any) {
    this.updatedMarginData = data;
  }
  handleDataWBidPrice(data: any) {
    this.postWBidPrice= data;
  }
}
