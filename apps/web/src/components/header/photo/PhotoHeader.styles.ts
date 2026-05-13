import styled from '@emotion/styled';

export const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1009;
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: 56px;
  right: 16px;
  min-width: 120px;
  margin-top: 10px;
  z-index: 1010;
`;
