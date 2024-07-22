import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const registerFunc = async (values: any) => {
    try {
      await axios.post("http://119.235.112.154:3003/api/v1/users/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate("/");
    } catch (error) {
      console.error("There was an error registering the user!", error);
    }
  };

  return (
    <div>
      <Form
        name="register"
        className="register-form"
        initialValues={{ remember: true }}
        onFinish={registerFunc}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            type="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
          Or{" "}
          <a
            href=""
            onClick={() => {
              navigate("/");
            }}
          >
            Back to login!
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
