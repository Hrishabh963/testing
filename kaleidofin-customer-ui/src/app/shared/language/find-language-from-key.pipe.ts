import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "findLanguageFromKey" })
export class FindLanguageFromKeyPipe implements PipeTransform {
  private languages: any = {
    en: { name: "English" }
    // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
  };
  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
