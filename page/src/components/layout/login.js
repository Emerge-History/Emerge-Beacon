import React from 'react';
import styles from './login.less';


import { Button, Form, Input, Icon, notification } from 'antd';
const FormItem = Form.Item
import logo from '../../assets/logo.jpg';

// const args = {
//     message: '登录试试',
//     description: '账号: admin 密码: admin',
//     duration: 0,
// };
// setTimeout(()=>{
//     notification.open(args);
// }, 1000)

const Login = ({ logining, form, onLogin }) => {
  const { getFieldDecorator, validateFields, getFieldsValue } = form
  function handleSubmit (e) {
    e.preventDefault()
    validateFields((errors) => {
      if (!!errors) {
        return
      }
      onLogin(getFieldsValue())
    })
  }

  return (
      <div className={styles.container}>
        <div className={styles.box}>
        <div className={styles.title}>
            <img src={logo} width="50"/>
        </div>
        <Form horizontal onSubmit={handleSubmit}>
            <FormItem hasFeedback>
            <div className={styles.icon}><Icon type="user" /></div>
            {getFieldDecorator('account', {
                validate: [{
                rules: [
                    { required: true, message: '不能为空' }
                ],
                trigger: ['onBlur', 'onChange']
                }]
            })(
                <Input placeholder='账户' disabled={logining} />
            )}
            </FormItem>
            <FormItem hasFeedback>
            <div className={styles.icon}><Icon type="lock" /></div>
            {getFieldDecorator('password', {
                validate: [{
                rules: [
                    { required: true, message: '不能为空' }
                ],
                trigger: ['onBlur', 'onChange']
                }]
            })(
                <Input type='password' placeholder='密码' disabled={logining} />
            )}
            </FormItem>
            <FormItem hasFeedback>
            <Button type='primary' loading={logining} htmlType='submit'>
                登录
            </Button>
            </FormItem>
        </Form>
        </div>
        <p className={styles.copyright}>Ant Design 版权所有 © 2015 由蚂蚁金服体验技术部支持</p>
    </div>
  )
}

Login.propTypes = {
}

export default Form.create()(Login)

