import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import {
    ReactElement,
    JSXElementConstructor,
    ReactNode,
    ReactPortal,
    useState,
} from 'react';
import {
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
    SheetFooter,
} from '@/components/ui/sheet';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const events = [
    {
        title: 'Anh Quang - Sân A',
        rrule: {
            freq: 'daily',
            byweekday: ['mo', 'we', 'fr'],
            dtstart: '2024-11-01T05:00:00',
            until: '2024-12-01',
        },
        duration: '02:00',
    },
    {
        title: 'Chị Quỳnh - Sân B',
        rrule: {
            freq: 'daily',
            byweekday: ['mo', 'we', 'fr'],
            dtstart: '2024-11-01T05:00:00',
            until: '2024-12-01',
        },
        duration: '02:00',
    },
];

const CalendarPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Calendar
            </h3>
            <FullCalendar
                plugins={[rrulePlugin, dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                contentHeight={'auto'}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek add',
                }}
                buttonText={{
                    prev: 'Prev',
                    next: 'Next',
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                }}
                customButtons={{
                    add: {
                        text: 'Add event',
                        click: () => setOpen(!open),
                    },
                }}
                events={events}
                eventContent={renderEventContent}
            />
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Add event</SheetTitle>
                        <SheetDescription>
                            Add your new event here. Click save when you're
                            done.
                        </SheetDescription>
                    </SheetHeader>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default CalendarPage;

function renderEventContent(eventInfo: {
    timeText:
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | ReactPortal
        | null
        | undefined;
    event: {
        title:
            | string
            | number
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | null
            | undefined;
    };
}) {
    return (
        <div>
            <b>{eventInfo.timeText}</b>
            <p>{eventInfo.event.title}</p>
        </div>
    );
}
