import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailTemplateModifiedComponent } from './add-email-template-modified.component';

describe('AddEmailTemplateModifiedComponent', () => {
  let component: AddEmailTemplateModifiedComponent;
  let fixture: ComponentFixture<AddEmailTemplateModifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmailTemplateModifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailTemplateModifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
