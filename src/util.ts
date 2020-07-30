import uniqBy from "lodash.uniqby"
import { PatternId } from "./state"
export const formatSVG = (markup: string) => {
  return markup.replace(/^((\s+)([^<])*")>/gm, (_match: string, offset: string) => offset + "/>");
}

export const communityPatterns = (patternMap: Map<PatternId, PatternType>) => {
  const patterns: PatternType[] = []

  for (let [[, owner], value] of patternMap) {
    if (owner === "community") {
      patterns.push(value)
    }
  }

  return uniqBy(patterns, 'id')
}

export const userPatterns = (patternMap: Map<PatternId, PatternType>) => {
  const patterns: PatternType[] = []

  for (let [[, owner], value] of patternMap) {
    if (owner === "user") {
      patterns.push(value)
    }
  }

  return uniqBy(patterns, 'id')
}

export const featuredPatterns = (patternMap: Map<PatternId, PatternType>) => {
  const patterns: PatternType[] = []

  for (let [[, owner], value] of patternMap) {
    if (owner === "community" && value.featured) {
      patterns.push(value)
    }
  }

  return uniqBy(patterns, 'id')
}
