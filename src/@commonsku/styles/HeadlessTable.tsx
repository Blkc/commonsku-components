import React from 'react';
import { useTable, useSortBy, useBlockLayout, usePagination, useColumnOrder } from 'react-table'
import { useSticky } from 'react-table-sticky';
import { SharedStyles, SharedStyleTypes } from './SharedStyles'

type HeadlessTableProps = React.PropsWithChildren<{columns: any, data: any, setSidePanelRow?: any} & SharedStyleTypes>;

const HeadlessTable = ({ columns, data, setSidePanelRow }: HeadlessTableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    prepareRow,
    setColumnOrder,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination,
    useColumnOrder,
    useSticky,
    useBlockLayout
  )

  let columnBeingDragged = null;

  const onDragStart = e => {
    columnBeingDragged = e.target.dataset.columnIndex;
  };

  const onDrop = e => {
    e.preventDefault();
    const newPosition = e.target.dataset.columnIndex;
    const currentCols = visibleColumns.map(c => c.id);
    const colToBeMoved = currentCols.splice(columnBeingDragged, 1);
    currentCols.splice(newPosition, 0, colToBeMoved[0]);
    setColumnOrder(currentCols);
  };

  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
      <table {...getTableProps()} className="react-table react-table-sticky">
        <thead className="header">
          {headerGroups.map((headerGroup, h) => (
            <tr key={h} {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column, i) => (
                <th key={i} {...column.getHeaderProps(column.getSortByToggleProps())}
                  data-column-index={i}
                  draggable="true"
                  onDragStart={onDragStart}
                  onDragOver={e => e.preventDefault()}
                  onDrop={onDrop}
                  className="th"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="body">
          {page.map((row, r) => {
            prepareRow(row)
            return (
              <tr key={r} {...row.getRowProps()} onClick={() => {setSidePanelRow(row.original)}}>
                {row.cells.map((cell, c) => {
                  return <td key={c} {...cell.getCellProps()} className="td">{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="react-table-pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export { HeadlessTable };