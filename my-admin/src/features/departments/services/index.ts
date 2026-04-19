import { apiClient } from '../../../lib/api-client';
import type { Faculty } from '../../students/types';

interface CreateFacultyPayload {
  facultyName: string;
  facultyCode: string;
}

interface UpdateFacultyPayload {
  facultyName?: string;
  facultyCode?: string;
}

interface FacultyApiResponse {
  id: number;
  facultyName: string;
  facultyCode: string;
  isActive: boolean;
}

interface CreateFacultyResponse {
  code: number;
  message: string;
  data: FacultyApiResponse;
}

interface UpdateResponse {
  code: number;
  message: string;
  data: null;
}

const facultyMetaMap: Record<string, Omit<Faculty, 'id' | 'name' | 'facultyCode'> & { name: string; facultyCode: string }> = {
  CNTT: {
    facultyCode: 'CNTT',
    name: 'Khoa Toán - Tin học',
    description: 'Đào tạo Kỹ sư phần mềm, An toàn thông tin và Hệ thống nhúng chất lượng cao.',
    icon: 'laptop',
    color: '#3B82F6',
    image: 'toan-tin',
  },
  KTQL: {
    facultyCode: 'KTQL',
    name: 'Khoa Kinh tế - Quản lý',
    description: 'Cung cấp nguồn nhân lực quản lý, marketing và tài chính chuyên nghiệp.',
    icon: 'bank',
    color: '#10B981',
    image: 'kinh-te'
  },
  KNN: {
    facultyCode: 'KNN',
    name: 'Khoa Ngoại ngữ',
    description: 'Chương trình chuẩn quốc tế về Ngôn ngữ và Văn hóa các nước trên thế giới.',
    icon: 'translate',
    color: '#EF4444',
    image: 'ngoai-ngu'
  },
  KAN: {
    facultyCode: 'KAN',
    name: 'Khoa Âm nhạc ứng dụng',
    description: 'Nơi khơi nguồn sáng tạo và rèn luyện kỹ năng thiết kế truyền thông nghệ thuật.',
    icon: 'music',
    color: '#8B5CF6',
    image: 'am-nhac'
  },
  XHNV: {
    facultyCode: 'XHNV',
    name: 'Khoa Khoa học xã hội và nhân văn',
    description: 'Nơi khơi nguồn sáng tạo và rèn luyện kỹ năng thiết kế truyền thông nghệ thuật.',
    icon: 'social',
    color: '#6d0102',
    image: 'khoa-hoc-xa-hoi'
  },
  KHSK: {
    facultyCode: 'KHSK',
    name: 'Khoa Sức khỏe',
    description: 'Đào tạo cử nhân điều dưỡng có y đức và kỹ năng chăm sóc sức khỏe cộng đồng.',
    icon: 'health',
    color: '#3ac2d8',
    image: 'suc-khoe'
  },
  KDL: {
    facultyCode: 'KDL',
    name: 'Khoa Du lịch',
    description: 'Nơi khơi nguồn sáng tạo và rèn luyện kỹ năng thiết kế truyền thông nghệ thuật.',
    icon: 'travel',
    color: '#00715f',
    image: 'du-lich'
  },
  KTT: {
    facultyCode: 'KTT',
    name: 'Khoa Truyền thông',
    description: 'Nơi khơi nguồn sáng tạo và rèn luyện kỹ năng thiết kế truyền thông nghệ thuật.',
    icon: 'media',
    color: '#be4510',
    image: 'truyen-thong'
  },
};

export function mapApiToFaculty(apiFaculty: FacultyApiResponse): Faculty {
  const meta = facultyMetaMap[apiFaculty.facultyCode];
  return {
    id: apiFaculty.id,
    facultyCode: apiFaculty.facultyCode,
    name: apiFaculty.facultyName,
    description: meta?.description ?? 'Mô tả đang được cập nhật.',
    icon: meta?.icon ?? 'users',
    color: meta?.color ?? '#6B7280',
    image: meta?.image ?? '',
  };
}

export async function createFaculty(payload: CreateFacultyPayload): Promise<Faculty> {
  const response = await apiClient<CreateFacultyResponse>(
    '/faculty/create',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return mapApiToFaculty(response.data);
}

export async function updateFaculty(facultyId: number, payload: UpdateFacultyPayload): Promise<void> {
  const response = await apiClient<UpdateResponse>(
    `/faculty/update/${facultyId}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteFaculty(facultyId: number): Promise<void> {
  const response = await apiClient<UpdateResponse>(
    `/faculty/delete/${facultyId}`,
    {
      method: 'POST',
    }
  );
}