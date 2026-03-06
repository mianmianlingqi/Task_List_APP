/**
 * 主页面组件
 * @description 组装搜索、筛选、任务列表、表单和操作入口的顶层页面
 */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Fab,
  Tooltip,
  IconButton,
  Collapse,
  Badge,
  Divider,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CategoryIcon from '@mui/icons-material/Category';
import SortIcon from '@mui/icons-material/Sort';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import type { Task, TaskCreateInput } from '@/types/task';
import { TaskSortBy } from '@/types/filter';
import { useTaskStore } from '@/stores/task.store';
import { useTaskActions } from '@/hooks/useTaskActions';
import { useFilteredTasks } from '@/hooks/useFilteredTasks';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useCategoryStore } from '@/stores/category.store';
import { TaskList } from '@/components/task/TaskList';
import { TaskForm } from '@/components/task/TaskForm';
import { SearchBar } from '@/components/filter/SearchBar';
import { FilterPanel } from '@/components/filter/FilterPanel';
import { CategoryManager } from '@/components/category/CategoryManager';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { exportToJson, parseFromJson } from '@/services/export.service';

/** 排序选项标签映射 */
const SORT_LABELS: Record<TaskSortBy, string> = {
  [TaskSortBy.MANUAL]: '手动排序',
  [TaskSortBy.CREATED_AT]: '创建时间',
  [TaskSortBy.DUE_DATE]: '截止日期',
  [TaskSortBy.PRIORITY]: '优先级',
};

/** 应用名称（从环境变量读取） */
const APP_NAME = import.meta.env.VITE_APP_NAME || '待办任务清单';

/**
 * 主页面 — 任务管理中心
 */
export const HomePage: React.FC = () => {
  /* === 本地 UI 状态 === */
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  /* === Store & Hook === */
  const { addTask, updateTask, deleteTask, toggleStatus, clearCompleted, importTasks } = useTaskActions();
  const { filteredTasks, stats } = useFilteredTasks();
  const { toggleTheme, isDark } = useThemeMode();
  const filter = useTaskStore((s) => s.filter);
  const setFilter = useTaskStore((s) => s.setFilter);
  const resetFilter = useTaskStore((s) => s.resetFilter);
  const setSortBy = useTaskStore((s) => s.setSortBy);
  const sortBy = useTaskStore((s) => s.sortBy);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  /* === 搜索回调 === */
  const handleSearch = useCallback(
    (keyword: string) => setFilter({ keyword: keyword || undefined }),
    [setFilter]
  );

  /* === 表单提交 === */
  const handleFormSubmit = useCallback(
    (data: TaskCreateInput) => {
      if (editingTask) {
        updateTask({ id: editingTask.id, ...data });
      } else {
        addTask(data);
      }
      setEditingTask(null);
    },
    [editingTask, addTask, updateTask]
  );

  /* === 编辑任务 === */
  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  /* === 新建任务 === */
  const handleNewTask = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  /* === 导出 === */
  const handleExport = useCallback(() => {
    const json = exportToJson(tasks, categories);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks, categories]);

  /* === 导入 === */
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = parseFromJson(text);
        importTasks(data.tasks, 'merge');
      } catch (err) {
        console.error('导入失败:', err);
      }
    };
    input.click();
  }, [importTasks]);

  /* === 筛选器活跃数量 === */
  const activeFilterCount =
    (filter.statuses?.length || 0) +
    (filter.priorities?.length || 0) +
    (filter.categoryId ? 1 : 0) +
    (filter.overdueOnly ? 1 : 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* === 顶部标题栏 === */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          {APP_NAME}
        </Typography>

        {/* 统计信息 */}
        <Typography variant="caption" color="text.secondary">
          {stats.todo} 待办 · {stats.inProgress} 进行中 · {stats.done} 完成
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* 排序按钮 */}
        <Tooltip title="排序方式">
          <IconButton size="small" onClick={(e) => setSortAnchorEl(e.currentTarget)}>
            <SortIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={sortAnchorEl}
          open={!!sortAnchorEl}
          onClose={() => setSortAnchorEl(null)}
        >
          {Object.values(TaskSortBy).map((sort) => (
            <MenuItem
              key={sort}
              selected={sortBy === sort}
              onClick={() => {
                setSortBy(sort);
                setSortAnchorEl(null);
              }}
            >
              {SORT_LABELS[sort]}
            </MenuItem>
          ))}
        </Menu>

        {/* 筛选器切换 */}
        <Tooltip title="筛选">
          <IconButton size="small" onClick={() => setFilterVisible((v) => !v)}>
            <Badge badgeContent={activeFilterCount} color="primary">
              <FilterListIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* 分类管理 */}
        <Tooltip title="管理分类">
          <IconButton size="small" onClick={() => setCategoryManagerOpen(true)}>
            <CategoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* 主题切换 */}
        <Tooltip title={isDark ? '切换亮色' : '切换暗色'}>
          <IconButton size="small" onClick={toggleTheme}>
            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* === 搜索栏 === */}
      <Box sx={{ px: 2, py: 1 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      {/* === 折叠式筛选面板 === */}
      <Collapse in={filterVisible}>
        <Box sx={{ px: 2, pb: 1 }}>
          <FilterPanel filter={filter} onFilterChange={setFilter} />
          {activeFilterCount > 0 && (
            <Button size="small" onClick={resetFilter} sx={{ mt: 0.5 }}>
              清除筛选
            </Button>
          )}
        </Box>
      </Collapse>

      {/* === 任务列表（可滚动区域） === */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1 }}>
        <TaskList
          tasks={filteredTasks}
          onToggleStatus={toggleStatus}
          onEdit={handleEdit}
          onDelete={deleteTask}
        />
      </Box>

      {/* === 底部操作栏 === */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          size="small"
          startIcon={<ClearAllIcon />}
          onClick={() => setClearConfirmOpen(true)}
          disabled={stats.done === 0}
          color="warning"
        >
          清除已完成 ({stats.done})
        </Button>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="导入任务">
          <IconButton size="small" onClick={handleImport}>
            <FileUploadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="导出备份">
          <IconButton size="small" onClick={handleExport}>
            <FileDownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* === FAB 新建任务按钮 === */}
      <Fab
        color="primary"
        onClick={handleNewTask}
        sx={{
          position: 'fixed',
          bottom: 72,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      {/* === 对话框集合 === */}
      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />
      <CategoryManager open={categoryManagerOpen} onClose={() => setCategoryManagerOpen(false)} />
      <ConfirmDialog
        open={clearConfirmOpen}
        title="清除已完成任务"
        content={`确定要删除 ${stats.done} 个已完成的任务吗？此操作不可撤销。`}
        confirmText="清除"
        onConfirm={() => {
          clearCompleted();
          setClearConfirmOpen(false);
        }}
        onCancel={() => setClearConfirmOpen(false)}
      />
    </Box>
  );
};
