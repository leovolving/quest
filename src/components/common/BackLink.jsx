import { styled } from 'styled-components';

import { RouterLink } from '../_ds';

const BackLinkComponent = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: fit-content;
`;

export const BackLink = (props) => (
  <BackLinkComponent variant="tertiary" {...props}>
    ← Back
  </BackLinkComponent>
);
