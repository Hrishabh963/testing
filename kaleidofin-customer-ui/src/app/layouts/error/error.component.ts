import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ig-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
  errorMessage: string = '';
  error403: boolean = false;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((routeData) => {
      if (routeData['error403']) {
        this.error403 = routeData['error403'];
      }
      if (routeData['errorMessage']) {
        this.errorMessage = routeData['errorMessage'];
      }
    });
  }
}
