import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { EscrowModule } from './escrow/escrow.module';
import { KycModule } from './kyc/kyc.module';
import { BackgroundChecksModule } from './background-checks/background-checks.module';
import { LicensesModule } from './licenses/licenses.module';
import { PaymentsModule } from './payments/payments.module';
import { PayoutsModule } from './payouts/payouts.module';
import { CommissionsModule } from './commissions/commissions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { FraudDetectionModule } from './fraud-detection/fraud-detection.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    OrdersModule,
    EscrowModule,
    KycModule,
    BackgroundChecksModule,
    LicensesModule,
    PaymentsModule,
    PayoutsModule,
    CommissionsModule,
    SubscriptionsModule,
    NotificationsModule,
    AuditModule,
    FraudDetectionModule,
    AdminModule,
  ],
})
export class AppModule {}

