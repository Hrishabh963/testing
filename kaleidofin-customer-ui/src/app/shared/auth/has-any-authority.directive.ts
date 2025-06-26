import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PrincipalService } from 'src/app/core';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *jhiHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *jhiHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[igHasAnyAuthority]',
})
export class HasAnyAuthorityDirective {
  private authorities: string[] = [];

  constructor(
    private readonly principal: PrincipalService,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  @Input()
  set igHasAnyAuthority(value: string | string[]) {
    this.authorities = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
    this.principal.getAuthenticationState().subscribe(() => this.updateView());
  }

  private updateView(): void {
    this.principal.hasAnyAuthority(this.authorities).then((result) => {
      this.viewContainerRef.clear();
      if (result) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
