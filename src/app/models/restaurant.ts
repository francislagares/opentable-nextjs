import { Cuisine, Location, PRICE, Review } from '@prisma/client';

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  reviews: Review[];
}

export interface RestaurantDetail {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  openTime: string;
  closeTime: string;
}
