import { Subscription } from './subscription.interfaces';
import { SystemConfiguration } from './system-configuration.interface';

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  oauth_token_secret?: string | null;
  oauth_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  client: Client;
  isActive?: boolean | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  client: Client;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
  createdAt: Date;
}

export interface Client {
  id_client: string;
  username: string;
  name: string;
  tin?: string | null;
  locations: Location[];
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  image: string;
  emailVerified?: Date | null;
  accounts: Account[];
  sessions: Session[];
  subscription?: Subscription | null;
  businessType?: string;
  isActive?: boolean | null;

  SystemConfiguration: SystemConfiguration[];
}

export interface SubscriptionPlan {
  id: string;
  productId?: string | null;
  variants: string[];
  slug: SubscriptionPlanSlug;
  name: string;
  description: string;
  nodeQuota: number;
  priceMonthly: number;
  priceYearly: number;
  hrefMonthly?: string | null;
  hrefYearly?: string | null;
  features: string[];
  mostPopular: boolean;
  tier: number;
  isActive?: boolean | null;
  Subscription: Subscription[];
}

export type SubscriptionPlanSlug = 'gratis' | 'plus';
export type SubscriptionFrequency = 'mensual' | 'anual';
