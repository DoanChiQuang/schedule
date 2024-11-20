import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/modules/components/ui/card';
import ResetPasswordForm from '@/modules/pages/reset-password/components/reset-password-form';

const ResetPasswordPage = () => {
    return (
        <Card className="mx-10 my-20 sm:mx-auto sm:w-[400px]">
            <CardHeader className="text-center">
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Điền thông tin mật khẩu mới</CardDescription>
            </CardHeader>
            <CardContent>
                <ResetPasswordForm />
                <div className="mt-6 text-center">
                    <a className="text-sm" href="/signin">
                        Quay lại đăng nhập
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResetPasswordPage;
