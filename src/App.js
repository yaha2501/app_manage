import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Tag,
  Upload,
  message,
} from "antd";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleTwoTone,
  HourglassTwoTone,
  PlusOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const getLocalItems = () => {
  let list = localStorage.getItem("lists");
  if (list) {
    return JSON.parse(list).map((item) => {
      const {
        time: [from, to], // khởi tạo biến time gồm 2 value: from, to
        ...other //  nhóm các phần tử còn lại
      } = item;
      return {
        ...other, // destructring mảng other ra thành các ptu riêng
        time: [dayjs(from), dayjs(to)], // ép kiểu cho biến time sang dayjs()
      };
    });
  } else {
    return [];
  }
};
function App() {
  const [task, setTask] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [listState, setListState] = useState(getLocalItems());

  const [id, setId] = useState(0);

  const [selectTask, setSelectTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(listState)); // add data to localStorage
  }, [listState]);

  const handleSubmit = (values) => {
    if (selectTask) {
      const updateState = {
        ...selectTask, // update
        piority: values.piority,
        number: values.number,
        time: values.time,
        status: values.status,
      };
      const newListState = [...listState];
      newListState[id] = updateState;
      setListState(newListState);
    } else {
      const newState = {
        id: listState.length,
        name: task,
        piority: values.piority,
        number: values.number,
        time: values.time,
        status: values.status,
      };
      setListState([...listState, newState]); // nối
    }
    form2.resetFields();
    setIsModalOpen(false);
  };
  const showModal = (value) => {
    setIsModalOpen(true);
    setTask(value.taskName);
    form1.resetFields();
  };
  // const handleOk = () => {
  //   // setIsModalOpen(true);
  //   localStorage.removeItem("toDoList");
  // }
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectTask(null);
    form2.resetFields();
  };
  const removeTask = (indexToRemove) => {
    // indexToRemove => id
    setListState((prevItems) => {
      // prevItem : mảng ban đầu
      const newItems = [...prevItems]; // ...prevItems: lấy và nối các ptu ban đầu
      newItems.splice(indexToRemove, 1); // hàm splice để xóa ptu bắt đầu từ index( id)
      return newItems;
    });
  };
  const confirm = (id) => {
    removeTask(id);
    message.success("Delete successfully");
  };
  const cancel = (id) => {
    console.log(id);
    message.error("No delete successfully");
  };
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const handleEdit = (values) => {
    setTask(values.name);
    setIsModalOpen(true);
    setSelectTask(values);
    const initialValues = {
      piority: values.piority,
      number: values.number,
      time: values.time,
      status: values.status,
    };
    form2.setFieldsValue(initialValues);
  };
  const Months = [
    ...new Set(listState.map((val) => val.time[0].format("MM"))), //lưu các tháng có trong mảng item
  ];
  return (
    <div className="parent">
      <div className="background">
        <h1 className="text-main">Work management</h1>
        <div className="parent-search">
          <Form onFinish={showModal} form={form1} className="form">
            <Form.Item
              name="taskName"
              rules={[
                { required: true, message: "Please input your name task" },
              ]}
            >
              <Input placeholder="Enter your new task" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="button-add">
                Add task
              </Button>
            </Form.Item>
          </Form>
        </div>
        {Months.sort((a, b) => dayjs(a, "MM") - dayjs(b, "MM")).map((month) => { // sắp xếp tháng
          return (
            <>
              <h1>Tháng {month}</h1>
              <div className="card">
                {listState
                  .filter((value) => value.time[0].format("MM") === month)
                  .sort((a, b) => a.time[0] - b.time[0]) //sắp xếp các item theo tháng bắt đầu từ bé đến lớn
                  .map((value, index) => {
                    return (
                      <>
                        <Card
                          className={
                            new Date() > value.time[1] &&
                            value.status !== "Finish"
                              ? "alerting" // ten className
                              : null
                          }
                          key={index}
                          title={value.name}
                          bordered={false}
                          style={{
                            width: 300,
                          }}
                          actions={[
                            <div
                              className="edit"
                              onClick={() => {
                                handleEdit(value);
                                setId(index);
                              }}
                            >
                              <EditOutlined key="edit" />
                            </div>,
                            <div className="delete">
                              <Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                onConfirm={() => confirm(index)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined key="delete" />
                              </Popconfirm>
                            </div>,
                          ]}
                        >
                          <div className="content">
                            <p>Piority: {value.piority}</p>
                            {/* <p>Number participants: {value.number}</p> */}
                            {/* <p>{value.time}</p> */}
                            <p>
                              Start time : {value.time[0].format("DD-MM-YYYY")}
                            </p>
                            <p>
                              End time : {value.time[1].format("DD-MM-YYYY")}
                            </p>
                            {new Date() > value.time[1] &&
                            value.status !== "Finish" ? (
                              <p className="overdue">Overdue</p>
                            ) : null}
                            <p>
                              Status:{" "}
                              {value.status === "Finish" ? (
                                <CheckCircleTwoTone twoToneColor={"#52c41a"} />
                              ) : value.status === "Not done" ? (
                                <ExclamationCircleTwoTone
                                  twoToneColor={"#dc143c"}
                                />
                              ) : (
                                <HourglassTwoTone spin />
                              )}{" "}
                              {value.status}
                            </p>
                          </div>
                        </Card>
                      </>
                    );
                  })}
              </div>
            </>
          );
        })}
        <div className="parent-info">
          <Modal
            title={task}
            open={isModalOpen}
            // onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
          >
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              form={form2}
              className="info-detail"
              style={{
                maxWidth: 600,
              }}
            >
              {/* <Form.Item name="ten" label="Task name">
                <Input value={task} />
              </Form.Item> */}
              <Form.Item
                name="piority"
                label="Piority"
                rules={[
                  { required: true, message: "Please input piority task" },
                ]}
              >
                <Select>
                  <Select.Option value="Normal">Normal</Select.Option>
                  <Select.Option value="Important">Important</Select.Option>
                  <Select.Option value="Urgent">Urgent</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: "Please input time task" }]}
              >
                <RangePicker />
              </Form.Item>
              <Form.Item name="number" label="Number of participants">
                <InputNumber />
              </Form.Item>
              <Form.Item name="description" label="Description task">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Upload document"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload action="/upload.do" listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Please input status task" },
                ]}
              >
                <Radio.Group>
                  <Radio value="Not done">
                    <Tag color="red">Not done</Tag>
                  </Radio>
                  <Radio value="In progress">
                    <Tag color="blue">In progress</Tag>
                  </Radio>
                  <Radio value="Finish">
                    <Tag color="green">Finish </Tag>
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  OK
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
export default App;
