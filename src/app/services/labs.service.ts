import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabsData } from '../models/labs-data.model';

@Injectable({
  providedIn: 'root',
})
export class LabsService {
  private baseUrl: string = 'https://dev2.badamygeny.pl/api/laboratoria/inne';

  constructor(private http: HttpClient) {}

  getLabsAndCoordsData(): Observable<LabsData> {
    return this.http.get<LabsData>(this.baseUrl);
  }
}
