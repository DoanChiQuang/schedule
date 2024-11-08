import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import ForgotPasswordForm from '@/modules/auth/components/ui/forgotPasswordForm';

const ForgotPasswordPage = () => {
    return (
        <Card className="sm:w-[350px] sm:mx-auto mx-10 my-20">
            <CardHeader className="text-center">
                <CardTitle>Forgot Password?</CardTitle>
                <CardDescription>Fill your information</CardDescription>
            </CardHeader>
            <CardContent>
                <ForgotPasswordForm />
                <div className="text-center mt-6">
                    <a className="text-sm" href="/signin">
                        Back to Signin
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordPage;
