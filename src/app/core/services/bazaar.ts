import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bazaar } from '../models/bazaar.model';

@Injectable({
  providedIn: 'root',
})
export class BazaarService {
  // -------------------
  // Properties
  // -------------------
  private jsonUrl = 'assets/data/bazaars.json';

  // -------------------
  // Constructor
  // -------------------
  constructor(private http: HttpClient) { }

  // -------------------
  // Methods
  // -------------------
  getBazaars(): Observable<Bazaar[]> {
    return this.http.get<Bazaar[]>(this.jsonUrl);
  }
}
