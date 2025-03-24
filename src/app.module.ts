import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProducerModule } from './producer/producer.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProducerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
