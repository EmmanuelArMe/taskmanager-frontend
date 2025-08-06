import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks, updateTaskStatus, deleteTask } from '../redux/slices/taskSlice';
import { Task } from '../api/taskService';
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TaskListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleCreateTask = () => {
        navigate('/tasks/new');
    };

    const handleViewTask = (id: number) => {
        navigate(`/tasks/${id}`);
    };

    const handleEditTask = (id: number) => {
        navigate(`/tasks/${id}/edit`);
    };

    const handleStatusChange = async (id: number, newStatus: Task['status']) => {
        await dispatch(updateTaskStatus({ id, status: newStatus }));
    };

    const handleDeleteClick = (id: number) => {
        setTaskToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (taskToDelete !== null) {
            await dispatch(deleteTask(taskToDelete));
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Filtrar las tareas por estado y término de búsqueda
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'ALL' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'TODO': return 'info';
            case 'IN_PROGRESS': return 'primary';
            case 'DONE': return 'success';
            case 'BLOCKED': return 'error';
            case 'CANCELLED': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'LOW': return '#8BC34A';
            case 'MEDIUM': return '#FFC107';
            case 'HIGH': return '#FF9800';
            case 'URGENT': return '#F44336';
            default: return 'default';
        }
    };

    const formatStatus = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'TODO': return 'Por hacer';
            case 'IN_PROGRESS': return 'En progreso';
            case 'DONE': return 'Completado';
            case 'BLOCKED': return 'Bloqueado';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Mis Tareas
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateTask}
                >
                    Nueva Tarea
                </Button>
            </Box>

            <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
                <TextField
                    label="Buscar tareas"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="filter-status-label">Estado</InputLabel>
                    <Select
                        labelId="filter-status-label"
                        id="filter-status"
                        value={filter}
                        label="Estado"
                        onChange={handleFilterChange}
                        size="small"
                    >
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="PENDING">Pendiente</MenuItem>
                        <MenuItem value="TODO">Por hacer</MenuItem>
                        <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                        <MenuItem value="DONE">Completado</MenuItem>
                        <MenuItem value="BLOCKED">Bloqueado</MenuItem>
                        <MenuItem value="CANCELLED">Cancelado</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : filteredTasks.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                        No hay tareas disponibles.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Prioridad</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha límite</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            sx={{
                                                backgroundColor: getPriorityColor(task.priority),
                                                color: task.priority === 'LOW' ? 'rgba(0,0,0,0.87)' : 'white'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                value={task.status}
                                                onChange={(e) => task.id && handleStatusChange(task.id, e.target.value as Task['status'])}
                                                size="small"
                                                renderValue={(selected) => (
                                                    <Chip
                                                        label={formatStatus(selected)}
                                                        size="small"
                                                        color={getStatusColor(selected as Task['status'])}
                                                    />
                                                )}
                                            >
                                                <MenuItem value="PENDING">Pendiente</MenuItem>
                                                <MenuItem value="TODO">Por hacer</MenuItem>
                                                <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                                                <MenuItem value="DONE">Completado</MenuItem>
                                                <MenuItem value="BLOCKED">Bloqueado</MenuItem>
                                                <MenuItem value="CANCELLED">Cancelado</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(task.dueDate), 'PP', { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => task.id && handleViewTask(task.id)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => task.id && handleEditTask(task.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => task.id && handleDeleteClick(task.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"¿Eliminar esta tarea?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar permanentemente esta tarea?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskListPage;