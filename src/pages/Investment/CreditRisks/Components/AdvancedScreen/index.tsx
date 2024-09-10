import { QueryBuilder } from 'react-querybuilder';
import { useState, useEffect } from 'react';
import 'react-querybuilder/dist/query-builder.css';
import './index.less';
import {
  AntDValueSelector,
  AntDValueEditor,
  AntDActionElement,
  AntDDragHandle,
  AntDNotToggle,
} from '@react-querybuilder/antd';

const controlElements = {
  addGroupAction: AntDActionElement,
  addRuleAction: AntDActionElement,
  cloneGroupAction: AntDActionElement,
  cloneRuleAction: AntDActionElement,
  combinatorSelector: AntDValueSelector,
  dragHandle: AntDDragHandle,
  fieldSelector: AntDValueSelector,
  notToggle: AntDNotToggle,
  operatorSelector: AntDValueSelector,
  removeGroupAction: AntDActionElement,
  removeRuleAction: AntDActionElement,
  valueEditor: AntDValueEditor,
};

const translations = {
  fields: {
    title: 'Fields',
    placeholderName: '~',
    placeholderLabel: '------',
    placeholderGroupLabel: '------',
  },
  operators: {
    title: 'Operators',
    placeholderName: '~',
    placeholderLabel: '------',
    placeholderGroupLabel: '------',
  },
  value: {
    title: 'Value',
  },
  removeRule: {
    label: 'x',
    title: 'Remove rule',
  },
  removeGroup: {
    label: 'x',
    title: 'Remove group',
  },
  addRule: {
    label: '添加规则',
    title: 'Add rule',
  },
  addGroup: {
    label: '添加组',
    title: 'Add group',
  },
  combinators: {
    title: 'Combinators',
  },
  notToggle: {
    label: 'Not',
    title: 'Invert this group',
  },
  cloneRule: {
    label: '⧉',
    title: 'Clone rule',
  },
  cloneRuleGroup: {
    label: '⧉',
    title: 'Clone group',
  },
  dragHandle: {
    label: '⁞⁞',
    title: 'Drag handle',
  },
  lockRule: {
    label: '🔓',
    title: 'Lock rule',
  },
  lockGroup: {
    label: '🔓',
    title: 'Lock group',
  },
  lockRuleDisabled: {
    label: '🔒',
    title: 'Unlock rule',
  },
  lockGroupDisabled: {
    label: '🔒',
    title: 'Unlock group',
  },
};

const controlClassnames = {
  removeGroup: 'bg_grey',
  removeRule: 'bg_grey',
  addRule: 'bg_grey',
  addGroup: 'bg_grey',
};
const operators = [
  { name: '=', label: '等于' },
  { name: '!=', label: '不等于' },
  { name: '<=', label: '小于等于' },
  { name: '>=', label: '大于等于' },
  { name: 'contains', label: '包含(like)' },
  { name: 'begins with', label: '开头是' },
  { name: 'ends with', label: '结尾是' },
  { name: 'does not contain', label: '不包含(like)' },
  { name: 'does not begin with', label: '开头不是' },
  { name: 'does not end with', label: '结尾不是' },
  { name: 'is null', label: '为空' },
  { name: 'is not null', label: '不为空' },
  { name: 'in', label: '包含(in)' },
  { name: 'not in', label: '不包含(in)' },
  { name: 'between', label: '在范围之内(between)' },
  { name: 'not between', label: '不在范围之内(between)' },
];

const combinators = [
  { name: 'and', label: '且' },
  { name: 'or', label: '或' },
];

function TransformField(list: any[]) {
  return list.map((item: any) => {
    return {
      label: item.alias,
      name: item.columnName || item.fieldName,
    };
  });
}
const Screen = ({
  field,
  filterStr,
  setFilterStr,
}: {
  field: any[];
  filterStr: any;
  setFilterStr: any;
}) => {
  const [ableBuilder, setAbleBuilder] = useState<boolean>(true);
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(field) && field?.length > 0) {
      setFields(() => TransformField(field));
      setAbleBuilder(false);
    } else {
      setFields([]);
      setAbleBuilder(true);
    }
  }, [field]);

  useEffect(() => {
    if (filterStr?.rules?.length) {
      setAbleBuilder(false);
    }
  }, [filterStr]);

  return (
    <QueryBuilder
      disabled={ableBuilder}
      controlElements={controlElements}
      translations={translations}
      combinators={combinators}
      controlClassnames={controlClassnames}
      operators={operators}
      fields={fields}
      query={filterStr}
      onAddRule={(rule: any) => ({ ...rule, valueSource: 'value' })}
      onQueryChange={(q) => setFilterStr(q)}
    />
  );
};
export default Screen;
