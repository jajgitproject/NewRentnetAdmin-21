// @ts-nocheck
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Kanban, KanbanAdapter } from './kanban.model';
// import { kanbanS } from "./kanban.data";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class KanbanService extends UnsubscribeOnDestroyAdapter {
  private adapter = inject(KanbanAdapter);
  private httpClient = inject(HttpClient);

  private trash: Set<number> = new Set([]); // trashed kanbans' id; set is better for unique ids
  // private _kanbans: BehaviorSubject<object[]> = new BehaviorSubject([]);
  private _kanbans = new BehaviorSubject<object[]>([]);
  public readonly kanbans: Observable<object[]> = this._kanbans.asObservable();
  private readonly API_URL = 'assets/data/kanbans.json';

  constructor() {
    super();
    // this._kanbans.next(kanbanS); // mock up backend with fake data (not Kanban objects yet!)
    this.getAllKanbanss();
  }

  /** CRUD METHODS */
  getAllKanbanss(): void {
    this.subs.sink = this.httpClient.get<Kanban[]>(this.API_URL).subscribe({
      next: (data) => {
        this._kanbans.next(data); // mock up backend with fake data (not Kanban objects yet!)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  private compareKanbanGravity(a: Kanban, b: Kanban): number {
    // if at least one of compared kanban deadlines is not null, compare deadline dates
    // (further date comes first), else compare priority (larger priority comes first)
    if (a.deadline !== null || b.deadline !== null) {
      // simply compare dates without converting to numbers
      return -(a.deadline! > b.deadline!) || +(a.deadline! < b.deadline!);
    } else {
      return b.priority - a.priority;
    }
  }

  public getObjects(): Observable<Kanban[]> {
    return this.kanbans.pipe(
      map((data: object[]) =>
        (data as Kanban[])
          .filter(
            // do not return objects marked for delete
            (item: Kanban) => !this.trash.has(item.id)
          )
          .map(
            // convert objects to Kanban instances
            (item: Kanban) => this.adapter.adapt(item)
          )
      )
    );
  }

  public getObjectById(id: number): Observable<Kanban> {
    return this.kanbans.pipe(
      map(
        (data: object[]) =>
          (data as Kanban[])
            .filter(
              // find object by id
              (item: Kanban) => item.id === id
            )
            .map(
              // convert to Kanban instance
              (item: Kanban) => this.adapter.adapt(item)
            )[0]
      )
    );
  }

  public createOject(kanban: Kanban): void {
    kanban.id = this._kanbans.getValue().length + 1; // mock Kanban object with fake id (we have no backend)
    this._kanbans.next(this._kanbans.getValue().concat(kanban));
  }

  public updateObject(kanban: Kanban): void {
    const kanbans = [...this._kanbans.getValue()] as Kanban[];
    const kanbanIndex = kanbans.findIndex((t) => t.id === kanban.id);
    if (kanbanIndex !== -1) {
      kanbans[kanbanIndex] = kanban;
      this._kanbans.next(kanbans);
    }
  }

  public deleteObject(kanban: Kanban): void {
    const kanbans = this._kanbans.getValue() as Kanban[];
    this._kanbans.next(kanbans.filter((t) => t.id !== kanban.id));
  }

  public detachObject(kanban: Kanban): void {
    // add kanban id to trash
    this.trash.add(kanban.id);
    // force emit change for kanbans observers
    return this._kanbans.next(this._kanbans.getValue());
  }

  public attachObject(kanban: Kanban): void {
    // remove kanban id from trash
    this.trash.delete(kanban.id);
    // force emit change for kanbans observers
    return this._kanbans.next(this._kanbans.getValue());
  }
}

