import styled from 'styled-components';

import { ACTION_NAMES, APP_NAME } from '../../constants';

import useAnalytics from '../../services/analyticsService';

import { Banner, BannerActionContainer, BannerButton, BANNER_VARIANT } from '../_ds';

const BannerComponent = styled(Banner)`
  margin: ${({ theme }) => theme.spacing.md + ' 0'};
`;

export const MvpBanner = () => {
  const { logAction } = useAnalytics();

  const onGiveFeedbackClick = () => {
    logAction(ACTION_NAMES.mvpBannerGiveFeedbackClicked);
  };

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
        <BannerButton
          as="a"
          href="https://forms.gle/QfDbiB9oTKZbaQ2u7"
          target="_blank"
          noopener
          noreferrer
          onClick={onGiveFeedbackClick}
        >
          Give feedback
        </BannerButton>
      </BannerActionContainer>
    </BannerComponent>
  );
};
