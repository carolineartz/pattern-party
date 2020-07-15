export const formatSVG = (markup: string) => {
  return markup.replace(/^((\s+)([^<])*")>/gm, (_match: string, offset: string) => offset + "/>");
}
