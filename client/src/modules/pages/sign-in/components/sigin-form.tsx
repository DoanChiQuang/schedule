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
import signinAction from '@/stores/auth/actions/signin';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/modules/components/ui/alert';
import { CircleAlert } from 'lucide-react';

const formSchema = z.object({
    email: z.string().email({ message: 'Email không đúng định dạng.' }),
    password: z.string(),
});

const SigninForm = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        dispatch(signinAction(fields));
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Điền mật khẩu"
                                    {...field}
                                    required
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <a
                    className="float-end inline-block text-sm"
                    href="/forgot-password"
                >
                    Quên mật khẩu?
                </a>
                <Button type="submit" disabled={!!loading} className="w-full">
                    Đăng nhập
                </Button>
            </form>
        </Form>
    );
};

export default SigninForm;
