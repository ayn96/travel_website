/**
 * @param {ArrayBuffer} buffer
 * @returns string
 */
export function arrayBufferToHexString(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * @param {string} hexString
 * @returns ArrayBuffer
 */
export function hexStringToArrayBuffer(hexString) {
  return new Uint8Array(
    // @ts-ignore
    hexString.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );
}
