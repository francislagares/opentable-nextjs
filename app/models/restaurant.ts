import { Cuisine, Location, PRICE } from '@prisma/client';

export interface RestaurantCardType {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
}

export interface RestaurantDetail {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
}
