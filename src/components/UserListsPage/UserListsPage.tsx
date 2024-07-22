import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Input, Layout, Menu, theme, List, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import "./UserListsPage.css";

interface taskType{
  uuid: string;
  checked: boolean;
  text: string;
}

interface listsType {
  uuid: string;
  name: string;
}

const { Header, Sider, Content } = Layout;

const UserListsPage: React.FC = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const [listUuid, setListUuid] = useState<string>("");
  const [data, setData] = useState();

  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<listsType[]>([]);
  const [getIt, setGetIt] = useState<string>("");
  const [newListName, setNewListName] = useState<string>("");
  const [saveList, setSaveList] = useState<string>("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const fetchLists = async () => {
    await axios
      .get("http://119.235.112.154:3003/api/v1/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const items = res.data.map((item: listsType) => ({
          label: item.name,
          key: item.uuid,
          onClick: async () => {
            await axios
              .get(
                `http://119.235.112.154:3003/api/v1/lists/${item.uuid}/tasks`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                console.log(res.data);
                setData(res.data);
              });
            setGetIt("");
            setListUuid(item.uuid);
          
            setSaveList(item.name);
          },
        }));
        setItems(items);
      });
  };

  const editList = async () => {
    await axios.put(
      `http://119.235.112.154:3003/api/v1/lists/${listUuid}`,
      {
        "name": getIt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setGetIt("");
    fetchLists();
  };

  const deleteList = async () =>{
    await axios.delete(`http://119.235.112.154:3003/api/v1/lists/${listUuid}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    fetchLists();
  }

  const deleteTask = async (item: string) => {
    await axios
      .delete(`http://119.235.112.154:3003/api/v1/tasks/${item}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchLists();
  };

  const addList = async () => {
    await axios
      .post(
        "http://119.235.112.154:3003/api/v1/lists",
        {
          name: newListName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
    fetchLists();
    setNewListName("");
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["2"]}
          items={[
            {
              key: "1",
              label: "Tasks",
              onClick: () => {
                navigate("/userTasks");
              },
            },
            {
              key: "2",
              label: "Lists",
            },
          ]}
        />
      </Sider>
      <Layout style={{ width: "100%" }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="addList">
            <Input
              placeholder="Add a new list..."
              onChange={(event) => {
                setNewListName(event.target.value);
              }}
              value={newListName}
            ></Input>
            <Button type="primary" className="addBtn" onClick={addList}>
              Add list
            </Button>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
          {listUuid != "" ? (
            <div className="list_edit_del">
              <div className="edit_div">
                <Input
                  placeholder="Edit the list name here..."
                  onClick={() => {
                    setGetIt(saveList);
                  }}
                  value={getIt}
                  onChange={(event) => {
                    setGetIt(event.target.value);
                  }}
                ></Input>
                <Button className="edit_btn" onClick={editList}>Edit list</Button>
              </div>
              <Button className="del_btn" onClick={deleteList}>Delete list</Button>
            </div>
          ) : (
            <div></div>
          )}
          {listUuid != "" ? (
            <div className="divTasks">
              <List
                bordered
                dataSource={data}
                style={{ width: "100%" }}
                renderItem={(item: taskType) => (
                  <div className="antd_list">
                    <div className="list_left">
                      <List.Item>
                        <Checkbox checked={item.checked}></Checkbox>
                      </List.Item>
                      <List.Item>{item.text}</List.Item>
                    </div>
                    <List.Item
                      className="list_right"
                      actions={[
                        <EditOutlined
                          className="edit_btn1"
                          onClick={() => {}}
                        ></EditOutlined>,
                        <DeleteOutlined className="del_btn1" onClick={() => {deleteTask(item.uuid)}}></DeleteOutlined>,
                      ]}
                    ></List.Item>
                  </div>
                )}
              ></List>
            </div>
          ) : (
            ""
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserListsPage;
