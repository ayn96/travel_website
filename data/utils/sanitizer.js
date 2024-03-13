const REPLACE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

export function sanitize(input) {
  return input.replace(/[&<>"'`=]/g, (s) => REPLACE_MAP[s]);
}
