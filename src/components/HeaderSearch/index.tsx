import { AutoComplete, Input } from 'antd';
import type { AutoCompleteProps } from 'antd/es/auto-complete';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React, { useRef, useState } from 'react';

import classNames from 'classnames';
import styles from './index.less';

export type HeaderSearchProps = {
  onSearch?: (value?: string) => void;
  onChange?: (value?: string) => void;
  onVisibleChange?: (b: boolean) => void;
  className?: string;
  placeholder?: string;
  options: AutoCompleteProps['options'];
  defaultVisible?: boolean;
  visible?: boolean;
  defaultValue?: string;
  value?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const {
    className,
    defaultValue,
    onVisibleChange,
    placeholder,
    visible,
    defaultVisible,
    ...restProps
  } = props;

  const inputRef = useRef<Input | null>(null);
  const [searchOptions, setSearchOptions] = useState(restProps.options);

  const [value, setValue] = useMergedState<string | undefined>(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });

  const [searchMode, setSearchMode] = useMergedState(defaultVisible ?? false, {
    value: props.visible,
    onChange: onVisibleChange,
  });

  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });
  return (
    <div
      className={classNames(className, styles.headerSearch)}
      onClick={() => {
        setSearchMode(true);
        if (searchMode && inputRef.current) {
          inputRef.current.focus();
        }
      }}
      onTransitionEnd={({ propertyName }) => {
        if (propertyName === 'width' && !searchMode) {
          setValue('');
          if (onVisibleChange) {
            onVisibleChange(searchMode);
          }
        }
      }}
    >
      <AutoComplete
        key="AutoComplete"
        className={inputClass}
        value={value}
        options={searchOptions}
        onChange={(v) => {
          setValue(v);
          setSearchOptions(() => {
            if (!v) return restProps.options;
            return (restProps.options || []).filter((ops: any) => ops?.value?.includes(v));
          });
        }}
      >
        <Input
          size="small"
          ref={inputRef}
          defaultValue={defaultValue}
          aria-label={placeholder}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (restProps.onSearch) {
                restProps.onSearch(value);
              }
            }
          }}
          onBlur={() => {
            setSearchMode(false);
          }}
        />
      </AutoComplete>
      <img
        className={styles['icon']}
        src={'https://cdnprod.tianhongjijin.com.cn/thfile/searchicon1652176612461.png'}
      />
    </div>
  );
};

export default HeaderSearch;
