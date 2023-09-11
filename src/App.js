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
  Upload,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  addTaskAction,
  clearTaskAction,
  editTaskAction,
} from "./redux/taskReducer/taskAction";
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
  console.log(list);
  if (list) {
    return JSON.parse(localStorage.getItem("lists"));
  } else {
    return [];
  }
};
function App() {
  // const counter = useSelector((state) => state.tasks); // lấy data
  // const dispatch = useDispatch(); // đẩy data vào redux

  const [task, setTask] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [listState, setListState] = useState(getLocalItems());

  const [selectTask, setSelectTask] = useState(null);
  
  // add data to localStorage 
  useEffect( () => {
     localStorage.setItem('lists',JSON.stringify(listState));
  }, [listState]);

  // get data from localStorage 
  
    

  // const [list, setList] = useState([]);
  // useEffect(() => {
  //   if (counter.length > 0) {
  //     localStorage.setItem("toDoList", JSON.stringify(counter));
  //     console.log("true");
  //   }
  //   console.log("Counter", counter);
  // }, [counter]);
  // useEffect(() => {
  //   const storedList = JSON.parse(localStorage.getItem("toDoList"));
  //   setList(storedList || []);
  //   dispatch(addTaskAction(storedList));
  // }, [dispatch]);

  //  useEffect(() => {
  //    if (counter.length > 0) {
  //      localStorage.setItem("toDoList", JSON.stringify(counter));
  //      setListState(counter);
  //      console.log("true");
  //    }
  //  }, [counter]);
  const handleSubmit = (values) => {
    if (selectTask) {
      const updateState = {
        ...selectTask, // update
        piority: values.piority,
        number: values.number,
        time: values.time,
        status: values.status,
      };
      setListState([{ ...updateState }]); // update
      //dispatch(editTaskAction(updateState));
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
      console.log(values);
      // dispatch(addTaskAction(newState));
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
  // };
  // console.log(listState, "test");
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectTask(null);
    form2.resetFields();
  };
  // console.log("testst", selectTask);
  const removeTask = (indexToRemove) => {
    // indexToRemove => id
    setListState((prevItems) => {
      // prevItem : mảng ban đầu
      const newItems = [...prevItems]; // ...prevItems: lấy và nối các ptu ban đầu
      newItems.splice(indexToRemove, 1); // hàm splice để xóa ptu bắt đầu từ index( id)
      return newItems;
    });
    // dispatch(clearTaskAction(indexToRemove));
    // console.log(indexToRemove);
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
    // console.log(values);
  };
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
              <Input
                placeholder="Enter your new task"
                // value={task}
                // onChange={(e) => e.target.value}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add task
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="card">
          {listState.map((value, index) => {
            console.log(value.time);
            return (
              <Card
                className={
                  new Date() > value.time[1] && value.status !== "Finish"
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
                  <div className="edit" onClick={() => handleEdit(value)}>
                    <EditOutlined key="edit" />
                  </div>,
                  <div className="delete">
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      // onConfirm={() => {
                      //   removeTask(index); message.success("Delete successfully")
                      // }}
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
                  <p>Number participants: {value.number}</p>
                  {/* <p>{value.time}</p> 
                  <p>Start time : {value.time[0].month()}</p>
                  <p>End time : {value.time[1].format("DD-MM-YYYY")}</p> 
                  {new Date() > value.time[1] && value.status !== "Finish" ? (
                    <p className="overdue">Overdue</p>
                  ) : null} */ } 
                  <p>Status: {value.status}</p>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="parent-info">
          <Modal
            title={task}
            open={isModalOpen}
            // onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
          >
            <Form
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
              <Form.Item name="piority" label="Piority">
                <Select>
                  <Select.Option value="Normal">Normal</Select.Option>
                  <Select.Option value="Important">Important</Select.Option>
                  <Select.Option value="Urgent">Urgent</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="time" label="Time">
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
              <Form.Item name="status" label="Status">
                <Radio.Group>
                  <Radio value="Not done"> Not done </Radio>
                  <Radio value="In progress"> In progress </Radio>
                  <Radio value="Finish"> Finish </Radio>
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
