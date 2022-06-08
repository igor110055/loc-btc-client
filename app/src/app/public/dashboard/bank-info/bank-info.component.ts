import { KeyValue } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { jsPDF } from 'jspdf';

import * as htmlToImage from 'html-to-image';
import * as moment from 'moment';
import { ToastrsService } from 'src/app/services/toastrs.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import html2canvas from 'html2canvas';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.css'],
})
export class BankInfoComponent implements OnInit, OnChanges {
  public sellerName: string = '';
  public orderNo: string = '';
  public accountNo: any = {};
  public ifsc: any = {};
  public name: any = {};
  public amount: string = '';
  public btcqty: string = '';
  public wzPrice: any = {};

  @ViewChild('scrollMe') private myScrollContainer: ElementRef<any> | any;

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef<any> | any;
  @Input() public set fetchBankData(data: any) {
    if (data) {
      console.log("Data",data);
      this.accountNo = data.msg.accNo;
      this.ifsc = data.msg.ifsc;
      this.name = data.msg.name;
      this.amount = data.amt;

      if (parseInt(this.amount) > 200000) {
        this.inputForm.controls['transaction_types_id'].setValue(3, {
          onlySelf: true,
        });
      } else {
        this.inputForm.controls['transaction_types_id'].setValue(4, {
          onlySelf: true,
        });
      }
      this.inputForm.patchValue({
        bene_account_number: this.accountNo,
        ifsc_code: this.ifsc,
        recepient_name: this.name,
        amount: this.amount,
      });
    } else {
      this.inputForm.patchValue({
        bene_account_number: '',
        ifsc_code: '',
        recepient_name: '',
        amount: ''
      });
    }
  }
  @Input("fetchWZPrice") set function(data: any) {
    this.wzPrice = data;
  }
  @Input() public set fetchChatStatusData(data: any) {
    if (data) {
      console.log("btc",data)
      this.sellerName = data.selllerName;
      this.orderNo = data.orderNo;
      this.btcqty = data.btc;
    }
  }

  @Output() public postRefreshChatMessage = new EventEmitter<any>();

  public res_data: any = '';
  public recent_messages: any = '';
  public review: any = '';
  public open_trades_messages: any = '';
  public add_list = [];
  public comp_list: any = [];
  public selectedAds: any = '';
  public competitor_ID = '';
  public val: any = {};
  public feedback: any = {};
  public Review: any = {};
  public inputForm: FormGroup;
  public CopyMsg: any = [];

  setLimitForm = new FormGroup({
    upLimit: new FormControl(''),
  });

  public wazirxUPPrice: any = '';
  public priceUpdate = false;
  public showAdKeys = [
    'ad_id',
    'max_amount',
    'min_amount',
    'price_equation',
    'trade_type',
    'online_provider',
  ];
  clipboard: any;
  currentChartUser: any;
  currentChartRoom: any = [];
  isChartRoomOpen: boolean = false;

  public input_text: any = '';

  last_sms: any;
  showInvoice: boolean = true;
  wazirxBidPrice: any;
  date: any;

  constructor(
    private _service: DashboardService,
    private _notify: ToastrsService,
    private formBuilder: FormBuilder
  ) {
    this.inputForm = this.formBuilder.group({
      otp: ['', Validators.required],
      transaction_types_id: ['', Validators.required],
      amount: ['', Validators.required],
      bene_account_number: ['', Validators.required],
      ifsc_code: ['', Validators.required],
      recepient_name: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  getOTP() {
    this._service.sendOTP().subscribe((res) => {
      console.log('order no from get otp', this.orderNo);
      if (res.message == 'Created' && res.statusCode == '201') {
        this._notify.success('Success', 'Please check your mobile for OTP');
      } else this._notify.error('Error', res.message);
    });
  }

  initiatePayouts() {
    console.log(this.inputForm);

    if (this.inputForm.valid) {
      this._service.initiatePayouts(this.inputForm.value).subscribe((res) => {
        if (!!res && res.statusCode == 200) {
          this.showInvoice = false;
          this.res_data = res.data;
          this.date = res.data.d;
          console.log('Payment data ', res.data);
          console.log('Payment :', res);
          let paymentDetailsMsg =
          "Thank You, \n " +
          res.data.recepient_name +
          "\n your payment has been send successfully credited from AlchemistPro to Your Account Number: "  +
          res.data.debit_account_number +
          "\n Amount : " +
          res.data.amount +
          "\n Transaction id"  +
          res.data.merchant_ref_id
          this._service
            .contactMessageSend(this.orderNo, paymentDetailsMsg)
            .subscribe(
              (res) => {
                if (res) {
                  this._notify.success(
                    'success',
                    'Payment details message posted'
                  );
                }
              },
              (error) => {
                this._notify.error(
                  'Error',
                  "Couldn't post payment details message due to API error. Please try again"
                );
              }
            );

          this._service.markAsPaid(this.orderNo).subscribe(
            (res) => {
              this._notify.success('Success', res.message);
              this._service
                .contactMessageSend(this.orderNo, this.feedback.end_message)
                .subscribe(
                  (res) => {
                    if (res && res.statusCode == 200) {
                      this._notify.success(
                        'success',
                        'Trade End Message Posted Successfully'
                      );
          console.log("Btc Qnty",this.btcqty,this.wzPrice,this.wzPrice.wzSellPrice)
          this._service.postBtcqty(this.btcqty,this.wzPrice.wzSellPrice).subscribe((res: any) =>
                    {
                      this._notify.error("Error", res.message)
                     this._notify.success("Success", "BTC amount posted successfully")
                   },(error: any) => {
                     this._notify.error(
                       'Error',
                       "Couldn't post BTC amount due to API error. Please try again"
                     );
                   })
                    } else {
                      this._notify.error(
                        'Error',
                        'There is some error in trade end message please try again'
                      );
                    }
                  },
                  (error) => {
                    this._notify.error(
                      'Error',
                      "Couldn't post payment details message due to API error. Please try again"
                    );
                  }
                );
            },
            (error) => {
              this._notify.error(
                'Error',
                "Couldn't post payment details message due to API error. Please try again"
              );
            }
          );

          this._notify.success('Success', res.message);
        } else {
          this._notify.error('Error', res.message);
          this._notify.error('Error', res.data);
        }
      });
    } else {
      this._notify.error('Error', 'Please enter all bank details');
    }
    this.postRefreshChatMessage.emit(true);
  }

  convetToPDF() {
    let data: any = document.getElementById('pdfTable');
    html2canvas(data).then((canvas) => {
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      var _pdf = pdf.output('blob');
      var base64 = pdf.output('datauristring');
      console.log(base64); //uri formate

      pdf.save('payment-invoice.pdf');
      pdf.close();
    });
  }

  sendMessage(message: any) {}

  getMessage() {}

  onAddComp(id: any) {
    // if (!!id && id.length == 7 && this.selectedAds.ad_id) {
    id = parseInt(id);
    if (typeof id === 'number') {
      this._service.addCompetitorByID(id).subscribe((res) => {
        if (!!res && res.status) {
          this._notify.success('Success', res.message);
          if (res.comp_ids.length > 0) this.comp_list = res.comp_ids;
        } else this._notify.error('Error', res.message);
      });
    }
    // }
  }

  onSubmit() {
    this._service.sendLimit(this.setLimitForm.value).subscribe((res: any) => {
      if (res.status) {
        this._notify.success('Success', res.message);
        this.getValue();
      } else this._notify.error('error', 'Not Updated');
    });
  }

  getValue() {
    this._service.getLimitValue().subscribe((res: any) => {
      if (!!res) {
        this.val = res.data;
      } else {
        this._notify.error('Error', res.message);
        this._notify.error('Error', res.data);
      }
    });
    this._service.getFeedBack().subscribe((res: any) => {
      if (!!res) {
        // this.feedback=res.data.feedback;
        this.feedback.firstmsg = res.data.firstmsg;
        this.feedback.lastmsg = res.data.lastmsg;
      } else {
        this._notify.error('Error', res.message);
        this._notify.error('Error', res.data);
      }
    });
  }

  onRemoveCompById(comp_id: any, ad_id: any) {
    this._service.onRemoveCompById(comp_id).subscribe((res) => {
      if (!!res && res.status) {
        this._notify.success('Success', res.message);
        this.getCompListById(this.selectedAds.ad_id);
      } else this._notify.error('Error', res.message);
    });
  }

  getCompListById(id: any) {
    this._service.getDetailsById(id).subscribe((res) => {
      if (!!res && res.status) {
        if (res.comp_ids.length > 0) {
          this.comp_list = res.comp_ids;
        } else {
          this._notify.error('Error', res.message);
          this.comp_list = [];
        }
      }
    });
  }
}
