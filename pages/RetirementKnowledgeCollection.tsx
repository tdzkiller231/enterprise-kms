import React, { useEffect, useMemo, useState } from 'react';
import { KMSService } from '../services/kmsService';
import { Category, DocStatus, User } from '../types';
import { Card, Button, Modal } from '../components/UI';
import { Edit, Plus, Save, Send, Trash2 } from 'lucide-react';

type CaptureStatus = 'Chờ phê duyệt' | 'Đã phê duyệt' | 'Bị từ chối';

interface RetirementKnowledgeRecord {
  id: string;
  approvalDocId?: string;
  expertId: string;
  expertName: string;
  department: string;
  categoryName: string;
  knowledgeType: string;
  documentType: 'Tài liệu đào tạo' | 'Tài liệu công ty';
  title: string;
  summary: string;
  attachments: string[];
  tags: string[];
  source: string;
  effectiveDate: string;
  expiryDate: string;
  status: CaptureStatus;
}

const KNOWLEDGE_TYPE_OPTIONS = ['Quy trình', 'Kinh nghiệm', 'Sự cố', 'Case study', 'Lessons Learned'];

export const RetirementKnowledgeCollection: React.FC = () => {
  const [experts, setExperts] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [records, setRecords] = useState<RetirementKnowledgeRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    expertId: '',
    knowledgeType: '',
    documentType: 'Tài liệu đào tạo' as 'Tài liệu đào tạo' | 'Tài liệu công ty',
    title: '',
    summary: '',
    tags: [] as string[],
    source: 'Nội bộ',
    effectiveDate: '',
    expiryDate: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [usersManagementResp, cats] = await Promise.all([
        KMSService.getUsersForManagement({ page: 1, pageSize: 100 }),
        KMSService.getCategories()
      ]);

      // Mock danh sách chuyên gia sắp nghỉ hưu: ưu tiên Manager hoặc user có thâm niên cao.
      const retirementExperts = usersManagementResp.users.filter((u: User) => u.role === 'Manager' || u.id === 'um4' || u.id === 'um1');
      setExperts(retirementExperts);
      setCategories(cats);

      // Dữ liệu view mẫu dạng lưới danh sách.
      setRecords([
        {
          id: 'rk-1',
          expertId: retirementExperts[0]?.id || '',
          expertName: retirementExperts[0]?.name || 'Chuyên gia mẫu',
          department: retirementExperts[0]?.department || 'Kỹ thuật',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Kinh nghiệm',
          documentType: 'Tài liệu đào tạo',
          title: 'Kinh nghiệm xử lý dao động áp suất cụm trao đổi nhiệt',
          summary: 'Tổng hợp cách nhận biết nguyên nhân và các bước xử lý nhanh theo ca.',
          attachments: ['xu_ly_ap_suat.pdf', 'video_huong_dan.mp4'],
          tags: ['iso', 'training'],
          source: 'Nội bộ',
          effectiveDate: '2026-03-20',
          expiryDate: '2027-03-20',
          status: 'Chờ phê duyệt'
        },
        {
          id: 'rk-2',
          expertId: retirementExperts[1]?.id || '',
          expertName: retirementExperts[1]?.name || 'Trần Thị B (Manager)',
          department: retirementExperts[1]?.department || 'Nhân sự',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Lessons Learned',
          documentType: 'Tài liệu công ty',
          title: 'Bài học triển khai đào tạo tại hiện trường',
          summary: 'Những bài học rút ra khi tổ chức đào tạo liên phòng ban.',
          attachments: ['lessons_learned_2025.pptx'],
          tags: ['hr', 'internal'],
          source: 'Nội bộ',
          effectiveDate: '2026-03-15',
          expiryDate: '2027-03-15',
          status: 'Đã phê duyệt'
        },
        {
          id: 'rk-3',
          expertId: retirementExperts[2]?.id || retirementExperts[0]?.id || '',
          expertName: retirementExperts[2]?.name || retirementExperts[0]?.name || 'Lê Văn C',
          department: retirementExperts[2]?.department || retirementExperts[0]?.department || 'Kỹ thuật',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Quy trình',
          documentType: 'Tài liệu đào tạo',
          title: 'Quy trình chuẩn khởi động lại hệ thống sau dừng khẩn cấp',
          summary: 'Checklist và ngưỡng an toàn khi đưa dây chuyền vận hành trở lại.',
          attachments: ['quy_trinh_restart_v2.pdf'],
          tags: ['restart', 'safety', 'operation'],
          source: 'SharePoint',
          effectiveDate: '2026-04-01',
          expiryDate: '2027-04-01',
          status: 'Chờ phê duyệt'
        },
        {
          id: 'rk-4',
          expertId: retirementExperts[1]?.id || '',
          expertName: retirementExperts[1]?.name || 'Trần Thị B (Manager)',
          department: retirementExperts[1]?.department || 'Nhân sự',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Sự cố',
          documentType: 'Tài liệu công ty',
          title: 'Sự cố mất tín hiệu cảm biến nhiệt độ đường ống chính',
          summary: 'Nguyên nhân thường gặp và các bước cô lập nhanh để không dừng toàn hệ thống.',
          attachments: ['incident_sensor_temp.docx', 'trend_data.csv'],
          tags: ['incident', 'sensor', 'dcs'],
          source: 'Email',
          effectiveDate: '2026-02-10',
          expiryDate: '2027-02-10',
          status: 'Đã phê duyệt'
        },
        {
          id: 'rk-5',
          expertId: retirementExperts[0]?.id || '',
          expertName: retirementExperts[0]?.name || 'Nguyễn Văn A (Admin)',
          department: retirementExperts[0]?.department || 'CNTT',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Case study',
          documentType: 'Tài liệu đào tạo',
          title: 'Case study tối ưu lịch bảo trì cụm bơm tuần hoàn',
          summary: 'So sánh trước/sau khi áp dụng bảo trì theo điều kiện vận hành thực tế.',
          attachments: ['case_study_pump_maintenance.pptx'],
          tags: ['case-study', 'maintenance', 'pump'],
          source: 'OneDrive',
          effectiveDate: '2026-01-05',
          expiryDate: '2027-01-05',
          status: 'Bị từ chối'
        },
        {
          id: 'rk-6',
          expertId: retirementExperts[2]?.id || retirementExperts[0]?.id || '',
          expertName: retirementExperts[2]?.name || retirementExperts[0]?.name || 'Lê Văn C',
          department: retirementExperts[2]?.department || retirementExperts[0]?.department || 'Kỹ thuật',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Kinh nghiệm',
          documentType: 'Tài liệu đào tạo',
          title: 'Kinh nghiệm đọc rung động bất thường từ dữ liệu online',
          summary: 'Mẹo nhận diện sớm nguy cơ hỏng vòng bi qua phổ rung.',
          attachments: ['vibration_best_practice.pdf'],
          tags: ['vibration', 'predictive', 'bearing'],
          source: 'Nội bộ',
          effectiveDate: '2026-03-01',
          expiryDate: '2027-03-01',
          status: 'Chờ phê duyệt'
        },
        {
          id: 'rk-7',
          expertId: retirementExperts[1]?.id || '',
          expertName: retirementExperts[1]?.name || 'Trần Thị B (Manager)',
          department: retirementExperts[1]?.department || 'Nhân sự',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Lessons Learned',
          documentType: 'Tài liệu công ty',
          title: 'Lessons learned khi chuyển giao ca trực dịp cao điểm',
          summary: 'Các lỗi giao tiếp thường gặp và mẫu checklist bàn giao hiệu quả.',
          attachments: ['ll_shift_handover.pdf'],
          tags: ['handover', 'checklist', 'shift'],
          source: 'Nội bộ',
          effectiveDate: '2026-02-20',
          expiryDate: '2027-02-20',
          status: 'Đã phê duyệt'
        },
        {
          id: 'rk-8',
          expertId: retirementExperts[0]?.id || '',
          expertName: retirementExperts[0]?.name || 'Nguyễn Văn A (Admin)',
          department: retirementExperts[0]?.department || 'CNTT',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Quy trình',
          documentType: 'Tài liệu công ty',
          title: 'Quy trình xử lý cảnh báo an ninh mạng tại khu vực OT',
          summary: 'Phân loại mức độ cảnh báo và quy trình phối hợp IT-OT theo SLA.',
          attachments: ['ot_security_response_v1.pdf'],
          tags: ['ot', 'security', 'sla'],
          source: 'Hệ thống khác',
          effectiveDate: '2026-05-01',
          expiryDate: '2027-05-01',
          status: 'Bị từ chối'
        },
        {
          id: 'rk-9',
          expertId: retirementExperts[2]?.id || retirementExperts[0]?.id || '',
          expertName: retirementExperts[2]?.name || retirementExperts[0]?.name || 'Lê Văn C',
          department: retirementExperts[2]?.department || retirementExperts[0]?.department || 'Kỹ thuật',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Case study',
          documentType: 'Tài liệu đào tạo',
          title: 'Case study giảm tiêu hao hơi trong giai đoạn khởi động',
          summary: 'Các thông số vận hành tối ưu giúp giảm 8% tiêu hao hơi.',
          attachments: ['steam_optimization_case.xlsx'],
          tags: ['steam', 'optimization', 'startup'],
          source: 'SharePoint',
          effectiveDate: '2026-04-15',
          expiryDate: '2027-04-15',
          status: 'Chờ phê duyệt'
        },
        {
          id: 'rk-10',
          expertId: retirementExperts[1]?.id || '',
          expertName: retirementExperts[1]?.name || 'Trần Thị B (Manager)',
          department: retirementExperts[1]?.department || 'Nhân sự',
          categoryName: 'Tri thức chuyên gia',
          knowledgeType: 'Sự cố',
          documentType: 'Tài liệu công ty',
          title: 'Sự cố lệch chuẩn chất lượng mẫu kiểm tra cuối ca',
          summary: 'Phân tích nguyên nhân do thao tác lấy mẫu và biện pháp phòng ngừa.',
          attachments: ['quality_incident_report.pdf'],
          tags: ['quality', 'sampling', 'incident'],
          source: 'Email',
          effectiveDate: '2026-01-22',
          expiryDate: '2027-01-22',
          status: 'Đã phê duyệt'
        }
      ]);
    };

    loadData();
  }, []);

  const selectedExpert = useMemo(() => experts.find(e => e.id === formData.expertId), [experts, formData.expertId]);
  const isEditingApprovedRecord = useMemo(() => {
    if (!editingRecordId) return false;
    const record = records.find(r => r.id === editingRecordId);
    return record?.status === 'Đã phê duyệt';
  }, [editingRecordId, records]);

  const expertKnowledgeCategory = useMemo(
    () => categories.find(c => c.name === 'Tri thức chuyên gia'),
    [categories]
  );

  const addTag = (rawTag: string) => {
    const tag = rawTag.trim();
    if (!tag) return;
    if (formData.tags.includes(tag)) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const validateRequired = () => {
    if (!formData.expertId || !formData.title.trim() || !formData.summary.trim()) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc: Chuyên gia, Tiêu đề tri thức, Tóm tắt nội dung.');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      expertId: '',
      knowledgeType: '',
      documentType: 'Tài liệu đào tạo',
      title: '',
      summary: '',
      tags: [],
      source: 'Nội bộ',
      effectiveDate: '',
      expiryDate: ''
    });
    setAttachments([]);
    setTagInput('');
    setEditingRecordId(null);
  };

  const openCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const openEdit = (record: RetirementKnowledgeRecord) => {
    setEditingRecordId(record.id);
    setFormData({
      expertId: record.expertId,
      knowledgeType: record.knowledgeType,
      documentType: record.documentType,
      title: record.title,
      summary: record.summary,
      tags: record.tags,
      source: record.source,
      effectiveDate: record.effectiveDate,
      expiryDate: record.expiryDate
    });
    setAttachments([]);
    setTagInput('');
    setIsEditing(true);
  };

  const buildRecord = (status: CaptureStatus): RetirementKnowledgeRecord | null => {
    const expert = experts.find(e => e.id === formData.expertId);
    if (!expert) return null;

    return {
      id: editingRecordId || `rk-${Date.now()}`,
      approvalDocId: editingRecordId ? records.find(r => r.id === editingRecordId)?.approvalDocId : undefined,
      expertId: expert.id,
      expertName: expert.name,
      department: expert.department || 'N/A',
      categoryName: expertKnowledgeCategory?.name || 'Tri thức chuyên gia',
      knowledgeType: formData.knowledgeType,
      documentType: formData.documentType,
      title: formData.title,
      summary: formData.summary,
      attachments: attachments.length > 0 ? attachments.map(file => file.name) : (editingRecordId ? (records.find(r => r.id === editingRecordId)?.attachments || []) : []),
      tags: formData.tags,
      source: formData.source,
      effectiveDate: formData.effectiveDate,
      expiryDate: formData.expiryDate,
      status
    };
  };

  const getKnowledgeTypeCategoryId = (knowledgeType: string) => {
    const map: Record<string, string> = {
      'Quy trình': 'c6-1',
      'Kinh nghiệm': 'c6-2',
      'Sự cố': 'c6-3',
      'Case study': 'c6-4',
      'Lessons Learned': 'c6-5'
    };
    return map[knowledgeType] || 'c6';
  };

  const handleSaveDraft = async () => {
    if (isEditingApprovedRecord) {
      alert('Bản ghi đã phê duyệt khi chỉnh sửa phải gửi phê duyệt lại. Vui lòng bấm "Gửi phê duyệt".');
      return;
    }
    if (!validateRequired()) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const record = buildRecord('Chờ phê duyệt');
    if (record) {
      setRecords(prev => {
        const exists = prev.some(item => item.id === record.id);
        if (exists) return prev.map(item => item.id === record.id ? record : item);
        return [record, ...prev];
      });
    }
    setSubmitting(false);
    setIsEditing(false);
    resetForm();
    alert('Đã lưu kế hoạch thu thập tri thức.');
  };

  const handleSubmitForApproval = async () => {
    if (!validateRequired()) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const record = buildRecord('Chờ phê duyệt');
    if (record) {
      const categoryId = getKnowledgeTypeCategoryId(formData.knowledgeType);
      const payload = {
        title: formData.title,
        summary: formData.summary,
        description: formData.summary,
        categoryIds: [categoryId],
        categoryId,
        tags: formData.tags,
        source: formData.source,
        effectiveDate: formData.effectiveDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        lifecycleStatus: 'PendingLevel1' as const,
        status: DocStatus.PENDING,
        documentType: formData.documentType,
        fileType: 'pdf' as const
      };

      if (record.approvalDocId) {
        await KMSService.updateDocument(record.approvalDocId, payload as any);
      } else {
        const created = await KMSService.createDocument(payload as any);
        record.approvalDocId = created.id;
      }

      setRecords(prev => {
        const exists = prev.some(item => item.id === record.id);
        if (exists) return prev.map(item => item.id === record.id ? record : item);
        return [record, ...prev];
      });
    }
    setSubmitting(false);
    setIsEditing(false);
    resetForm();
    alert('Đã gửi tri thức vào quy trình phê duyệt.');
  };

  const handleDeleteRecord = async (id: string) => {
    const target = records.find(r => r.id === id);
    if (!target) return;
    if (target.status === 'Đã phê duyệt') {
      alert('Bản ghi đã phê duyệt không thể xóa.');
      return;
    }
    if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;

    if (target.approvalDocId) {
      try {
        await KMSService.deleteDocument(target.approvalDocId);
      } catch (error) {
        // Keep local delete for UX even when mock service blocks deletion.
      }
    }
    setRecords(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thu thập tri thức từ chuyên gia sắp nghỉ hưu</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo tri thức chuyên gia
        </Button>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => { setIsEditing(false); resetForm(); }}
        title="Thông tin quản lý (màn tạo/sửa kế hoạch)"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setIsEditing(false); resetForm(); }}>
              Hủy
            </Button>
            {!isEditingApprovedRecord && (
              <Button variant="ghost" onClick={handleSaveDraft} isLoading={submitting}>
                <Save className="w-4 h-4 mr-2" />
                Lưu bản nháp
              </Button>
            )}
            <Button onClick={handleSubmitForApproval} isLoading={submitting}>
              <Send className="w-4 h-4 mr-2" />
              {isEditingApprovedRecord ? 'Gửi phê duyệt lại' : 'Gửi phê duyệt'}
            </Button>
          </>
        }
      >
      <div className="max-h-[75vh] overflow-y-auto pr-2">
        {isEditingApprovedRecord && (
          <div className="mb-4 p-3 rounded border border-amber-200 bg-amber-50 text-amber-800 text-sm">
            Bản ghi đang ở trạng thái Đã phê duyệt. Sau khi chỉnh sửa, bạn cần gửi phê duyệt lại.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Chuyên gia <span className="text-red-500">*</span></label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formData.expertId}
              onChange={(e) => setFormData(prev => ({ ...prev, expertId: e.target.value }))}
            >
              <option value="">Chọn chuyên gia sắp nghỉ hưu</option>
              {experts.map(expert => (
                <option key={expert.id} value={expert.id}>{expert.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Phòng ban</label>
            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-700">
              {selectedExpert?.department || 'Tự động lấy từ hồ sơ nhân viên'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">3. Danh mục tri thức <span className="text-red-500">*</span></label>
            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-700">
              {expertKnowledgeCategory?.name || 'Tri thức chuyên gia'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">4. Loại tri thức</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formData.knowledgeType}
              onChange={(e) => setFormData(prev => ({ ...prev, knowledgeType: e.target.value }))}
            >
              <option value="">Chọn loại tri thức</option>
              {KNOWLEDGE_TYPE_OPTIONS.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">5. Tiêu đề tri thức <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Nhập tiêu đề nội dung tri thức"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">6. Tóm tắt nội dung <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Mô tả ngắn gọn nội dung tri thức"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">7. Loại tài liệu <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="documentType"
                  value="Tài liệu đào tạo"
                  checked={formData.documentType === 'Tài liệu đào tạo'}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value as 'Tài liệu đào tạo' | 'Tài liệu công ty' }))}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Tài liệu đào tạo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="documentType"
                  value="Tài liệu công ty"
                  checked={formData.documentType === 'Tài liệu công ty'}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value as 'Tài liệu đào tạo' | 'Tài liệu công ty' }))}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Tài liệu công ty</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">8. File đính kèm</label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
            />
            {attachments.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Đã chọn: {attachments.map(file => file.name).join(', ')}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">9. Tags</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Nhập tag và Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
            />
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="font-semibold text-blue-700 hover:text-blue-900"
                      aria-label={`Xóa tag ${tag}`}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10. Nguồn dữ liệu</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            >
              <option value="Nội bộ">Nội bộ</option>
              <option value="Email">Email</option>
              <option value="OneDrive">OneDrive</option>
              <option value="SharePoint">SharePoint</option>
              <option value="Hệ thống khác">Hệ thống khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">11. Ngày hiệu lực</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formData.effectiveDate}
              onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12. Ngày hết hạn</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>
        </div>
      </div>
      </Modal>

      {!isEditing && (
      <Card title="Danh sách thu thập tri thức">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Chuyên gia</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phòng ban</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loại tri thức</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nguồn dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày hiệu lực</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày hết hạn</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Chức năng</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                    Chưa có dữ liệu thu thập tri thức. Hãy bấm "Tạo tri thức chuyên gia" để bắt đầu.
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{record.expertName}</td>
                    <td className="px-4 py-3">{record.department}</td>
                    <td className="px-4 py-3">{record.categoryName}</td>
                    <td className="px-4 py-3">{record.knowledgeType || '-'}</td>
                    <td className="px-4 py-3">{record.title}</td>
                    <td className="px-4 py-3">{record.source || '-'}</td>
                    <td className="px-4 py-3">{record.effectiveDate || '-'}</td>
                    <td className="px-4 py-3">{record.expiryDate || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        record.status === 'Đã phê duyệt'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'Bị từ chối'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(record)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" className="px-2 py-1" onClick={() => handleDeleteRecord(record.id)}>
                          <Trash2 className={`w-4 h-4 ${record.status === 'Đã phê duyệt' ? 'text-gray-300' : 'text-red-600'}`} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      )}
    </div>
  );
};
