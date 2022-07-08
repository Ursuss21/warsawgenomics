import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabsData } from '../models/labs-data.model';

@Injectable({
  providedIn: 'root',
})
export class LabsService {
  constructor(private http: HttpClient) {}

  getLabsAndCoordsData(url: string): Observable<LabsData> {
    return this.http.get<LabsData>(url);
  }
}
