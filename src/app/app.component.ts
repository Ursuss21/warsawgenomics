import { Component } from '@angular/core';
import { LabsData } from './models/labs-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  labsData: LabsData;

  title = 'warsawgenomics';

  getLabsData(data: LabsData): void {
    this.labsData = data;
    console.log(this.labsData);
  }
}
