// Brand marks (Simple Icons, CC0) extracted by scripts/extract-icons.js.
// Tools without an entry render as a text monogram.
import ICONS from '../data/tech-icons.json'

/** { path, hex } for a tool name, or null when no brand mark exists. */
export function techIcon(name) {
  return ICONS[name.toLowerCase()] ?? null
}
