"use server";

import { cache } from 'react';
import client from "@/lib/client/ApolloClient";
import { GET_EVENTS, GET_EVENT_BY_ID, GET_EVENTS_PAGE_OPTIONS } from "@/lib/queries/site/eventsQueries";

export interface EventNode {
    eventId: number;
    title: string;
    content: string;
    featuredImage: {
        node: {
            altText: string;
            sourceUrl: string;
        };
    } | null;
    eventOptions: {
        eventStartDateAndTime: string | null;
        eventEndDateAndTime: string | null;
        eventLocation: string | null;
        eventAttendanceMode: string[] | null;
        eventRegistrationBlockDescription: string | null;
        eventRegistrationBlockHeading: string | null;
        registerButtonLink: string | null;
    };
    categories: {
        nodes: {
            name: string;
        }[];
    } | null;
}

export interface EventsData {
    nodes: EventNode[];
    hasNextPage: boolean;
    endCursor: string | null;
}

export const fetchEvents = cache(async (first: number = 9, after?: string): Promise<EventsData> => {
    try {
        const { data } = await client.query<{
            events: {
                pageInfo: { hasNextPage: boolean; endCursor: string | null };
                nodes: EventNode[];
            };
        }>({
            query: GET_EVENTS,
            variables: { first, after: after || undefined },
            fetchPolicy: "network-only",
        });

        return {
            nodes: data?.events?.nodes ?? [],
            hasNextPage: data?.events?.pageInfo?.hasNextPage ?? false,
            endCursor: data?.events?.pageInfo?.endCursor ?? null,
        };
    } catch (error) {
        console.error("[fetchEvents] Error fetching events:", error);
        return { nodes: [], hasNextPage: false, endCursor: null };
    }
});

export const fetchEventById = cache(async (id: string): Promise<EventNode | null> => {
    try {
        const { data } = await client.query<{
            event: EventNode;
        }>({
            query: GET_EVENT_BY_ID,
            variables: { id },
            fetchPolicy: "network-only",
        });

        return data?.event ?? null;
    } catch (error) {
        console.error("[fetchEventById] Error fetching event:", error);
        return null;
    }
});

export interface SeoOptions {
    seoTitle: string | null;
    metaDescription: string | null;
    focusKeyword: string | null;
    canonicalUrl: string | null;
}

export interface EventsPageOptions {
    pageTitle: string | null;
    pageDescription: string | null;
}

export interface EventsPageData {
    pageOptions: EventsPageOptions | null;
    seoOptions: SeoOptions | null;
}

/**
 * Fetch the Events page title & description from WordPress ACF pageOptions.
 * @param uri - The WordPress page URI (e.g. "events")
 */
export const fetchEventsPageOptions = cache(async (
    uri: string
): Promise<EventsPageData | null> => {
    try {
        const { data } = await client.query<{
            pageBy: {
                pageOptions: EventsPageOptions;
                seoOptions: SeoOptions;
            } | null;
        }>({
            query: GET_EVENTS_PAGE_OPTIONS,
            variables: { uri },
            fetchPolicy: "network-only",
        });

        if (!data?.pageBy) return null;
        return {
            pageOptions: data.pageBy.pageOptions ?? null,
            seoOptions: data.pageBy.seoOptions ?? null,
        };
    } catch (error) {
        console.error("[fetchEventsPageOptions] Error fetching page options:", error);
        return null;
    }
});
