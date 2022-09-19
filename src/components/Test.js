import { Table, Select, Radio, Button } from 'antd';
import React, { useState } from 'react';
import { PatternFormat } from 'react-number-format';

const { Option } = Select;

export default function Test() {
  const [cities, setCities] = useState();
  const [value, setValue] = useState(1);
  
  const handleChange = (value) => {
    setCities(value)
    console.log(value);
  };

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  
  const dataSource = [
    {
      key: '1',
      Default: <Radio.Group onChange={onChange} value={value}>
        <Radio value={1}></Radio>
      </Radio.Group>,
      bankName: <Select
        style={{
          width: 180,
        }}
        onChange={handleChange}
      >
        <Option value="Kasikorn Bank">Kasikorn Bank</Option>
        <Option value="Krungthai Bank">Krungthai Bank</Option>
      </Select>,
      bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_"/>,
    },
    {
      key: '2',
      Default: <Radio.Group onChange={onChange} value={value}>
        <Radio value={2}></Radio>
      </Radio.Group>,
      bankName: <Select
        style={{
          width: 180,
        }}
        onChange={handleChange}
      >
        <Option value="Kasikorn Bank">Kasikorn Bank</Option>
        <Option value="Krungthai Bank">Krungthai Bank</Option>
      </Select>,
      bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_"/>
      ,
    },
  ];

  const columns = [
    {
      title: 'Default',
      dataIndex: 'Default',
      key: 'Default',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: 'Bank Account No.',
      dataIndex: 'bankAccountNo',
      key: 'bankAccountNo',
    },
  ];

  return (
    <div>
      <Table dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
      />


    </div>
  )
}