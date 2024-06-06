export interface Location {
  id: string;
  client_id: string;
  cartalog_id: string;
  locationName: string;
  district: string;
  address: string;
  coordinates?: string | null;
  phone?: string | null;
  email?: string | null;
  rating: number;
  reviews: number;
  schedule?: string | null;
  imagePortrait?: string | null;
  isActive: boolean;
}
