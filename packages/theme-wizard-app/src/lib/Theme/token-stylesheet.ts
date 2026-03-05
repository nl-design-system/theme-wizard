import { TokenPath, tokenPathToCSSCustomProperty } from './lib';

export const createStylesheet = (styleSheet = new CSSStyleSheet(), selector = ':root'): [CSSStyleSheet, CSSRule] => {
  styleSheet.replaceSync(`${selector} {}`);
  return [styleSheet, styleSheet.cssRules[0]];
};

export const setToken = (rule: CSSRule, path: TokenPath, $value: string) => {
  if (rule instanceof CSSStyleRule) {
    const name = tokenPathToCSSCustomProperty(path);
    if (rule.style.getPropertyValue(name) !== $value) {
      rule.style.setProperty(tokenPathToCSSCustomProperty(path), $value);
    }
  }
};

export const unsetToken = (rule: CSSRule, path: TokenPath) => {
  if (rule instanceof CSSStyleRule) {
    rule.style.removeProperty(tokenPathToCSSCustomProperty(path));
  }
};
