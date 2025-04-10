type M26HotspotButtonIcons = 'triathlon' | 'kitesurfing' | 'soccer' | 'basketball';
export type M26Themes = 'light-blue' | 'dark-blue' | 'dark-gold' | 'green' | 'gray' | 'orange';

export type M26HotspotButtonTypes = {
  alternateHotspotStyle?: boolean;
  icon?: M26HotspotButtonIcons;
  variant?: 'event';
  iconTheme?: M26Themes;
  aria?: Record<string, string>;
};
