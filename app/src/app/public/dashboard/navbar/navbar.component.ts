import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public session:boolean =false;
  constructor(private _router: Router, private _gservice: GeneralService) { }

  ngOnInit(): void {
  }

  showSession(input:any){
    this.session = input;
  }

  logout() {
    this._gservice.setToken("");
    this._router.navigateByUrl("/login");
  }

}
