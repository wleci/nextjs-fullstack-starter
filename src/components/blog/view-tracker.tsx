"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
    postId: string;
}

/**
 * Client component that tracks blog post views
 * Sends a view event every 1 minute while the user is on the page
 */
export function ViewTracker({ postId }: ViewTrackerProps) {
    const hasTrackedInitial = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Track initial view immediately
        if (!hasTrackedInitial.current) {
            trackView();
            hasTrackedInitial.current = true;
        }

        // Set up interval to track view every 1 minute
        intervalRef.current = setInterval(() => {
            trackView();
        }, 60000); // 60000ms = 1 minute

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [postId]);

    const trackView = async () => {
        try {
            await fetch("/api/blog/track-view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
            });
        } catch (error) {
            console.error("Failed to track view:", error);
        }
    };

    // This component doesn't render anything
    return null;
}
