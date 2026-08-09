export type BazaarId = number;

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * The domain representation of a bazaar.
 *
 * Keeping coordinates grouped in a value object means UI and infrastructure
 * code do not need to know how the data is stored by the API.
 */
export interface Bazaar {
  readonly id: BazaarId;
  readonly name: string;
  readonly location: Coordinates;
  readonly city: string;
  readonly state: string;
  readonly openToday: boolean;
  readonly isActive: boolean;
}
