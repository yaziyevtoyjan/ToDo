import { Button, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserTasksPage.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

interface dataSourceType {
  tasks: string;
  completed: boolean;
  uuid: string;
  List: {
    name: string;
  };
}

interface taskType {
  uuid: string;
  text: string;
  List: {
    uuid: string;
  };
  completed: string;
}

interface optionType {
  name: string;
  uuid: string;
}

const UserTasksPage = () => {
  const navigate = useNavigate();
  
    const [options, setOptions] = useState<optionType[]>([]);
  const [dataSource, setDataSource] = useState<dataSourceType[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [listId, setListId] = useState<string>("");

  const [listName, setListName] = useState<string>("");
  const [saveTask, setSaveTask] = useState<string>("");

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [listUuid, setListUuid] = useState<string>("");
  const [taskUuid, setTaskUuid] = useState<string>("");
  const [completed, setCompleted] = useState<string>("");

  const [bool, setBool] = useState<boolean>(true);

  const [messageApi, contextHolder] = message.useMessage();
  const token = Cookies.get("token");

  const addTaskHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleListId = (value: string, obj: { uuid: string }) => {
    setListId(obj.uuid);
    setListName(value);
  };

  const columns = [
    {
      title: "Tasks",
      dataIndex: "text",
    },
    {
      title: "Completed?",
      dataIndex: "completed",
    },
    {
      title: "Belonging list name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render: (record: taskType) => {
        return (
          <div>
            <EditOutlined
              className="edit"
              onClick={() => {
                console.log(record);
                setTaskUuid(record.uuid);
                setSaveTask(record.text);
                setModalOpen(true);
                setListUuid(record.List.uuid);
                setCompleted(record.completed);
              }}
            />
            <DeleteOutlined
              className="del"
              onClick={() => {
                deleteTask(record);
              }}
            />
          </div>
        );
      },
    },
  ];

  const editTask = async () => {
    await axios
      .put(
        `http://119.235.112.154:3003/api/v1/tasks/${taskUuid}`,
        {
          text: saveTask,
          completed: completed == "No" ? false : true,
          listUuid: listUuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Task edited successfully!",
        });
      });
    setModalOpen(false);
    fetchData();
  };

  const deleteTask = async (record: taskType) => {
    await axios
      .delete(`http://119.235.112.154:3003/api/v1/tasks/${record.uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Task deleted successfully!",
        });
      });
    fetchData();
  };

  const fetchData = async () => {
    await axios
      .get("http://119.235.112.154:3003/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const dataSource = res.data.map((item: dataSourceType) => ({
          ...item,
          key: item.uuid,
          name: item.List?.name,
          completed: item.completed == true ? "Yes" : "No",
        }));
        setDataSource(dataSource);
      });

    await axios
      .get("http://119.235.112.154:3003/api/v1/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const options = res.data.map((item: optionType) => ({
          ...item,
          key: item.uuid,
          label: item.name,
          value: item.name,
        }));
        setOptions(options);
      });
  };

  const addingTask = async () => {
    if (newTask.trim() == "") {
      if (bool) {
        setBool(false);
        messageApi.open({
          type: "warning",
          content: "Please enter task",
          duration: 2,
        });
        setTimeout(() => {
          setBool(true);
        }, 2000);
      }
    } else if (listId == "") {
      messageApi.open({
        type: "warning",
        content: "Please select list",
      });
    } else {
      await axios
        .post(
          "http://119.235.112.154:3003/api/v1/tasks",
          {
            text: newTask,
            completed: false,
            listUuid: listId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Task added successfully",
          });
          setNewTask("");
          setListName("");
          setListId("");
        });
    }

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <Layout style={{height: "100vh"}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                label: "Tasks",
              },
              {
                key: "2",
                label: "Lists",
                onClick: () => {
                  navigate("/userLists")
                },
              },
            ]}
          />
        </Sider>
        <Layout>
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
            <div className="Insebu">
              <Input
                value={newTask}
                placeholder="Enter the Tasks"
                className="inp"
                onChange={addTaskHandler}
              ></Input>
              <Select
                className="sel"
                value={listName}
                placeholder="Please select list"
                options={options}
                onChange={handleListId}
              />
              <Button
                type={"primary"}
                onClick={() => {
                  addingTask();
                }}
              >
                Add button
              </Button>
            </div>
            <Table columns={columns} dataSource={dataSource}></Table>
            <Modal
              open={modalOpen}
              centered
              onCancel={() => {
                setModalOpen(false);
              }}
              onOk={editTask}
              title="Edit the task name"
            >
              <Input
                value={saveTask}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSaveTask(event.target.value);
                }}
              ></Input>
            </Modal>
          </Content>
        </Layout>
      </Layout>
      {contextHolder}
      {/* <Menu1></Menu1> */}
    </div>
  );
};

export default UserTasksPage;
