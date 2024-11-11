import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    children?: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
    const navigate = useNavigate();
    const { isLogged } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isLogged) {
            navigate('/dashboard');
        }
    }, [isLogged]);

    return <div className="container mx-auto">{children}</div>;
};

export default AuthLayout;
