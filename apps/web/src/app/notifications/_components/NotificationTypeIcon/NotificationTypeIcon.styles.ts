import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { NotificationResponseType } from '@repo/api-client';

const COLOR_BY_TYPE: Record<NotificationResponseType, (theme: Theme) => string> = {
  [NotificationResponseType.REACTION]: (theme) => theme.colors.status.red[200],
  [NotificationResponseType.UPLOAD]: (theme) => theme.colors.primary[400],
  [NotificationResponseType.COMMENT]: (theme) => theme.colors.grayScale[200],
};

export const IconColor = styled.span<{ type: NotificationResponseType }>`
  display: inline-flex;
  color: ${({ type, theme }) => COLOR_BY_TYPE[type](theme)};
`;
