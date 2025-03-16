package com.socialanalytics.integrator.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MessageData {
    private String id;
    private String channelId;
    private String text;
    private String url;
    private Integer viewsCount;
    private Integer reactionsCount;
    private Integer commentsCount;
    private List<String> mediaUrls;
    private String author;
    private boolean hasMedia;
    private LocalDateTime publishedAt;
    private LocalDateTime lastUpdated;
    private List<ReactionData> reactions;
} 