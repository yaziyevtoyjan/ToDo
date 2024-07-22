import React, { useState } from "react";
import { LockOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginFunc = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://119.235.112.154:3003/api/v1/users/login",
        { 
          username: values.username,
          password: values.password,
        }
      );
      const token = response.data.token;
      Cookies.set("token", token);
      navigate("/userTasks");
    } catch (error) {
      console.error("There was an error logging in!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={loginFunc}
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
        <Button type="primary" htmlType="submit" className="login-form-button">
          {loading ? spinIcon : "Log in"}
        </Button>
        Or{" "}
        <a
          href=""
          onClick={() => {
            navigate("/register");
          }}
        >
          Register now!
        </a>
      </Form.Item>
    </Form>
  );
};

export default Login;
