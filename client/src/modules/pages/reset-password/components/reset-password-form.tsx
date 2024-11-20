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
import { CheckCircle, CircleAlert } from 'lucide-react';
import { useParams } from 'react-router-dom';
import resetPasswordAction from '@/stores/auth/actions/reset-password';

const passwordError = {
    message:
        'Mật khẩu của bạn phải dài ít nhất 8 ký tự, chứa ít nhất 1 chữ số, chữ hoa và chữ thường.',
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
            message: 'Mật khẩu không trùng khớp.',
            path: ['confirmPassword'],
        },
    );

const ResetPasswordForm = () => {
    const { token } = useParams();

    const dispatch = useAppDispatch();
    const { loading, error, success } = useAppSelector(
        (state: RootState) => state.auth,
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: token,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        dispatch(resetPasswordAction(fields));
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
                {success && (
                    <Alert variant={'default'}>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Thông báo!</AlertTitle>
                        <AlertDescription>
                            Thay đổi mật khẩu thành công.
                        </AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Điền mật khẩu mới"
                                    {...field}
                                    type="password"
                                    required
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
                            <FormLabel>Xác nhận lại mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Điền lại mật khẩu mới"
                                    {...field}
                                    type="password"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!!loading} className="w-full">
                    Xác nhận
                </Button>
            </form>
        </Form>
    );
};

export default ResetPasswordForm;
