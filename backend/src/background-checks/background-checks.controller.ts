import { Controller } from '@nestjs/common';
import { BackgroundChecksService } from './background-checks.service';

@Controller('background-checks')
export class BackgroundChecksController {
  constructor(private readonly backgroundChecksService: BackgroundChecksService) {}
}

