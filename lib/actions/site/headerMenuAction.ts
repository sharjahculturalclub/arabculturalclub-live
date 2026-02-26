import client from "@/lib/client/ApolloClient";
import { GET_HEADER_MENU } from "@/lib/queries/site/headerMenuQueries";

export interface MenuItem {
    label: string;
    uri: string;
    cssClasses: string[];
    description: string | null;
    linkRelationship: string | null;
    childItems?: {
        edges: Array<{
            node: MenuItem;
        }>;
    };
}

export interface MenuEdge {
    node: MenuItem;
}

export interface HeaderMenuDataType {
    menuItems: {
        edges: MenuEdge[];
    };
}

export interface NavLink {
    title: string;
    path: string;
    children?: NavLink[];
}

/**
 * Transform GraphQL menu item to NavLink format
 * Recursively handles sub-menu items
 */
function transformMenuItem(item: MenuItem): NavLink {
    const navLink: NavLink = {
        title: item.label,
        path: item.uri,
    };

    if (item.childItems?.edges && item.childItems.edges.length > 0) {
        navLink.children = item.childItems.edges.map(edge =>
            transformMenuItem(edge.node)
        );
    }

    return navLink;
}

/**
 * Fetch header menu data from WordPress via GraphQL
 * 
 * Called from server components only.
 * Follows PROJECT_CHECKLIST:
 * - §4: Separate fetch logic from components
 * - §4: Single centralized Apollo instance
 * - §4: Backend-agnostic transform (CMS fields → NavLink)
 */
export async function fetchHeaderMenu(): Promise<NavLink[]> {
    try {
        const result = await client.query<HeaderMenuDataType>({
            query: GET_HEADER_MENU,
        });

        if (result.error || !result.data?.menuItems?.edges) {
            console.error("Menu query error:", result.error);
            return [];
        }

        return result.data.menuItems.edges.map(edge =>
            transformMenuItem(edge.node)
        );
    } catch (error) {
        console.error("Error fetching header menu:", error);
        return [];
    }
}
