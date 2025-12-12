import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { OrchestrationService } from './orchestration.service';
import { OrchestrationController } from './orchestration.controller';

@Module({
  imports: [AiModule],
  controllers: [OrchestrationController],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}
