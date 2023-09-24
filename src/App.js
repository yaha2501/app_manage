import "./App.css";
import React, { useState } from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Tag,
    Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TaskItem from "./components/TaskItem/TaskItem";
import { addTask } from "./redux/taskSlice";
import randomid from "randomid";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

function App() {
    const taskList = useSelector((state) => state.task.taskList); // lấy taskList từ store
    const dispatch = useDispatch(); // hàm dispatch action

    const [task, setTask] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const showModalAddTask = (value) => {
        setIsModalOpen(true);
        setTask(value.taskName);
        form1.resetFields();
    };

    const handleAddTask = (taskData) => {
        // dispatch action addTask với param lần lượt là: nội dung task, tên task, ID task (khởi tạo với hàm random "3" là số ký tự của chuỗi random trả về)
        dispatch(
            addTask({
                ...taskData,
                name: task,
                taskID: randomid(3),
            })
        );
        setIsModalOpen(false);
        form2.resetFields();
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
        form2.resetFields();
    };

    return (
        <div className="parent">
            <h1 className="text-main">Work management</h1>

            {/* Add task section */}
            <div className="parent-search">
                <Form onFinish={showModalAddTask} form={form1} className="form">
                    <Form.Item
                        name="taskName"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name task",
                            },
                        ]}>
                        <Input placeholder="Enter your new task" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add task
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            {/* Modal add task */}
            <Modal
                title={task}
                open={isModalOpen}
                okText="Add"
                onOk={() => form2.submit()}
                onCancel={handleCancelModal}>
                <Form onFinish={handleAddTask} form={form2}>
                    <Form.Item name="piority" label="Piority">
                        <Select>
                            <Select.Option value="Normal">Normal</Select.Option>
                            <Select.Option value="Important">
                                Important
                            </Select.Option>
                            <Select.Option value="Urgent">Urgent</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="time" label="Time">
                        <RangePicker format={"DD/MM/YYYY"} />
                    </Form.Item>
                    <Form.Item name="number" label="Number of participants">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="description" label="Description task">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Upload document" name="file">
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card">
                            <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}>
                                    Upload
                                </div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Radio.Group>
                            <Radio value="Not done">
                                <Tag color="red">Not done</Tag>
                            </Radio>
                            <Radio value="In progress">
                                <Tag color="blue">In progress</Tag>
                            </Radio>
                            <Radio value="Finish">
                                <Tag color="green">Finish</Tag>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Task list section  */}
            <div className="card">
                {taskList.map((value, index) => {
                    return <TaskItem TaskData={value} key={index} />;
                })}
            </div>
        </div>
    );
}
export default App;
