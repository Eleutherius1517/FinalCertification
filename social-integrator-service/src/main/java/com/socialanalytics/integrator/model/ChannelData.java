package com.socialanalytics.integrator.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChannelData {
    private String id;
    private String name;
    private String description;
    private String url;
    private Integer subscribersCount;
    private Integer postsCount;
    private Double engagementRate;
    private String networkType; // TELEGRAM, TWITTER, VK
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
} 