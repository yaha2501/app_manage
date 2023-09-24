import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    FileOutlined,
} from "@ant-design/icons";
import {
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
} from "antd";
import {
    LoadingOutlined,
    HourglassOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import "./TaskItem.css";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { deleteTask, editTask } from "../../redux/taskSlice";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
const { RangePicker } = DatePicker;

function TaskItem({ TaskData }) {
    const [form2] = Form.useForm();
    const dispatch = useDispatch();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);
    const fields = [
        {
            name: ["name"],
            value: TaskData.name,
        },
        {
            name: ["time"],
            value: [dayjs(TaskData.time[0]), dayjs(TaskData.time[1])],
        },
        {
            name: ["number"],
            value: TaskData.number,
        },
        {
            name: ["description"],
            value: TaskData.description,
        },
        {
            name: ["file"],
            value: TaskData?.file,
        },
        {
            name: ["status"],
            value: TaskData.status,
        },
        {
            name: ["taskID"],
            value: TaskData.taskID,
        },
        {
            name: ["piority"],
            value: TaskData.piority,
        },
    ];

    const handleShowEditModal = () => {
        setOpenEditModal(true);
    };

    const handleHideEditModal = () => {
        setFileUpload(null);
        form2.resetFields(fields);
        setOpenEditModal(false);
    };

    const handleDeleteTask = () => {
        dispatch(deleteTask(TaskData.taskID)); // dispatch action deleteTask với param là ID task cần xoá
    };

    const handleEditTask = (taskEdited) => {
        dispatch(editTask({ ...taskEdited, taskID: TaskData.taskID }));
        setOpenEditModal(false);
    };

    return (
        <>
            <Card
                className="task-item"
                title={TaskData.name}
                bordered={false}
                actions={[
                    <div className="edit-btn" onClick={handleShowEditModal}>
                        <EditOutlined key="edit" />
                    </div>,
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={handleDeleteTask}
                        okText="Yes"
                        cancelText="No">
                        <div className="delete-btn">
                            <DeleteOutlined key="delete" />
                        </div>
                    </Popconfirm>,
                ]}>
                <div className="task-content">
                    <div className="task-label">
                        <span>Piority: </span>
                        <p>{TaskData.piority}</p>
                    </div>
                    <div className="task-label">
                        <span>Number participants: </span>
                        <p>{TaskData.number}</p>
                    </div>
                    <div className="task-label">
                        <span>Time: </span>
                        <div style={{ display: "flex", gap: 4 }}>
                            <p>
                                {dayjs(TaskData.time[0]).format("DD/MM/YYYY")}
                            </p>
                            {" - "}
                            <p>
                                {dayjs(TaskData.time[1]).format("DD/MM/YYYY")}
                            </p>
                        </div>
                    </div>
                    <div className="task-label">
                        <span>Status: </span>
                        <p>
                            {TaskData.status === "Not done" ? ( // Toán tử 3 ngôi
                                <Tag color={"red"}>
                                    <LoadingOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    {TaskData.status}
                                </Tag>
                            ) : TaskData.status === "In progress" ? (
                                <Tag color={"blue"}>
                                    <HourglassOutlined
                                        style={{ marginRight: 8 }}
                                        spin
                                    />
                                    {TaskData.status}
                                </Tag>
                            ) : (
                                <Tag color={"green"}>
                                    <CheckOutlined style={{ marginRight: 8 }} />
                                    {TaskData.status}
                                </Tag>
                            )}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Modal edit task */}
            <Modal
                open={openEditModal}
                onCancel={handleHideEditModal}
                title="Edit Task"
                okText="Update"
                onOk={() => form2.submit()}>
                <Form form={form2} onFinish={handleEditTask} fields={fields}>
                    <Form.Item name="name" label="Task Name">
                        <Input />
                    </Form.Item>
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
                            maxCount={1}
                            onChange={(e) => {
                                setFileUpload(e.file);
                            }}
                            beforeUpload={() => false}
                            listType="picture-card">
                            {fileUpload ? (
                                <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}>
                                        Upload
                                    </div>
                                </div>
                            ) : TaskData?.file ? (
                                <div
                                    style={{
                                        overflow: "hidden",
                                    }}>
                                    <FileOutlined color="blue" />
                                    <div
                                        style={{
                                            marginTop: 8,
                                            textOverflow: "ellipsis",
                                        }}>
                                        {TaskData?.file?.fileList[0].name}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}>
                                        Upload
                                    </div>
                                </div>
                            )}
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
        </>
    );
}

export default TaskItem;
