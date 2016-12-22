import React from 'react';
import { Icon, Tabs, Button, Table, Popconfirm, message, Input, Form } from 'antd';
import styles from './tab.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;





const Tab = ({ onLogout, tabs, beacons, changeCur, cur, deleteGroup, updateGroup, addGroup, form, addDevice, deleteDevice, selected, onSelect }) => {

  const handleClick = (id) => {
    changeCur(id);
  }

  const { getFieldDecorator, validateFields } = form;

  const form1 =  <Form inline>
  <FormItem hasFeedback>
    {getFieldDecorator('groupName', {
      validateTrigger: ['onChange', 'onBlur'],
      rules: [{ required: true, message:'不能为空' }],
    })(
      <Input placeholder="输入分组名" size="small"/>
    )}
    </FormItem>
  </Form>;

  const form2 =  <Form inline>
  <FormItem hasFeedback>
    {getFieldDecorator('groupNewName', {
      validateTrigger: ['onChange', 'onBlur'],
      rules: [{ required: true, message:'不能为空' }],
    })(
      <Input placeholder="输入新分组名" size="small"/>
    )}
    </FormItem>
  </Form>;

  const form3 =  <Form inline>
  <FormItem hasFeedback>
    {getFieldDecorator('deviceId', {
      validateTrigger: ['onChange', 'onBlur'],
      rules: [{ required: true, message:'不能为空' }],
    })(
      <Input placeholder="输入新设备名" size="small"/>
    )}
    </FormItem>
  </Form>;

  const hasSelected = selected.length > 0;

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const deviceIdentifiers = selectedRowKeys.map((key) => {
        return {device_id: parseInt(key)}
      })
      onSelect(deviceIdentifiers);
    },
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
  };

  const columns = [{
    title: '设备ID',
    dataIndex: 'device_id',
    key: 'device_id',
  }, {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment',
  }
  ,{
    title: 'major',
    dataIndex: 'major',
    key: 'major',
  }, {
    title: 'minor',
    dataIndex: 'minor',
    key: 'minor',
  }, {
    title: 'uuid',
    dataIndex: 'uuid',
    key: 'uuid',
  }];


  const operations = <div className={styles.head}>
      <Popconfirm placement="left" title={'必须确定该分组下没有设备，否则删除失败'} onConfirm={() => {
        deleteGroup();
      }} okText="确定" cancelText="取消">
        <Button type="ghost">删除分组</Button>
      </Popconfirm>

      <Popconfirm placement="left" title={form2} onConfirm={ () => {
        validateFields((err, values) => {
          if (!err.groupNewName) {
            const { groupNewName } = values;
            updateGroup(groupNewName);
          } else {
            message.error('分组名不能为空');
          }
        });
      }} okText="确定" cancelText="取消">
        <Button type="ghost">分组重命名</Button>
      </Popconfirm>

      <Popconfirm placement="left" title={form1} onConfirm={ () => {
        validateFields((err, values) => {
          if (!err.groupName) {
            const { groupName } = values;
            addGroup(groupName);
          } else {
            message.error('分组名不能为空');
          }
        });
      }} okText="确定" cancelText="取消">
        <Button type="ghost">新增分组</Button>
      </Popconfirm>
  </div>;

  return (
    <div className={styles.container}>
      <div className={styles.w}>
      
        <header>
          <div onClick={onLogout}>登出</div>
        </header>
        <div className={styles.tabs}>
          <Tabs 
          activeKey={cur}
          tabBarExtraContent={operations} 
          onTabClick={handleClick}>
          {
            tabs.map((tab) => {
              return <TabPane tab={tab.group_name} key={tab.group_id}></TabPane>
            })
          }
          </Tabs>   

          <div className={styles.button}>
            <Popconfirm placement="right" title={'确定删除选中设备？'} onConfirm={() => {
              deleteDevice();
            }} okText="确定" cancelText="取消">
              <Button type="primary" icon="delete" disabled={!hasSelected}>删除</Button>
            </Popconfirm>
            <Popconfirm placement="left" title={form3} onConfirm={() => {

              validateFields((err, values) => {
                if (!err.deviceId) {
                  const { deviceId } = values;
                  addDevice(deviceId);
                } else {
                  message.error('分组名不能为空');
                }
              });


              
            }} okText="确定" cancelText="取消">
              <Button type="primary" icon="plus-square-o">添加</Button>
            </Popconfirm>
          </div>
          <Table
            bordered
            size="small"
            rowSelection={rowSelection} 
            columns={columns} 
            dataSource={beacons} />

        </div>

      </div>

    </div>
  );
};

Tab.propTypes = {
};

export default Form.create()(Tab);
