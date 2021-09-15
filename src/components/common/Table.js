import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";
import TableContainer from "@material-ui/core/TableContainer";
import DownloadIcon from "@material-ui/icons/GetApp";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import DeleteIcon from "@material-ui/icons/Delete";
import TableRow from "@material-ui/core/TableRow";
import MuiTable from "@material-ui/core/Table";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import cn from "classnames";

import useTranslate from "../hooks/useTranslate";
import styled from "styled-components/macro";
import hexToRgb from "../../utils/hexToRgb";
import Tooltip from "./Tooltip";

const Table = ({
  data,
  page,
  count,
  component = Paper,
  isLoading,
  minheight = 400,
  structure,
  hasActions,
  handleEdit,
  rowsPerPage,
  csvFileName,
  editingRowId,
  handleRemove,
  onPageChange,
  removingRowId,
  hasPagination,
  onRowsPerPageChange,
}) => {
  const i18n = useTranslate();
  const [csvHeaders, setCSVHeaders] = useState([]);
  const [csvData, setCSVData] = useState([]);

  useEffect(() => {
    setCSVHeaders(structure.map(({ key, header }) => ({ label: header, key })));
  }, [structure]);

  useEffect(() => {
    setCSVData(
      data.reduce((acc, current) => {
        const newCurrent = structure.reduce((innerAcc, { accessor, header, skipForCSV, key }) => {
          return skipForCSV
            ? innerAcc
            : {
                ...innerAcc,
                [key]: typeof accessor === "string" ? current[accessor] : accessor(current),
              };
        }, {});

        return [...acc, newCurrent];
      }, [])
    );
  }, [structure, data]);

  return (
    <StyledTableContainer component={component} elevation={3}>
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
                <ActionCell className="action-edit">{i18n("TABLE_ACTIONS.EDIT")}</ActionCell>
                <ActionCell className="action-delete">{i18n("TABLE_ACTIONS.DELETE")}</ActionCell>
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
      <TableActions>
        <StyledCSVLink data={csvData} filename={csvFileName} headers={csvHeaders} target="_blank">
          <Tooltip placement="left" tooltipText={i18n("TABLE_ACTIONS.DOWNLOAD_CSV")}>
            <DownloadIcon />
          </Tooltip>
        </StyledCSVLink>

        {hasPagination && (
          <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </TableActions>

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
    background-color: ${({ theme }) => hexToRgb(theme.palette.primary.dark, 0.3)};
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

const TableActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing(2)}px;
`;

const StyledCSVLink = styled(CSVLink)`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;
