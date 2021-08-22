import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MuiTable from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components/macro";
import React from "react";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const dummyRows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const dummyTableHeaderCells = [
  { title: "Dessert (100g serving)" },
  { title: "Calories" },
  { title: "Fat&nbsp;(g)" },
  { title: "Carbs&nbsp;(g)" },
  { title: "Protein&nbsp;(g)" },
];

const Table = ({
  component = Paper,
  tableHeaderCells = dummyTableHeaderCells,
  rows = dummyRows,
}) => (
  <TableContainer component={component}>
    <StyledTable>
      <TableHead>
        <TableRow>
          {tableHeaderCells.map(({ title, ...rest }) => (
            <TableCell {...rest}>{title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.name}>
            {Object.keys(row).map(key => (
              <TableCell key={key} component="th" scope="row">
                {row[key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  </TableContainer>
);

export default Table;

const StyledTable = styled(MuiTable)`
  min-width: 650px;
`;
