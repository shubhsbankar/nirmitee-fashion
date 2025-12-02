import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from '@/lib/showToast';

const useDeleteMutation = (queryKey, deleteEndpoint) => {
  
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ids, deleteType}) =>{
      const { data: response } = await axios({
        url: deleteEndpoint,
        method: deleteType === 'PD' ? 'DELETE' : 'PUT',
        data: { ids, deleteType }
      })

      if (!response.success) {
        throw Error(response.message);
      }

      return response;
    },
    onSuccess: (data) => {
      showToast('sucess',data.message);
      queryClient.invalidateQueries([queryKey]);
    },
    onError: (error) => {
      showToast('error',error.message);
    }

  })
}

export default useDeleteMutation;
