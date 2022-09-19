import { Button, Form, Input, Popconfirm, Table, Radio, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PatternFormat } from 'react-number-format';

const { Option } = Select;

const EditableContext = React.createContext(null);

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

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function TableData() {
  const [count, setCount] = useState(3);
  const [Bank, setBank] = useState(`Bank Name #${count}`);
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
        value = {"Bank Name #1"}
      >
        <Option value="Kasikorn Bank">Kasikorn Bank</Option>
        <Option value="Krungthai Bank">Krungthai Bank</Option>
      </Select>,
      bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_" />
    },
    {
      key: '2',
      Default: <Radio.Group onChange={onChangeRadio} value={valueRadio}>
        <Radio value={2}></Radio>
      </Radio.Group>,
      bankName: <Select
        style={{
          width: 180,
        }}
        onChange={handleChange}
        value = {"Bank Name #2"}
      >
        <Option value="Kasikorn Bank">Kasikorn Bank</Option>
        <Option value="Krungthai Bank">Krungthai Bank</Option>
      </Select>,
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
            <a><MinusCircleOutlined /></a>
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
          value = {Bank}
        >
          <Option value="Kasikorn Bank">Kasikorn Bank</Option>
          <Option value="Krungthai Bank">Krungthai Bank</Option>
        </Select>,
        bankAccountNo: <PatternFormat value="" valueIsNumericString format="####-#-#####-#" mask="_" placeholder="___-_-_____-_" />
      };
      setDataSource([...dataSource, newData]);
      setBank(`Bank Name #${count+1}`)
      setCount(count + 1);
      setRows(rows + 1)
    }
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
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
        handleSave,
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
      />
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }} 
        disabled = {rows === 6? true : false}
      >
        <PlusOutlined /> Bank Account
      </Button>
      <div>
        <div>Maximum</div>
        <span>5 Account</span>
        <div>/ User</div>
      </div>
    </div>
  );
};

