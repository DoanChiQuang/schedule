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
    FormMessage,
} from '@/modules/components/ui/form';
import { Input } from '@/modules/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { RootState } from '@/stores';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/modules/components/ui/alert';
import { CircleAlert, MailCheck } from 'lucide-react';
import forgotPasswordAction from '@/stores/auth/actions/forgot-password';

const formSchema = z.object({
    email: z.string().email({ message: 'Email không đúng định dạng.' }),
});

const ForgotPasswordForm = () => {
    const dispatch = useAppDispatch();
    const { loading, error, isSent } = useAppSelector(
        (state: RootState) => state.auth,
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        dispatch(forgotPasswordAction(fields));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert variant={'destructive'}>
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Thông báo!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {isSent && (
                    <Alert variant={'default'}>
                        <MailCheck className="h-4 w-4" />
                        <AlertTitle>Thông báo!</AlertTitle>
                        <AlertDescription>
                            Vui lòng kiểm tra Email của bạn.
                        </AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Điền Email"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!!loading} className="w-full">
                    Lấy lại mật khẩu
                </Button>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;
