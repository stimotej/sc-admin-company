import {
  ClockCircleOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

export default function getApplicationStatus(status: string) {
  switch (status) {
    case "invited":
      return {
        className: "text-blue-500",
        title: "Student je pozvan",
        icon: PlusCircleOutlined,
      };
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
      return {
        className: "text-orange-500",
        title: "Na čekanju",
        icon: ClockCircleOutlined,
      };
  }
}
