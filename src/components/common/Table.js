import cn from "classnames";

import CircularProgress from "@material-ui/core/CircularProgress";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import DeleteIcon from "@material-ui/icons/Delete";
import TableRow from "@material-ui/core/TableRow";
import useTranslate from "../hooks/useTranslate";
import MuiTable from "@material-ui/core/Table";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components/macro";
import hexToRgb from "../../utils/hexToRgb";

const Table = ({
  component = Paper,
  data,
  isLoading,
  minheight = 400,
  structure,
  hasActions,
  handleEdit,
  editingRowId,
  removingRowId,
  handleRemove,
}) => {
  const i18n = useTranslate();

  return (
    <StyledTableContainer component={component}>
      <StyledTable stickyHeader minheight={minheight}>
        <StyledTableHead>
          <TableRow>
            {structure.map(({ header, className }) => (
              <TableCell className={className} key={header}>
                {header}
              </TableCell>
            ))}
            {hasActions && (
              <>
                <ActionCell className="action-edit">{i18n("TABLE_HEADERS.EDIT")}</ActionCell>
                <ActionCell className="action-delete">{i18n("TABLE_HEADERS.DELETE")}</ActionCell>
              </>
            )}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map(item => (
            <StyledTableRow
              className={cn({
                "is-editing": item.id === editingRowId,
                "is-removing": item.id === removingRowId,
              })}
              hover
              key={item.id}
            >
              {structure.map(({ accessor, header }) => (
                <TableCell key={header} component="th" scope="row">
                  {typeof accessor === "string" ? item[accessor] : accessor(item)}
                </TableCell>
              ))}

              {hasActions && (
                <>
                  <ActionCell>
                    <ActionWrap
                      className="action-edit"
                      onClick={() => handleEdit && handleEdit(item)}
                    >
                      <EditIcon />
                    </ActionWrap>
                  </ActionCell>
                  <ActionCell>
                    <ActionWrap
                      className="action-delete"
                      onClick={() => handleRemove && handleRemove(item)}
                    >
                      <DeleteIcon />
                    </ActionWrap>
                  </ActionCell>
                </>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>

      {isLoading && (
        <LoadingWrap>
          <CircularProgress />
        </LoadingWrap>
      )}
    </StyledTableContainer>
  );
};

export default Table;

const StyledTableContainer = styled(TableContainer)`
  position: relative;
`;

const StyledTable = styled(MuiTable)`
  min-width: 650px;
  min-height: ${({ minheight }) => minheight}px;
`;

const StyledTableHead = styled(TableHead)`
  .MuiTableCell-stickyHeader {
    background-color: ${({ theme }) => hexToRgb(theme.palette.primary.light, 0.3)};
  }
`;

const StyledTableRow = styled(TableRow)`
  position: relative;
  height: 30px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
  }

  &.is-editing {
    &:after {
      background-color: ${({ theme }) => hexToRgb(theme.palette.primary.light, 0.3)};
      animation: pulse 0.5s alternate infinite;
    }
  }

  &.is-removing {
    &:after {
      background-color: ${({ theme }) => hexToRgb(theme.palette.error.light, 0.3)};
      animation: pulse 0.5s alternate infinite;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ActionWrap = styled(Button)`
  border-radius: 50px;
  padding: 10px;

  &.action-edit {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  &.action-delete {
    color: ${({ theme }) => theme.palette.error.main};
  }

  &.MuiButton-root {
    min-width: unset;
  }
`;

const ActionCell = styled(TableCell)`
  width: 50px;
`;

const LoadingWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.action.disabledBackground};
  overflow: hidden;
`;
