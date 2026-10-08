import {
  HiOutlineComputerDesktop,
  HiOutlineDevicePhoneMobile,
  HiOutlineUsers,
  HiOutlineMegaphone,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineServerStack,
  HiOutlineFilm,
  HiOutlineVideoCamera,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlinePresentationChartLine,
  HiOutlineSignal,
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineBolt,
  HiOutlineStar,
} from "react-icons/hi2";
import { FaWordpress } from "react-icons/fa6";

// Service `visual` id -> icon (same set as the Figma design)
export const SERVICE_ICONS = {
  web: HiOutlineComputerDesktop,
  app: HiOutlineDevicePhoneMobile,
  crm: HiOutlineUsers,
  handling: HiOutlineMegaphone,
  content: HiOutlineDocumentText,
  wordpress: FaWordpress,
  social: HiOutlineChatBubbleLeftRight,
  stack: HiOutlineServerStack,
  edit: HiOutlineFilm,
  shoot: HiOutlineVideoCamera,
  search: HiOutlineMagnifyingGlass,
  ai: HiOutlineSparkles,
  answer: HiOutlineChatBubbleBottomCenterText,
  ads: HiOutlinePresentationChartLine,
  reach: HiOutlineSignal,
};

// Stat icon chosen from the stat's label (stats come from the CMS)
export const statIcon = (label = "") => {
  if (/project/i.test(label)) return HiOutlineCube;
  if (/satisf|rating|review/i.test(label)) return HiOutlineStar;
  if (/client|customer/i.test(label)) return HiOutlineUserGroup;
  if (/year|experience/i.test(label)) return HiOutlineBolt;
  return HiOutlineSparkles;
};
