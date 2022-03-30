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
import EnhancedTableHead from 'enl-components/Tables/tableParts/TableHeader';
import EnhancedTableToolbar from 'enl-components/Tables/tableParts/TableToolbar';
import Loading from 'enl-components/Loading';
import styles from 'enl-components/Tables/tableStyle-jss';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import CommentDTO from '../../../../dto/comment/User';

function CommentsTable(props) {
  const {
    classes,
    title,
    onAdd,
    onEdit,
    onRemove,
    data,
    loading,
    users
  } = props;
  const [tableState, setTableState] = useState({
    order: 'asc',
    orderBy: 'createdAt',
    selected: [],
    columnData: [
      {
        id: 'text',
        numeric: false,
        disablePadding: false,
        label: 'Comment'
      },
      {
        id: 'user',
        numeric: false,
        disablePadding: false,
        label: 'Commenter'
      },
      {
        id: 'winner',
        numeric: false,
        disablePadding: false,
        label: 'User'
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
        label: 'Written At'
      },
      {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action'
      }
    ],
    comments: [],
    page: 0,
    rowsPerPage: 10,
    defaultPerPage: 10,
    filterText: ''
  });
  const [removeAlertVisible, setRemoveAlertVisible] = React.useState(false);
  const [countdown, setCountdown] = React.useState(new CommentDTO());

  const handleUserInput = value => {
    // Show all item first
    const { comments, defaultPerPage } = tableState;
    if (value !== '') {
      setTableState({
        ...tableState,
        rowsPerPage: comments
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
      ) : itemCell.id === 'user' || itemCell.id === 'winner' ? (
        users.length > 0 ? (
          users.find(item => item._id === dataArray[itemCell.id]) ? (
            users.find(item => item._id === dataArray[itemCell.id]).name
          ) : (
            ''
          )
        ) : (
          ''
        )
      ) : itemCell.id === 'createdAt' ? (
        moment(dataArray[itemCell.id]).format('DD/MM/YYYY hh:mm:ss')
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
        text="Do you really want to remove this comment?"
        onConfirm={removeCountdown}
        onCancel={() => {
          setRemoveAlertVisible(false);
        }}
      />
      {loading ? <Loading /> : ''}
    </Fragment>
  );
}

CommentsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  users: PropTypes.array.isRequired
};

CommentsTable.defaultProps = {
  loading: false
};

export default withStyles(styles)(CommentsTable);
