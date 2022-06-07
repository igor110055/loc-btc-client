import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrsService } from 'src/app/services/toastrs.service';
import { map } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-active-trade',
  templateUrl: './active-trade.component.html',
  styleUrls: ['./active-trade.component.css'],
})
export class ActiveTradeComponent implements OnInit, OnDestroy {
  public open_trades_messages: any = '';
  public feedback: any = {};
  public username: string = '';
  isChartRoomOpen: boolean = false;
  currentChartUser: any;
  currentChartRoom: any = [];
  currentLi: number = 0;
  status: boolean = true;
  private tradeSub: Subscription = new Subscription();
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
    this.currentLi = i;
    this._service.getOrderDetails(item.data.contact_id.toString()).subscribe(
      (res: any) => {
        if (
          res &&
          res.data &&
          res.message == 'OK' &&
          res.data.message_list.length == 0
        ) {
          this._service
            .contactMessageSend(
              item.data.contact_id,
              this.feedback.start_message
            )
            .subscribe(
              (res) => {
                if (res) {
                  this._notify.success('success', 'Message send successfully');
                } else {
                  this._notify.error('error', 'Please check start message');
                  return;
                }
              },
              (error) => {
                this._notify.error(
                  'error',
                  'There is some error in API. please try again'
                );
                return;
              }
            );
        }
        this.postChatStatus.emit({
          orderNo: item.data.contact_id,
          status: true,
          selllerName: item.sellerNickname,
          userName: environment.username,
          amount: item.data.amount
        });
      },
      (error) => {
        this._notify.error(
          'error',
          'There is some error in API. please try again'
        );
      }
    );
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
    this.tradeSub = this._socketService.getTrade().subscribe(
      (data: any) => {
        console.log('Trade Data', data.res.contact_list);
        this.open_trades_messages = data.res.contact_list.sort(
          (a: any, b: any) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime()
        );
      },
      (error) => {
        this._notify.error('Error', error); 
      }
    );

    // interval(5000).pipe(
    //   map(() => this._socketService.setUserOrder())
    // ).subscribe();
    // this._socketService.setUserOrder();
    // this.userOrderDetailsSub = this._socketService.getUserOrderDetails().subscribe(
    //   (res: any) => {
    //     if (res)
    //   {
    //     res=res.data
    //     console.log(res)
    //       this.open_trades_messages = res.contact_list.sort((a:any, b: any) => b.data.created_at - a.data.created_at);
    //     }else {
    //       this._notify.error('Error', "Something went wrong active trade");
    //     }
    //   },
    //   (error: any) => {
    //     this._notify.error('Error', error);
    //   }
    // );
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
    this.tradeSub.unsubscribe();
  }
}
