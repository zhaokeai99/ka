import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useBoolean, useControllableValue } from 'ahooks';
import { Tag } from 'antd';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import styles from './index.less';

const { CheckableTag } = Tag;

export interface TagSelectOptionProps {
  value: string | number;
  style?: React.CSSProperties;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
}

const TagSelectOption: React.FC<TagSelectOptionProps> & {
  isTagSelectOption: boolean;
} = ({ children, checked, onChange, value, disabled = false }) => {
  if (disabled) {
    return (
      <CheckableTag checked={!!checked} key={value} className={styles.disabled}>
        {children}
      </CheckableTag>
    );
  }
  return (
    <CheckableTag
      checked={!!checked}
      key={value}
      onChange={(state) => onChange && onChange(value, state)}
    >
      {children}
    </CheckableTag>
  );
};

TagSelectOption.isTagSelectOption = true;

type TagSelectOptionElement = React.ReactElement<TagSelectOptionProps, typeof TagSelectOption>;

const isTagSelectOption = (node: TagSelectOptionElement) =>
  node && node.type && (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption');

// 多选
export interface MultipleTagSelectProps {
  onChange?: (value: (string | number)[]) => void;
  expandable?: boolean;
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  style?: React.CSSProperties;
  hideCheckAll?: boolean;
  isDisabledAll?: boolean; // 全部禁止点击
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  Option?: TagSelectOptionProps;
  children?: TagSelectOptionElement | TagSelectOptionElement[];
}

export const MultipleSelect: FC<MultipleTagSelectProps> & { Option: typeof TagSelectOption } = (
  props,
) => {
  const {
    children,
    hideCheckAll = false,
    isDisabledAll = false,
    className,
    style,
    expandable,
    actionsText = {},
  } = props;
  const [expand, { toggle }] = useBoolean();
  const [value, setValue] = useControllableValue<(string | number)[]>(props);

  const getAllTags = () => {
    const childrenArray = React.Children.toArray(children) as TagSelectOptionElement[];
    const checkedTags = childrenArray
      .filter((child) => isTagSelectOption(child))
      .map((child) => child.props.value);
    return checkedTags || [];
  };

  const onSelectAll = (checked: boolean) => {
    let checkedTags: (string | number)[] = [];
    if (checked) {
      checkedTags = getAllTags();
    }
    setValue(checkedTags);
  };

  const handleTagChange = (tag: string | number, checked: boolean) => {
    const checkedTags: (string | number)[] = [...(value || [])];

    const index = checkedTags.indexOf(tag);
    if (checked && index === -1) {
      checkedTags.push(tag);
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    setValue(checkedTags);
  };

  const checkedAll = getAllTags().length === value?.length;
  const { expandText = '展开', collapseText = '收起', selectAllText = '全部' } = actionsText;

  const cls = classNames(styles.tagSelect, className, {
    [styles.hasExpandTag]: expandable,
    [styles.expanded]: expand,
  });

  const renderAllCheck = () => {
    if (hideCheckAll) return null;
    if (isDisabledAll) {
      return (
        <CheckableTag checked={checkedAll} key="tag-select-__all__" className={styles.disabled}>
          {selectAllText}
        </CheckableTag>
      );
    }
    return (
      <CheckableTag checked={checkedAll} key="tag-select-__all__" onChange={onSelectAll}>
        {selectAllText}
      </CheckableTag>
    );
  };

  return (
    <div className={cls} style={style}>
      {renderAllCheck()}
      {children &&
        React.Children.map(children, (child: TagSelectOptionElement) => {
          if (isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: value && value.indexOf(child.props.value) > -1,
              disabled: child.props.disabled || isDisabledAll || false,
              onChange: handleTagChange,
            });
          }
          return child;
        })}
      {expandable && (
        <a
          className={styles.trigger}
          onClick={() => {
            toggle();
          }}
        >
          {expand ? (
            <>
              {collapseText} <UpOutlined />
            </>
          ) : (
            <>
              {expandText}
              <DownOutlined />
            </>
          )}
        </a>
      )}
    </div>
  );
};
MultipleSelect.Option = TagSelectOption;

// 单选
export interface RadioTagSelectProps {
  onChange?: (value: string | number) => void;
  expandable?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  style?: React.CSSProperties;
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  isDisabledAll?: boolean; // 全部禁止点击
  className?: string;
  Option?: TagSelectOptionProps;
  children?: TagSelectOptionElement | TagSelectOptionElement[];
}

export const RadioSelect: FC<RadioTagSelectProps> & { Option: typeof TagSelectOption } = (
  props,
) => {
  const { children, className, style, expandable, isDisabledAll = false, actionsText = {} } = props;
  const { expandText = '展开', collapseText = '收起' } = actionsText;
  const [expand, { toggle }] = useBoolean();
  const [value, setValue] = useControllableValue<string | number>(props);

  const handleTagChange = (tag: string | number) => {
    setValue(tag);
  };

  const cls = classNames(styles.tagSelect, className, {
    [styles.hasExpandTag]: expandable,
    [styles.expanded]: expand,
  });

  return (
    <div className={cls} style={style}>
      {children &&
        React.Children.map(children, (child: TagSelectOptionElement) => {
          if (isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: value === child.props.value,
              disabled: child.props.disabled || isDisabledAll || false,
              onChange: handleTagChange,
            });
          }
          return child;
        })}
      {expandable && (
        <a
          className={styles.trigger}
          onClick={() => {
            toggle();
          }}
        >
          {expand ? (
            <>
              {collapseText} <UpOutlined />
            </>
          ) : (
            <>
              {expandText}
              <DownOutlined />
            </>
          )}
        </a>
      )}
    </div>
  );
};
RadioSelect.Option = TagSelectOption;
