import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";

@Injectable()
export class EncryptDecryptService {
  constructor(private readonly snackBar: MatSnackBar, private readonly router: Router) {}

  encrypt(keys: any, value: any) {
    if (keys && value) {
      let key = CryptoJS.enc.Utf16.parse(keys);
      let iv = CryptoJS.enc.Utf8.parse(keys);
      let encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf16.parse(value.toString()),
        key,
        {
          keySize: 16,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      return encrypted.toString();
    }
    this.snackBar.open("Something went wrong.Please sign up again", "close", {
      duration: 5000,
    });
    return "";
  }

  decrypt(keys: any, value: any) {
    if (keys && value) {
      let key = CryptoJS.enc.Utf16.parse(keys);
      let iv = CryptoJS.enc.Utf8.parse(keys);
      let decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf16);
    }
    this.snackBar.open("Something went wrong.Please sign up again", "close", {
      duration: 5000,
    });
    this.router.navigate(["./login"]);
    return "";
  }

  generateKey(data: any) {
    let salt = CryptoJS.lib.WordArray.random(16);
    return CryptoJS.PBKDF2(data, salt, { keySize: 16, iterations: 1000 });
  }
}
