import { KeyValue } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';

import * as htmlToImage from 'html-to-image';
import * as moment from 'moment';
import { ToastrsService } from 'src/app/services/toastrs.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.css'],
})
export class BankInfoComponent implements OnInit, OnChanges {
  public sellerName: string = "";
  public orderNo: string = "";
  public accountNo: any = {};
  public ifsc: any = {};
  public name: any = {};
  public btnStatus: any = null;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef<any> | any;

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef<any> | any;
  @Input() public set fetchBankData(data: any) {
    if(data) {
      this.accountNo = data[0].fields.filter((data: any) => data.fieldContentType == "pay_account");
      this.ifsc = data[0].fields.filter((data: any) => data.fieldName.includes("IFSC"));
      this.name = data[0].fields.filter((data: any) => data.fieldContentType == "payee");
      this.inputForm.patchValue({
        bene_account_number: this.accountNo[0].fieldValue,
        ifsc_code: this.ifsc[0].fieldValue,
        recepient_name: this.name[0].fieldValue
      })
    } else {
      this.inputForm.patchValue({
        bene_account_number: "",
        ifsc_code: "",
        recepient_name: ""
      })
    }
  };

  @Input() public set fetchChatStatusData(data: any) {
    if(data) {
      this.sellerName = data.selllerName;
      this.orderNo = data.orderNo;
    }
  }

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
      otp: [''],
      transaction_types_id: [''],
      amount: [''],
      merchant_ref_id: [''],
      bene_account_number: [''],
      ifsc_code: [''],
      recepient_name: ['']
    });
  }

  ngOnInit(): void {
    
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }
  

  

  getOTP() {
    this._service.sendOTP().subscribe((res) => {
      if (!!res && res.status) {
        this._notify.success('Success', res.message);
        this.btnStatus = null;
      } else
        this._notify.error('Error', res.message);
        this.btnStatus = "true";
    })
  }

  initiatePayouts() {
    var input_value = this.inputForm.value;
    console.log(input_value);
    input_value.merchant_ref_id = Math.floor(100000 + Math.random() * 900000);
    this._service.initiatePayouts(this.inputForm.value).subscribe((res) => {
      if (!!res && res.status) {
        this.showInvoice = false;
        this.res_data = res.data.payouts_body;
        this.date = res.data.d;
        this._notify.success('Success', res.message);
      } else {
        this._notify.error('Error', res.message);
        this._notify.error('Error', res.data);
      }

      
    });
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
      this._service
        .addCompetitorByID(id)
        .subscribe((res) => {
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
      }  else {
        this._notify.error('Error', res.message);
        this._notify.error('Error', res.data);
      }
    });
    this._service.getFeedBack().subscribe((res: any) => {
      if (!!res) {
        // this.feedback=res.data.feedback;
        this.feedback.firstmsg = res.data.firstmsg;
        this.feedback.lastmsg = res.data.lastmsg;
      }  else {
        this._notify.error('Error', res.message);
        this._notify.error('Error', res.data);
      }
    });
  }

  onRemoveCompById(comp_id: any, ad_id: any) {
    this._service.onRemoveCompById(comp_id, ad_id).subscribe((res) => {
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
