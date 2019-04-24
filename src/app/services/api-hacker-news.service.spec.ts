import { TestBed, getTestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiHackerNewsService } from './api-hacker-news.service';
import { Story } from 'src/models/story';
import { delay } from 'rxjs/operators';

describe('ApiHackerNewsService', () => {

  let injector: TestBed;
  let service: ApiHackerNewsService;
  let httpmock: HttpTestingController;
  let dummyData: Array<Story>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHackerNewsService]
    });

    injector = getTestBed();
    service = injector.get(ApiHackerNewsService);
    httpmock = injector.get(HttpTestingController);

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
  });

  afterEach(() => {
    httpmock.verify();
  });

  it('should be created', () => {
    const service: ApiHackerNewsService = TestBed.get(ApiHackerNewsService);
    expect(service).toBeTruthy();
  });

  it('should return 2 stories', () => {

    service.getStories(0, 2).subscribe((stories) => {
      expect(stories.length).toBe(2);
      expect(stories).toEqual(dummyData);
    });

    const reqGetList = httpmock.expectOne(`${service.apiUrl}/newstories.json`);
    expect(reqGetList.request.method).toBe("GET");
    reqGetList.flush([19698598, 19698594]);

    dummyData.forEach(story => {
      const reqGetStory = httpmock.expectOne(`${service.apiUrl}/item/${story.id}.json`);
      expect(reqGetStory.request.method).toBe("GET");
      reqGetStory.flush(story);
    });

  });

  it("should return an empty array of stories", () => {

    service.newStoriesIds = [];

    service.getLatestStories().subscribe(stories => {
      expect(stories.length).toBe(0);
    })

  })

  it("should return one new stories", () => {
    
    service.storiesIds = [19698594];
    service.newStoriesIds = [19698598];

    service.getLatestStories().subscribe(stories => {
      expect(stories.length).toBe(1);
      expect(service.storiesIds).toEqual([19698598, 19698594]);
      expect(service.newStoriesIds.length).toBe(0);
    });

    const story = dummyData[0];
    const reqGetStory = httpmock.expectOne(`${service.apiUrl}/item/${story.id}.json`);
    expect(reqGetStory.request.method).toBe("GET");
    reqGetStory.flush(story);

  });

  it("should return a given story", ()=> {
    const story = dummyData[0];

    service.getStoryById(story.id).subscribe(story => {
      expect(story).toEqual(story);
      expect(story.id).toBe(story.id);
    })

    const reqGetStory = httpmock.expectOne(`${service.apiUrl}/item/${story.id}.json`);
    expect(reqGetStory.request.method).toBe("GET");
    reqGetStory.flush(story);
  })

});
