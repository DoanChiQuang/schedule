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
import signinAction from '@/store/auth/actions/signin';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(2, { message: 'Password must be at least 2 characters.' })
        .max(50),
    remember: z.boolean(),
});

const SigninForm = () => {
    // Define Redux State & Dispatch
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    // Define Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
    });

    // Define SubmitHandler
    const onSubmit = (fields: z.infer<typeof formSchema>) => {
        dispatch(signinAction(fields));
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Input password"
                                    {...field}
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-wrap justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" name="remember" />
                        <label htmlFor="remember" className="text-sm">
                            Remember me
                        </label>
                    </div>
                    <a className="text-sm" href="/forgot-password">
                        Forgot password?
                    </a>
                </div>
                <Button type="submit" disabled={!!loading} className="w-full">
                    Sign-in
                </Button>
            </form>
        </Form>
    );
};

export default SigninForm;
