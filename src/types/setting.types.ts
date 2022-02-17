export type ScopeSetting = {
  scope: string | string[];
  settings?: {
    fontStyle?: string;
    foreground?: string;
  };
};

export type TextmateRules = {
  textMateRules: ScopeSetting[];
};

export type TokenColorCustomizationType = {
  [key: string]: TextmateRules | ScopeSetting | ScopeSetting[];
};
