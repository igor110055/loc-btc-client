import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTradeComponent } from './active-trade.component';

describe('ActiveTradeComponent', () => {
  let component: ActiveTradeComponent;
  let fixture: ComponentFixture<ActiveTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveTradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
