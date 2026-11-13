import { Capacitor } from "@capacitor/core";

/** true dentro do app Capacitor (Android/iOS); false no site e no PWA. */
export const isNative = Capacitor.isNativePlatform();

/** Endereço público do jogo (no app, `location.href` é https://localhost). */
export const SITE_URL = "https://farm-number-fun.ksepisteme.com.br/";
