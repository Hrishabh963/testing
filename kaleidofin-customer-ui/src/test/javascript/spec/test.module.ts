import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { NgModule, ElementRef, Renderer } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  JhiDataUtils,
  JhiDateUtils,
  JhiEventManager,
  JhiAlertService,
  JhiParseLinks
} from "ng-jhipster";
import { Principal, AccountService } from "app/core";
import { MockPrincipal } from "./helpers/mock-principal.service";
import { MockAccountService } from "./helpers/mock-account.service";
import { MockActivatedRoute, MockRouter } from "./helpers/mock-route.service";
import { MockEventManager } from "./helpers/mock-event-manager.service";

@NgModule({
  providers: [
    DatePipe,
    JhiDataUtils,
    JhiDateUtils,
    JhiParseLinks,
    {
      provide: JhiEventManager,
      useClass: MockEventManager
    },
    {
      provide: ActivatedRoute,
      useValue: new MockActivatedRoute({ id: 123 })
    },
    {
      provide: Router,
      useClass: MockRouter
    },
    {
      provide: Principal,
      useClass: MockPrincipal
    },
    {
      provide: AccountService,
      useClass: MockAccountService
    },
    {
      provide: ElementRef,
      useValue: null
    },
    {
      provide: Renderer,
      useValue: null
    },
    {
      provide: JhiAlertService,
      useValue: null
    }
  ],
  imports: [HttpClientTestingModule]
})
export class Ignition5BaseTestModule {}
