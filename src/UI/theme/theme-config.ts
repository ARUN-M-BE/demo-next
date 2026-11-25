export type Theme = "light" | "dark" | "system";

export interface ThemeConfig {
  defaultTheme: Theme;
  storageKey: string;
  attribute: "class";
}

export const themeConfig: ThemeConfig = {
  defaultTheme: "dark",
  storageKey: "uiastra-theme",
  attribute: "class",
};
