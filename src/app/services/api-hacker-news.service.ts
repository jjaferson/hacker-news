import { Injectable } from '@angular/core';
import { Story } from 'src/models/story';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, mergeMap, mergeAll, take, tap, ignoreElements, finalize, filter, skip } from 'rxjs/operators';
import { Observable, of, from, combineLatest, merge, interval, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHackerNewsService {

  apiUrl = "https://hacker-news.firebaseio.com/v0/";
  storiesIds: number[];
  newStoriesIds: number[] = [];

  constructor(
    private http: HttpClient
    ) { }

    public getStories(start: number, end: number): Observable<Story[]> {

      // getting news stories ids and caching the ids
      const newStoriesIDs = this.http.get<number[]>(`${this.apiUrl}/newstories.json`)
        .pipe(
          tap(ids => this.storiesIds = ids)
        );

      const observableIds: Observable<number[]> = (this.storiesIds) ? of(this.storiesIds) : newStoriesIDs;
      return observableIds
        .pipe(
          mergeMap(ids => 
            combineLatest(
              ids.slice(start, end).map(id => this.getStoryById(id))
            )
          )
        )
    }

    public getLatestStories(): Observable<Story[]>{
      
      if (this.newStoriesIds.length <= 0) {
        return of([]);
      }

      const newStoriesLength = this.newStoriesIds.length;
      this.storiesIds.unshift(... this.newStoriesIds);
      this.newStoriesIds = [];

      return this.getStories(0, newStoriesLength);
    }

    public checkForLatestStories(): Observable<number>{
      const intervalTime = 10000;
      const newStories = this.http.get<number[]>(`${this.apiUrl}/newstories.json`)
        .pipe(
          map(ids => {
            const index = ids.indexOf(this.storiesIds[0]);
            this.newStoriesIds = ids.slice(0, index);
            return this.newStoriesIds.length;
          })
        )

      return interval(intervalTime)
        .pipe(
          mergeMap(() => newStories)
        );
    }

    public getStoryById(id: number): Observable<Story> {
      return this.http.get<Story>(`${this.apiUrl}/item/${id}.json`);
    }
}
