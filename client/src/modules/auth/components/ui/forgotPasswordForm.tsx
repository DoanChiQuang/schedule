import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert, MailCheck } from 'lucide-react';
import forgotPasswordAction from '@/store/auth/actions/forgotPassword';

const formSchema = z.object({
    email: z.string().email(),
});

const ForgotPasswordForm = () => {
    // Define Redux State & Dispatch
    const dispatch = useAppDispatch();
    const { loading, error, isSent } = useAppSelector(
        (state: RootState) => state.auth,
    );

    // Define Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    // Define SubmitHandler
    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        dispatch(forgotPasswordAction(fields));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert variant={'destructive'}>
                        <CircleAlert className="h-4 w-4" />                        
                        <AlertTitle>Error!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {isSent && (
                    <Alert variant={'default'}>
                        <MailCheck className="h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>Checkout your email</AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Input email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!!loading} className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;
