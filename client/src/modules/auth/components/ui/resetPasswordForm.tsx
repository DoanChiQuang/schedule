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
import { CheckCircle, CircleAlert } from 'lucide-react';
import { useParams } from 'react-router-dom';
import resetPasswordAction from '@/store/auth/actions/resetPassword';

const passwordError = {
    message:
        'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
};

const formSchema = z
    .object({
        token: z.string(),
        password: z
            .string()
            .min(8, passwordError)
            .max(20, passwordError)
            .refine((password) => /[A-Z]/.test(password), passwordError)
            .refine((password) => /[a-z]/.test(password), passwordError)
            .refine((password) => /[0-9]/.test(password), passwordError)
            .refine((password) => /[!@#$%^&*]/.test(password), passwordError),
        confirmPassword: z.string(),
    })
    .refine(
        (values) => {
            return values.password === values.confirmPassword;
        },
        {
            message: 'Passwords must match',
            path: ['confirmPassword'],
        },
    );

const ResetPasswordForm = () => {
    const { token } = useParams();

    // Define Redux State & Dispatch
    const dispatch = useAppDispatch();
    const { loading, error, success } = useAppSelector((state: RootState) => state.auth);

    // Define Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: token,
            password: '',
            confirmPassword: '',
        },
    });

    // Define SubmitHandler
    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        dispatch(resetPasswordAction(fields));
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
                {success && (
                    <Alert variant={'default'}>
                        <CheckCircle className="h-4 w-4" />                        
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>Reset password successfully</AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Input new password"
                                    {...field}
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Input confirm password"
                                    {...field}
                                    type="password"
                                />
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

export default ResetPasswordForm;
