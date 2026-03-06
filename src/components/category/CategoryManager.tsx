/**
 * 分类管理对话框组件
 * @description 提供分类的新增、删除操作
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useCategories } from '@/hooks/useCategories';
import { CATEGORY_COLORS } from '@/constants/app.constants';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 分类管理对话框
 */
export const CategoryManager: React.FC<CategoryManagerProps> = ({ open, onClose }) => {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(CATEGORY_COLORS[0]);

  /** 添加分类 */
  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), color: selectedColor });
    setNewName('');
    // 自动切换到下一个颜色
    const nextIdx = (CATEGORY_COLORS.indexOf(selectedColor as typeof CATEGORY_COLORS[number]) + 1) % CATEGORY_COLORS.length;
    setSelectedColor(CATEGORY_COLORS[nextIdx]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>管理分类</DialogTitle>
      <DialogContent>
        {/* 已有分类列表 */}
        {categories.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {categories.map((cat) => (
              <Box
                key={cat.id}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Chip
                  label={cat.name}
                  sx={{ backgroundColor: cat.color, color: '#fff' }}
                />
                <IconButton size="small" onClick={() => deleteCategory(cat.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            暂无分类，请添加
          </Typography>
        )}

        {/* 新增分类表单 */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            label="分类名称"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            size="small"
            fullWidth
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <IconButton onClick={handleAdd} color="primary" disabled={!newName.trim()}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* 颜色选择器 */}
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
          {CATEGORY_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                border: selectedColor === color ? '2px solid #fff' : '2px solid transparent',
                transition: 'border 0.15s',
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
};
