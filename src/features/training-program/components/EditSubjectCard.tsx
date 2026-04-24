import { Button, Group, Checkbox, Select, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import type { SubjectDetail, SemesterDetail } from '../types';
import classes from './AddSubjectCard.module.css';

interface EditSubjectCardProps {
    subject: SubjectDetail;
    semesters: SemesterDetail[];
    onCancel: () => void;
    onSave: (data: SubjectFormData) => void;
}

export interface SubjectFormData {
    semesterId: number;
    isRequired: boolean;
    electiveGroup: string | null;
}

const electiveGroupOptions = [
    { value: '', label: 'Không thuộc nhóm tự chọn' },
    { value: 'GROUP_1', label: 'Nhóm tự chọn 1' },
    { value: 'GROUP_2', label: 'Nhóm tự chọn 2' },
    { value: 'GROUP_3', label: 'Nhóm tự chọn 3' },
];

export function EditSubjectCard({ subject, semesters, onCancel, onSave }: EditSubjectCardProps) {
    const currentSemester = semesters.find(sem => sem.subjects.some(sub => sub.id === subject.id));
    const semesterOptions = semesters.map(sem => ({
        value: sem.semesterId.toString(),
        label: sem.semesterName,
    }));

    const [selectedSemesterId, setSelectedSemesterId] = useState<string>(
        currentSemester?.semesterId.toString() || ''
    );
    const [selectedElectiveGroup, setSelectedElectiveGroup] = useState<string>(
        subject.electiveGroup || ''
    );
    const [isRequired, setIsRequired] = useState<boolean>(subject.isRequired);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedSemesterId) {
            return;
        }
        onSave({
            semesterId: parseInt(selectedSemesterId, 10),
            isRequired,
            electiveGroup: selectedElectiveGroup || null,
        });
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <h3 className={classes.title}>Sửa môn học - {subject.subjectName}</h3>
                <button type="button" className={classes.closeBtn} onClick={onCancel}>
                    <IconX size={18} />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={classes.formGrid}>
                    <Text size="sm" fw={500}>Mã môn: {subject.subjectCode}</Text>
                    <div />
                    <Select
                        label="Học kỳ"
                        data={semesterOptions}
                        value={selectedSemesterId}
                        onChange={(val) => val && setSelectedSemesterId(val)}
                        placeholder="Chọn học kỳ"
                        required
                        size="sm"
                    />
                    <Select
                        label="Nhóm tự chọn"
                        data={electiveGroupOptions}
                        value={selectedElectiveGroup}
                        onChange={(val) => setSelectedElectiveGroup(val || '')}
                        placeholder="Chọn nhóm tự chọn"
                        size="sm"
                    />
                    <Checkbox
                        label="Môn bắt buộc"
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.currentTarget.checked)}
                        size="sm"
                    />
                </div>
                <Group justify="flex-end" mt="xl">
                    <Button variant="subtle" onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="submit" style={{ backgroundColor: '#111827', color: '#fff' }}>
                        Lưu thay đổi
                    </Button>
                </Group>
            </form>
        </div>
    );
}
