import { useState, useEffect } from 'react';
import { Modal, ScrollArea, Text, Group, Button, Select, Loader, Stack, Divider, Card } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { LecturerList } from './components/LecturerList';
import { AddLecturerCard } from './components/AddLecturerCard';
import { EditLecturerCard } from './components/EditLecturerCard';
import { useLecturers } from './hooks/useLecturers';
import type { Lecturer, LecturerFormData, StudentClass, AdvisedClass } from './types';
import { fetchAdvisedClassesAPI, fetchStudentClassesAPI, assignAdvisorAPI, removeAdvisorAPI } from './services';
import classes from './LecturersPage.module.css';

export function LecturersPage() {
    const [selectedFaculty, setSelectedFaculty] = useState<string>('');
    const [facultiesLoaded, setFacultiesLoaded] = useState(false);
    const [addModalOpened, setAddModalOpened] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);
    const [advisorLecturer, setAdvisorLecturer] = useState<Lecturer | null>(null);
    const [advisedClasses, setAdvisedClasses] = useState<AdvisedClass[]>([]);
    const [availableClasses, setAvailableClasses] = useState<StudentClass[]>([]);
    const [loadingAdvised, setLoadingAdvised] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const {
        lecturers,
        loading,
        error,
        page,
        setPage,
        totalPages,
        reload,
        handleDelete,
        handleCreate,
        faculties,
        departments,
    } = useLecturers(selectedFaculty);

    // Auto-select first faculty when loaded
    useEffect(() => {
        if (!selectedFaculty && faculties.length > 0 && !facultiesLoaded) {
            setSelectedFaculty(faculties[0].value);
            setFacultiesLoaded(true);
        }
    }, [faculties, selectedFaculty, facultiesLoaded]);

    const handleAddLecturer = () => {
        setAddModalOpened(true);
    };

    const handleEditLecturer = (lecturer: Lecturer) => {
        setEditingLecturer(lecturer);
    };

    const handleSaveLecturer = async (_data: LecturerFormData) => {
        try {
            await handleCreate(_data);
            notifications.show({
                title: 'Thành công',
                message: 'Tạo giảng viên thành công',
                color: 'green',
            });
            setAddModalOpened(false);
            reload();
        } catch (err) {
            notifications.show({
                title: 'Lỗi',
                message: 'Tạo giảng viên thất bại',
                color: 'red',
            });
        }
    };

    const handleViewAdvisor = async (lecturer: Lecturer) => {
        setAdvisorLecturer(lecturer);
        setLoadingAdvised(true);
        setAdvisedClasses([]);
        setSelectedClassId(null);
        try {
            const classes = await fetchAdvisedClassesAPI(lecturer.id);
            setAdvisedClasses(classes);
        } catch (err) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể tải danh sách lớp cố vấn',
                color: 'red',
            });
        } finally {
            setLoadingAdvised(false);
        }
    };

    const handleAdvisorModalClose = () => {
        setAdvisorLecturer(null);
        setAdvisedClasses([]);
        setAvailableClasses([]);
        setSelectedClassId(null);
    };

    const loadAvailableClasses = async (khoa: string) => {
        setLoadingClasses(true);
        try {
            const classes = await fetchStudentClassesAPI(khoa);
            setAvailableClasses(classes);
        } catch (err) {
            console.error('Error loading student classes:', err);
        } finally {
            setLoadingClasses(false);
        }
    };

    const handleAssignAdvisor = async () => {
        if (!advisorLecturer || !selectedClassId) return;
        setAssigning(true);
        try {
            await assignAdvisorAPI(advisorLecturer.id, parseInt(selectedClassId));
            notifications.show({
                title: 'Thành công',
                message: 'Bổ nhiệm cố vấn học tập thành công',
                color: 'green',
            });
            const newAdvised = await fetchAdvisedClassesAPI(advisorLecturer.id);
            setAdvisedClasses(newAdvised);
            setSelectedClassId(null);
            reload();
        } catch (err) {
            notifications.show({
                title: 'Lỗi',
                message: 'Bổ nhiệm cố vấn học tập thất bại',
                color: 'red',
            });
        } finally {
            setAssigning(false);
        }
    };

    const handleRemoveAdvisor = async (classId: number) => {
        if (!advisorLecturer) return;
        try {
            await removeAdvisorAPI(advisorLecturer.id, classId);
            notifications.show({
                title: 'Thành công',
                message: 'Xóa cố vấn học tập thành công',
                color: 'green',
            });
            const newAdvised = await fetchAdvisedClassesAPI(advisorLecturer.id);
            setAdvisedClasses(newAdvised);
            reload();
        } catch (err) {
            notifications.show({
                title: 'Lỗi',
                message: 'Xóa cố vấn học tập thất bại',
                color: 'red',
            });
        }
    };

    useEffect(() => {
        if (advisorLecturer) {
            loadAvailableClasses(advisorLecturer.departmentName);
        }
    }, [advisorLecturer]);

    return (
        <div className={classes.page}>
            <div className={classes.pageHeader}>
                <h1 className={classes.pageTitle}>Giảng viên</h1>
                <p className={classes.pageSubtitle}>
                    Quản lý thông tin các giảng viên trong trường. Theo dõi và cập nhật danh sách giảng viên theo từng khoa.
                </p>
            </div>

            <LecturerList
                lecturers={lecturers}
                loading={loading}
                error={error}
                page={page}
                totalPages={totalPages}
                onPage={setPage}
                onReload={reload}
                onAddLecturer={handleAddLecturer}
                onEditLecturer={handleEditLecturer}
                onDeleteConfirm={handleDelete}
                onViewAdvisor={handleViewAdvisor}
                selectedFaculty={selectedFaculty}
                onFacultyChange={setSelectedFaculty}
                faculties={faculties}
            />

            <Modal
                opened={addModalOpened}
                onClose={() => setAddModalOpened(false)}
                centered
                size="60%"
                withCloseButton={false}
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <AddLecturerCard
                    onCancel={() => setAddModalOpened(false)}
                    onSave={handleSaveLecturer}
                    departments={departments}
                    faculties={faculties}
                    selectedFaculty={selectedFaculty}
                />
            </Modal>

            <Modal
                opened={editingLecturer !== null}
                onClose={() => setEditingLecturer(null)}
                centered
                size="60%"
                withCloseButton={false}
                scrollAreaComponent={ScrollArea.Autosize}
            >
                {editingLecturer && (
                    <EditLecturerCard
                        lecturer={editingLecturer}
                        onCancel={() => setEditingLecturer(null)}
                        onSave={() => {
                            setEditingLecturer(null);
                            reload();
                        }}
                        departments={departments}
                        faculties={faculties}
                        selectedFaculty={selectedFaculty}
                    />
                )}
            </Modal>

            <Modal
                opened={advisorLecturer !== null}
                onClose={handleAdvisorModalClose}
                centered
                size="70%"
                title="Quản lý cố vấn học tập"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                {advisorLecturer && (
                    <Stack gap="md" p="xs">
                        <Card withBorder padding="sm">
                            <Text fw={600} size="lg">{advisorLecturer.fullName}</Text>
                            <Text size="sm" c="dimmed">
                                Mã giảng viên: {advisorLecturer.lecturerCode} | Email: {advisorLecturer.email}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Bộ môn: {advisorLecturer.departmentName}
                            </Text>
                        </Card>

                        <Divider label="Lớp đang làm cố vấn học tập" labelPosition="left" />

                        {loadingAdvised ? (
                            <Group justify="center" py="md">
                                <Loader size="sm" />
                            </Group>
                        ) : advisedClasses.length === 0 ? (
                            <Text c="dimmed" ta="center" py="md">Giảng viên chưa làm cố vấn học tập lớp nào</Text>
                        ) : (
                            <Stack gap="xs">
                                {advisedClasses.map((cls) => (
                                    <Card key={cls.id} withBorder padding="xs">
                                        <Group justify="space-between">
                                            <div>
                                                <Text fw={500}>{cls.classCode}</Text>
                                                <Text size="xs" c="dimmed">
                                                    {cls.majorName} | Khóa {cls.startYear} | {cls.studentCount} sinh viên
                                                </Text>
                                            </div>
                                            <Button
                                                size="xs"
                                                color="red"
                                                variant="light"
                                                leftSection={<IconTrash size={14} />}
                                                onClick={() => handleRemoveAdvisor(cls.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        )}

                        <Divider label="Bổ nhiệm cố vấn học tập" labelPosition="left" />

                        <Group align="flex-end" gap="sm">
                            <Select
                                label="Chọn lớp sinh viên"
                                placeholder="Chọn lớp"
                                data={availableClasses
                                    .filter(cls => !advisedClasses.some(ac => ac.id === cls.id))
                                    .map(cls => ({
                                        value: cls.id.toString(),
                                        label: `${cls.classCode} - ${cls.majorName} (${cls.startYear})`
                                    }))}
                                value={selectedClassId}
                                onChange={setSelectedClassId}
                                disabled={loadingClasses}
                                style={{ flex: 1 }}
                            />
                            <Button
                                onClick={handleAssignAdvisor}
                                disabled={!selectedClassId}
                                loading={assigning}
                            >
                                Bổ nhiệm
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </div>
    );
}
