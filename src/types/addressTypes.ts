import type { TAddressEntity } from "./entityTypes";

export type TAddress = {
  addressId: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  entityId: number;
  entityType: TAddressEntity;
};