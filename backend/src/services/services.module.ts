import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './service.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { TechniciansModule } from 'src/technicians/technicians.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), ClientsModule, TechniciansModule],
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}