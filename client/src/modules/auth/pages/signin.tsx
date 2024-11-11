import SigninForm from '@/modules/auth/components/sigin-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const SigninPage = () => {
    return (
        <Card className="mx-10 my-20 sm:mx-auto sm:w-[400px]">
            <CardHeader className="text-center">
                <CardTitle>Schedule</CardTitle>
                <CardDescription>
                    Điền thông tin để đăng nhập vào hệ thống
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SigninForm />
            </CardContent>
        </Card>
    );
};

export default SigninPage;
