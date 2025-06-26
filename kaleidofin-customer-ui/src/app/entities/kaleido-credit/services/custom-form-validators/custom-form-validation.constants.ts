export class PasswordValidation {
  lowercase: number | null = null;
  uppercase: number | null = null;
  numeric: number | null = null;
  specialCharacters: string | null = null;
  oldPassword: number | null = null;
  maxLength: number | null = null;
  minLength: number | null = null;


  constructor(rulesString: string) {
    this.parseRules(rulesString);
  }

  private parseRules(rulesString: string): void {
    const rulesArray = rulesString.split(",");
    rulesArray.forEach((rule) => {
      const match = rule.match(/^([A-Z_]+)(?:\((.*?)\))?$/);
      if (match) {
        const key = match[1];
        const value = match[2];

        switch (key) {
          case "LOWERCASE":
            this.lowercase = value ? parseInt(value, 10) : 1;
            break;
          case "UPPERCASE":
            this.uppercase = value ? parseInt(value, 10) : 1;
            break;
          case "NUMERIC":
            this.numeric = value ? parseInt(value, 10) : 1;
            break;
          case "SPECIAL_CHARACTERS":
            this.specialCharacters = value ?? "";
            break;
          case "OLD_PASSWORD":
            this.oldPassword = value ? parseInt(value, 10) : 0;
            break;
          case "MAX_LENGTH":
            this.maxLength = value ? parseInt(value, 10) : 100;
            break;
          case "MIN_LENGTH":
            this.minLength = value ? parseInt(value, 10) : 1;
            break;
        }
      }
    });
  }
}
