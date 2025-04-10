import M12SocialProps from '../../molecule/m12-social/M12Social.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import M06LinkProps from '../../molecule/m06-link/M06Link.types';

export type O94SocialMediaProps = {
  items: M12SocialProps['items'];
  alignment?: 'centered' | 'stretched'; //defaults to stretched;
  eyebrow: A04EyebrowProps;
  iconsSize?: 'regular' | 'large'; //defaults to regular
  link?: Omit<M06LinkProps, 'icon'>;
};
