import React, { memo, useCallback, useEffect, useState } from 'react';
import { Modal, Row, Col, Empty, Button } from 'antd';
const JsDiff = require('diff');
// 文件对比
interface propsType {
  record: any;
  visible: boolean;
  handleOnCancel: () => void;
}
const styleObj = {
  width: '97%',
  height: '700px',
  padding: '15px',
  border: '1px solid #ccc',
  backgroundColor: '#eee',
};
const FileContentDiff = (props: propsType) => {
  const { record } = props;
  const [errCount, setErrCount] = useState<number>(0);
  const [diffIndex, setDiffIndex] = useState(0);

  const judgeExistYesOrNo = useCallback((text: any) => {
    const str = text;
    const i = text?.indexOf('|Y|');
    if (i > 30 && i < 40) {
      //存在
      const endStr = '|\\\\\\</ETFVldRslt>\\\\\\|';

      return endStr.length + str.indexOf(endStr) + 1;
    }
    return -1;
  }, []);

  const getErrInfo = (errCounts: number, type?: string) => {
    if (errCounts > 0) {
      if (diffIndex === 0) {
        setDiffIndex(1);
        const t: any = document.getElementById('err0')?.offsetTop;
        const pre1: any = document.querySelector('#edit_pre_1');
        pre1.scrollTop = t;
      } else {
        setDiffIndex((diff) => {
          if (type === 'NEXT') {
            if (diff === errCounts) {
              return diff;
            }

            return diff + 1;
          }

          if (type === 'PREV') {
            if (diff === 1) {
              return diff;
            }

            return diff - 1;
          }
          return diff;
        });
      }
    }
  };

  const test1_scroll = () => {
    const _top: any = document.querySelector('#edit_pre_1')?.scrollTop;
    const _left: any = document.querySelector('#edit_pre_1')?.scrollLeft;
    const pre2: any = document.querySelector('#edit_pre_2');
    pre2.scrollTop = _top;
    pre2.scrollLeft = _left;
  };

  const test2_scroll = () => {
    const _top: any = document.querySelector('#edit_pre_2')?.scrollTop;
    const _left: any = document.querySelector('#edit_pre_2')?.scrollLeft;
    const pre1: any = document.querySelector('#edit_pre_1');
    pre1.scrollTop = _top;
    pre1.scrollLeft = _left;
  };

  const goPrevErr = () => {
    const t: any = document.getElementById(`err${diffIndex - 2}`)?.offsetTop;
    const pre1: any = document.querySelector('#edit_pre_1');
    pre1.scrollTop = t;
    getErrInfo(errCount, 'PREV');
  };

  const goNextErr = () => {
    const t: any = document.getElementById(`err${diffIndex}`)?.offsetTop;
    const pre1: any = document.querySelector('#edit_pre_1');
    pre1.scrollTop = t;
    getErrInfo(errCount, 'NEXT');
  };

  const goBottom = () => {
    const i = 0;
    const t: any = document.getElementById('err' + i)?.offsetTop;
    const pre1: any = document.querySelector('#edit_pre_1');
    pre1.scrollTop = t;
  };

  const goTop = () => {
    const i: number = errCount - 1;
    const t: any = document.getElementById('err' + i)?.offsetTop;
    const pre1: any = document.querySelector('#edit_pre_1');
    pre1.scrollTop = t;
  };

  const textchanges = () => {
    const pre1: any = document.querySelector('#edit_pre_1');
    const pre2: any = document.querySelector('#edit_pre_2');
    const data1 = record.fileContent;
    const data2 = record.contrastFileContent;
    let tarData1 = data1;
    let tarData2 = data2;
    let _errCount = 0;
    let errFlag = true;
    const isExistYes1 = judgeExistYesOrNo(data1);
    const isExistYes2 = judgeExistYesOrNo(data2);
    const times: any = (str: string, num: number) => {
      const _str = str;
      const _num = num - 1;
      return num > 1 ? str + times(_str, _num) : str;
    };
    const fragment = document.createDocumentFragment(),
      fragmentDeletions = document.createDocumentFragment();

    if (isExistYes1 > 0) {
      const str = data1.substr(0, isExistYes1);
      {
        tarData1 = data1.substr(isExistYes1);
        const color = 'grey';
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document.createTextNode(str.replace(/&nbsp;/g, '\u0020')));
        fragment.appendChild(span);
      }
      //另一个加三个空行
      const cts = str.split('\n').length - 1;
      const tarStr = times('\n', cts);
      {
        const color = 'grey';
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document.createTextNode(tarStr.replace(/&nbsp;/g, '\u0020')));
        fragmentDeletions.appendChild(span);
      }
    }
    if (isExistYes2 > 0) {
      const str = data2.substr(0, isExistYes1);
      {
        tarData2 = data2.substr(isExistYes2);
        const color = 'grey';
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document.createTextNode(str.replace(/&nbsp;/g, '\u0020')));
        fragmentDeletions.appendChild(span);
      }
      //另一个加三个空行
      const cts = str.split('\n').length - 1;
      const tarStr = times('\n', cts);
      {
        const color = 'grey';
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document.createTextNode(tarStr.replace(/&nbsp;/g, '\u0020')));
        fragment.appendChild(span);
      }
    }
    const diff = JsDiff.diffWordsWithSpace(tarData1, tarData2);
    diff.forEach((part: any) => {
      // green for additions, red for deletions
      // grey for common parts
      if (part.added) {
        const color = '#fff';
        const backColor = '#35d435';
        const span = document.createElement('span');
        span.style.color = color;
        span.style.backgroundColor = backColor;
        span.appendChild(document.createTextNode(part.value.replace(/&nbsp;/g, '\u0020')));
        if (errFlag) {
          errFlag = false;
          span.setAttribute('herf', 'err' + _errCount);
          span.setAttribute('id', 'err' + _errCount);
          _errCount++;
        }
        fragmentDeletions.appendChild(span);
      } else if (part.removed) {
        const color = '#fff';
        const backColor = '#ff6969';
        const span = document.createElement('span');
        span.style.color = color;
        span.style.backgroundColor = backColor;
        span.appendChild(document.createTextNode(part.value.replace(/&nbsp;/g, '\u0020')));
        if (errFlag) {
          errFlag = false;
          span.setAttribute('herf', 'err' + _errCount);
          span.setAttribute('id', 'err' + _errCount);
          _errCount++;
        }
        fragment.appendChild(span);
      } else {
        {
          const color = 'grey';
          const span = document.createElement('span');
          span.style.color = color;
          span.appendChild(document.createTextNode(part.value.replace(/&nbsp;/g, '\u0020')));
          fragmentDeletions.appendChild(span);
        }
        {
          const color = 'grey';
          const span = document.createElement('span');
          span.style.color = color;
          span.appendChild(document.createTextNode(part.value.replace(/&nbsp;/g, '\u0020')));
          fragment.appendChild(span);
        }
        errFlag = true;
      }
    });
    setErrCount(_errCount);
    pre1.appendChild(fragment);
    pre2.appendChild(fragmentDeletions);
    getErrInfo(_errCount);
  };

  useEffect(() => {
    if (props.record?.contrastFlag && props.visible) {
      setTimeout(() => textchanges(), 100);
    }
  }, [props.record, props.visible]);

  return (
    <Modal
      title={'文件对比'}
      centered
      destroyOnClose
      visible={props.visible}
      width={1200}
      footer={false}
      onCancel={() => {
        setDiffIndex(0);
        props.handleOnCancel();
      }}
    >
      {record.contrastFlag && (
        <>
          <Row style={{ marginBottom: 10 }}>
            <Col span={24}>
              {props.record?.fileName} &nbsp;({props.record?.filePath})：
            </Col>
          </Row>
          <Row style={{ display: errCount == 0 ? 'none' : '', marginBottom: 10 }}>
            <Col span={6}>
              共_<span style={{ color: '#f5222d' }}>{errCount}</span>_处不一致。当前第_
              <span style={{ color: '#f5222d' }}>{diffIndex}</span>_个
            </Col>
            <Col span={18}>
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  goBottom();
                  setDiffIndex(1);
                }}
                size={'small'}
                disabled={diffIndex <= 1}
              >
                第一个
              </Button>
              &nbsp;&nbsp;
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  goPrevErr();
                }}
                size={'small'}
                disabled={diffIndex <= 1}
              >
                上一个
              </Button>
              &nbsp;&nbsp;
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  goNextErr();
                }}
                size={'small'}
                disabled={diffIndex >= errCount}
              >
                下一个
              </Button>
              &nbsp;&nbsp;
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  goTop();
                  setDiffIndex(errCount);
                }}
                size={'small'}
                disabled={diffIndex >= errCount}
              >
                最后一个
              </Button>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={12}>
              <div>
                <pre
                  style={styleObj}
                  className={'display-span-code'}
                  id="edit_pre_1"
                  onScroll={() => {
                    test1_scroll();
                  }}
                ></pre>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <pre
                  style={styleObj}
                  className={'display-span-code'}
                  id="edit_pre_2"
                  onScroll={() => {
                    test2_scroll();
                  }}
                ></pre>
              </div>
            </Col>
          </Row>
        </>
      )}
      {!record.contrastFlag && <Empty />}
    </Modal>
  );
};
export default memo(FileContentDiff);
