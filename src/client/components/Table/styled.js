import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const TableWrapper = styled.div`
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
`;

export const TableElement = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;

  th {
    text-align: left;
    padding: 12px;
  }

  td {
    text-align: left;
    padding: 12px;
  }

  thead {
    tr {
      border-bottom: 2px solid ${props => props.theme.rgbaColor(0.4)};
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${props => props.theme.rgbaColor(0.12)};

      &:hover {
        background-color: ${props => props.theme.rgbaColor(0.12)};
      }
    }
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  user-select: none;

  ${props =>
    props.sort &&
    css`
      cursor: pointer;
    `}
`;