import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { StoryListComponent } from './components/story-list/story-list.component';
import { ApiHackerNewsService } from './services/api-hacker-news.service';
import { DomainUrlPipe } from './pipes/domain-url.pipe';
import { InfiniteScrollerDirective } from './directives/infinite-scroller.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SubHeaderComponent,
    StoryListComponent,
    DomainUrlPipe,
    InfiniteScrollerDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ApiHackerNewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
