package com.socialanalytics.integrator.model;

import lombok.Data;

@Data
public class ReactionData {
    private String id;
    private String messageId;
    private String emoji;
    private Integer count;
    private String networkType; // TELEGRAM, TWITTER, VK
}
 