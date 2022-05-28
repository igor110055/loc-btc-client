import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';

import * as htmlToImage from 'html-to-image';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrsService } from 'src/app/services/toastrs.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  chatLists: any ={};
  url: string = "";
  showChatBox: boolean = false;
  public accountNo: any = {};
  public ifsc: any = {};
  public name: any = {};
  @ViewChild('scrollMe') private myScrollContainer: ElementRef<any> | any;

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef<any> | any;
  @Output() public postBankDetails = new EventEmitter<any>();
  @Input() set fetchPostStatus(data:any) {
    if(data) {
      this.showChatBox = data.status;
      this.url = "id=&order=&orderNo=" + data.orderNo + "&page=1&rows=10&sort="
      //this._service.getChatDetails(this.url).subscribe((res: any) => {
      this._service.getOrderDetails(data.orderNo).subscribe((res: any) => {
        if (res && res.data && res.data.message == "success") {
          this.chatLists = res.data.data;
          this.accountNo = this.chatLists.payMethods[0].fields.filter((data: any) => data.fieldContentType == "pay_account");
          this.ifsc = this.chatLists.payMethods[0].fields.filter((data: any) => data.fieldName.includes("IFSC"));
          this.name = this.chatLists.payMethods[0].fields.filter((data: any) => data.fieldContentType == "payee");
          this.postBankDetails.emit(false)
        }
      },(error) => this._notify.error("Error", "Something went wrong"))
    }
  }

  public res_data: any = '';
  public recent_messages: any = '';
  public  review:any="";
  public open_trades_messages: any = '';
  public add_list = [];
  public comp_list: any = [];
  public selectedAds: any = '';
  public competitor_ID = "";
  public val: any = {};
  public  feedback:any={};
  public Review:any={};
  public inputForm: FormGroup;
  public CopyMsg:any=[];

  setLimitForm = new FormGroup({
    upLimit: new FormControl(''),

  });



  public wazirxUPPrice: any = '';
  public priceUpdate = false;
  public showAdKeys = ['ad_id', 'max_amount', 'min_amount', 'price_equation', 'trade_type', 'online_provider']
  clipboard: any;
  currentChartUser: any;
  currentChartRoom: any = [];
  isChartRoomOpen: boolean = false;

  public input_text: any = '';

  last_sms: any;
  showInvoice: boolean = true;
  wazirxBidPrice: any;
  date: any;


  constructor( private formBuilder: FormBuilder, private _service: DashboardService, private _notify: ToastrsService) {
    this.inputForm = this.formBuilder.group({
      recepient_name: [''],
      email_id: [''],
      mobile_number: [''],
      otp: [''],
      debit_account_number: [''],
      transaction_types_id: [''],
      amount: [''],
      merchant_ref_id: [''],
      purpose: [''],
      vpa: [''],
      bene_account_number: [''],
      ifsc_code: [''],

    });

  }

  ngOnInit(): void {
    

  }

  
  copyChat(msg:any)
  {
    this.postBankDetails.emit(msg);
  
  }

  getOTP() {
  }


  convetToPDF()
   {
    let data: any = document.getElementById('pdfTable');
    html2canvas(data).then((canvas) => {
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      var _pdf = pdf.output('blob');
      var base64 = pdf.output('datauristring');

      pdf.save('payment-invoice.pdf');
      pdf.close();
    });
  }


  sendMessage(message: any) {
  }

  getMessage()
  {
  }


}