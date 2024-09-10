export async function queryData(params: any) {
  console.log('queryData params ', params);
  // Data.UIComponents.push(params);
  // console.log('addItem lists ', Data.UIComponents);
  // console.log('createUiComponentUsingPOST params ', params);
  //   setTimeout(() => {
  if (params.url === 'testquery1') {
    return {
      success: true,
      data: {
        title: 'testquery1',
        key: 'test',
      },
    };
  }
  if (params.url === 'testquery2') {
    return {
      success: true,
      data: {
        title: 'testquery2',
        key: 'test',
      },
    };
  }
  if (params.url === 'testquery3') {
    return {
      success: true,
      data: {
        time: '2021-11-10',
        upDown: true,
        rate: '10%',
        value: '1.9023',
      },
    };
  }
  if (params.url === 'testquery3') {
    return {
      success: true,
      data: {
        title: 'testquery3',
        key: 'test',
      },
    };
  }

  return { success: false, data: null };
  // }, 1000);
}
