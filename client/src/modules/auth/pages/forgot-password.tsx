import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import ForgotPasswordForm from '@/modules/auth/components/forgot-password-form';

const ForgotPasswordPage = () => {
    return (
        <Card className="mx-10 my-20 sm:mx-auto sm:w-[400px]">
            <CardHeader className="text-center">
                <CardTitle>Quên mật khẩu</CardTitle>
                <CardDescription>
                    Điền thông tin để có thể lấy lại mật khẩu
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ForgotPasswordForm />
                <div className="mt-6 text-center">
                    <a className="text-sm" href="/signin">
                        Quay lại đăng nhập
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordPage;
