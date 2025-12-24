import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sortings } from "@/lib/utils"
import { IoFilter } from "react-icons/io5"


const Sorting = ({ limit, setLimit, sorting, setSorting,
    mobileFilterOpen, setMobileFilterOpen }) => {
    return (
        <div className='flex justify-between items-center flex-wrap gap-2 bg-gray-50 p-4'>
            <Button className='lg:hidden' type='button' variant={'outline'} onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                <IoFilter />
                Filter
            </Button>
            <ul className='flex items-center gap-4'>
                <li className='font-semibold'>
                    Show
                </li>
                {
                    [9, 12, 18, 24].map(l => (
                        <li key={l}>
                            <button type='button' onClick={() => setLimit(l)} className={`${limit === l ?
                                'text-sm text-white cursor-pointer w-8 h-8 flex justify-center items-center rounded-full bg-primary'
                                : 'cursor-pointer'}`}>
                                {l}
                            </button>
                        </li>
                    ))
                }
            </ul>

            <Select value={sorting} onValueChange={(value) => setSorting(value)}>
                <SelectTrigger className="md:w-[180px] w-full bg-white">
                    <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent>
                    {
                        sortings.map(options => (
                            <SelectItem key={options.value } value={options.value}>{options.label}</SelectItem>
                        ))
                    }
                    </SelectContent>
            </Select>
        </div>
    )
}

export default Sorting
