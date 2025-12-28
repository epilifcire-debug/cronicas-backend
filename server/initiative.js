import { roll } from "./dice.js";

export function rollInitiative(entities) {
  return entities
    .map(e => ({
      ...e,
      initiative: roll("1d20") + (e.dex || 0)
    }))
    .sort((a, b) => b.initiative - a.initiative);
}
