import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Tooltip} from 'bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import wallpaper from '../assets/wallpaper.webp';
import s from '../styles/loginPage.module.scss';
import {useLoginMutation} from '../app/api';
import {useToast} from '../components/ToastProvider';
import {useAppDispatch} from "../app/hooks.ts";
import {setToken} from '../features/auth/authSlice.ts';


type FormData = {
    email: string;
    password: string;
};

export const LoginPage = () => {
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm<FormData>();
    const [sendLogin, {isLoading}] = useLoginMutation();

    const {showToast} = useToast();

    const dispatch = useAppDispatch();

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((el) => new Tooltip(el));
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await sendLogin(data).unwrap();
            dispatch(setToken(response.token));
            localStorage.setItem('token', response.token);
            showToast('You have successfully logged in!', 'success');
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err: any) {
            const message =
                err?.data?.error ||
                err?.data?.message ||
                'Login error';
            showToast(message, 'error');
        }
    };

    return (
        <div className="container-fluid vh-100 p-0">
            <div className={`row h-100 m-0 ${s.container}`}>
                <div className="col-md-6">
                    <div className="col-md-3 w-100 mt-5 ms-5">
                        <h1 className={`text-primary ${s.logo}`}>THE APP</h1>
                    </div>
                    <div className="col-md-6 d-flex w-100 mt-5 justify-content-center align-items-center">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className={`rounded shadow bg-white ${s.form}`}
                        >
                            <h3 className={`text-primary text-opacity-75 fw-lighter ${s.introduction}`}>
                                Start your journey
                            </h3>
                            <h2 className={`text-black fw-medium ${s.signIn}`}>Sign In to The App</h2>

                            <div className={`${s.emailBlock}`}>
                                <label htmlFor="email" className={`form-label ${s.formLabel}`}>Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${s.formInput}`}
                                    id="email"
                                    placeholder="Enter email"
                                    required
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="right"
                                    title="Enter your email address"
                                    {...register('email', {required: true})}
                                />
                            </div>

                            <div className={`${s.passwordBlock}`}>
                                <label htmlFor="password" className={`form-label ${s.formLabel}`}>Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${s.formInput}`}
                                    id="password"
                                    placeholder="Enter password"
                                    required
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="right"
                                    title="Enter your account password"
                                    {...register('password', {required: true})}
                                />
                            </div>

                            <button type="submit" className={`btn btn-primary w-100 mt-3 ${s.signInBtn}`}
                                    disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                    <div className="col-md-3 w-100 d-flex justify-content-center align-items-center mt-3 ">
                        <h3 className={`text-black text-opacity-75 fw-lighter ${s.signUp}`}>
                            Don't have an account?{' '}
                            <Link to="/register" className={`text-primary ${s.singUpLink}`}>
                                Sign Up
                            </Link>
                        </h3>
                    </div>
                </div>
                <div className={`col-6 p-0 vh-100 overflow-hidden ${s.wallpaperBlock}`}>
                    <img className="w-100 h-100" style={{display: 'block'}} src={wallpaper} loading="eager"
                         alt="wallpaper"/>
                </div>
            </div>
        </div>
    );
};
