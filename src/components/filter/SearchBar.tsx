/**
 * 搜索输入框组件
 * @description 带防抖的关键字搜索输入框
 */
import React, { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface SearchBarProps {
  /** 搜索值变更回调（已防抖） */
  onSearch: (keyword: string) => void;
  /** 占位文字 */
  placeholder?: string;
}

/** 防抖延迟（毫秒） */
const DEBOUNCE_DELAY = 300;

/**
 * 带防抖功能的搜索输入框
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '搜索任务...',
}) => {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* 防抖触发搜索 */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, DEBOUNCE_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setValue('')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
};
