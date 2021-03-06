import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Service } from './service.entity';
import { Client } from 'src/clients/client.entity';
import { Technician } from 'src/technicians/technician.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) { }

    // Create a service
    async create(type: string, client: Client, technician: Technician): Promise<Service> {
        const service = this.servicesRepository.create({
            type: type,
            client: client,
            technician: technician
        });
        await this.servicesRepository.save(service);
        return service;
    }

    // find a service by id
    async findById(id: number): Promise<Service> {
        const service = await this.servicesRepository.createQueryBuilder('service')
            .innerJoinAndSelect('service.technician', 'technician')
            .where('service.id = :id', {id: id}).getOne();

        return service;
    }

    // update service working date
    async updateWorkingDate(id: number) {
        await this.servicesRepository.query('UPDATE service set working_date=CURRENT_TIMESTAMP WHERE id = $1', [id]);
    }

    // updates service completed date
    async updateCompletedDate(id: number) {
        await this.servicesRepository.query('UPDATE service set completed_date=CURRENT_TIMESTAMP WHERE id = $1', [id]);
    }

    // updates the rating
    async updateRating(id: number, rating: number) {
        const service = await this.servicesRepository.findOne(id);
        service.rating = rating;
        await this.servicesRepository.save(service);
    }

    async findAll(filters): Promise<Service[]> {
        let query = this.servicesRepository.createQueryBuilder('service')
            .innerJoinAndSelect('service.technician', 'technician')
            .where('technician.id = :technicianId', filters)

        if (filters.status === 'waiting') {
            query = query.andWhere('service.working_date IS NULL');
        } else if (filters.status === 'working') {
            query = query.andWhere('service.working_date IS NOT NULL and service.completed_date IS NULL');
        } else if (filters.status === 'completed') {
            query = query.andWhere('service.completed_date IS NOT NULL');
        }

        const services = await query.getMany();
        return services;
    }
}