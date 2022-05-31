import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Observable, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastrsService } from 'src/app/services/toastrs.service';

@Component({
  selector: 'app-ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.css']
})
export class AdsListComponent implements OnInit, OnDestroy {

  @Output() postAdsDetails = new EventEmitter<any>();
  @Input() public set fetchUpdatedMarginData(data: any) {
    this.val = data
  }
  

  public add_list : any = {};
  public comp_list: any = [];
  public showdetails: boolean = false;
  public priceUpdate: boolean = false;
  public adsPrice: number = 0;
  public val: number = 0;
  public wazirxBidPrice: number = 0;
  public wazirxUPPrice: number = 0;
  private adsDetailsSub: Subscription = new Subscription();
  private wzssDetailsSub: Subscription = new Subscription();
  public wzsData: any = {};
  public currentBtn: number = 0;

  
  constructor(private _service: DashboardService, 
    private _notify: ToastrsService, 
    private _zone: NgZone, 
    private _socketService: SocketService,
    private elem: ElementRef) { }
  
  ngOnInit(): void {
    this.getAdsData();
  }

  getAdsData() {
    this._service.getAdsData().subscribe((res: any) => {
      console.log(res);
      if (!!res && res.message == "OK") {
        console.log(res);
        this.add_list = res.data.ad_list[0].data;
        console.log(this.add_list);
        this.adsPrice = this.add_list.temp_price ? this.add_list.temp_price : this.add_list.price_equation;
        this.onSelect(this.add_list[0], 0);
      }
    },(error: any) => {
      this._notify.error('Error', error);
    });
  }

  onSelect(obj: any, i: number) {
    this.currentBtn = i;
    this.showdetails = true;    
    this.priceUpdate = true;  
    this.val = 1;
    this._service.getMargin().subscribe((res: any) => {
      this.val = res.data.BTCINR.margin;
      this.postAdsDetails.emit({"margin":res.data.BTCINR.margin, "asset": res.data.BTCINR.currency});
    }, (error: any) => {
      this._notify.error('Error', error); 
    })
    this.wazirxBidPrice = 0;
    this.wazirxUPPrice = 0; 
    this.wzssDetailsSub = this._socketService.getWazirxDetails().subscribe((data: any) => {
      this.wzsData = data;
      this.wazirxBidPrice = this.wzsData && this.wzsData.wp ? parseFloat(this.wzsData.wp) : this.wazirxBidPrice;
      this.wazirxUPPrice = this.wzsData && this.wzsData.wup ? parseFloat(this.wzsData.wup) : this.wazirxUPPrice
      this.val = this.wzsData && this.wzsData.uplimit ? parseFloat(this.wzsData.uplimit) * 100 : this.val;
    },(error) => {
      this._notify.error("Error", error);
    })
    interval(1000).pipe(
      map(() => this._socketService.setMerchantAd())
    ).subscribe();
    this._socketService.setMerchantAd();
    this.adsDetailsSub = this._socketService.getMerchantAdDetails().subscribe(
      (res: any) => {
        if (res && res.data && res.message == 'success') {
          console.log(res)
        }else {
          this._notify.error('Error', "Something went wrong");
        }
      },
      (error: any) => {
        this._notify.error('Error', error);
      }
    );

  }

  getCompListById(id: any) {
    this._service.getDetailsById(id).subscribe((res: any) => {
      if (!!res && res.status) {
        if (res.comp_ids.length > 0) {
          this.comp_list = res.comp_ids;
          this._notify.success('Success', res.message);
        } else {
          this._notify.error('Error', res.message);
          this._notify.error('Error', res.data);
          this.comp_list = [];
        }
      }
    },(error: any) => {
      this._notify.error("Error", error)
    });
  }

  

  ngOnDestroy(): void {
    this.adsDetailsSub.unsubscribe();
    this.wzssDetailsSub.unsubscribe();
  }

}
