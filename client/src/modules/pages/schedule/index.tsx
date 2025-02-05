import { useState } from 'react';
import {
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
    SheetFooter,
} from '@/modules/components/ui/sheet';
import { Sheet } from '@/modules/components/ui/sheet';
import { Button } from '@/modules/components/ui/button';
import { Typography } from '@/modules/components/ui/typography';
import BigCalendar from '@/modules/pages/schedule/components/big-calendar';
import EventForm from '@/modules/pages/schedule/components/event-form';

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

const SchedulePage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <BigCalendar events={events} onClick={setOpen} />
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Thêm sự kiện mới</SheetTitle>
                        <SheetDescription>
                            Vui lòng điền đầy đủ thông tin có gán (*) và bấm lưu
                            khi hoàn thành.
                        </SheetDescription>
                    </SheetHeader>
                    <EventForm />
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default SchedulePage;
