import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/modules/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/modules/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { RootState } from '@/stores';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/modules/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import DatePicker from '@/modules/components/date-picker';
import { MultiSelect } from '@/modules/components/multi-select';
import { Input } from '@/modules/components/ui/input';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/modules/components/ui/radio-group';

const weekDayOptions = [
    { label: 'Thứ 2', value: '1' },
    { label: 'Thứ 3', value: '2' },
    { label: 'Thứ 4', value: '3' },
    { label: 'Thứ 5', value: '4' },
    { label: 'Thứ 6', value: '5' },
    { label: 'Thứ 7', value: '6' },
    { label: 'Chủ Nhật', value: '0' },
];

const yardOptions = [
    { label: 'Sân A', value: '1' },
    { label: 'Sân B', value: '2' },
    { label: 'Sân C', value: '3' },
];

const formSchema = z.object({
    dateTimeStart: z.date({
        required_error: 'Ngày bắt đầu không được bỏ trống.',
    }),
    dateTimeUntil: z.date({
        required_error: 'Ngày kết thúc không được bỏ trống.',
    }),
    weekday: z.string().array(),
    yard: z.string().array(),
    duration: z.object({
        hour: z.string(),
        minus: z.string(),
    }),
    phone: z.string({
        required_error: 'Số điện thoại không được bỏ trống.',
    }),
    customerName: z.string({
        required_error: 'Tên khách hàng không được bỏ trống.',
    }),
    type: z.enum(['0', '1']),
    prepay: z.number(),
});

const EventForm = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateTimeStart: new Date(),
            duration: {
                hour: '0',
                minus: '0',
            },
            type: '0',
        },
    });

    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        console.log(fields);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-4 space-y-4"
            >
                {error && (
                    <Alert variant={'destructive'}>
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Thông báo!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="flex items-center justify-between space-x-2">
                    <FormField
                        control={form.control}
                        name="dateTimeStart"
                        render={({ field }) => (
                            <FormItem className="flex flex-1 flex-col space-y-1">
                                <FormLabel>Ngày bắt đầu*</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        formatString="P"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dateTimeUntil"
                        render={({ field }) => (
                            <FormItem className="flex flex-1 flex-col space-y-1">
                                <FormLabel>Ngày kết thúc*</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        formatString="P"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="weekday"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col space-y-1">
                            <FormLabel>Ngày thứ*</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    value={field.value}
                                    options={weekDayOptions}
                                    onValueChange={field.onChange}
                                    placeholder="Chọn ngày thứ"
                                    variant="inverted"
                                    maxCount={3}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="yard"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col space-y-1">
                            <FormLabel>Sân*</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    value={field.value}
                                    options={yardOptions}
                                    onValueChange={field.onChange}
                                    placeholder="Chọn sân"
                                    variant="inverted"
                                    maxCount={3}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-between space-x-2">
                    <FormField
                        control={form.control}
                        name="duration.hour"
                        render={({ field }) => (
                            <FormItem className="flex flex-1 flex-col space-y-1">
                                <FormLabel>Giờ</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        max={24}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration.minus"
                        render={({ field }) => (
                            <FormItem className="flex flex-1 flex-col space-y-1">
                                <FormLabel>Phút</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        max={59}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col space-y-1">
                            <FormLabel>Loại</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center justify-around"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="0" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Vãng lai
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="1" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Cố định
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col space-y-1">
                            <FormLabel>Số điện thoại*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Điền số điện thoại của khách"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col space-y-1">
                            <FormLabel>Tên khách hàng</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Điền tên của khách"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="prepay"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col space-y-1">
                            <FormLabel>Tên khách hàng</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Điền tên của khách"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!!loading} className="w-full">
                    Lưu
                </Button>
            </form>
        </Form>
    );
};

export default EventForm;
