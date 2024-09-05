import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  url = 'https://house-prog-api.bgall.dev'

  constructor(private http: HttpClient) { }

  get_data(): Observable<JSON[]>{
    return this.http.get<JSON[]>(`${this.url}/data`)
  }

  get_names(): Observable<string[]>{
    return this.http.get<string[]>(`${this.url}/names`)
  }

  add_data(name: string, date: string, amount:number): Observable<JSON>{
    const body = {
      date: date,
      name: name,
      amount: amount
    }
    return this.http.post<JSON>(`${this.url}`, body)
  }

  edit_data(name: string, date: string, amount:number): Observable<JSON>{
    const body = {
      date: date,
      name: name,
      amount: amount
    }
    return this.http.put<JSON>(`${this.url}`, body)
  }
}
