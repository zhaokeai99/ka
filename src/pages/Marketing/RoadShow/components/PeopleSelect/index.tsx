import React, { useState, useCallback, useEffect } from 'react';
import { Select, Tag, Popover } from 'antd';
import { debounce as _debounce } from 'lodash';
import { PARTICIPANT_TYPE } from '../../constant';
import { queryContactByKey, queryGroupDetail } from '../../service';

const { Option } = Select;
// 这里需要根据list item type来确认是不是群组
const getItem = (value, list) => {
  if (value && list) {
    for (const item of list) {
      if (item && value === item.participantAccount) {
        return item;
      }
    }
  }
  return {};
};

// 这里传入的是上次搜索的数据列表，每次变化一个元素，取最后一个即可
const getSelectPeople = (values, list) => {
  const addList = [];
  if (values && values.length > 0 && list && list.length > 0) {
    const element = values[values.length - 1];
    if (element) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].participantAccount === element) {
          addList.push(list[i]);
        }
      }
    }
  }

  return addList;
};

// 将传入值转化成select可以展示的入参value
const getSelectValue = (values) => {
  const valueList = [];
  if (values && values.length) {
    values.forEach((element) => {
      if (element && element.participantAccount) {
        valueList.push(element.participantAccount);
      }
    });
  }
  return valueList;
};

// 删除datas其中没有的元素
const deleteSelectList = (values, list) => {
  const newList = [];
  if (values && values.length > 0 && list && list.length > 0) {
    values.forEach((element) => {
      if (element) {
        for (let i = 0; i < list.length; i++) {
          if (element && list[i] && list[i].participantAccount === element) {
            newList.push(list[i]);
            break;
          }
        }
      }
    });
  }
  return newList;
};

// 这里因为select能控制的数据有限，需要缓存起来选中的数据的完整信息，包含类型。在渲染时需要加展开标签。
// options 数据源应该包含已经选择的加搜索结果拼接起来才行，初始值就用外边传进来
const PeopleSelect: React.FC<any> = (props = {}) => {
  const { value, onChange, placeholder, disabled, noBordered, supportGroup, defaultSelect } = props;
  // supportGroup 外部传入，是否支持组搜索添加
  const [selectList, setSelectList] = useState(value || []);
  const [searchList, setSearchList] = useState(value || []);

  useEffect(() => {
    setSelectList(value || [].concat(defaultSelect || []));
    setSearchList(value || [].concat(defaultSelect || []));
  }, [value]);

  useEffect(() => {
    if (onChange && defaultSelect) {
      onChange([].concat(defaultSelect || []));
    }
  }, []);

  const handleSearch = useCallback(
    _debounce((searchWord) => {
      const params = {
        searchWord,
        queryGroup: supportGroup,
      };

      queryContactByKey(params)
        .then((res) => {
          if (res) {
            const { ehrUserInfos, ehrGroupInfos } = res;
            const searchListNew = [];
            if (ehrUserInfos && ehrUserInfos.length > 0) {
              ehrUserInfos.forEach((element) => {
                if (element && element.c_personname) {
                  searchListNew.push({
                    participantType: PARTICIPANT_TYPE.PEOPLE,
                    participantName: element.c_personname,
                    participantAccount: element.username,
                  });
                }
              });
            }
            if (supportGroup) {
              if (ehrGroupInfos && ehrGroupInfos.length > 0) {
                ehrGroupInfos.forEach((elementg) => {
                  if (elementg && elementg.department_name) {
                    searchListNew.push({
                      participantType: PARTICIPANT_TYPE.GROUP,
                      participantName: elementg.department_name,
                      participantAccount: elementg.department_code,
                    });
                  }
                });
              }
            }
            const list = searchListNew.concat(selectList);
            if (list.length === 0) {
              list.push({
                participantType: PARTICIPANT_TYPE.PEOPLE,
                participantName: searchWord,
                participantAccount: searchWord, // 非公司人员，无账户信息
              });
            }
            setSearchList(list);
          }
        })
        .catch((e) => console.log(e));
    }, 300),
    [supportGroup],
  );

  const tagRender = useCallback(
    (prop) => {
      const { label, value: values, closable, onClose } = prop;
      const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };
      const item = getItem(values, selectList);
      const content =
        item &&
        item.roadShowParticipants &&
        item.roadShowParticipants.map((item1) => {
          return <div>{item1.participantName || '未知'}</div>;
        });
      if (item.participantType === PARTICIPANT_TYPE.GROUP) {
        return (
          <Popover content={content} title="所有成员">
            <Tag
              color={'red'}
              onMouseDown={onPreventMouseDown}
              closable={closable}
              onClose={onClose}
              style={{ marginRight: 3 }}
            >
              {label}
            </Tag>
          </Popover>
        );
      } else {
        return (
          <Tag
            // color={'red'}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
          >
            {label}
          </Tag>
        );
      }
    },
    [selectList],
  );

  const selectChange = useCallback(
    (datas) => {
      let newSelect;
      let queryGroupKeyword = '';
      if (datas.length > selectList.length) {
        newSelect = selectList.concat(getSelectPeople(datas, searchList));
        if (
          newSelect &&
          newSelect.length > 0 &&
          newSelect[newSelect.length - 1] &&
          newSelect[newSelect.length - 1].participantType === PARTICIPANT_TYPE.GROUP
        ) {
          queryGroupKeyword = newSelect[newSelect.length - 1].participantName;
        }
      } else {
        newSelect = deleteSelectList(datas, selectList);
      }

      if (queryGroupKeyword) {
        if (
          newSelect &&
          newSelect.length > 0 &&
          newSelect[newSelect.length - 1] &&
          newSelect[newSelect.length - 1].participantType === PARTICIPANT_TYPE.GROUP
        ) {
          queryGroupDetail({ searchWord: queryGroupKeyword })
            .then((res) => {
              if (res) {
                const { ehrUserInfos } = res;
                newSelect[newSelect.length - 1].roadShowParticipants = [];
                if (ehrUserInfos && ehrUserInfos.length > 0) {
                  ehrUserInfos.forEach((element) => {
                    if (element && element.c_personname) {
                      newSelect[newSelect.length - 1].roadShowParticipants.push({
                        participantType: PARTICIPANT_TYPE.PEOPLE,
                        participantName: element.c_personname,
                        participantAccount: element.username,
                      });
                    }
                  });
                }
              }

              setSelectList(newSelect);
              if (onChange) {
                onChange(newSelect);
              }
            })
            .catch((e) => console.log(e));
        }
      } else {
        setSelectList(newSelect);
        if (onChange) {
          onChange(newSelect);
        }
      }
    },
    [selectList, searchList],
  );

  return (
    <Select
      mode="multiple"
      showSearch
      value={getSelectValue(selectList)}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={selectChange}
      notFoundContent={null}
      tagRender={tagRender}
      disabled={disabled}
      bordered={!noBordered}
    >
      {(searchList || []).map((item) => {
        return <Option value={item.participantAccount}>{item.participantName}</Option>;
      })}
    </Select>
  );
};

export default PeopleSelect;
