import { SubscriptionFrequency } from './client.interface';

export interface Subscription {
  id: string;
  clientId: string;
  subscriptionPlanId: string;
  frequency: SubscriptionFrequency;
  renewsAt?: Date | null;
  startsAt: Date;
  endsAt?: Date | null;
  isActive?: boolean | null;
}
