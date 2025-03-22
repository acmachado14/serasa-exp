import { Global, Module } from '@nestjs/common';
import { db } from '../config/database.config';

@Global()
@Module({
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
  ],
  exports: ['DB'],
})
export class DrizzleModule {}
