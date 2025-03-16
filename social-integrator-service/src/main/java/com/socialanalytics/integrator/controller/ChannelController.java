package com.socialanalytics.integrator.controller;

import com.socialanalytics.integrator.service.DataCollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final DataCollectionService dataCollectionService;

    @PostMapping("/{channelId}/collect")
    public ResponseEntity<Void> collectChannelData(
            @PathVariable String channelId,
            @RequestParam String networkType) {
        dataCollectionService.collectChannelData(channelId, networkType);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/{channelId}/messages/collect")
    public ResponseEntity<Void> collectMessages(
            @PathVariable String channelId,
            @RequestParam String networkType,
            @RequestParam(defaultValue = "100") int limit) {
        dataCollectionService.collectMessages(channelId, networkType, limit);
        return ResponseEntity.accepted().build();
    }
} 