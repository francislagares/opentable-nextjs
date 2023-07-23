import { PRICE } from '@prisma/client';

export interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}
