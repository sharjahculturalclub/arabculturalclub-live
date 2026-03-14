import client from "@/lib/client/ApolloClient";
import { GET_LECTURE_HALL_BOOKING_PAGE } from "@/lib/queries/site/lectureHallBookingPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

export interface InfoPointItem {
    pointText: string | null;
}

export interface BookingFormSection {
    formId: string | null;
}

export interface InfoSection {
    sectionTitle: string | null;
    infoPoints: InfoPointItem[] | null;
}

export interface LectureHallBookingPageData {
    pageTitle: string | null;
    pageDescription: string | null;
    formId: string | null;
    infoSection: InfoSection | null;
    sEOOptions: SEOOptions | null;
}

export async function fetchLectureHallBookingPageData(): Promise<LectureHallBookingPageData | null> {
    try {
        const result = await client.query<{
            pageBy: {
                pageOptions: {
                    pageTitle: string | null;
                    pageDescription: string | null;
                } | null;
                template: {
                    swimmingSubscriptionPageBuilder: {
                        lecturehallBookingPageBuilder: any[];
                    } | null;
                } | null;
                sEOOptions: SEOOptions | null;
            } | null;
        }>({
            query: GET_LECTURE_HALL_BOOKING_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Lecture Hall Booking page query error:", result.error);
            return null;
        }

        const page = result.data?.pageBy;
        if (!page) return null;

        const sections =
            page.template?.swimmingSubscriptionPageBuilder?.lecturehallBookingPageBuilder ?? [];

        const formSection = sections.find(
            (s: any) => 'formId' in s
        ) as BookingFormSection | undefined;

        const infoSection = sections.find(
            (s: any) => 'sectionTitle' in s
        ) as InfoSection | undefined;

        return {
            pageTitle: page.pageOptions?.pageTitle ?? null,
            pageDescription: page.pageOptions?.pageDescription ?? null,
            formId: formSection?.formId ?? null,
            infoSection: infoSection ?? null,
            sEOOptions: page.sEOOptions ?? null,
        };
    } catch (error) {
        console.error("Error fetching lecture hall booking page data:", error);
        return null;
    }
}
