import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { StoryListComponent } from './story-list.component';
import { DomainUrlPipe } from 'src/app/pipes/domain-url.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ApiHackerNewsService } from 'src/app/services/api-hacker-news.service';
import { of } from 'rxjs';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let newStoriesButton: DebugElement;
  let service: ApiHackerNewsService;
  let dummyData = [];
  let elmListOfStories: DebugElement; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryListComponent, DomainUrlPipe ],
      imports: [HttpClientTestingModule],
      providers: [ApiHackerNewsService]
    })
    .compileComponents();

    service = TestBed.get(ApiHackerNewsService);
    dummyData = [{
      by: "chwolfe",
      descendants: 0,
      id: 19698598,
      score: 1,
      time: 1555673078,
      title: "Learning Parser Combinators with Rust",
      type: "story",
      url: "https://bodil.lol/parser-combinators/",
      kids: []
    },{
      by: "rambojazz",
      descendants: 0,
      id: 19698594,
      score: 1,
      time: 1555673038,
      title: "Ask HN: Programming Language with “Limited” Types?",
      type: "story",
      kids: [],
      url: "https://bodil.lol/parser-combinators/"
    }]
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    newStoriesButton = fixture.debugElement.query(By.css('.bt-new-stories'));
    elmListOfStories = fixture.debugElement.query(By.css('li'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display new stories button', () => {
    component.showLoadNewStories = false;
    expect(newStoriesButton).toBeTruthy();
    expect(newStoriesButton.nativeElement.hasAttribute('hidden')).toBeTruthy();
  });

  it('should load first stories', fakeAsync(() => {
    spyOn(service, 'getStories').and.returnValue(of(dummyData));

    component.numberOfStoriesLoaded = 2;
    component.loadFirstStories();

    tick();

    fixture.detectChanges();
    expect(component.stories.length).toBe(2);
  }))


});
