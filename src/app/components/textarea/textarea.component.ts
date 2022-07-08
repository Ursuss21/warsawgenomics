import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LabsData } from '../../models/labs-data.model';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnInit {
  @Input() labsDataObservable: Observable<LabsData>;

  labsData: string;

  constructor() {}

  ngOnInit(): void {
    this.labsDataObservable.subscribe({
      next: (data: LabsData) => {
        this.labsData = JSON.stringify(data);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
