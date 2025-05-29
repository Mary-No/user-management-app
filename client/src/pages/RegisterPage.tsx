import {useForm} from 'react-hook-form';
import {Tooltip} from 'bootstrap';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useRegisterMutation} from '../app/api.ts';
import {useToast} from '../components/ToastProvider.tsx';
import s from "../styles/registerPage.module.scss";


type FormData = {
    name: string;
    email: string;
    password: string;
};

export const RegisterPage = () => {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const [sendRegister, {isLoading}] = useRegisterMutation();
    const {showToast} = useToast();

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((el) => new Tooltip(el, {html: true}));
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            await sendRegister(data).unwrap();
            showToast('You have registered successfully!', 'success');
            setTimeout(() => navigate('/login'), 1000);
        } catch (err: any) {
            if (err?.data?.errors?.length) {
                const errorMessages = err.data.errors.map((e: any) => e.message).join(', ');
                showToast(errorMessages, 'error');
            } else {
                const message = err?.data?.error || err?.data?.message || 'Registration error';
                showToast(message, 'error');
            }
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className={`card shadow p-5 ${s.card}`}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className={`form-label ${s.formLabel}`}>Name</label>
                        <input
                            id="name"
                            className={`form-control ${s.formInput} ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your name"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Your full name"
                            {...register('name', {required: 'Name is required'})}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className={`form-label ${s.formLabel}`}>Email</label>
                        <input
                            id="email"
                            type="email"
                            className={`form-control ${s.formInput} ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your email"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            data-bs-html="true"
                            data-bs-title="Use only English letters<br>Include '@' and a dot <br>(example@mail.com)"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className={`form-label ${s.formLabel}`}>Password</label>
                        <input
                            id="password"
                            type="password"
                            className={`form-control ${s.formInput} ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Minimum 6 characters"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>

                    <button type="submit" className={`btn mt-3 btn-primary w-100 ${s.registerBtn}`}
                            disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};
