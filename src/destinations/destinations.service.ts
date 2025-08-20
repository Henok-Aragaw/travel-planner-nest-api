import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
    constructor(private prisma: PrismaService){}

    async create(userId: string, createDestinationDto: CreateDestinationDto){
        // Validate travelDate
        const date = new Date(createDestinationDto.travelDate);
        if (!createDestinationDto.travelDate || isNaN(date.getTime())) {
            throw new BadRequestException('Invalid travelDate. Must be a valid ISO-8601 date string.');
        }
        return this.prisma.destination.create({
            data: {
               ...createDestinationDto,
               travelDate: date.toISOString(),
               userId
            },
        });
    }

    async findAll(userId: string){
        return this.prisma.destination.findMany({
            where:{userId}
        });
    }

    async findOne(userId: string,id: string){
        const destination = await this.prisma.destination.findFirst({
            where:{
                id,
                userId
            }
        });

        if(!destination){
            throw new NotFoundException('Destination not found');
        }

        return destination
    }

    async removeDestination(userId: string, id:string){
        await this.findOne(userId, id);

        return this.prisma.destination.delete({
            where:{
                id
            }
        });
    }

    async update(userId: string, id:string, updateDestinationDto: UpdateDestinationDto){
        
        await this.findOne(userId, id);

        // If travelDate is present, validate and convert to ISO string
        let updateData = { ...updateDestinationDto };
        if (updateDestinationDto.travelDate !== undefined) {
            const date = new Date(updateDestinationDto.travelDate);
            if (!updateDestinationDto.travelDate || isNaN(date.getTime())) {
                throw new BadRequestException('Invalid travelDate. Must be a valid ISO-8601 date string.');
            }
            updateData.travelDate = date.toISOString();
        }

        return this.prisma.destination.update({
            where: {
                id
            },
            data: updateData
        });
    }
    
}
