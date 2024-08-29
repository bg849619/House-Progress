import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  url = 'http://localhost:9980'

  constructor(private http: HttpClient) { }

  get_data(): Observable<JSON>{
    return this.http.get<JSON>(`${this.url}/data`)
  }
}
