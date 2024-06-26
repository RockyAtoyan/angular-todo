import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PendingService {
  public isLoading = new BehaviorSubject<boolean>(false);
}
