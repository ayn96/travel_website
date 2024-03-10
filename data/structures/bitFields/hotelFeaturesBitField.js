import { BitField } from "../../utils/bitField.js";

export const HotelFeaturesBits = {
  POOL: 1 << 0,
  SPA: 1 << 1,
  GYM: 1 << 2,
  RESTAURANT: 1 << 3,
  BAR: 1 << 4,
  WI_FI: 1 << 5,
  PARKING: 1 << 6,
  ROOM_SERVICE: 1 << 7,
  CONFERENCE_ROOMS: 1 << 8,
  PET_FRIENDLY: 1 << 9,
  AIR_CONDITIONING: 1 << 10,
  LAUNDRY_SERVICE: 1 << 11,
  NON_SMOKING_ROOMS: 1 << 12,
  FAMILY_ROOMS: 1 << 13,
  DISABLED_FACILITIES: 1 << 14,
  HOT_TUB: 1 << 15,
  SAUNA: 1 << 16,
  CASINO: 1 << 17,
  FREE_BREAKFAST: 1 << 18,
  ALL_INCLUSIVE: 1 << 19,
  ADULTS_ONLY: 1 << 20,
  BEACH_ACCESS: 1 << 21,
  SKI_IN_SKI_OUT: 1 << 22,
  ELECTRIC_VEHICLE_CHARGING_STATION: 1 << 23,
  KITCHENETTES: 1 << 24,
  GOLF_COURSE: 1 << 25,
  TENNIS_COURTS: 1 << 26,
  WATER_PARK: 1 << 27,
  BABYSITTING_SERVICES: 1 << 28,
};

export class HotelFeaturesBitField extends BitField {
  static get FLAGS() {
    return HotelFeaturesBits;
  }
}

console.log(HotelFeaturesBitField.ALL);
