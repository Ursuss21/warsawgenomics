import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LabsData } from './models/labs-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  labsData = new Subject<LabsData>;

  title = 'warsawgenomics';

  getLabsData(data: LabsData): void {
    this.labsData.next(data);
    console.log(this.labsData);
  }
}
