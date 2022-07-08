import { Component, OnInit } from '@angular/core';
import { LabsService } from '../services/labs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  loading: boolean = false;

  constructor(private labsService: LabsService) {}

  ngOnInit(): void {}

  getLabsData(): void {
    this.labsService.getLabsAndCoordsData().subscribe((data) => {
      console.log(data);
    });
  }
}
