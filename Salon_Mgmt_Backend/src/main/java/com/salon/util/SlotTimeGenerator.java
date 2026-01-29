package com.salon.util;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class SlotTimeGenerator {

    public static List<LocalTime> generateStartTimes(LocalTime opening, LocalTime closing, int slotMinutes) {
        List<LocalTime> times = new ArrayList<>();

        LocalTime cursor = opening;
        while (!cursor.plusMinutes(slotMinutes).isAfter(closing)) {
            times.add(cursor);
            cursor = cursor.plusMinutes(slotMinutes);
        }
        return times;
    }
}
