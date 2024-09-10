const columnsMap = (data: any) => {
  return {
    MANAGER: [
      {
        title: '管理人名称',
        dataIndex: 'managerName',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '注册地址',
        dataIndex: 'managerRegisteredAddress',
        search: false,
      },
      {
        title: '证件类型',
        dataIndex: 'managerIdentityType',
        search: false,
      },
      {
        title: '营业执照号码/资质证书编号',
        dataIndex: 'managerIdentityNo',
        search: false,
      },
      {
        title: '组织机构代码',
        dataIndex: 'orgNo',
        search: false,
      },
      {
        title: '证件有效期',
        dataIndex: 'managerIdentityDate',
        search: false,
      },
      {
        title: '法人',
        dataIndex: 'legalName',
        search: false,
      },
      {
        title: '职务',
        dataIndex: 'managerduty',
        search: false,
      },
      {
        title: '证件类型',
        dataIndex: 'userIdentityType',
        search: false,
      },
      {
        title: '证件号码',
        dataIndex: 'userIdentityNo',
        search: false,
      },
      {
        title: '证件有效期',
        dataIndex: 'userIdentityDate',
        search: false,
      },
      {
        title: '被授权签字人',
        dataIndex: 'authSigner',
        search: false,
      },
      {
        title: '地区',
        dataIndex: 'area',
        search: false,
      },
      {
        title: '注册地区',
        dataIndex: 'rigisterArea',
        search: false,
      },
      {
        title: '境内外注册地区',
        dataIndex: 'inOutRigisterArea',
        search: false,
      },
      {
        title: '查询代理总账户账号',
        dataIndex: 'accountNo',
        search: false,
      },
      {
        title: '资产管理人客户编号',
        dataIndex: 'assetManagerCustNo',
        search: false,
      },
      {
        title: '机构类型',
        dataIndex: 'orgType',
        search: false,
      },
      {
        title: '注册资本',
        dataIndex: 'rigisterCapital',
        search: false,
      },
      {
        title: '经营范围',
        dataIndex: 'bussinessScope',
        search: false,
      },
      {
        title: '办公地址',
        dataIndex: 'busssinessAddress',
        search: false,
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        search: false,
      },
      {
        title: '资质证明',
        dataIndex: 'qualification',
        search: false,
      },
      {
        title: '股东',
        dataIndex: 'stockHolder',
        search: false,
      },
      {
        title: '股东证件类型',
        dataIndex: 'stockIdentityType',
        search: false,
      },
      {
        title: '股东证件号码',
        dataIndex: 'stockIdentityNo',
        search: false,
      },
      {
        title: '股东证件有效期',
        dataIndex: 'stockIdentityDate',
        search: false,
      },
    ],
    MANAGEROPERATOR: [
      {
        title: '姓名',
        dataIndex: 'userName',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '对应账户类型',
        dataIndex: 'accountType',
        search: false,
      },
      {
        title: '部门',
        dataIndex: 'department',
        search: false,
      },
      {
        title: '职务',
        dataIndex: 'duty',
        search: false,
      },
      {
        title: '电话',
        dataIndex: 'telephone',
        search: false,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        search: false,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        search: false,
      },
      {
        title: '地址',
        dataIndex: 'address',
        search: false,
      },
      {
        title: '邮编',
        dataIndex: 'postalCode',
        search: false,
      },
      {
        title: '传真号码',
        dataIndex: 'faxCode',
        search: false,
      },
      {
        title: '身份证文件类型',
        dataIndex: 'identityType',
        search: false,
      },
      {
        title: '证件号码',
        dataIndex: 'identityNo',
        search: false,
      },
      {
        title: '身份证有效期',
        dataIndex: 'identityDate',
        search: false,
      },
    ],
    TRUSTEE: [
      {
        title: '托管人名称',
        dataIndex: 'trustName',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '营业执照号码',
        dataIndex: 'bussinessNo',
        search: false,
      },
      {
        title: '组织机构代码',
        dataIndex: 'orgNo',
        search: false,
      },
      {
        title: '资产托管人客户编号',
        dataIndex: 'customNo',
        search: false,
      },
      {
        title: '资产托管关系分组编号',
        dataIndex: 'AssetRelationGroup',
        search: false,
      },
      {
        title: '资金资产托管关系分组编号',
        dataIndex: 'capitalRelationGroup',
        search: false,
      },
      {
        title: '债券业务操作代理总账户账号',
        dataIndex: 'boldAgentNo',
        search: false,
      },
      {
        title: '资金业务操作代理总账户账号',
        dataIndex: 'capitaloAgentNo',
        search: false,
      },
    ],
    TRUSTEEOPERATOR: [
      {
        title: '托管人',
        dataIndex: 'peratorName',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '对应账户类型',
        dataIndex: 'accountType',
        search: false,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        search: {
          transform: (value: any) => {
            return {
              option2: value,
            };
          },
        },
      },
      {
        title: '职务',
        dataIndex: 'duty',
        search: false,
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        search: false,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        search: false,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        search: false,
      },
      {
        title: '地址',
        dataIndex: 'address',
        search: false,
      },
      {
        title: '邮编',
        dataIndex: 'postalCode',
        search: false,
      },
      {
        title: '传真号码',
        dataIndex: 'faxCode',
        search: false,
      },
      {
        title: '身份证文件类型',
        dataIndex: 'identityType',
        search: false,
      },
      {
        title: '证件号码',
        dataIndex: 'identityNo',
        search: false,
      },
    ],
    LINK: [
      {
        title: '托管人',
        dataIndex: 'trusteeName',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        search: {
          transform: (value: any) => {
            return {
              option2: value,
            };
          },
        },
      },
      {
        title: '对应账户类型',
        dataIndex: 'accountType',
        search: false,
        valueType: 'select',
        request: () => data?.acctTypes,
        fieldProps: (form: any, { rowKey }) => {
          return {
            onChange: () => {
              form?.setFieldsValue({
                [rowKey]: {
                  linkType: undefined,
                  businessTopic: undefined,
                },
              });
            },
          };
        },
      },
      {
        title: '联系人类型',
        dataIndex: 'linkType',
        search: false,
        valueType: 'select',
        fieldProps: (form: any, { rowKey }) => {
          const val = form && form.getFieldValue([rowKey || '', 'accountType']);
          if (['银行间户-上清', '股东户']?.includes(val)) {
            return {
              disabled: true,
            };
          }
          return {
            options: data[val]?.options,
            onChange: () => {
              form?.setFieldsValue({
                [rowKey]: {
                  businessTopic: undefined,
                },
              });
            },
          };
        },
      },
      {
        title: '业务主题/类别',
        dataIndex: 'businessTopic',
        search: false,
        valueType: 'select',
        fieldProps: (form: any, { rowKey }) => {
          const accountType = form && form.getFieldValue([rowKey || '', 'accountType']);
          const linkType = (form && form.getFieldValue([rowKey || '', 'linkType'])) || '';
          if (
            accountType === '股东户' ||
            (accountType === '银行间户-外汇交易中心' && linkType === '本币交易系统管理员')
          ) {
            return {
              disabled: true,
            };
          }
          if (!linkType) {
            const obj: any = Object?.entries(data[accountType]?.businessTopicOptions || {});
            let arr: any = [];
            obj?.map((item: any) => {
              if (item[0] === '') {
                arr = item[1];
              }
            });
            return {
              options: arr,
            };
          } else {
            return {
              options: data[accountType]?.businessTopicOptions[linkType],
            };
          }
        },
      },
      {
        title: '机构名称',
        dataIndex: 'orgName',
        search: false,
      },
      {
        title: '部门',
        dataIndex: 'department',
        search: false,
      },
      {
        title: '分管领导',
        dataIndex: 'leader',
        search: false,
      },
      {
        title: '职务',
        dataIndex: 'duty',
        search: false,
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        search: false,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        search: false,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        search: false,
      },
      {
        title: '地址',
        dataIndex: 'address',
        search: false,
      },
      {
        title: '邮编',
        dataIndex: 'postalCode',
        search: false,
      },
      {
        title: '传真号码',
        dataIndex: 'faxCode',
        search: false,
      },
      {
        title: '职责范围',
        dataIndex: 'role',
        search: false,
      },
      {
        title: '身份证文件类型',
        dataIndex: 'identityType',
        search: false,
      },
      {
        title: '证件号码',
        dataIndex: 'identityNo',
        search: false,
      },
    ],
    EMAILADDRESS: [
      {
        title: '托管人/对接机构',
        dataIndex: 'dockOrg',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '对应账户类型',
        dataIndex: 'accountType',
        search: false,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        search: {
          transform: (value: any) => {
            return {
              option2: value,
            };
          },
        },
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        search: false,
      },
      {
        title: '地址',
        dataIndex: 'address',
        search: false,
      },
    ],
    FUNDMANAGER: [
      {
        title: '姓名',
        dataIndex: 'userName',
        fixed: 'left',
        search: {
          transform: (value: any) => {
            return {
              option1: value,
            };
          },
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
        search: false,
      },
      {
        title: '身份证文件类型',
        dataIndex: 'identityType',
        search: false,
      },
      {
        title: '证件号码',
        dataIndex: 'identityNo',
        search: false,
      },
      {
        title: '身份证有效期',
        dataIndex: 'identityDate',
        search: false,
      },
      {
        title: '职务',
        dataIndex: 'role',
        search: false,
      },
    ],
  };
};
export default columnsMap;
