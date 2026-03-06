/**
 * 任务表单对话框组件
 * @description 用于新增或编辑任务的模态表单
 */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import type { Task, TaskCreateInput } from '@/types/task';
import { TaskStatus, TaskPriority } from '@/types/task';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/constants/app.constants';
import { useCategoryStore } from '@/stores/category.store';

interface TaskFormProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 提交回调 */
  onSubmit: (data: TaskCreateInput) => void;
  /** 编辑模式下的初始任务数据 */
  initialData?: Task | null;
}

/** 表单默认值 */
const DEFAULT_FORM: TaskCreateInput = {
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  categoryId: undefined,
  dueDate: undefined,
};

/**
 * 任务表单对话框
 */
export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<TaskCreateInput>(DEFAULT_FORM);
  const [titleError, setTitleError] = useState('');
  const categories = useCategoryStore((s) => s.categories);

  /* 编辑模式下，填充初始数据 */
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        categoryId: initialData.categoryId,
        dueDate: initialData.dueDate,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setTitleError('');
  }, [initialData, open]);

  /** 处理表单提交 */
  const handleSubmit = () => {
    // 校验标题
    if (!form.title.trim()) {
      setTitleError('任务标题不能为空');
      return;
    }
    if (form.title.length > 100) {
      setTitleError('标题不能超过 100 个字符');
      return;
    }
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
    });
    onClose();
  };

  /** 通用字段更新 */
  const updateField = <K extends keyof TaskCreateInput>(key: K, value: TaskCreateInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'title') setTitleError('');
  };

  const isEdit = !!initialData;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? '编辑任务' : '新建任务'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* 标题 */}
          <TextField
            label="任务标题"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            error={!!titleError}
            helperText={titleError}
            fullWidth
            autoFocus
            required
          />

          {/* 描述 */}
          <TextField
            label="任务描述（可选）"
            value={form.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          {/* 状态 + 优先级（并排） */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>状态</InputLabel>
              <Select
                value={form.status}
                label="状态"
                onChange={(e) => updateField('status', e.target.value as TaskStatus)}
              >
                {Object.values(TaskStatus).map((s) => (
                  <MenuItem key={s} value={s}>{STATUS_LABELS[s]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>优先级</InputLabel>
              <Select
                value={form.priority}
                label="优先级"
                onChange={(e) => updateField('priority', e.target.value as TaskPriority)}
              >
                {Object.values(TaskPriority).map((p) => (
                  <MenuItem key={p} value={p}>{PRIORITY_LABELS[p]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 分类选择 */}
          <FormControl fullWidth>
            <InputLabel>分类（可选）</InputLabel>
            <Select
              value={form.categoryId || ''}
              label="分类（可选）"
              onChange={(e) => updateField('categoryId', e.target.value || undefined)}
            >
              <MenuItem value="">
                <em>无分类</em>
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: c.color,
                      }}
                    />
                    {c.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 截止日期 */}
          <TextField
            label="截止日期（可选）"
            type="date"
            value={form.dueDate || ''}
            onChange={(e) => updateField('dueDate', e.target.value || undefined)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">取消</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? '保存修改' : '创建任务'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
