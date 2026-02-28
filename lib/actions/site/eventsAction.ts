"use server";

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
        eventDate: string;
        eventLocation: string;
        eventRegistrationBlockDescription: string;
        eventRegistrationBlockHeading: string;
        eventTime: string;
        registerButtonLink: string;
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

export async function fetchEvents(first: number = 9, after?: string): Promise<EventsData> {
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
}

export async function fetchEventById(id: string): Promise<EventNode | null> {
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
}

export interface EventsPageOptions {
    pageTitle: string | null;
    pageDescription: string | null;
}

/**
 * Fetch the Events page title & description from WordPress ACF pageOptions.
 * @param uri - The WordPress page URI (e.g. "events")
 */
export async function fetchEventsPageOptions(
    uri: string
): Promise<EventsPageOptions | null> {
    try {
        const { data } = await client.query<{
            pageBy: {
                pageOptions: EventsPageOptions;
            } | null;
        }>({
            query: GET_EVENTS_PAGE_OPTIONS,
            variables: { uri },
            fetchPolicy: "network-only",
        });

        return data?.pageBy?.pageOptions ?? null;
    } catch (error) {
        console.error("[fetchEventsPageOptions] Error fetching page options:", error);
        return null;
    }
}
