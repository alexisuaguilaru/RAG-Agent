/**
 * Sidebar Banner Configuration
 * 
 * Configurable link and image settings for the Sidebar Header banner.
 * Change `targetUrl` to redirect users to any internal or external page.
 * Change `imageUrl` to use a custom banner image.
 */

export interface BannerConfig {
  /** Target destination URL when clicking the banner */
  targetUrl: string;
  /** Banner image source URL or path (e.g. /banner.svg, /banner.png or external URL) */
  imageUrl: string;
  /** Alt text for accessibility */
  altText: string;
  /** Whether to open in a new tab when clicked */
  openInNewTab: boolean;
}

export const bannerConfig: BannerConfig = {
  targetUrl: "https://github.com/alexisuaguilaru/RAG-Agent",
  imageUrl: "/banner.svg",
  altText: "AI Chatbot Banner",
  openInNewTab: true,
};
