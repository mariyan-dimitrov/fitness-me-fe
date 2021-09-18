import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import TableContainer from "@material-ui/core/TableContainer";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import { useState, useEffect, useCallback } from "react";
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
import { CSVLink } from "react-csv";
import cn from "classnames";

import useTranslate from "../hooks/useTranslate";
import styled from "styled-components/macro";
import hexToRgb from "../../utils/hexToRgb";
import Tooltip from "./Tooltip";

const sortMap = {
  asc: "desc",
  desc: "asc",
};

const compareStrings = (a, b, sortDirection) => {
  if (a > b) {
    return sortDirection === "asc" ? 1 : -1;
  } else if (a < b) {
    return sortDirection === "asc" ? -1 : 1;
  } else {
    return 0;
  }
};

const compareNumbers = (a, b, sortDirection) => {
  if (a - b > 0) {
    return sortDirection === "asc" ? 1 : -1;
  } else if (a - b < 0) {
    return sortDirection === "asc" ? -1 : 1;
  } else {
    return 0;
  }
};

const Table = ({
  data,
  count,
  component = Paper,
  isLoading,
  minheight = 400,
  structure,
  hasActions,
  handleEdit,
  csvFileName,
  editingRowId,
  handleRemove,
  removingRowId,
  hasPagination = true,
}) => {
  const i18n = useTranslate();
  const [sortDirection, setSortDirection] = useState("asc");
  const [visibleItems, setVisibleItems] = useState([]);
  const [csvHeaders, setCSVHeaders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState(false);
  const [csvData, setCSVData] = useState([]);
  const [page, setPage] = useState(0);

  const isValidDate = d => d instanceof Date && !isNaN(d);

  const getVisibleItems = useCallback(
    () =>
      data
        .sort((a, b) => {
          const aSortValue = a[sortBy];
          const bSortValue = b[sortBy];
          const aSecondSortValue = a.name;
          const bSecondSortValue = b.name;

          const areBothNumbers = typeof aSortValue === "number" && typeof bSortValue === "number";
          const areBothStrings = typeof aSortValue === "string" && typeof bSortValue === "string";
          const areBothDates = isValidDate(aSortValue) && isValidDate(bSortValue);

          const compareFunction =
            areBothNumbers || areBothDates
              ? compareNumbers
              : areBothStrings
              ? compareStrings
              : null;

          if (compareFunction) {
            const compareResult = compareFunction(aSortValue, bSortValue, sortDirection);

            return compareResult
              ? compareResult
              : typeof aSecondSortValue === "number" && typeof bSecondSortValue === "number"
              ? compareNumbers(aSecondSortValue, bSecondSortValue, sortDirection)
              : compareStrings(aSecondSortValue, bSecondSortValue, sortDirection);
          } else {
            return 0;
          }
        })
        .filter((row, index) => index - pageSize * page >= 0 && index < pageSize * (page + 1)),
    [data, pageSize, page, sortBy, sortDirection]
  );

  useEffect(() => {
    setVisibleItems(getVisibleItems());
  }, [getVisibleItems]);

  useEffect(() => {
    setCSVHeaders(structure.map(({ key, header }) => ({ label: header, key })));
  }, [structure]);

  useEffect(() => {
    setCSVData(
      visibleItems.reduce((acc, current) => {
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
  }, [structure, visibleItems]);

  return (
    <StyledTableContainer component={component} elevation={3}>
      <StyledTable stickyHeader minheight={minheight}>
        <StyledTableHead>
          <TableRow>
            {structure.map(({ header, className, sortByKey }) => (
              <TableCell
                className={cn(className, { "is-column-sortable": Boolean(sortByKey) })}
                key={header}
                onClick={
                  sortByKey
                    ? () => {
                        setSortBy(sortByKey);
                        setSortDirection(sortMap[sortDirection]);
                      }
                    : null
                }
              >
                {header}

                {sortBy === sortByKey && sortDirection === "desc" && (
                  <ArrowDropDown className="table-sort-icon" />
                )}
                {sortBy === sortByKey && sortDirection === "asc" && (
                  <ArrowDropUp className="table-sort-icon" />
                )}
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
          {visibleItems.map(item => (
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
            count={data.length}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={event => {
              setPage(0);
              setPageSize(parseInt(event.target.value, 10));
            }}
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
    position: relative;
    background-color: ${({ theme }) => hexToRgb(theme.palette.primary.dark, 0.3)};
  }

  .is-column-sortable {
    cursor: pointer;
  }

  .table-sort-icon {
    position: absolute;
    vertical-align: bottom;
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
