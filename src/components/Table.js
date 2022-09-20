import { Button, Form, Popconfirm, Table, Radio, Select, Image } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { PatternFormat } from 'react-number-format';

const { Option } = Select;

const EditableContext = React.createContext(null);
const logo = [require('../asset/blank.png'), require('../asset/kbank.png'), require('../asset/kth.png')]

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export default function TableData() {
  const [count, setCount] = useState(3);
  const [Bank, setBank] = useState("");
  const [valueRadio, setValueRadio] = useState(1);
  const [rows, setRows] = useState(3)

  const onChangeRadio = (e) => {
    console.log('radio checked', e.target.value);
    setValueRadio(e.target.value);
    // return value
  };

  const handleChange = (value) => {
    setBank(value)
    console.log(value);
  };

  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      Default: <Radio.Group onChange={onChangeRadio} value={valueRadio}>
        <Radio value={1}></Radio>
      </Radio.Group>,
      bankName: <Select
        style={{
          width: 180,
        }}
        onChange={handleChange}
        defaultValue="Bank Name #1"
        >
        <Option value="Kasikorn Bank"><Image width={30} src ={logo[1]} preview={false}/>Kasikorn Bank</Option>
        <Option value="Krungthai Bank"><Image width={30} src ={logo[2]} preview={false}/>Krungthai Bank</Option>
        
      </Select>,
      bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_" />
    },
    {
      key: '2',
      Default: <Radio.Group onChange={onChangeRadio} value={valueRadio}>
        <Radio value={2}></Radio>
      </Radio.Group>,
      bankName: <Image.PreviewGroup><Select
        style={{
          width: 180,
        }}
        onChange={handleChange}
        defaultValue="Bank Name #2"
      >
        <Option value="Kasikorn Bank"><Image width={30} src ={logo[1]} preview={false}/>Kasikorn Bank</Option>
        <Option value="Krungthai Bank"><Image width={30} src ={logo[2]} preview={false}/>Krungthai Bank</Option>
      </Select></Image.PreviewGroup>,
      bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_" />
    },
  ]);


  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    setRows(rows - 1)
  };


  const defaultColumns = [
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
    {
      title: ' ',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Delete Account" onConfirm={() => handleDelete(record.key)}>
            <a><MinusCircleOutlined className="w-8 " /></a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    if (rows <= 5) {
      const newData = {
        key: count,
        Default: <Radio.Group onChange={onChangeRadio} value={valueRadio}>
          <Radio value={count}></Radio>
        </Radio.Group>,
        bankName: <Select
          style={{
            width: 180,
          }}
          onChange={handleChange}
          defaultValue={logo[0] +"Bank Name #"+ count}
        >
          <Option value="Kasikorn Bank"> Kasikorn Bank</Option>
          <Option value="Krungthai Bank">Krungthai Bank</Option>
        </Select>,
        bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_" />
      };
      setDataSource([...dataSource, newData]);
      
      setCount(count + 1);
      setRows(rows + 1)
    }
  };


  const components = {
    body: {
      row: EditableRow,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered={false}

        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
        className="w-1/2"
      />
      <div className="flex items-baseline	mt-7">
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
            borderRadius: 6,
          }}
          disabled={rows === 6 ? true : false}
        >
          <PlusOutlined /> Bank Account
        </Button>
        <div className="flex ml-6 text-gray-600">
          <div>Maximum</div>
          <span className="font-bold">5 Account</span>
          <div>/ User</div>
        </div>
      </div>
    </div>
  );
};

