import client from "@/lib/client/ApolloClient";
import { GET_FACILITY_BOOKING_PAGE } from "@/lib/queries/site/facilityBookingPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

// ── Type definitions ──────────────────────────────────────────────

export interface NoteItem {
    noteText: string | null;
}

export interface BookingFormSection {
    formId: string | null;
}

export interface NotesSection {
    sectionTitle: string | null;
    notes: NoteItem[] | null;
}

export type FacilityBookingSection = BookingFormSection | NotesSection;

export interface FacilityBookingPageDataType {
    pageBy: {
        pageOptions: {
            pageTitle: string | null;
            pageDescription: string | null;
        } | null;
        template: {
            templateName: string;
            facilityBookingPageBuilder: {
                facilityBookingPageBuilder: FacilityBookingSection[];
            } | null;
        } | null;
        sEOOptions: SEOOptions | null;
    } | null;
}

export interface FacilityBookingPageData {
    pageTitle: string | null;
    pageDescription: string | null;
    formId: string | null;
    notesSection: NotesSection | null;
    sEOOptions: SEOOptions | null;
}

// ── Server-side fetch ─────────────────────────────────────────────

/**
 * Fetch facility booking page data in a single query.
 * Called from server components only.
 */
export async function fetchFacilityBookingPageData(): Promise<FacilityBookingPageData | null> {
    try {
        const result = await client.query<FacilityBookingPageDataType>({
            query: GET_FACILITY_BOOKING_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Facility booking page query error:", result.error);
            return null;
        }

        const page = result.data?.pageBy;
        if (!page) return null;

        const sections =
            page.template?.facilityBookingPageBuilder?.facilityBookingPageBuilder ?? [];

        // Extract form ID from the booking form section
        const formSection = sections.find(
            (s) => 'formId' in s
        ) as BookingFormSection | undefined;

        // Extract notes section
        const notesSection = sections.find(
            (s) => 'sectionTitle' in s
        ) as NotesSection | undefined;

        return {
            pageTitle: page.pageOptions?.pageTitle ?? null,
            pageDescription: page.pageOptions?.pageDescription ?? null,
            formId: formSection?.formId ?? null,
            notesSection: notesSection ?? null,
            sEOOptions: page.sEOOptions ?? null,
        };
    } catch (error) {
        console.error("Error fetching facility booking page data:", error);
        return null;
    }
}
