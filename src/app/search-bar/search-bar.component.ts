import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabsData } from '../models/labs-data.model';
import { LabsService } from '../services/labs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Output() labsDataChange = new EventEmitter<LabsData>();

  loading: boolean = false;

  constructor(private labsService: LabsService) {}

  ngOnInit(): void {}

  getLabsData(): void {
    this.loading = true;
    this.labsService.getLabsAndCoordsData().subscribe({
      next: (data: LabsData) => {
        this.labsDataChange.emit(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        console.error(error);
      },
    });
  }
}
