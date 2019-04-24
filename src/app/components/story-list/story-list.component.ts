import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiHackerNewsService } from 'src/app/services/api-hacker-news.service';
import { Story } from 'src/models/story';
import { finalize, catchError, tap } from 'rxjs/operators';
import { Subscription, of, fromEvent } from 'rxjs';
import { viewParentEl } from '@angular/core/src/view/util';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})

export class StoryListComponent implements OnInit {

  checkNewsStories: Subscription;

  stories: Story[];

  // show spinner when load stories
  loadingStories: boolean;

  // show the button to show new stories
  showLoadNewStories: boolean = false;

  // number of new stories not displed yet 
  numberOfNewStories: number = 0;

  // display error message in case stories can be loaded
  showErrorMessage: boolean = false;

  // number of stories that is loaded over time
  numberOfStoriesLoaded: number = 20;

  constructor(
    private api: ApiHackerNewsService
  ) { }

  ngOnInit() {

    this.loadFirstStories();
    this.checkNewStories();
  }

  loadFirstStories() {
    this.loadingStories = true;

    this.api.getStories(0, this.numberOfStoriesLoaded)
      .pipe(
        catchError(error => {
          this.showErrorMessage = true;
          return of([]);
        }),
        finalize(() => this.loadingStories = false)
      )
      .subscribe(stories => this.stories = this.validateStories(stories));
  }

  checkNewStories() {
    this.checkNewsStories = this.api.checkForLatestStories()
    .subscribe(newStoriesCounter => {
      this.numberOfNewStories = newStoriesCounter;
      
      // display the new stories button 
      this.showLoadNewStories = (newStoriesCounter > 0);
    })
  }

  // load more stories as the user scrolls down
  loadMore() {
    this.loadingStories = true;

    const start = this.stories.length;
    const end = start + this.numberOfStoriesLoaded;
    this.api.getStories(start, end)
      .pipe(
        finalize(() => this.loadingStories = false)
      )
      .subscribe(stories => this.stories.push(... this.validateStories(stories)));
  }

  // load the latest stories after 
  loadLatestStories() {
    this.showLoadNewStories = false;

    this.api.getLatestStories()
      .pipe(tap(() => window.scrollTo(0, 0)))
      .subscribe(stories => this.stories.unshift(... this.validateStories(stories)))
  }

  // discard stories that are null
  validateStories(stories: Story[]): Story[] {
    return stories.filter(data => data !== null);
  }

  ngOnDestroy() {
    this.checkNewsStories.unsubscribe();
  }

}
