import uniqBy from "lodash.uniqby"
import compact from "lodash.compact"
import { PatternId } from "./store"
export const formatSVG = (markup: string) => {
  return markup.replace(/^((\s+)([^<])*")>/gm, (_match: string, offset: string) => offset + "/>");
}

export const communityPatterns = (patternMap: Map<PatternId, PatternType>) => {
  // const patterns: PatternType[] = []

  return compact(Array.from(patternMap.entries()).map(([[, owner], value]) => {
    if (owner === "community") {
      return value
    }
  })).reverse()

  // for (let [[, owner], value] of patternMap) {
  //   if (owner === "community") {
  //     patterns.push(value)
  //   }
  // }

  // return uniqBy(patterns, 'id').reverse()
}

export const userPatterns = (patternMap: Map<PatternId, PatternType>) => {
  // const patterns: PatternType[] = []

  // for (let [[, owner], value] of patternMap) {
  //   if (owner === "user") {
  //     patterns.push(value)
  //   }
  // }

  // return uniqBy(patterns, 'id').reverse()

  return compact(Array.from(patternMap.entries()).map(([[, owner], value]) => {
    if (owner === "user") {
      return value
    }
  })).reverse()
}

export const featuredPatterns = (patternMap: Map<PatternId, PatternType>) => {
  return compact(Array.from(patternMap.entries()).map(([[, owner], value]) => {
    if (owner === "community" && value.featured) {
      return value
    }
  })).reverse()
}
