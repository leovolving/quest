import useAnalytics from '../../services/analyticsService';

import { Banner, BannerButton, BANNER_VARIANT } from '../_ds';

export const MvpBanner = () => {
  const { exportAnalytics } = useAnalytics();
  return (
    <Banner variant={BANNER_VARIANT.WARN}>
      MVP <BannerButton onClick={exportAnalytics}>Export data</BannerButton>
    </Banner>
  );
};
