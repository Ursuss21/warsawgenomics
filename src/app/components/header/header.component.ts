import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  selectedLanguage: string = 'pl';

  constructor() {}

  ngOnInit(): void {}

  selectLanguage(lang: string): void {
    this.selectedLanguage = lang;
  }
}
