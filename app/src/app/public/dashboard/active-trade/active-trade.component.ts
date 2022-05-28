import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrsService } from 'src/app/services/toastrs.service';
import { map } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-active-trade',
  templateUrl: './active-trade.component.html',
  styleUrls: ['./active-trade.component.css'],
})
export class ActiveTradeComponent implements OnInit, OnDestroy {
  public open_trades_messages: any = '';
  public feedback: any = {};
  isChartRoomOpen: boolean = false;
  currentChartUser: any;
  currentChartRoom: any = [];
  currentLi: number = 0;
  private userOrderDetailsSub: Subscription = new Subscription();
  @Output() public postChatStatus = new EventEmitter<any>();
  constructor(
    private _service: DashboardService,
    private _notify: ToastrsService,
    private formBuilder: FormBuilder,
    private _socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.isChartRoomOpen = false;
    this.getStartEndMessages();
    this.openTradesMessages();
  }

  openChart(item: any, i: number) {
    this.currentChartRoom = [];
    this.currentChartUser = item;
    this.postChatStatus.emit({
      orderNo: item.orderNumber,
      status: true,
      selllerName: item.sellerNickname,
    });
    this.currentLi = i;
  }

  send_feedback() {
    this._service.SaveStartFeed(this.feedback).subscribe(
      (res: any) => {
        if (res && res.data && res.message == 'Success') {
          this._notify.success('Success', res.message);
          this._service.SaveEndFeed(this.feedback).subscribe(
            (res: any) => {
              if (res && res.data && res.message == 'Success') {
                this._notify.success('Success', res.message);
                this.getStartEndMessages();
              } else {
                this._notify.error('Error', res.message);
                this._notify.error('Error', res.data);
              }
            },
            (error: any) => {
              this._notify.error('Error', error);
            }
          );
        } else {
          this._notify.error('Error', res.message);
          this._notify.error('Error', res.data);
        }
      },
      (error: any) => {
        this._notify.error('Error', error);
      }
    );
    
  }

  openTradesMessages() {
    interval(5000).pipe(
      map(() => this._socketService.setUserOrder())
    ).subscribe();
    this._socketService.setUserOrder();
    this.userOrderDetailsSub = this._socketService.getUserOrderDetails().subscribe(
      (res: any) => {
        if (res && res.data && res.message == 'success') {
          //this.open_trades_messages = res.data.filter((data: any) => data.orderStatus == 1 || data.orderStatus == 2 || data.orderStatus == 3)
          this.open_trades_messages = res.data.filter((data: any) => data.orderStatus == 7)
          this.open_trades_messages = this.open_trades_messages.sort((a:any, b: any) => b.createTime - a.createTime);
          this.open_trades_messages.length = 5;
          // this.open_trades_messages = res.data.sort((a: any, b: any) => b.createTime - a.createTime);
        }else {
          this._notify.error('Error', "Something went wrong");
        }
      },
      (error: any) => {
        this._notify.error('Error', error);
      }
    );
  }
  getStartEndMessages() {
    this._service.getStartEndMessages().subscribe(
      (res: any) => {
        if (res && res.data && res.message == 'Success') {
          this.feedback.start_message = res.data.start_message;
          this.feedback.end_message = res.data.end_message;
          this._notify.success('Success', res.message);
        } else {
          this._notify.error('Error', res.message);
          this._notify.error('Error', res.data);
        }
      },
      (error: any) => {
        this._notify.error('Error', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.userOrderDetailsSub.unsubscribe();
  }
}
