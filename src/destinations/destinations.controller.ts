import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Controller('destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
    constructor(private readonly destinationsSerive: DestinationsService){}

    @Post()
    create(@Request() req, @Body() createDestinationDto: CreateDestinationDto){
        return this.destinationsSerive.create(req.user.userId, createDestinationDto);
    };

    @Get()
    findAll(@Request() req){
        return this.destinationsSerive.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id:string){
        return this.destinationsSerive.findOne(req.user.userId, id);
    }

    @Patch(':id')
    update(@Request() req,
    @Param('id') id:string,
    @Body() updateDestinationDto: CreateDestinationDto
){
    return this.destinationsSerive.update(req.user.userId, id, updateDestinationDto)
}

@Delete(':id')
remove(@Request() req, @Param('id') id:string) {
    return this.destinationsSerive.removeDestination(req.user.userId, id);
}
}
