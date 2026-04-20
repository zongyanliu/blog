import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  /** Path to author photo (relative to site root, e.g. '/avatar.jpg'). Used in Person schema. */
  authorImage?: string;
  /**
   * Set to false if your blog post images already match your theme color
   * and you don't want the brand color overlay applied on top of them.
   */
  blogImageOverlay?: boolean;
  /**
   * Branding configuration
   * Logo files: Replace SVGs in src/assets/branding/
   * Favicon: Replace in public/favicon.svg
   */
  branding: {
    /** Logo alt text for accessibility */
    logo: {
      alt: string;
      /** Path to logo image for structured data (e.g. '/logo.png'). Add a PNG to public/ and set this. */
      imageUrl?: string;
    };
    /** Favicon path (lives in public/) */
    favicon: {
      svg: string;
    };
    /** Theme colors for manifest and browser UI */
    colors: {
      /** Browser toolbar color (hex) */
      themeColor: string;
      /** PWA splash screen background (hex) */
      backgroundColor: string;
    };
  };
}

export const siteConfig: SiteConfig = {
  name: 'Synapse & Sequence',
  description: 'Advancing Biology through Artificial Intelligence',
  url: SITE_URL || 'https://zongyanliu.github.io/web',
  ogImage: '/og-default.svg',
  author: 'Zong-Yan Liu',
  email: 'zl843@cornell.edu',
  address: {
    street: '',
    city: 'Ithaca',
    state: 'NY',
    zip: '14850',
    country: 'United States',
  },
  socialLinks: [
    'https://github.com/zongyanliu',
    'https://twitter.com/YourTwitterHandle',
    'https://www.linkedin.com/in/zongyanliu/',
  ],
  twitter: {
    site: 'https://twitter.com/YourTwitterHandle',
    creator: '@YourTwitterHandle',
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  authorImage: '/avatar.svg',
  blogImageOverlay: true,
  branding: {
    logo: {
      alt: 'The AI Botanist',
      imageUrl: '/favicon.svg',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: '#22c55e', // A vibrant green
      backgroundColor: '#0f172a', // Slate dark
    },
  },
};

export default siteConfig;
