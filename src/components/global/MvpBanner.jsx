import styled from 'styled-components';

import { APP_NAME } from '../../constants';

import useAnalytics from '../../services/analyticsService';

import { Banner, BannerActionContainer, BannerButton, BANNER_VARIANT } from '../_ds';

const BannerComponent = styled(Banner)`
  margin: ${({ theme }) => theme.spacing.md + ' 0'};
`;

export const MvpBanner = () => {
  const { exportAnalytics } = useAnalytics();
  return (
    <BannerComponent variant={BANNER_VARIANT.WARN} stacked>
      <div>
        <strong>Warning:</strong> {APP_NAME} is still in Beta testing. Your data is only saved to
        your device and may be erased.
        <br />
        <br />
        Got feedback? Noticed a bug? Let us know!
      </div>
      <BannerActionContainer>
        {/* TODO: add link to Google form */}
        <BannerButton>Give feedback</BannerButton>
        <BannerButton floating onClick={exportAnalytics}>
          Export data
        </BannerButton>
      </BannerActionContainer>
    </BannerComponent>
  );
};
