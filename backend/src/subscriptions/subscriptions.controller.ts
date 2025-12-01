import { Controller, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  getPlans() {
    return [
      {
        id: '1',
        name: 'Basic',
        price: 99,
        features: ['Up to 50 products', 'Basic support'],
        isActive: true,
      },
      {
        id: '2',
        name: 'Professional',
        price: 199,
        features: ['Unlimited products', 'Priority support', 'Advanced analytics'],
        isActive: true,
      },
      {
        id: '3',
        name: 'Enterprise',
        price: 399,
        features: ['Unlimited products', '24/7 support', 'Custom integrations'],
        isActive: true,
      },
    ];
  }
}

