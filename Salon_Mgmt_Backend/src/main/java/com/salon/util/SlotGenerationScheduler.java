
package com.salon.util;

import java.time.LocalDate;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.salon.services.SlotGenerationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SlotGenerationScheduler {

    private final SlotGenerationService slotGenerationService;

    // Runs every day at 12:00 AM
    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailySlots() {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        slotGenerationService.generateSlotsForDateRange(today, tomorrow);
    }
}
