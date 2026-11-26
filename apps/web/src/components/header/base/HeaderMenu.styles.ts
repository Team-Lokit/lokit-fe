import styled from '@emotion/styled';

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1009;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 56px;
  right: 16px;
  min-width: 120px;
  margin-top: 10px;
  z-index: 1010;
`;
