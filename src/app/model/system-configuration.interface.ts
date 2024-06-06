import { TailwindColor } from './color.type';

export interface SystemConfiguration {
  id: string;
  idClient: string;
  businessSlug?: string;
  previusBusinessSlug?: string;
  businessColor: TailwindColor;
  catalogName?: string;
  homeTitle?: string;
  isBusinessSlugModified?: boolean;
  businessLogo?: string;
  businessURL?: string;
  businessQR?: string;
}
