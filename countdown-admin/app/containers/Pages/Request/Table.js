import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import { AlertDialog } from 'enl-components';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Loading from 'enl-components/Loading';
import moment from 'moment';
import EnhancedTableHead from 'enl-components/Tables/tableParts/TableHeader';
import EnhancedTableToolbar from 'enl-components/Tables/tableParts/TableToolbar';
import styles from 'enl-components/Tables/tableStyle-jss';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CountdownDTO from '../../../dto/Countdown';

function RequestTable(props) {
  const {
    classes,
    title,
    onAdd,
    onEdit,
    onRemove,
    data,
    loading,
    users,
    countdowns
  } = props;
  const [tableState, setTableState] = useState({
    order: 'asc',
    orderBy: 'createdAt',
    selected: [],
    columnData: [
      {
        id: 'countdown',
        numeric: false,
        disablePadding: false,
        label: 'Countdown'
      },
      {
        id: 'user',
        numeric: false,
        disablePadding: false,
        label: 'User'
      },
      {
        id: 'text',
        numeric: false,
        disablePadding: false,
        label: 'Request'
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
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Created At'
      },
      {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action'
      }
    ],
    requests: [],
    page: 0,
    rowsPerPage: 10,
    defaultPerPage: 10,
    filterText: ''
  });
  const [removeAlertVisible, setRemoveAlertVisible] = React.useState(false);
  const [countdown, setCountdown] = React.useState(new CountdownDTO());

  const handleUserInput = value => {
    // Show all item first
    const { requests, defaultPerPage } = tableState;
    if (value !== '') {
      setTableState({
        ...tableState,
        rowsPerPage: requests
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

  const confirmRemove = current => {
    setRemoveAlertVisible(true);
    setCountdown(current);
  };

  const removeCountdown = () => {
    setRemoveAlertVisible(false);
    onRemove(countdown);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const renderCell = (dataArray, keyArray) => keyArray.map((itemCell, index) => (
    <TableCell
      align={itemCell.numeric ? 'right' : 'left'}
      key={index.toString()}
    >
      {itemCell.id === 'action' ? (
        <div>
          <IconButton
            className={classes.button}
            aria-label="Delete"
            color="primary"
            onClick={() => onEdit(dataArray)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label="Delete"
            color="default"
            onClick={() => confirmRemove(dataArray)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ) : itemCell.id === 'createdAt' ? (
        moment(dataArray[itemCell.id]).format('DD/MM/YYYY hh:mm:ss')
      ) : itemCell.id === 'user' ? (
        users.length > 0 ? (
          users.find(item => item._id === dataArray[itemCell.id]) ? (
            users.find(item => item._id === dataArray[itemCell.id]).name
          ) : (
            ''
          )
        ) : (
          ''
        )
      ) : itemCell.id === 'countdown' ? (
        countdowns.length > 0 ? (
          countdowns.find(item => item._id === dataArray[itemCell.id]) ? (
            countdowns.find(item => item._id === dataArray[itemCell.id]).name
          ) : (
            ''
          )
        ) : (
          ''
        )
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
        onAddItem={() => {
          onAdd();
        }}
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
                if (n.text.toLowerCase().indexOf(filterText) === -1) {
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
                <TableCell colSpan={8} />
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

      <AlertDialog
        visible={removeAlertVisible}
        text="Do you really want to remove this request?"
        onConfirm={removeCountdown}
        onCancel={() => {
          setRemoveAlertVisible(false);
        }}
      />
      {loading ? <Loading /> : ''}
    </Fragment>
  );
}

RequestTable.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  users: PropTypes.array.isRequired,
  countdowns: PropTypes.array.isRequired
};

RequestTable.defaultProps = {
  loading: false
};

export default withStyles(styles)(RequestTable);
