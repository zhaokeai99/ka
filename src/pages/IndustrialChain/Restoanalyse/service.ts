import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 研报情绪/态度
export enum reportViewpointEnum {
  增持 = '增持',
  中性 = '中性',
  买入 = '买入',
  减持 = '减持',
}

// 研报来源
export const ratingInstituteEnum = {
  天风证券: { text: '天风证券' },
  山西证券: { text: '山西证券' },
  国泰君安: { text: '国泰君安' },
  长江证券: { text: '长江证券' },
  民生证券: { text: '民生证券' },
  中信证券: { text: '中信证券' },
  湘财证券: { text: '湘财证券' },
  华泰证券: { text: '华泰证券' },
  海通证券: { text: '海通证券' },
  华鑫证券: { text: '华鑫证券' },
  兴业证券: { text: '兴业证券' },
  开源证券: { text: '开源证券' },
  华西证券: { text: '华西证券' },
  德邦证券: { text: '德邦证券' },
  西南证券: { text: '西南证券' },
  华创证券: { text: '华创证券' },
  国海证券: { text: '国海证券' },
  国元证券: { text: '国元证券' },
  信达证券: { text: '信达证券' },
  国信证券: { text: '国信证券' },
  国金证券: { text: '国金证券' },
  浙商证券: { text: '浙商证券' },
  渤海证券: { text: '渤海证券' },
  中泰证券: { text: '中泰证券' },
  华安证券: { text: '华安证券' },
  中信建投: { text: '中信建投' },
  东北证券: { text: '东北证券' },
  招商证券: { text: '招商证券' },
  中银证券: { text: '中银证券' },
  平安证券: { text: '平安证券' },
  光大证券: { text: '光大证券' },
  银河证券: { text: '银河证券' },
  财信证券: { text: '财信证券' },
  东吴证券: { text: '东吴证券' },
  新时代证券: { text: '新时代证券' },
  申万宏源: { text: '申万宏源' },
  华金证券: { text: '华金证券' },
  东方证券: { text: '东方证券' },
  东海证券: { text: '东海证券' },
  广发证券: { text: '广发证券' },
  安信证券: { text: '安信证券' },
  首创证券: { text: '首创证券' },
  上海证券: { text: '上海证券' },
  太平洋证券: { text: '太平洋证券' },
  中航证券: { text: '中航证券' },
  东兴证券: { text: '东兴证券' },
  中原证券: { text: '中原证券' },
  国盛证券: { text: '国盛证券' },
  长城证券: { text: '长城证券' },
  万联证券: { text: '万联证券' },
  方正证券: { text: '方正证券' },
  长城国瑞证券: { text: '长城国瑞证券' },
  中邮证券: { text: '中邮证券' },
  东亚前海证券: { text: '东亚前海证券' },
  财通证券: { text: '财通证券' },
  申港证券: { text: '申港证券' },
  国联证券: { text: '国联证券' },
  西部证券: { text: '西部证券' },
  东莞证券: { text: '东莞证券' },
  红塔证券: { text: '红塔证券' },
  野村东方国际: { text: '野村东方国际' },
  国融证券: { text: '国融证券' },
  华福证券: { text: '华福证券' },
  中金公司: { text: '中金公司' },
  川财证券: { text: '川财证券' },
  克而瑞证券: { text: '克而瑞证券' },
  '招商证券(香港)': { text: '招商证券(香港)' },
  国都证券: { text: '国都证券' },
  招银国际: { text: '招银国际' },
  英大证券: { text: '英大证券' },
  万和证券: { text: '万和证券' },
  瑞银证券: { text: '瑞银证券' },
  浦银国际: { text: '浦银国际' },
  五矿证券: { text: '五矿证券' },
  华融证券: { text: '华融证券' },
  国开证券: { text: '国开证券' },
  爱建证券: { text: '爱建证券' },
  华龙证券: { text: '华龙证券' },
  华宝证券: { text: '华宝证券' },
  天风国际: { text: '天风国际' },
};

// 申万行业
export const ratingDtEnum = {
  光伏: { text: '光伏' },
  农林牧渔: { text: '农林牧渔' },
  基础化工: { text: '基础化工' },
  钢铁: { text: '钢铁' },
  有色金属: { text: '有色金属' },
  电子: { text: '电子' },
  食品饮料: { text: '食品饮料' },
  纺织服饰: { text: '纺织服饰' },
  轻工制造: { text: '轻工制造' },
  医药生物: { text: '医药生物' },
  公用事业: { text: '公用事业' },
  交通运输: { text: '交通运输' },
  房地产: { text: '房地产' },
  商贸零售: { text: '商贸零售' },
  社会服务: { text: '社会服务' },
  综合: { text: '综合' },
  汽车: { text: '汽车' },
  银行: { text: '银行' },
  非银金融: { text: '非银金融' },
  建筑材料: { text: '建筑材料' },
  建筑装饰: { text: '建筑装饰' },
  电力设备: { text: '电力设备' },
  机械设备: { text: '机械设备' },
  国防军工: { text: '国防军工' },
  计算机: { text: '计算机' },
  传媒: { text: '传媒' },
  通信: { text: '通信' },
  煤炭: { text: '煤炭' },
  石油石化: { text: '石油石化' },
  环保: { text: '环保' },
  美容护理: { text: '美容护理' },
  家用电器: { text: '家用电器' },
};

// 观点统计柱状图数据
export async function queryIndustryReportInfoToChart(params: any) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryReportInfoToChart,
    params,
  );

  return { success, data };
}

// list列表数据
export async function queryIndustryReportInfoLimit(params: any) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryReportInfoLimit,
    params,
  );

  return { success, data };
}
