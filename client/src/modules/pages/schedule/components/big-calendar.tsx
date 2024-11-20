import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/modules/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Typography } from '@/modules/components/ui/typography';
import DatePicker from '@/modules/components/date-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/modules/components/ui/select';
import { format } from 'date-fns';

type BigCalendarProps = {
    events: any;
    onClick: any;
};

const BigCalendar = ({ events = [], onClick }: BigCalendarProps) => {
    const fullCalendarRef = useRef<FullCalendar>(null);
    const [fullCalendarApi, setFullCalendarApi] = useState<any>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<string>('dayGridMonth');

    useEffect(() => {
        if (fullCalendarRef && fullCalendarRef.current) {
            let fullCalendarApi = fullCalendarRef.current.getApi();
            setFullCalendarApi(fullCalendarApi);
        }
    }, []);

    const onUpdateDate = () => {
        const date = fullCalendarApi.getDate();
        setDate(date);
    };

    const goPrev = () => {
        fullCalendarApi.prev();
        onUpdateDate();
    };

    const goNext = () => {
        fullCalendarApi.next();
        onUpdateDate();
    };

    const goToDay = () => {
        fullCalendarApi.today();
        onUpdateDate();
    };

    const onSelectedView = (view: string) => {
        setView(view);
        onChangeView(view, date);
    };

    const onSelectedDate = (date: Date) => {
        setDate(date);
        onChangeView(view, date);
    };

    const onChangeView = (viewName: string, dateOrRange?: string | Object) => {
        fullCalendarApi.changeView(viewName, dateOrRange);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Typography
                        variant="h4"
                        content={format(date, 'MMMM').toUpperCase()}
                    />
                    <Typography
                        variant="muted"
                        content={format(date, 'PPPP')}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={view} onValueChange={onSelectedView}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Chọn tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dayGridMonth">Tháng</SelectItem>
                            <SelectItem value="timeGridWeek">Tuần</SelectItem>
                            <SelectItem value="timeGridDay">Ngày</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={goToDay}>
                        Hôm nay
                    </Button>
                    <DatePicker
                        date={date}
                        setDate={onSelectedDate}
                        isIconButton
                    />
                    <Button variant="outline" size="icon" onClick={goPrev}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline" size="icon" onClick={goNext}>
                        <ChevronRight />
                    </Button>
                    <Button variant="default" size="icon" onClick={onClick}>
                        <Plus />
                    </Button>
                </div>
            </div>
            <FullCalendar
                ref={fullCalendarRef}
                locale="vi"
                plugins={[rrulePlugin, dayGridPlugin, timeGridPlugin]}
                initialView={view}
                contentHeight="auto"
                headerToolbar={false}
                events={events}
                eventContent={renderEventContent}
                eventDisplay="block"
                eventMaxStack={1}
                dayMaxEvents={2}
            />
        </div>
    );
};

export default BigCalendar;

const renderEventContent = (eventInfo: any) => {
    return (
        <div className="flex h-full flex-col space-y-1 rounded-sm border-l-4 border-blue-400 bg-blue-200 p-2 text-primary">
            <b>{eventInfo.timeText}</b>
            <p>{eventInfo.event.title}</p>
        </div>
    );
};
