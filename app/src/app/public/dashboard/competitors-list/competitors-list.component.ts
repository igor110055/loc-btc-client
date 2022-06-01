import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrsService } from 'src/app/services/toastrs.service';

@Component({
  selector: 'app-competitors-list',
  templateUrl: './competitors-list.component.html',
  styleUrls: ['./competitors-list.component.css']
})
export class CompetitorsListComponent implements OnInit {

  @Output() postMarginBack = new EventEmitter<any>();
  
  public comp_list: any[] = [];
  public val: any = {};
  public  feedback:any={};
  public selectedAds: any = '';
  public competitor_ID = "";
  public asset: string = "";
  constructor(private _service: DashboardService, private _notify: ToastrsService, private formBuilder: FormBuilder){ }

  ngOnInit(): void {
  this.getCompList();   
 }
  setLimitForm = new FormGroup({
    upLimit: new FormControl(''),

  });

  @Input() set fetchMarginData(data: any) {
    if(data) {
      this.asset = data.asset;
      this.setLimitForm.patchValue({upLimit: data.margin})
    }
  }

  onSubmit() {
    this._service.sendLimit({"margin":this.setLimitForm.value.upLimit}).subscribe((res: any) => {
      if (res && res.message == "Success") {
        this._notify.success("Success", "Margin Updated Successfully");
        this.getMarginValue();
      } else
        this._notify.error('error', 'Not Updated');
    })
  }

  getMarginValue() {
    this._service.getMargin().subscribe((res: any) => {
      if (!!res) {
        this.postMarginBack.emit(res.data.BTCINR.margin);
        this._notify.success("Success", "Margin Updated");
      } else {
        this._notify.error('Error', res.message);
      }
    })
     this._service.getFeedBack().subscribe((res:any)=>{
         if(!!res) {
            // this.feedback=res.data.feedback;
            this.feedback.firstmsg=res.data.firstmsg;
            this.feedback.lastmsg=res.data.lastmsg
         } else {
          this._notify.error('Error', res.message);
         }
         

     })
  };

  onRemoveCompById(comp_id: any) {
    this._service.onRemoveCompById(comp_id.id).subscribe((res) => {
      if (!!res && res.message == "Success") {
        this._notify.success('Success', res.message);
        this.getCompList();
      } else
        this._notify.error('Error', res.message);
    })
  }

  getCompList() {
    this._service.getCompetitor().subscribe((res) => {
      if (!!res && res.message == "Success") {
        if (res.data.length > 0) {
          for(var x = 0; x < res.data.length; x++) {
            this.getCompDetails(res.data[x])
          }
        } else {
          this._notify.error('Error', res.message);
          this.comp_list = [];
        }
      }
    });
  }

  getCompDetails(id: any) {
    this._service.getCompDetails(id).subscribe((res: any) => {
      if (res && res.message == "OK") {
        let adsPrice = res.data.ad_list[0].data.temp_price
        if(adsPrice) {
          this.comp_list.push({"id": id, "adsprice": adsPrice })
        }
        this._notify.success("Success", "Competitor Updated Successfully");
      } else
        this._notify.error('error', 'No Competitor');
    })  
  }

  onAddComp(id: any) {
    // if (!!id && id.length == 7 && this.selectedAds.ad_id) {
    //id = BigInt(id);
    id = id.toString();
      this._service.addCompetitorByID(id).subscribe((res) => {
        if (!!res && res.message == "Success") {
          this._notify.success('Success', res.message);
          if (res.data) {
            let amendedList = Object.values(res.data);
            for(var x = 0; x < amendedList.length; x++) {
              this.getCompDetails(amendedList[x])
            }
          }
        } else {
            this._notify.error('Error', res.message);
        }
      });
  }




}
