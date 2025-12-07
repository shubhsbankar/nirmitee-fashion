import { useState } from 'react';
import { useQuery,keepPreviousData } from '@tanstack/react-query';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ShowHideColumnsButton, 
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
} from 'material-react-table';
import RecyclingIcon from '@mui/icons-material/Recycling';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Link from 'next/link';
import { Tooltip, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ButtonLoading from '@/components/application/ButtonLoading';
import { generateCsv, download, mkConfig } from 'export-to-csv';
import axios from 'axios';
import { showToast } from '@/lib/showToast'
const Datatable = ({
  queryKey,
  fetchUrl,
  columnConfig,
  initialPageSize=10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction
}) => {
    // filters, sorting and pagination states
    const [columnFilters,setColumnFilters] = useState([]);
    const [globalFilter,setGlobalFilter] = useState('');
    const [sorting,setSorting] = useState([]);
    const [pagination,setPagination] = useState({
    pageIndex:0,
    pageSize: initialPageSize
    });
    
    const [exportLoading,setExportLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});

    
    const handleExport = async (selectedRows) => {
      setExportLoading(true);
      try{
        const csvConfig = mkConfig({
          fieldSeparator: ',',
          decimalSeparator: '.',
          useKeysAsHeaders: true,
          filename: 'data-csv'
        });
        let csv;
        console.log(rowSelection);
        if (Object.keys(rowSelection).length > 0){
          const rowData = selectedRows.map(row => row.original);
          csv = generateCsv(csvConfig)(rowData);
        } else {
          const {data : response} = await axios.get(exportEndpoint);
          if(!response.success) {
            throw Error(response.message);
          }
          const rowData = response.data;
          console.log('rowData',rowData);
          csv = generateCsv(csvConfig)(rowData);
        }
        download(csvConfig)(csv);
      }catch(error){
        console.log(error.message);
        showToast('error',error.message);
      }
      finally{
        setExportLoading(false);
      }
    }

    const deleteMutation = useDeleteMutation(queryKey,deleteEndpoint);
    const handleDelete = (ids, deleteType) => {
          let c;
          if (deleteType === 'PD'){
              c = confirm('Are you sure you want to delete the data permanently?');
          }
          else{
              c = confirm('Are you sure you want to move the data into trash?');
          }

          if (c) {
              deleteMutation.mutate({ ids, deleteType});
              setRowSelection({});
          }

      };
    //Data fetching logics
    const {
    data: {data= [],meta} = {},
    isError,
    isRefetching,
    isLoading,
    refetch
    } = useQuery({
    queryKey:[queryKey, { columnFilters, globalFilter, sorting, pagination }],
    queryFn: async () =>{
          const url = new URL(fetchUrl,process.env.NEXT_PUBLIC_BASE_URL);
      //read our state and pass it to the API as query params
      url.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      url.searchParams.set('deleteType', deleteType);

      //use whatever fetch library you want, fetch, axios, etc
      const response = await axios.get(url.href);
      console.log("QueryFn : response",response);
      return response;
		},
		placeholderData: keepPreviousData,
    })

  const table = useMaterialReactTable({
	  columns: columnConfig,
      data: data?.data || {},
      enableRowSelection: true,
      columnFilterDisplayMode: 'popover',
      paginationDisplayMode: 'pages',
      enableColumnOrdering: true,
      enableStickyHeader: true,
      enableStickyFooter:true,
	  initialState: { showColumnFilters: true },
	  manualFiltering: true, //turn off built-in client-side filtering
	  manualPagination: true, //turn off built-in client-side pagination
	  manualSorting: true, //turn off built-in client-side sorting
	  muiToolbarAlertBannerProps: isError
		? {
			color: 'error',
			children: 'Error loading data',
		  }
		: undefined,
	  onColumnFiltersChange: setColumnFilters,
	  onGlobalFilterChange: setGlobalFilter,
	  onPaginationChange: setPagination,
	  onSortingChange: setSorting,
	  rowCount:data?.meta?.totalRowCount ?? 0,
      onRowSelectionChange: setRowSelection,
	  state: {
		columnFilters,
		globalFilter,
		isLoading,
		pagination,
		showAlertBanner: isError,
		showProgressBars: isRefetching,
		sorting,
        rowSelection,
	  },
      getRowId: (originalRow) => originalRow._id,
renderToolbarInternalActions: ({ table }) => (
  <>
    <MRT_ToggleGlobalFilterButton table={table} />
    <MRT_ShowHideColumnsButton table={table} />
    <MRT_ToggleFullScreenButton table={table} />
    <MRT_ToggleDensePaddingButton table={table} />

    {deleteType !== 'PD' && (
      <Tooltip title="Recycle Bin">
        <Link href={trashView}>
          <IconButton>
            <RecyclingIcon />
          </IconButton>
        </Link>
      </Tooltip>
    )}

    {deleteType === 'SD' && (
      <Tooltip title="Delete All">
        <IconButton
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )}

    {deleteType === 'PD' && (
      <>
        <Tooltip title="Restore Data">
          <IconButton
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() =>
              handleDelete(Object.keys(rowSelection), 'RSD')
            }
          >
            <RestoreFromTrashIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Permanently Delete Data">
          <IconButton
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() =>
              handleDelete(Object.keys(rowSelection), deleteType)
            }
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </>
    )}
  </>
),


              enableRowActions: true,
              positionActionsColumn: 'last',
              renderRowActionMenuItems: ({ row }) => createAction(row,deleteType,handleDelete),
              renderTopToolbarCustomActions: ({ table }) => (
              <Tooltip>
                <ButtonLoading 
                  type='button'
                  text={<> <SaveAltIcon fontSize='25'/> Exoprt</>}
                  loading={exportLoading}
                  onClick={() => handleExport(table.getSelectedRowModel().rows)}
                  className='cursor-pointer'
                />
              </Tooltip>
              )
	});

    return (<MaterialReactTable table={table} />);
};

export default Datatable;
