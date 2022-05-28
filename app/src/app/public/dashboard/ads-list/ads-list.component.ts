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
  

  public add_list : any[] = [];
  public selectedAds: any = '';
  public comp_list: any = [];
  public showdetails: boolean = false;
  public priceUpdate: boolean = false;
  public val: number = 12;
  public wazirxBidPrice: number = 12;
  public wazirxUPPrice: number = 12;
  public pageSize: number = 100;
  public page: number = 1;
  public collectionSize: number = 0;
  public adsPrice: number = 0;
  public returnedPrice: number = 0;
  public returnedWazirxPrice: number = 0;
  public advNo: string = "";
  public asset: string = "";
  private adsDetailsSub: Subscription = new Subscription();
  private wzssDetailsSub: Subscription = new Subscription();
  public wzsData: any[] = [];
  public currentBtn: number = 0;

  
  constructor(private _service: DashboardService, 
    private _notify: ToastrsService, 
    private _zone: NgZone, 
    private _socketService: SocketService,
    private elem: ElementRef) { }
  
  ngOnInit(): void {
    this.getAdsData(this.page);
  }

  getAdsData(page: number) {
    const postData = {"page": page, "rows": this.pageSize}
    this._service.getAdsData(postData).subscribe((res: any) => {
      if (!!res && res.data.success && res.data.data.length > 0) {
        this.add_list = res.data.data;
        this.collectionSize = res.data.total;
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
    this._service.getMargin(obj.asset).subscribe((res: any) => {
      this.val = res.data.margin || 0;
      this.postAdsDetails.emit({"margin":res.data.margin, "asset": obj.asset, "advNo": obj.advNo});
    }, (error: any) => {
      this._notify.error('Error', error); 
    })
    this.wazirxBidPrice = 0;
    this.wazirxUPPrice = 0; 
    this.selectedAds = obj;
    this.selectedAds.price_equation = 78.4;
    this.advNo = obj.advNo;
    this.asset = obj.asset;
    //this.selectedAds.msg = this.selectedAds.msg.replace(/\n/g, "<br />");
    this.wzssDetailsSub = this._socketService.getWazirxDetails().subscribe((data: any) => {
      this.wzsData = data.filter((data: any) => data.coin.includes(this.asset));
      this.wazirxBidPrice = this.wzsData[0] && this.wzsData[0].wp ? parseFloat(this.wzsData[0].wp) : this.wazirxBidPrice;
      this.wazirxUPPrice = this.wzsData[0] && this.wzsData[0].wup ? parseFloat(this.wzsData[0].wup) : this.wazirxUPPrice
      this.val = this.wzsData[0] && this.wzsData[0].uplimit ? parseFloat(this.wzsData[0].uplimit) * 100 : this.val;
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

  getAdsPrice(advNo: any) {
    this._service.getAdDetailsByNo(advNo).subscribe((res: any) => {
      if (!!res && res.data.success) {
        this.returnedPrice = parseFloat(res.data.data.price);
      }
    },(error: any) => {
      this._notify.error("Error", error)
    });
    return this.returnedPrice;
    //return Math.random();
  }
  // getWazirxPrice(asset: any): string {
  //   this._service.getWazirxPrice().subscribe((res: any) => {
  //     if (!!res && res.data.success) {
  //       this.returnedWazirxPrice = res.data.data.price;
  //     }
  //   },(error: any) => {
  //     this._notify.error("Error", error)
  //   });
  //   //return this.returnedPrice;
  //   return Math.random();
  // }

  ngOnDestroy(): void {
    this.adsDetailsSub.unsubscribe();
    this.wzssDetailsSub.unsubscribe();
  }

}
