import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import Switch from '@material-ui/core/Switch';
import moment from 'moment';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EnhancedTableHead from 'enl-components/Tables/tableParts/TableHeader';
import EnhancedTableToolbar from 'enl-components/Tables/tableParts/TableToolbar';
import styles from 'enl-components/Tables/tableStyle-jss';
import Loading from 'enl-components/Loading';
import { countries } from '../../../api/consts';

function UserTable(props) {
  const {
    classes, title, data, loading
  } = props;
  const [tableState, setTableState] = useState({
    order: 'asc',
    orderBy: 'createdAt',
    selected: [],
    columnData: [
      {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name'
      },
      {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email'
      },
      {
        id: 'country',
        numeric: false,
        disablePadding: false,
        label: 'Country'
      },
      {
        id: 'ip',
        numeric: false,
        disablePadding: false,
        label: 'IP Address'
      },
      {
        id: 'likes',
        numeric: true,
        disablePadding: false,
        label: 'Likes'
      },
      {
        id: 'dislikes',
        numeric: true,
        disablePadding: false,
        label: 'Dislikes'
      },
      {
        id: 'isReal',
        numeric: false,
        disablePadding: false,
        label: 'Real'
      },
      {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Created At'
      }
    ],
    users: data,
    page: 0,
    rowsPerPage: 10,
    defaultPerPage: 10,
    filterText: ''
  });

  const handleUserInput = value => {
    // Show all item first
    const { users, defaultPerPage } = tableState;
    if (value !== '') {
      setTableState({
        ...tableState,
        rowsPerPage: users
      });
    } else {
      setTableState({
        ...tableState,
        rowsPerPage: defaultPerPage
      });
    }

    // Show result base on keyword
    setTableState({
      ...tableState,
      filterText: value.toLowerCase()
    });
  };

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    page,
    filterText,
    columnData
  } = tableState;

  const handleRequestSort = (event, property) => {
    const orderByConst = property;
    let orderLet = 'desc';

    if (orderBy === property && order === 'desc') {
      orderLet = 'asc';
    }

    const dataConst = orderLet === 'desc'
      ? data.sort((a, b) => (b[orderByConst] < a[orderByConst] ? -1 : 1))
      : data.sort((a, b) => (a[orderByConst] < b[orderByConst] ? -1 : 1));

    setTableState({
      ...tableState,
      data: dataConst,
      order: orderLet,
      orderBy: orderByConst
    });
  };

  const handleChangePage = (event, newPage) => {
    setTableState({
      ...tableState,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = event => {
    setTableState({
      ...tableState,
      rowsPerPage: event.target.value
    });
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const renderCell = (dataArray, keyArray) => keyArray.map((itemCell, index) => (
    <TableCell
      align={itemCell.numeric ? 'right' : 'left'}
      key={index.toString()}
    >
      {itemCell.id === 'isReal' ? (
        <Switch checked={dataArray[itemCell.id]} />
      ) : itemCell.id === 'createdAt' ? (
        moment(dataArray[itemCell.id]).format('DD/MM/YYYY HH:mm:ss')
      ) : itemCell.id === 'country' ? (
        countries.find(item => item.code === dataArray[itemCell.id]).label
      ) : (
        dataArray[itemCell.id]
      )}
    </TableCell>
  ));

  return (
    <Fragment>
      <EnhancedTableToolbar
        numSelected={selected.length}
        filterText={filterText}
        onUserInput={event => handleUserInput(event)}
        title={title}
        placeholder="Search"
      />
      <div className={classes.rootTable}>
        <Table className={classNames(classes.table, classes.stripped)}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={(e, p) => handleRequestSort(e, p)}
            rowCount={data.length}
            columnData={columnData}
          />
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                if (n.name.toLowerCase().indexOf(filterText) === -1) {
                  return false;
                }
                return (
                  <TableRow role="checkbox" tabIndex={-1} key={n._id}>
                    {renderCell(n, columnData)}
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page'
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page'
        }}
        onChangePage={(e, p) => handleChangePage(e, p)}
        onChangeRowsPerPage={val => handleChangeRowsPerPage(val)}
      />

      {loading ? <Loading /> : ''}
    </Fragment>
  );
}

UserTable.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool
};

UserTable.defaultProps = {
  loading: false
};

export default withStyles(styles)(UserTable);
