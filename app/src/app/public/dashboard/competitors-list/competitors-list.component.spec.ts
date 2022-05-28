import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorsListComponent } from './competitors-list.component';

describe('CompetitorsListComponent', () => {
  let component: CompetitorsListComponent;
  let fixture: ComponentFixture<CompetitorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitorsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
