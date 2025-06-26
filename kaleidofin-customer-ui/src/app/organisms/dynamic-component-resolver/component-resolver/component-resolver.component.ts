import { Component, Input, Injector } from "@angular/core";

@Component({
  selector: "app-component-resolver",
  templateUrl: "./component-resolver.component.html"
})
export class ComponentResolverComponent {
  @Input() componentName: any;
  @Input() injector: Injector;
  @Input() contentNodes: any[][];
}
