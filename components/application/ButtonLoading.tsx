import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from '@/lib/utils'
const ButtonLoading = ({type, text, loading, className, onClick, ...props}) =>  {
  return (
    <Button 
      disabled={ loading } 
      size="sm" 
      type={type} 
      className={cn("", className)}
      onClick={onClick} 
      { ...props }>
          {loading && <Spinner />}
          { text }
      </Button>
  )
};

export default ButtonLoading;

