import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootercComponent } from './footerc.component';

describe('FootercComponent', () => {
  let component: FootercComponent;
  let fixture: ComponentFixture<FootercComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FootercComponent]
    });
    fixture = TestBed.createComponent(FootercComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
