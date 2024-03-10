/**
 * @class BitField
 *
 * @description
 * BitFields are used to store a set of flags in a single number.
 * - Flags are represented as powers of 2, so each flag has a value that is a power of 2.
 * - In their binary form, each flag is represented by a single bit.
 *
 * @example
 * 0101 (5 in decimal) represents the flags 1 and 4.
 *
 * @link https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/BitField.js - Inspired by Discord.js
 */
export class BitField {
  static get DEFAULT_BIT() {
    return 0;
  }

  static get FLAGS() {
    return {};
  }

  static get ALL() {
    // Get all the values from `this` to account for any potential extensions of the class
    const { FLAGS, DEFAULT_BIT } = this;

    // Perform OR operation to combine all the bits and return the result
    return Object.values(FLAGS).reduce((prev, bit) => {
      return prev | bit;
    }, DEFAULT_BIT);
  }

  /**
   * @param {number | string | BitField | number[] | string[]} bits
   */
  constructor(bits = BitField.DEFAULT_BIT) {
    /**
     * Bitfield of the packed bits
     * @type {number}
     */
    this.bitfield = BitField.resolve(bits);
  }

  /**
   * @param {number} bit bit(s) to add
   * @returns {boolean}
   */
  has(bit) {
    // Perform AND operation to check if the bit is present
    // Example: 0011 & 0010 = 0010 and 0001 & 0010 = 0000
    return (this.bitfield & bit) === bit;
  }

  /**
   * @param {number[]} bits bit(s) to add
   */
  add(...bits) {
    let total = BitField.resolve(bits);
    if (!this.has(total)) {
      // Perform OR operation to add the bits
      // Example: 0001 | 0010 = 0011
      this.bitfield = this.bitfield | total;
    }
    return this.bitfield;
  }

  /**
   * @param {number[]} bits bit(s) to remove
   */
  remove(...bits) {
    let total = BitField.resolve(bits);
    if (this.has(total)) {
      // Perform XOR operation to remove the bits
      // Example: 0011 ^ 0010 = 0001
      this.bitfield = this.bitfield ^ total;
    }
    return this.bitfield;
  }

  /**
   * Resolves bitfields to their numeric form.
   * @param {number | string | BitField | number[] | string[]} [bit] bit(s) to resolve
   * @returns {number}
   */
  static resolve(bit) {
    const { DEFAULT_BIT } = BitField;

    // If bit is already a number and is greater than or equal to the default bit, return it
    if (typeof bit === "number" && Number(bit) >= DEFAULT_BIT) {
      return bit;
    }

    // If bit is an instance of BitField, return the bitfield
    if (bit instanceof BitField) return bit.bitfield;

    // If bit is an array, resolve each bit and perform OR operation to combine them
    if (Array.isArray(bit)) {
      const result = bit
        .map((bit_) => BitField.resolve(bit_))
        .reduce((prev, bit_) => {
          // Perform OR operation to combine the bits
          return Number(prev) | Number(bit_);
        }, DEFAULT_BIT);

      return result;
    }

    // If bit is a string, resolve the bit and return it
    if (typeof bit === "string") {
      const numberBit = Number(bit);

      if (!Number.isNaN(numberBit)) {
        return numberBit;
      }

      if (BitField.FLAGS[bit] !== undefined) return BitField.FLAGS[bit];
    }

    throw new RangeError(`[INVALID_BITFIELD]: ${bit}`);
  }
}
