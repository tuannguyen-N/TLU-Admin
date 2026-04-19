import {
  TextInput, Select, Button, Stack, Grid, Alert, LoadingOverlay, Textarea, Switch, Text, NumberInput, Group
} from '@mantine/core';
import {
  IconPlus, IconX, IconDeviceFloppy, IconBell
} from '@tabler/icons-react';
import { useState } from 'react';
import { notifications as mantineNotifications } from '@mantine/notifications';
import classes from './AddNotificationCard.module.css';
import { createNotification } from '../services';
import type { NotificationFormData } from '../types';

type TargetType = 'GLOBAL' | 'FACULTY' | 'STUDENT_CLASS' | 'COURSE_CLASS' | 'STUDENT';

interface ValidationErrors {
  title?: string;
  content?: string;
  targetIds?: string;
}

interface Props {
  onCancel: () => void;
  onSave: (data: NotificationFormData) => void;
}

const SectionTitle = ({ icon: Icon, number, title }: { icon: any; number: number; title: string }) => (
  <div className={classes.sectionTitle}>
    <div className={classes.sectionIcon}><Icon size={18} /></div>
    <span className={classes.sectionNum}>{number}.</span>
    <span className={classes.sectionText}>{title}</span>
  </div>
);

const targetTypeData = [
  { value: 'GLOBAL', label: 'Toàn trường' },
  { value: 'FACULTY', label: 'Khoa' },
  { value: 'STUDENT_CLASS', label: 'Lớp sinh viên' },
  { value: 'COURSE_CLASS', label: 'Lớp học phần' },
  { value: 'STUDENT', label: 'Sinh viên' },
];

export function AddNotificationCard({ onCancel, onSave }: Props) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetType: 'GLOBAL' as TargetType,
    targetIds: [] as number[],
    deadLine: '',
    isImportant: false,
  });
  const [targetIdsText, setTargetIdsText] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isGlobal = form.targetType === 'GLOBAL';

  const set = (key: keyof typeof form) => (val: any) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!form.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!form.content.trim()) newErrors.content = 'Nội dung là bắt buộc';
    if (!isGlobal && form.targetIds.length === 0) {
      newErrors.targetIds = 'Cần ít nhất một ID đối tượng';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseTargetIds = (text: string): number[] => {
    return text
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
  };

  const handleTargetIdsChange = (text: string) => {
    setTargetIdsText(text);
    set('targetIds')(parseTargetIds(text));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const payload: NotificationFormData = {
        title: form.title.trim(),
        content: form.content.trim(),
        targetType: form.targetType,
        targetIds: isGlobal ? [] : form.targetIds,
        referenceType: 'TUITION',
        deadLine: form.deadLine || null,
        isImportant: form.isImportant,
      };
      await createNotification(payload);
      mantineNotifications.show({ title: 'Thành công', message: 'Tạo thông báo thành công', color: 'green' });
      onSave(payload);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      mantineNotifications.show({ title: 'Lỗi', message: 'Tạo thông báo thất bại', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.page} style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <div className={classes.pageHeader}>
        <h1 className={classes.pageTitle}>Tạo Thông Báo Mới</h1>
        <p className={classes.pageSubtitle}>Nhập thông tin chi tiết để tạo thông báo mới.</p>
      </div>

      <Stack gap={16}>
        <div className={classes.section}>
          <SectionTitle icon={IconBell} number={1} title="Thông tin thông báo" />
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="TIÊU ĐỀ"
                required
                placeholder="Nhập tiêu đề thông báo"
                value={form.title}
                onChange={e => set('title')(e.target.value)}
                error={errors.title}
                classNames={{ label: classes.fieldLabel, input: classes.input }}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="NỘI DUNG"
                required
                placeholder="Nhập nội dung thông báo"
                value={form.content}
                onChange={e => set('content')(e.target.value)}
                error={errors.content}
                classNames={{ label: classes.fieldLabel, input: classes.input }}
                minRows={3}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="LOẠI THÔNG BÁO"
                required
                data={targetTypeData}
                value={form.targetType}
                onChange={val => set('targetType')(val as TargetType)}
                classNames={{ label: classes.fieldLabel, input: classes.input }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="HẠN CHÓT"
                placeholder="YYYY-MM-DD"
                value={form.deadLine}
                onChange={e => set('deadLine')(e.target.value)}
                classNames={{ label: classes.fieldLabel, input: classes.input }}
              />
            </Grid.Col>
            {!isGlobal && (
              <Grid.Col span={12}>
                <TextInput
                  label="DANH SÁCH ID ĐỐI TƯỢNG"
                  required
                  placeholder="Ví dụ: 1001, 1002, 1003"
                  value={targetIdsText}
                  onChange={e => handleTargetIdsChange(e.target.value)}
                  error={errors.targetIds}
                  classNames={{ label: classes.fieldLabel, input: classes.input }}
                  description="Nhập các ID cách nhau bằng dấu phẩy hoặc khoảng trắng"
                />
              </Grid.Col>
            )}
            <Grid.Col span={6}>
              <Stack gap={8}>
                <Text className={classes.fieldLabel}>QUAN TRỌNG</Text>
                <Switch
                  checked={form.isImportant}
                  onChange={(e) => set('isImportant')(e.currentTarget.checked)}
                  label={form.isImportant ? 'Quan trọng' : 'Không quan trọng'}
                />
              </Stack>
            </Grid.Col>
          </Grid>
        </div>
      </Stack>

      <div className={classes.footer}>
        <Button variant="subtle" color="gray" leftSection={<IconX size={16} />} onClick={onCancel} className={classes.cancelBtn} disabled={loading}>
          Huỷ
        </Button>
        <Button leftSection={<IconDeviceFloppy size={16} />} onClick={handleSave} className={classes.saveBtn} loading={loading}>
          Tạo thông báo
        </Button>
      </div>

      {apiError && <Alert color="red" title="Lỗi" mt="md">{apiError}</Alert>}
    </div>
  );
}