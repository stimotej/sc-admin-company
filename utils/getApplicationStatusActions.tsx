import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

export default function getApplicationStatusActions(status: string) {
  switch (status) {
    case "invited":
      return (
        <div className="flex gap-2 items-center">
          <Button shape="circle" icon={<CheckCircleOutlined />} />
          <Button shape="circle" icon={<CloseCircleOutlined />} />
        </div>
      );
    case "accepted":
      return {
        className: "text-green-500",
        title: "Prijava je prihvaćena",
        icon: CheckCircleOutlined,
      };
    case "rejected":
      return {
        className: "text-red-500",
        title: "Prijava je odbijena",
        icon: CloseCircleOutlined,
      };
    case "inactive":
      return {
        className: "text-gray-600",
        title: "Prijava je otkazana",
        icon: CloseCircleOutlined,
      };
    default:
      return (
        <div className="flex gap-2 items-center">
          <Button shape="circle" icon={<PlusCircleOutlined />} />
          <Button shape="circle" icon={<CloseCircleOutlined />} />
        </div>
      );
  }
}
