/**
 * Formats JSON string with proper indentation
 */
export function formatJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return jsonString
  }
}
