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
      orderNo: item.data.advertisement.id,
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

    var res1 = [
      {
        "data": {
          "created_at": "2013-12-06T15:23:01.61",
          "buyer": {
              "username": "hylje",
              "trade_count": "30+",
              "feedback_score": "100",
              "name": "hylje (30+; 100)",
              "last_online": "2013-12-19T08:28:16+00:00",
              "real_name": "",
              "company_name": "",
              "countrycode_by_ip": "",
              "countrycode_by_phone_number": ""
          },
          "seller": {
              "username": "jeremias",
              "trade_count": "100+",
              "feedback_score": "100",
              "name": "jeremias (100+; 100)",
              "last_online": "2013-12-19T06:28:51+00:00"
          },
          "reference_code": "123",
          "currency": "EUR",
          "amount": "105.55",
          "amount_btc": "190",
          "fee_btc": "1.9",
          "exchange_rate_updated_at": "2013-06-20T15:23:01+00:00",
          "advertisement": {
             "id": 123,
             "trade_type": "ONLINE_SELL",
             "advertiser": {
                 "username": "jeremias",
                 "trade_count": "100+",
                 "feedback_score": "100",
                 "name": "jeremias (100+; 100)",
                 "last_online": "2013-12-19T06:28:51.604754+00:00"
             }
          },
          "contact_id": 1234,
          "canceled_at": null,
          "escrowed_at": "2013-12-06T15:23:01+00:00",
          "funded_at": "2013-12-06T15:23:01+00:00",
          "payment_completed_at": "2013-12-06T15:23:01+00:00",
          "disputed_at": null,
          "closed_at": null,
          "released_at": null,
          "is_buying": true,
          "is_selling": false,
          "account_details": "",
          "account_info": "",
          "floating": ""
        },
        "actions": {
          "mark_as_paid_url": "/api/contact_mark_as_paid/1/",
          "advertisement_public_view": "/ads/123",
          "message_url": "/api/contact_messages/1234",
          "message_post_url": "/api/contact_message_post/1234"
        }
      },{
        "data": {
          "created_at": "2013-12-08T15:23:01.61",
          "buyer": {
              "username": "hylje",
              "trade_count": "30+",
              "feedback_score": "100",
              "name": "hylje (30+; 100)",
              "last_online": "2013-12-19T08:28:16+00:00",
              "real_name": "",
              "company_name": "",
              "countrycode_by_ip": "",
              "countrycode_by_phone_number": ""
          },
          "seller": {
              "username": "jeremias",
              "trade_count": "100+",
              "feedback_score": "100",
              "name": "jeremias (100+; 100)",
              "last_online": "2013-12-19T06:28:51+00:00"
          },
          "reference_code": "123",
          "currency": "EUR",
          "amount": "105.55",
          "amount_btc": "190",
          "fee_btc": "1.9",
          "exchange_rate_updated_at": "2013-06-20T15:23:01+00:00",
          "advertisement": {
             "id": 123,
             "trade_type": "ONLINE_SELL",
             "advertiser": {
                 "username": "jeremias",
                 "trade_count": "100+",
                 "feedback_score": "100",
                 "name": "jeremias (100+; 100)",
                 "last_online": "2013-12-19T06:28:51.604754+00:00"
             }
          },
          "contact_id": 1234,
          "canceled_at": null,
          "escrowed_at": "2013-12-06T15:23:01+00:00",
          "funded_at": "2013-12-06T15:23:01+00:00",
          "payment_completed_at": "2013-12-06T15:23:01+00:00",
          "disputed_at": null,
          "closed_at": null,
          "released_at": null,
          "is_buying": true,
          "is_selling": false,
          "account_details": "",
          "account_info": "",
          "floating": ""
        },
        "actions": {
          "mark_as_paid_url": "/api/contact_mark_as_paid/1/",
          "advertisement_public_view": "/ads/123",
          "message_url": "/api/contact_messages/1234",
          "message_post_url": "/api/contact_message_post/1234"
        }
      }
    ]





















    this.open_trades_messages = res1.sort((a:any, b: any) =>{console.log(b.data.created_at + "and a is " + a.data.created_at); return new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime()});
    console.log(this.open_trades_messages)





    interval(5000).pipe(
      map(() => this._socketService.setUserOrder())
    ).subscribe();
    this._socketService.setUserOrder();
    this.userOrderDetailsSub = this._socketService.getUserOrderDetails().subscribe(
      (res: any) => {
        console.log("getTradeDetails");
        console.log(res);
        if (res && res.data && res.message == 'success') {

          // var res1 = [
          //   {
          //     "data": {
          //       "created_at": "2013-12-08T15:23:01.61",
          //       "buyer": {
          //           "username": "hylje",
          //           "trade_count": "30+",
          //           "feedback_score": "100",
          //           "name": "hylje (30+; 100)",
          //           "last_online": "2013-12-19T08:28:16+00:00",
          //           "real_name": "",
          //           "company_name": "",
          //           "countrycode_by_ip": "",
          //           "countrycode_by_phone_number": ""
          //       },
          //       "seller": {
          //           "username": "jeremias",
          //           "trade_count": "100+",
          //           "feedback_score": "100",
          //           "name": "jeremias (100+; 100)",
          //           "last_online": "2013-12-19T06:28:51+00:00"
          //       },
          //       "reference_code": "123",
          //       "currency": "EUR",
          //       "amount": "105.55",
          //       "amount_btc": "190",
          //       "fee_btc": "1.9",
          //       "exchange_rate_updated_at": "2013-06-20T15:23:01+00:00",
          //       "advertisement": {
          //          "id": 123,
          //          "trade_type": "ONLINE_SELL",
          //          "advertiser": {
          //              "username": "jeremias",
          //              "trade_count": "100+",
          //              "feedback_score": "100",
          //              "name": "jeremias (100+; 100)",
          //              "last_online": "2013-12-19T06:28:51.604754+00:00"
          //          }
          //       },
          //       "contact_id": 1234,
          //       "canceled_at": null,
          //       "escrowed_at": "2013-12-06T15:23:01+00:00",
          //       "funded_at": "2013-12-06T15:23:01+00:00",
          //       "payment_completed_at": "2013-12-06T15:23:01+00:00",
          //       "disputed_at": null,
          //       "closed_at": null,
          //       "released_at": null,
          //       "is_buying": true,
          //       "is_selling": false,
          //       "account_details": "",
          //       "account_info": "",
          //       "floating": ""
          //     },
          //     "actions": {
          //       "mark_as_paid_url": "/api/contact_mark_as_paid/1/",
          //       "advertisement_public_view": "/ads/123",
          //       "message_url": "/api/contact_messages/1234",
          //       "message_post_url": "/api/contact_message_post/1234"
          //     }
          //   },{
          //     "data": {
          //       "created_at": "2013-12-06T15:23:01.61",
          //       "buyer": {
          //           "username": "hylje",
          //           "trade_count": "30+",
          //           "feedback_score": "100",
          //           "name": "hylje (30+; 100)",
          //           "last_online": "2013-12-19T08:28:16+00:00",
          //           "real_name": "",
          //           "company_name": "",
          //           "countrycode_by_ip": "",
          //           "countrycode_by_phone_number": ""
          //       },
          //       "seller": {
          //           "username": "jeremias",
          //           "trade_count": "100+",
          //           "feedback_score": "100",
          //           "name": "jeremias (100+; 100)",
          //           "last_online": "2013-12-19T06:28:51+00:00"
          //       },
          //       "reference_code": "123",
          //       "currency": "EUR",
          //       "amount": "105.55",
          //       "amount_btc": "190",
          //       "fee_btc": "1.9",
          //       "exchange_rate_updated_at": "2013-06-20T15:23:01+00:00",
          //       "advertisement": {
          //          "id": 123,
          //          "trade_type": "ONLINE_SELL",
          //          "advertiser": {
          //              "username": "jeremias",
          //              "trade_count": "100+",
          //              "feedback_score": "100",
          //              "name": "jeremias (100+; 100)",
          //              "last_online": "2013-12-19T06:28:51.604754+00:00"
          //          }
          //       },
          //       "contact_id": 1234,
          //       "canceled_at": null,
          //       "escrowed_at": "2013-12-06T15:23:01+00:00",
          //       "funded_at": "2013-12-06T15:23:01+00:00",
          //       "payment_completed_at": "2013-12-06T15:23:01+00:00",
          //       "disputed_at": null,
          //       "closed_at": null,
          //       "released_at": null,
          //       "is_buying": true,
          //       "is_selling": false,
          //       "account_details": "",
          //       "account_info": "",
          //       "floating": ""
          //     },
          //     "actions": {
          //       "mark_as_paid_url": "/api/contact_mark_as_paid/1/",
          //       "advertisement_public_view": "/ads/123",
          //       "message_url": "/api/contact_messages/1234",
          //       "message_post_url": "/api/contact_message_post/1234"
          //     }
          //   }
          // ]





















          // this.open_trades_messages = res1.sort((a:any, b: any) => b.created_at - a.created_at);
        }else {
          this._notify.error('Error', "Something went wrong active trade");
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
