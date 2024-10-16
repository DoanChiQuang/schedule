import SigninForm from '@/modules/auth/components/ui/siginForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const SigninPage = () => {
    return (
        <Card className="sm:w-[350px] sm:mx-auto mx-10 my-20">
            <CardHeader className="text-center">
                <CardTitle>Welcome to Schedule!</CardTitle>
                <CardDescription>Sign in your account</CardDescription>
            </CardHeader>
            <CardContent>
                <SigninForm />
            </CardContent>
        </Card>
    );
};

export default SigninPage;
