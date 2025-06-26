import { Component, OnInit } from '@angular/core';
import { AssociateLenderService } from '../../services/associate-lender/associate-lender.service';
import { LENDER_CONFIGURATIONS } from 'src/app/constants/lender.config';
import { get } from 'lodash';

@Component({
  selector: 'app-powered-by-kaleidofin',
  templateUrl: './powered-by-kaleidofin.component.html',
  styleUrls: ['./powered-by-kaleidofin.component.scss']
})
export class PoweredByKaleidofinComponent implements OnInit {

  useFooter: boolean = false;

  constructor(private readonly associateLenderService: AssociateLenderService) { }

  ngOnInit(): void {
    this.associateLenderService
      .getLenderCodeSubject()
      .subscribe((lenderCode) => {
        let config = LENDER_CONFIGURATIONS[lenderCode];
        this.useFooter = get(config, "useFooter");
      });
  }

}
