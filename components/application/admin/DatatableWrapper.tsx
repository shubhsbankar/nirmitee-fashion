'use client'
import { ThemeProvider } from '@mui/material';
import Datatable from '@/components/application/admin/Datatable';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '@/lib/materialTheme';

const DatatableWrapper = ({
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
    const {resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (<ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}> 
      <Datatable   
      queryKey={queryKey}
      fetchUrl={fetchUrl}
      columnConfig={columnConfig}
      initialPageSize={initialPageSize}
      exportEndpoint={exportEndpoint}
      deleteEndpoint={deleteEndpoint}
      deleteType={deleteType}
      trashView={trashView}
      createAction={createAction}
  />
    </ThemeProvider>);
};

export default DatatableWrapper;
