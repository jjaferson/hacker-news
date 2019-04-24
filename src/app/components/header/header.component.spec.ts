import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let title: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    title = fixture.debugElement.query(By.css("h1"));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should have title with h1 tag', () => {
    expect(title).toBeTruthy();
  })

  it('should have title Hacker News', () => {
    expect(title.nativeElement.textContent).toContain("Hacker News")
  })
});
