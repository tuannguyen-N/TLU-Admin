import { Group, Text, Button, Loader, Center, Modal, ActionIcon, Tooltip } from '@mantine/core';
import {
    IconArrowLeft, IconPencil, IconTrash,
    IconDeviceLaptop,
    IconBuildingBank,
    IconLanguage,
    IconMusic,
    IconUsers,
    IconHeartbeat,
    IconBeach,
    IconDeviceTv,
} from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import type { Faculty } from '../../students/types';
import { deleteFaculty } from '../services';
import { EditDepartmentCard } from './EditDepartmentCard';
import classes from './DepartmentList.module.css';

interface Props {
    faculty: Faculty;
    loading?: boolean;
    error?: string | null;
    onBack: () => void;
    onReload: () => void;
    onDepartmentUpdated: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  laptop: IconDeviceLaptop,
  bank: IconBuildingBank,
  translate: IconLanguage,
  music: IconMusic,
  social: IconUsers,
  health: IconHeartbeat,
  travel: IconBeach,
  media: IconDeviceTv,
};

export function DepartmentList({
    faculty,
    loading,
    error,
    onBack,
    onReload,
    onDepartmentUpdated,
}: Props) {
    const Icon = iconMap[faculty.icon] ?? IconUsers;

    const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleEdit = (f: Faculty) => {
        setEditingFaculty(f);
    };

    const handleDeleteClick = (f: Faculty) => {
        setDeletingFaculty(f);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingFaculty) return;
        setDeleting(true);
        try {
            await deleteFaculty(deletingFaculty.id);
            notifications.show({
                title: 'Thành công',
                message: 'Xóa khoa/bộ môn thành công',
                color: 'green',
            });
            setDeleteModalOpen(false);
            onDepartmentUpdated();
        } catch (err) {
            notifications.show({
                title: 'Lỗi',
                message: 'Xóa khoa/bộ môn thất bại',
                color: 'red',
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <button className={classes.backBtn} onClick={onBack}>
                    <IconArrowLeft size={18} />
                    <span>Quay lại</span>
                </button>
                <div className={classes.headerRight}>
                    <div>
                        <h2 className={classes.title}>Thông tin khoa</h2>
                        <p className={classes.subtitle}>Khoa {faculty.name}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <Center py={60}>
                    <Loader size="md" />
                </Center>
            ) : error ? (
                <Center py={60}>
                    <Text c="red">{error}</Text>
                </Center>
            ) : (
                <div className={classes.detailCard}>
                    <div className={classes.detailHeader}>
                        <div className={classes.iconWrapper} style={{ backgroundColor: `${faculty.color}18` }}>
                            <Icon size={32} color={faculty.color} stroke={1.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 className={classes.detailName}>{faculty.name}</h3>
                            <p className={classes.detailCode}>Mã khoa: {faculty.facultyCode}</p>
                        </div>
                        <Group gap={4}>
                            <Tooltip label="Sửa" position="top">
                                <ActionIcon variant="subtle" color="yellow" size="md" onClick={() => handleEdit(faculty)}>
                                    <IconPencil size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Xóa" position="top">
                                <ActionIcon variant="subtle" color="red" size="md" onClick={() => handleDeleteClick(faculty)}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </div>

                    <p className={classes.detailDesc}>{faculty.description}</p>

                    <div className={classes.infoGrid}>
                        <div className={classes.infoItem}>
                            <span className={classes.infoLabel}>Mã khoa</span>
                            <span className={classes.infoValue}>{faculty.facultyCode}</span>
                        </div>
                        <div className={classes.infoItem}>
                            <span className={classes.infoLabel}>ID</span>
                            <span className={classes.infoValue}>{faculty.id}</span>
                        </div>
                        <div className={classes.infoItem}>
                            <span className={classes.infoLabel}>Biểu tượng</span>
                            <span className={classes.infoValue}>{faculty.icon}</span>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                opened={editingFaculty !== null}
                onClose={() => setEditingFaculty(null)}
                size="60%"
                withCloseButton={false}
            >
                {editingFaculty && (
                    <EditDepartmentCard
                        faculty={editingFaculty}
                        onCancel={() => setEditingFaculty(null)}
                        onSave={() => {
                            setEditingFaculty(null);
                            onDepartmentUpdated();
                        }}
                    />
                )}
            </Modal>

            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Xác nhận xóa"
                centered
            >
                <Text mb="lg">
                    Bạn có chắc chắn muốn xóa khoa/bộ môn <strong>{deletingFaculty?.name}</strong> không?
                </Text>
                <Group justify="flex-end">
                    <Button variant="subtle" onClick={() => setDeleteModalOpen(false)} disabled={deleting}>
                        Huỷ
                    </Button>
                    <Button color="red" onClick={handleDeleteConfirm} loading={deleting}>
                        Xóa
                    </Button>
                </Group>
            </Modal>
        </div>
    );
}