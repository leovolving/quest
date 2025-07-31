import { styled } from 'styled-components';

export const VARIANT = {
  INFO: 'info',
  WARN: 'warning',
  DANGER: 'danger',
};

const BannerComponent = styled.aside``;

export const BannerButton = styled.button``;

export const Banner = (props) => {
  return <BannerComponent {...props} />;
};
