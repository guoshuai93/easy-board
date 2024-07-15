import { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { ITasks } from "../types";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface IProps {
  open: boolean;
  task: Partial<ITasks>;
  onCancel: () => void;
  onOk: (params: Partial<ITasks>) => void;
}
const defaultTask = {
  title: "",
  remark: "",
  link: "",
  time: [],
};

const AddTask = ({ open, task, onCancel, onOk }: IProps) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const v = await form.validateFields();
      const data = { ...task, ...v };
      onOk && onOk(data);
      // 添加任务
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (open === true) {
      const time = task?.time ? task?.time.map((i) => dayjs(i)) : [];
      const payload = task.id ? { ...task, time } : { ...task, ...defaultTask };
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
    }
  }, [form, task, open]);

  return (
    <Modal title="任务" open={open} onOk={handleOk} onCancel={onCancel}>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        requiredMark={false}
        labelAlign="left"
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: "标题不能为空" }]}
        >
          <Input placeholder="任务标题，必填" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="链接" name="link">
          <Input />
        </Form.Item>
        <Form.Item label="任务起止时间" name="time">
          <RangePicker format={"YYYY-MM-DD"} />
        </Form.Item>
        <Form.Item name="colId" hidden>
          <Input type="text" />
        </Form.Item>
        <Form.Item name="id" hidden>
          <Input type="text" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTask;
