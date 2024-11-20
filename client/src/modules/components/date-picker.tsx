import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/modules/components/ui/popover';
import { Button } from '@/modules/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/modules/components/ui/calendar';
import { format } from 'date-fns';

type PropDatePicker = {
    date: Date | undefined;
    setDate: any;
    isIconButton?: boolean;
    formatString?: string;
};

const DatePicker = ({
    date,
    setDate,
    isIconButton = false,
    formatString = 'PPP',
}: PropDatePicker) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size={(isIconButton && 'icon') || 'default'}
                    className="flex space-x-2"
                >
                    <CalendarIcon />
                    {!isIconButton && (
                        <div>
                            {date ? (
                                format(date, formatString)
                            ) : (
                                <span>Chọn ngày</span>
                            )}
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
