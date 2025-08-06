import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { login } from '../redux/slices/authSlice';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    Alert,
    CircularProgress
} from '@mui/material';

interface LoginFormData {
    usernameOrEmail: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showError, setShowError] = useState(false);

    if (isAuthenticated) {
        navigate('/dashboard');
    }

    const onSubmit = async (data: LoginFormData) => {
        setShowError(false);
        try {
            await dispatch(login(data)).unwrap();
            navigate('/dashboard');
        } catch (err) {
            setShowError(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Iniciar Sesión
                    </Typography>

                    {showError && error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="usernameOrEmail"
                            label="Usuario o Email"
                            autoComplete="username"
                            autoFocus
                            {...register("usernameOrEmail", { required: "Este campo es requerido" })}
                            error={!!errors.usernameOrEmail}
                            helperText={errors.usernameOrEmail?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register("password", { required: "Este campo es requerido" })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"¿No tienes una cuenta? Regístrate"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;