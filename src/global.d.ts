// GA4 type augmentations
// Reference: https://developers.google.com/tag-platform/gtagjs/reference

declare namespace Gtag {
  // Common item structure for ecommerce events
  interface Item {
    item_id?: string; // SKU / Product ID
    item_name?: string; // Product name
    affiliation?: string;
    coupon?: string;
    currency?: string;
    discount?: number;
    index?: number;
    item_brand?: string;
    item_category?: string;
    item_category2?: string;
    item_category3?: string;
    item_category4?: string;
    item_category5?: string;
    item_list_id?: string;
    item_list_name?: string;
    item_variant?: string;
    location_id?: string;
    price?: number;
    promotion_id?: string;
    promotion_name?: string;
    quantity?: number;
    creative_name?: string;
    creative_slot?: string;
    // Allow additional custom dimensions/metrics (unknown for type-safety)
    [key: string]: unknown;
  }

  interface ConfigParams {
    send_page_view?: boolean;
    allow_ad_personalization_signals?: boolean;
    anonymize_ip?: boolean;
    page_path?: string;
    page_title?: string;
    page_location?: string;
    debug_mode?: boolean;
    cookie_prefix?: string;
    cookie_domain?: string;
    cookie_expires?: number;
    // Custom / additional params
    [key: string]: unknown;
  }

  interface EventParams {
    value?: number;
    currency?: string;
    transaction_id?: string;
    affiliation?: string;
    tax?: number;
    shipping?: number;
    items?: Item[];
    method?: string; // e.g. for login / sign_up
    coupon?: string;
    shipping_tier?: string;
    payment_type?: string;
    // Custom / additional params
    [key: string]: unknown;
  }

  interface ConsentParams {
    ad_storage?: "granted" | "denied";
    analytics_storage?: "granted" | "denied";
    functionality_storage?: "granted" | "denied";
    personalization_storage?: "granted" | "denied";
    security_storage?: "granted" | "denied";
    ad_user_data?: "granted" | "denied";
    ad_personalization?: "granted" | "denied";
    // Allow future keys
    [key: string]: "granted" | "denied" | undefined;
  }

  interface SetParams {
    [key: string]: unknown;
  }

  // dataLayer entries can be arbitrary objects or gtag command argument arrays
  type DataLayerEntry = Record<string, unknown> | IArguments | unknown[];
}

type GtagFunction = {
  (command: "js", date: Date): void;
  (command: "config", measurementId: string, config?: Gtag.ConfigParams): void;
  (command: "event", eventName: string, params?: Gtag.EventParams): void;
  (command: "consent", action: "default" | "update", params: Gtag.ConsentParams): void;
  (command: "set", params: Gtag.SetParams): void;
  // Fallback signature
  (...args: unknown[]): void;
};

declare global {
  interface Window {
    dataLayer: Gtag.DataLayerEntry[];
    gtag: GtagFunction;
  }
}

export {};
