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
  postWZPrice: any;
  refreshChatMessage: boolean = false;


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
  handleDataWZPrice(data: any) {
    this.postWZPrice= data;
  }
  handlePostRefreshChatMessage(data: boolean) {
    this.refreshChatMessage = data;
  }
}
