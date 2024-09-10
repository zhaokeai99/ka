# 产品信息系统

This project is initialized with [Ant Design Pro](https://pro.ant.design).

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

## 添加左侧导航

- 打开 config/routes.ts 文件
- 按照里面的例子，添加类似下面内容

```
{
    path: '/test', // 路由路径
    name: 'test', // 国际化映射
    icon: 'smile',
    component: './PageTest', // 组件地址
},

```

- src/locales/zh-CN/menus.ts 添加 `menu.test` 来完成文字映射

```
'menu.test': '测试',
```

- src/pages/ 添加页面目录， 并且增加下面三个文件

```
src/pages/test
    service.ts // 数据请求接口
    data.d.ts // 类型定义文件
    index.tsx // 页面核心文件

```

进入到上面目录，

## 添加页面

- src/pages
